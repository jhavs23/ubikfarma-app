import React, { useState } from 'react';
import { Home, Clock, Heart, ShoppingBag, User, Search } from 'lucide-react';
import FeedHome from './FeedHome';
import FeedHistory from './FeedHistory';
import FeedFavorites from './FeedFavorites';
import FeedPurchases from './FeedPurchases';
import FeedProfile from './FeedProfile';

const PatientFeed = ({ userSub, setActiveTab }) => {
  const [activeSection, setActiveSection] = useState('home');

  const sections = {
    home: { component: FeedHome, icon: Home, label: 'Inicio' },
    history: { component: FeedHistory, icon: Clock, label: 'Historial' },
    favorites: { component: FeedFavorites, icon: Heart, label: 'Favoritos' },
    purchases: { component: FeedPurchases, icon: ShoppingBag, label: 'Compras' },
    profile: { component: FeedProfile, icon: User, label: 'Perfil' },
  };

  const SectionComponent = sections[activeSection].component;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header con búsqueda */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black text-emerald-600">UBIKFARMA</h1>
          <button className="p-2 rounded-full hover:bg-slate-100 transition">
            <Search className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Contenido dinámico */}
      <div className="max-w-3xl mx-auto">
        <SectionComponent userSub={userSub} setActiveTab={setActiveTab} />
      </div>

      {/* Navegación inferior (tipo app) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-20">
        <div className="max-w-3xl mx-auto flex justify-around py-2">
          {Object.entries(sections).map(([key, { icon: Icon, label }]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
                activeSection === key
                  ? 'text-emerald-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default PatientFeed;