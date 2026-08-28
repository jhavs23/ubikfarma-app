import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listQuoteRequests } from '../../graphql/queries';

const client = generateClient();

const FeedHistory = ({ userSub }) => {
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

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Mi Historial</h2>
      {quotes.length === 0 ? (
        <p className="text-slate-500">No tienes cotizaciones aún.</p>
      ) : (
        quotes.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-slate-900">{q.medicine_name}</h4>
            <p className="text-xs text-slate-500">{q.city}, {q.zone}</p>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {q.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default FeedHistory;