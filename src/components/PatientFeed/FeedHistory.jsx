import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listQuoteRequests } from '../../graphql/queries';
import { RefreshCw, Eye, Trash2 } from 'lucide-react';

const client = generateClient();

const FeedHistory = ({ userSub, setActiveTab }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const result = await client.graphql({
        query: listQuoteRequests,
        variables: { filter: { patient_id: { eq: userSub } } },
        authMode: 'apiKey'
      });
      const items = result.data.listQuoteRequests.items || [];
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setQuotes(items);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (quote) => {
    alert(`Detalle de cotización:\nMedicamento: ${quote.medicine_name}\nEstado: ${quote.status}\nCiudad: ${quote.city}\nZona: ${quote.zone}`);
  };

  const handleDelete = (quoteId) => {
    if (window.confirm('¿Estás seguro de eliminar esta cotización?')) {
      // Aquí iría la mutación deleteQuoteRequest (cuando esté creada)
      setQuotes(quotes.filter(q => q.id !== quoteId));
      alert('Cotización eliminada (simulación)');
    }
  };

  const handleRepeat = (quote) => {
    // Precargar datos en el formulario de cotización (próximamente)
    alert('Funcionalidad de repetir cotización (próximamente)');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">Mi Historial</h2>
        <button
          onClick={fetchHistory}
          className="text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">No tienes cotizaciones aún.</p>
          <button
            onClick={() => setActiveTab('quote')}
            className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition"
          >
            Cotizar ahora
          </button>
        </div>
      ) : (
        quotes.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900">{q.medicine_name}</h4>
                <p className="text-xs text-slate-500">{q.city}, {q.zone}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  q.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                  q.status === 'CLOSED' ? 'bg-gray-100 text-gray-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {q.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleView(q)} className="text-slate-400 hover:text-blue-600 transition" title="Ver detalle">
                  <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(q.id)} className="text-slate-400 hover:text-red-600 transition" title="Eliminar">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleRepeat(q)} className="text-emerald-600 hover:text-emerald-800 transition text-sm font-bold flex items-center gap-1">
                  <RefreshCw className="w-4 h-4" /> Repetir
                </button>
              </div>
            </div>
            {q.responses && q.responses.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700">Respuestas:</p>
                {q.responses.map((resp, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{resp.pharmacyName}</span>
                    <span className="font-bold text-emerald-600">${resp.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FeedHistory;