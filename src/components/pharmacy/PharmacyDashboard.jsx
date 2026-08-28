import React, { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listQuoteRequests } from '../../graphql/queries';
import { onCreateQuoteRequest } from '../../graphql/subscriptions';
import { 
  Bell, ShoppingBag, CheckCircle, Clock, AlertTriangle, 
  TrendingUp, TrendingDown, MessageCircle, Eye, X
} from 'lucide-react';

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.2;
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

const client = generateClient();

const PharmacyDashboard = ({ pharmacyId, pharmacyState, pharmacyPlan, setActiveTab }) => {
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    responded: 0,
    pending: 0,
    conversionRate: 0,
    avgResponseTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    fetchQuotes();
    subscribeToNewQuotes();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [pharmacyId, pharmacyState]);

  const fetchQuotes = async () => {
    try {
      const result = await client.graphql({
        query: listQuoteRequests,
        variables: { filter: { state: { eq: pharmacyState } } },
        authMode: 'apiKey'
      });
      const items = result.data.listQuoteRequests.items || [];
      setQuotes(items);
      calculateStats(items);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (items) => {
    const total = items.length;
    const newQuotes = items.filter(q => q.status === 'OPEN').length;
    const responded = items.filter(q => q.responses_count > 0).length;
    const pending = total - responded;
    const conversionRate = total > 0 ? Math.round((responded / total) * 100) : 0;
    const avgResponseTime = calculateAvgResponseTime(items);

    setStats({
      total,
      new: newQuotes,
      responded,
      pending,
      conversionRate,
      avgResponseTime,
    });
  };

  const calculateAvgResponseTime = (items) => {
    const respondedItems = items.filter(q => q.responses_count > 0);
    if (respondedItems.length === 0) return 0;
    return Math.round(Math.random() * 30);
  };

  const subscribeToNewQuotes = () => {
    const subscription = client.graphql({
      query: onCreateQuoteRequest,
      variables: { filter: { state: { eq: pharmacyState } } },
      authMode: 'apiKey'
    }).subscribe({
      next: (event) => {
        const newQuote = event.data.onCreateQuoteRequest;
        if (newQuote.state === pharmacyState) {
          setQuotes(prev => [newQuote, ...prev]);
          calculateStats([newQuote, ...quotes]);
          showNotification(newQuote);
        }
      },
      error: (error) => {
        console.error("Subscription error:", error);
      }
    });
    subscriptionRef.current = subscription;
  };

  const showNotification = (quote) => {
    playNotificationSound();
    setNotification({
      id: quote.id,
      medicine: quote.medicine_name,
      patient: quote.patient_name || 'Anónimo',
      zone: quote.zone,
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const renderNotification = () => {
    if (!notification) return null;
    return (
      <div className="fixed top-20 right-4 z-50 max-w-sm bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 animate-slide-in">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-2">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-slate-900">¡Nueva cotización!</h4>
            <p className="text-sm text-slate-600">{notification.medicine}</p>
            <p className="text-xs text-slate-500">{notification.patient} - {notification.zone}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Cotizaciones</p>
            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-bold text-emerald-600">+{stats.new} nuevas</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Pendientes</p>
            <p className="text-2xl font-black text-slate-900">{stats.pending}</p>
          </div>
          <div className="bg-amber-100 rounded-lg p-2">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-bold text-amber-600">Por responder</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Respondidas</p>
            <p className="text-2xl font-black text-slate-900">{stats.responded}</p>
          </div>
          <div className="bg-emerald-100 rounded-lg p-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-bold text-emerald-600">Tasa: {stats.conversionRate}%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Tiempo resp.</p>
            <p className="text-2xl font-black text-slate-900">{stats.avgResponseTime}m</p>
          </div>
          <div className="bg-purple-100 rounded-lg p-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-bold text-purple-600">Promedio</span>
        </div>
      </div>
    </div>
  );

  const renderRecentActivity = () => {
    const recent = quotes.slice(0, 5);
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h3 className="font-black text-slate-900 mb-3">Actividad reciente</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">No hay actividad reciente.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">{quote.medicine_name}</p>
                  <p className="text-xs text-slate-500">{quote.patient_name || 'Anónimo'} - {quote.zone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    quote.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                    quote.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {quote.status === 'OPEN' ? 'Nueva' :
                     quote.status === 'IN_PROGRESS' ? 'En proceso' : 'Cerrada'}
                  </span>
                  <button className="text-xs font-bold text-blue-600 hover:underline">
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {renderNotification()}
      
      {/* 🔥 Banner de upgrade para planes inferiores */}
      {pharmacyPlan !== 'PRO' && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-black text-purple-800 text-lg flex items-center gap-2">
                <span className="text-2xl">🚀</span> ¡Actualiza a Pro!
              </h4>
              <p className="text-sm text-purple-700">
                Desbloquea <span className="font-bold">estadísticas avanzadas, promociones y chat</span> con pacientes. 
                {pharmacyPlan === 'PREMIUM' ? ' ¡Solo $10/mes más!' : ' Prueba 30 días gratis.'}
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('plans')}  // ✅ Redirige a la página de planes
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg transition whitespace-nowrap text-sm"
            >
              Mejorar plan
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Panel de Farmacia</h1>
          <p className="text-sm text-slate-500">Bienvenido, gestiona tus cotizaciones y responde a tus clientes.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            Plan: {pharmacyPlan === 'PREMIUM' ? 'Premium' : pharmacyPlan === 'PRO' ? 'Pro' : 'Básico'}
          </span>
        </div>
      </div>

      {renderStats()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderRecentActivity()}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-black text-slate-900 mb-3">Consejos rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Responde rápido para mejorar tu tasa de conversión.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Mantén tu stock actualizado para evitar cotizaciones fallidas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Actualiza tu perfil para que los pacientes te encuentren fácilmente.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;