import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listQuoteRequests } from '../graphql/queries';

const client = generateClient();

export default function PatientHistory({ patientId }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contador de uso mensual
  const monthlyUsage = quotes.length; 
  const freeLimit = 2;
  const isProPlan = false; // Cambiar a true según la suscripción del usuario

  useEffect(() => {
    if (patientId) {
      fetchHistory();
    }
  }, [patientId]);

  const fetchHistory = async () => {
    try {
      const result = await client.graphql({
        query: listQuoteRequests,
        variables: {
          filter: { patient_id: { eq: patientId } }
        }
      });
      setQuotes(result.data.listQuoteRequests.items || []);
    } catch (err) {
      console.error('Error cargando historial:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular horas transcurridas
  const getHoursElapsed = (createdAt) => {
    const diffMs = new Date() - new Date(createdAt);
    return Math.floor(diffMs / (1000 * 60 * 60));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      
      {/* 📊 BARRA DE USO DEL PLAN PACIENTE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            📋 Mis Consultas de Medicamentos
          </h3>
          <p className="text-slate-400 text-sm">
            {isProPlan 
              ? '✨ Tienes acceso ILIMITADO con tu Plan Pro ($0.99/mes)' 
              : `Has usado ${monthlyUsage} de ${freeLimit} consultas gratuitas este mes.`}
          </p>
        </div>

        {!isProPlan && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-32 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div 
                className={`h-full ${monthlyUsage >= freeLimit ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min((monthlyUsage / freeLimit) * 100, 100)}%` }}
              />
            </div>
            {monthlyUsage >= freeLimit && (
              <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg shadow-lg">
                Activar Pro ($0.99)
              </button>
            )}
          </div>
        )}
      </div>

      {/* 📜 LISTADO DE SOLICITUDES E HISTORIAL */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">Cargando tu historial...</div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400">
          No has realizado consultas de medicamentos todavía.
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => {
            const hoursOld = getHoursElapsed(quote.createdAt);
            const isExpired = hoursOld > 48;
            const isWarning = hoursOld >= 24 && hoursOld <= 48;

            return (
              <div 
                key={quote.id} 
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4"
              >
                {/* Cabecera del Item */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-lg font-bold text-emerald-400">
                      {quote.medicine_name} <span className="text-slate-400 text-sm font-normal">({quote.dosage_mg})</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Cantidad: {quote.quantity} | Solicitado hace {hoursOld < 1 ? 'minutos' : `${hoursOld} horas`}
                    </p>
                  </div>

                  {/* Badge de Estado / Semáforo de Tiempo */}
                  <div>
                    {isExpired ? (
                      <span className="bg-red-950/80 text-red-400 border border-red-800/60 text-xs font-semibold px-2.5 py-1 rounded-full">
                        ⚠️ Presupuesto Expirado (&gt;48h)
                      </span>
                    ) : isWarning ? (
                      <span className="bg-amber-950/80 text-amber-400 border border-amber-800/60 text-xs font-semibold px-2.5 py-1 rounded-full">
                        ⏳ Consultar Antes de Ir (24h-48h)
                      </span>
                    ) : (
                      <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-semibold px-2.5 py-1 rounded-full">
                        🟢 Presupuesto Fresco
                      </span>
                    )}
                  </div>
                </div>

                {/* Respuestas Recibidas de Farmacias */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Respuestas de Farmacias ({quote.responses?.items?.length || 0}):
                  </p>

                  {quote.responses?.items?.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">Buscando farmacias cercanas con inventario...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quote.responses.items.map((resp) => (
                        <div key={resp.id} className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 text-sm flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white">{resp.pharmacy?.name}</p>
                            <p className="text-xs text-slate-400">📍 {resp.pharmacy?.zone}</p>
                            <p className="text-emerald-400 font-bold mt-1">
                              ${resp.total_price_usd?.toFixed(2)} USD
                            </p>
                          </div>

                          {/* Botón WhatsApp Directo */}
                          <a
                            href={`https://wa.me/${resp.pharmacy?.whatsapp}?text=Hola%20${encodeURIComponent(resp.pharmacy?.name)},%20vi%20su%20presupuesto%20de%20${encodeURIComponent(quote.medicine_name)}%20en%20Ubikfarma.`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                          >
                            💬 WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🔘 BOTONES DE ACCIÓN INTELIGENTES */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
                  {isExpired && (
                    <button 
                      onClick={() => alert(`Reagendando consulta para ${quote.medicine_name}...`)}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1"
                    >
                      🔄 Retomar Presupuesto (Verificar Stock Actual)
                    </button>
                  )}

                  <button 
                    onClick={() => alert('Marcar como comprado')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 py-2 rounded-lg"
                  >
                    ✅ Ya lo compré
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}