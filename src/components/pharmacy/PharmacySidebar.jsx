import React, { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, MessageSquare, Package, 
  User, Megaphone, BarChart3, Menu, X, Home
} from 'lucide-react';

const PharmacySidebar = ({ activeTab, setActiveTab, pharmacyName, logoUrl, notificationCount, userPlan }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🔥 FUERZA todos los módulos para pruebas (ignora userPlan)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotes', label: 'Cotizaciones', icon: ClipboardList },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'promotions', label: 'Promociones', icon: Megaphone },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  // 👇 Descomenta esto para usar la lógica condicional (cuando estés listo para producción)
  /*
  const getVisibleModules = () => {
    const baseModules = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'quotes', label: 'Cotizaciones', icon: ClipboardList },
      { id: 'inventory', label: 'Inventario', icon: Package },
      { id: 'profile', label: 'Perfil', icon: User },
    ];
    const premiumModules = [
      { id: 'promotions', label: 'Promociones', icon: Megaphone },
    ];
    const proModules = [
      { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
    ];
    let visible = [...baseModules];
    if (userPlan === 'PREMIUM' || userPlan === 'PRO') {
      visible = [...visible, ...premiumModules];
    }
    if (userPlan === 'PRO') {
      visible = [...visible, ...proModules];
    }
    return visible;
  };
  const menuItems = getVisibleModules();
  */

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg border border-slate-200"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 shadow-lg z-40
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo y nombre */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={pharmacyName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-700 font-black text-lg">
                  {pharmacyName?.charAt(0) || 'F'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-black text-slate-900 truncate">
                {pharmacyName || 'Mi Farmacia'}
              </h2>
              <span className="text-[10px] font-bold text-slate-400">Panel de gestión</span>
            </div>
          </div>
        </div>

        {/* Menú */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'quotes' && notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Botón volver al inicio */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <button
            onClick={() => {
              setActiveTab('home');
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <Home className="w-5 h-5" />
            <span>Volver al inicio</span>
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default PharmacySidebar;