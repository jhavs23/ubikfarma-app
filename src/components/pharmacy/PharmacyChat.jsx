import React, { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listChatMessages } from '../../graphql/queries';
import { createChatMessage } from '../../graphql/mutations';
import { onCreateChatMessage } from '../../graphql/subscriptions';
import { MessageSquare, Send, User, Clock, Package } from 'lucide-react';

const client = generateClient();

const PharmacyChat = ({ pharmacyId }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Mock: lista de conversaciones (en producción se obtienen de DynamoDB)
  useEffect(() => {
    // Simulación: en un escenario real, listarías QuoteRequests con chat activo
    const mockConversations = [
      { id: 'quote-1', patient_name: 'Carlos Pérez', medicine: 'Acetaminofén', last_message: '¿Cuánto cuesta?', time: '12:30' },
      { id: 'quote-2', patient_name: 'María Gómez', medicine: 'Amoxicilina', last_message: 'Lo retiro hoy', time: '11:15' },
    ];
    setConversations(mockConversations);
    setLoading(false);
  }, []);

  // Suscripción a nuevos mensajes
  useEffect(() => {
    if (selectedQuoteId) {
      fetchMessages();
      subscribeToMessages();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [selectedQuoteId]);

  const fetchMessages = async () => {
    try {
      const result = await client.graphql({
        query: listChatMessages,
        variables: { filter: { quote_request_id: { eq: selectedQuoteId } } },
        authMode: 'apiKey'
      });
      const items = result.data.listChatMessages.items || [];
      setMessages(items);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const subscription = client.graphql({
      query: onCreateChatMessage,
      variables: { filter: { quote_request_id: { eq: selectedQuoteId } } },
      authMode: 'apiKey'
    }).subscribe({
      next: (event) => {
        const newMsg = event.data.onCreateChatMessage;
        setMessages(prev => [...prev, newMsg]);
      },
      error: (error) => console.error('Subscription error:', error)
    });
    subscriptionRef.current = subscription;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedQuoteId) return;
    setSending(true);
    try {
      await client.graphql({
        query: createChatMessage,
        variables: {
          input: {
            quote_request_id: selectedQuoteId,
            sender_id: pharmacyId,
            sender_type: 'pharmacy',
            message: newMessage.trim(),
            read: false,
          }
        },
        authMode: 'apiKey'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar mensaje.');
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (quoteId) => {
    setSelectedQuoteId(quoteId);
    setMessages([]);
  };

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-emerald-600" />
        Chat con Pacientes
      </h2>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Lista de conversaciones */}
        <div className="w-1/3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-700 text-sm">Conversaciones</h3>
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.length === 0 ? (
              <p className="p-4 text-sm text-slate-500 text-center">Sin conversaciones activas.</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full text-left p-3 border-b border-slate-100 hover:bg-slate-50 transition ${
                    selectedQuoteId === conv.id ? 'bg-emerald-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{conv.patient_name}</p>
                      <p className="text-xs text-slate-500 truncate">{conv.medicine}</p>
                      <p className="text-xs text-slate-400 truncate">{conv.last_message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{conv.time}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Área del chat */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          {selectedQuoteId ? (
            <>
              {/* Cabecera del chat */}
              <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-700">
                  {conversations.find(c => c.id === selectedQuoteId)?.patient_name || 'Paciente'}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  {conversations.find(c => c.id === selectedQuoteId)?.medicine}
                </span>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center">Inicia la conversación.</p>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender_type === 'pharmacy'
                          ? 'bg-emerald-600 text-white self-end ml-auto'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <span className="text-[10px] opacity-70 block text-right mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensaje */}
              <div className="p-3 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? 'Enviando...' : <Send className="w-5 h-5" />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <p>Selecciona una conversación</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyChat;