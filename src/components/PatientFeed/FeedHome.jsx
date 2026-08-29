import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listPharmacyInventories, listPromotions, listDoctorProfiles } from '../../graphql/queries';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const client = generateClient();

// 🔥 DATOS MOCK (para cuando no hay conexión)
const MOCK_PRODUCTS = [
  { id: '1', custom_name: 'Acetaminofén 500mg', presentation: 'Tabletas', price_usd: 8.50, stock_quantity: 45, is_available: true },
  { id: '2', custom_name: 'Amoxicilina 250mg', presentation: 'Cápsulas', price_usd: 12.00, stock_quantity: 30, is_available: true },
  { id: '3', custom_name: 'Ibuprofeno 400mg', presentation: 'Tabletas', price_usd: 7.50, stock_quantity: 20, is_available: false },
];

const MOCK_PROMOTIONS = [
  { id: 'p1', title: '15% OFF en Acetaminofén', description: 'Válido para compras online', discount_percentage: 15, code: 'ACETA15', valid_to: '2026-12-31' },
  { id: 'p2', title: '$5 OFF en Amoxicilina', description: 'Cupón de descuento', discount_fixed_usd: 5, code: 'AMOXI5', valid_to: '2026-12-31' },
];

const MOCK_DOCTORS = [
  { id: 'd1', full_name: 'Dr. Roberto Mendoza', primary_specialty: 'Cardiología', bio: 'Especialista en cardiología intervencionista.' },
  { id: 'd2', full_name: 'Dra. Carolina Gómez', primary_specialty: 'Pediatría', bio: 'Pediatra con enfoque en neonatología.' },
];

// 📝 Instrucciones para el carrusel (solo registrados)
const INSTRUCTIONS = [
  { icon: '🏠', text: 'Inicio: mira productos, promociones y médicos destacados.' },
  { icon: '📰', text: 'Publicaciones: noticias y tips de salud.' },
  { icon: '➕', text: 'Cotizar: envía una solicitud de medicamentos.' },
  { icon: '🕐', text: 'Historial: consulta tus cotizaciones anteriores.' },
  { icon: '🛒', text: 'Compras: seguimiento de tus pedidos.' },
  { icon: '👤', text: 'Perfil: edita tus datos y preferencias.' },
];

const FeedHome = ({ userSub, setActiveTab, isAuthenticated }) => {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  // Estado para el carrusel
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      setLoading(true);
      
      const productResult = await client.graphql({
        query: listPharmacyInventories,
        variables: { limit: itemsPerPage },
        authMode: 'apiKey'
      });
      const productItems = productResult.data.listPharmacyInventories.items || [];
      const availableProducts = productItems.filter(p => p.is_available !== false);
      setProducts(availableProducts);

      const now = new Date().toISOString();
      const promoResult = await client.graphql({
        query: listPromotions,
        variables: { 
          filter: { 
            active: { eq: true },
            valid_from: { le: now },
            valid_to: { ge: now }
          },
          limit: 5
        },
        authMode: 'apiKey'
      });
      const promoItems = promoResult.data.listPromotions.items || [];
      setPromotions(promoItems);

      const doctorResult = await client.graphql({
        query: listDoctorProfiles,
        variables: { 
          filter: { is_vip: { eq: true } },
          limit: 4
        },
        authMode: 'apiKey'
      });
      const doctorItems = doctorResult.data.listDoctorProfiles.items || [];
      setDoctors(doctorItems);

      setHasMore(false);
    } catch (error) {
      console.error('Error fetching feed data:', error);
      setProducts(MOCK_PRODUCTS);
      setPromotions(MOCK_PROMOTIONS);
      setDoctors(MOCK_DOCTORS);
    } finally {
      setLoading(false);
    }
  };

  // Carrusel: siguiente / anterior
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % INSTRUCTIONS.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + INSTRUCTIONS.length) % INSTRUCTIONS.length);
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
      {/* BANNER / CARRUSEL DE INSTRUCCIONES (solo para registrados) */}
      {isAuthenticated ? (
        <div className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-2xl p-6 shadow-lg relative">
          <div className="flex items-center justify-between">
            <button
              onClick={prevSlide}
              className="p-1 rounded-full hover:bg-white/20 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 text-center px-4">
              <div className="text-4xl mb-2">{INSTRUCTIONS[currentSlide].icon}</div>
              <p className="text-sm font-semibold">{INSTRUCTIONS[currentSlide].text}</p>
              <div className="flex justify-center gap-1 mt-3">
                {INSTRUCTIONS.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentSlide ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={nextSlide}
              className="p-1 rounded-full hover:bg-white/20 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        // Banner para invitados (no registrados)
        <div className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-black">¡Bienvenido a UBIKFARMA!</h2>
          <p className="text-sm opacity-90">
            Regístrate para cotizar y recibir ofertas personalizadas.
          </p>
          <button 
            onClick={() => setActiveTab('onboarding')}
            className="mt-3 bg-white text-emerald-700 font-bold px-4 py-1.5 rounded-full text-sm hover:bg-emerald-50 transition"
          >
            Crear cuenta gratis
          </button>
        </div>
      )}

      {/* Espacio para publicidad (placeholder) */}
      <div className="bg-slate-200 h-20 rounded-xl flex items-center justify-center text-slate-500 text-sm border-2 border-dashed border-slate-300">
        📢 Espacio para publicidad (Google Ads / Yanko Ads)
      </div>

      {/* Promociones activas */}
      {promotions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            🔥 Ofertas Especiales
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{promo.title}</h4>
                    <p className="text-sm text-slate-600">{promo.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {promo.discount_percentage && (
                        <span className="text-lg font-black text-emerald-600">{promo.discount_percentage}% OFF</span>
                      )}
                      {promo.discount_fixed_usd && (
                        <span className="text-lg font-black text-emerald-600">${promo.discount_fixed_usd} OFF</span>
                      )}
                      {promo.code && (
                        <span className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded font-mono">{promo.code}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    {new Date(promo.valid_to) > new Date() ? 'Activa' : 'Próximamente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Productos destacados */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">💊 Productos destacados</h3>
        {products.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No hay productos disponibles.</p>
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
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Stock: {product.stock_quantity || 0}</span>
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

      {/* Sección de médicos */}
      {doctors.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h3 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <span>🩺</span> Médicos destacados
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                    {doctor.full_name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{doctor.full_name}</p>
                    <p className="text-xs text-slate-500">{doctor.primary_specialty}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doctor.bio || ''}</p>
                <button className="mt-2 text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                  <span>Contactar</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cargar más */}
      {hasMore && (
        <button 
          onClick={() => alert('Cargar más productos')}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition"
        >
          Cargar más
        </button>
      )}
    </div>
  );
};

export default FeedHome;