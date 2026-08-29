import React, { useState } from 'react';
import { Home, Clock, ShoppingBag, User, Newspaper, PlusCircle, LogOut } from 'lucide-react';
import FeedHome from './FeedHome';
import FeedHistory from './FeedHistory';
import FeedPurchases from './FeedPurchases';
import FeedProfile from './FeedProfile';
import FeedPosts from './FeedPosts';
import FeedQuoteForm from './FeedQuoteForm';

const PatientFeed = ({ userSub, setActiveTab, isAuthenticated, onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');

  const sections = {
    home: { component: FeedHome, icon: Home, label: 'Inicio' },
    posts: { component: FeedPosts, icon: Newspaper, label: 'Publicaciones' },
    quote: { component: FeedQuoteForm, icon: PlusCircle, label: 'Cotizar' },
    history: { component: FeedHistory, icon: Clock, label: 'Historial' },
    purchases: { component: FeedPurchases, icon: ShoppingBag, label: 'Compras' },
    profile: { component: FeedProfile, icon: User, label: 'Perfil' },
  };

  const SectionComponent = sections[activeSection].component;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black text-emerald-600">UBIKFARMA</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-800 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4">
        <SectionComponent 
          userSub={userSub} 
          setActiveTab={setActiveTab}
          isAuthenticated={isAuthenticated}
        />
      </div>

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