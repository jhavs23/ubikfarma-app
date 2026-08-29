import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

// Datos mock (luego se reemplazarán con query real)
const MOCK_PURCHASES = [
  {
    id: 'p1',
    pharmacy: 'Farmacia Botica Central',
    medicine: 'Acetaminofén 500mg',
    quantity: 2,
    price: 17.00,
    date: '2026-08-28T10:00:00Z',
    status: 'Entregado'
  }
];

const FeedPurchases = ({ userSub, setActiveTab }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga (en producción, usar listPurchases)
    setTimeout(() => {
      setPurchases(MOCK_PURCHASES);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Mis Compras</h2>
      {purchases.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Aún no has realizado compras.</p>
          <p className="text-sm text-slate-400">Cotiza medicamentos y cuando compres, aparecerán aquí.</p>
          <button
            onClick={() => setActiveTab('quote')}
            className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition"
          >
            Cotizar ahora
          </button>
        </div>
      ) : (
        purchases.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-slate-900">{p.medicine}</h4>
                <p className="text-sm text-slate-600">{p.pharmacy}</p>
                <p className="text-xs text-slate-500">Cantidad: {p.quantity} | {new Date(p.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-600">${p.price.toFixed(2)}</span>
                <p className={`text-xs font-bold ${p.status === 'Entregado' ? 'text-green-600' : 'text-amber-600'}`}>{p.status}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FeedPurchases;