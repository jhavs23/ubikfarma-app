import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listQuoteRequests } from '../graphql/queries';
import { deleteQuoteRequest } from '../graphql/mutations';
import { Trash2, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

const client = generateClient();

const PatientHistory = ({ patientId }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null); // id de la cotización que se está eliminando

  useEffect(() => {
    fetchQuotes();
  }, [patientId]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const result = await client.graphql({
        query: listQuoteRequests,
        variables: { filter: { patient_id: { eq: patientId } } },
        authMode: 'apiKey' // Para usuarios invitados también funciona
      });
      const items = result.data.listQuoteRequests.items || [];
      // Ordenar por fecha descendente (más reciente primero)
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setQuotes(items);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('No se pudo cargar el historial.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta cotización?')) return;
    
    setDeleting(quoteId);
    try {
      await client.graphql({
        query: deleteQuoteRequest,
        variables: { input: { id: quoteId } },
        authMode: 'apiKey'
      });
      // Actualizar la lista eliminando la cotización
      setQuotes(quotes.filter(q => q.id !== quoteId));
    } catch (err) {
      console.error('Error deleting quote:', err);
      alert('Error al eliminar la cotización. Intenta de nuevo.');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">Nueva</span>;
      case 'IN_PROGRESS':
        return <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">En proceso</span>;
      case 'CLOSED':
        return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">Cerrada</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <h3 className="text-xl font-black text-slate-700">📭 No tienes cotizaciones</h3>
        <p className="text-slate-500 mt-2">Cuando envíes una cotización, aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Mis Cotizaciones</h2>
      <p className="text-sm text-slate-500">Tienes {quotes.length} cotización{quotes.length > 1 ? 'es' : ''}.</p>
      
      <div className="space-y-4">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-bold text-slate-900">{quote.medicine_name}</h4>
                  {getStatusBadge(quote.status)}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Dosis:</span> {quote.dosage_mg || 'No especificada'} | 
                  <span className="font-semibold ml-2">Cantidad:</span> {quote.quantity || 1}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-semibold">Ubicación:</span> {quote.state}, {quote.city} - {quote.zone}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enviado: {new Date(quote.createdAt).toLocaleString()}
                </p>
                {quote.responses_count > 0 && (
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    💬 {quote.responses_count} respuesta{quote.responses_count > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button 
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                >
                  <Eye className="w-4 h-4" /> Ver
                </button>
                <button 
                  onClick={() => handleDelete(quote.id)}
                  disabled={deleting === quote.id}
                  className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                >
                  {deleting === quote.id ? (
                    <span className="inline-block animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"></span>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientHistory;