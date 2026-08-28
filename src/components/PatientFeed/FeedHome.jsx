import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listPharmacyInventories } from '../../graphql/queries';

const client = generateClient();

const FeedHome = ({ userSub }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await client.graphql({
        query: listPharmacyInventories,
        variables: { limit: 10 },
        authMode: 'apiKey'
      });
      const items = result.data.listPharmacyInventories.items || [];
      setProducts(items);
      setHasMore(false); // Simulación: por ahora no hay más
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Banner de bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-black">¡Bienvenido!</h2>
        <p className="text-sm opacity-90">Encuentra los mejores precios en medicamentos e insumos cerca de ti.</p>
      </div>

      {/* Espacio para publicidad (Google AdSense) */}
      <div className="bg-slate-200 h-20 rounded-xl flex items-center justify-center text-slate-500 text-sm border-2 border-dashed border-slate-300">
        📢 Espacio para publicidad
      </div>

      {/* Productos destacados */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Productos destacados</h3>
        {products.length === 0 ? (
          <p className="text-sm text-slate-500">No hay productos disponibles.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                  <span className="text-3xl">💊</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{product.custom_name}</h4>
                  <p className="text-xs text-slate-500">{product.presentation || 'Sin presentación'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-lg font-black text-emerald-600">${product.price_usd?.toFixed(2)}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Stock disponible</span>
                  </div>
                  <button className="mt-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition">
                    Ver farmacia
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sección de videos de médicos */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h3 className="font-black text-slate-900 mb-2">🎥 Consejos de salud</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-200 aspect-video rounded-lg flex items-center justify-center text-slate-500 text-sm">
            Video 1
          </div>
          <div className="bg-slate-200 aspect-video rounded-lg flex items-center justify-center text-slate-500 text-sm">
            Video 2
          </div>
        </div>
      </div>

      {hasMore && (
        <button 
          onClick={() => alert('Cargar más')}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition"
        >
          Cargar más
        </button>
      )}
    </div>
  );
};

export default FeedHome;