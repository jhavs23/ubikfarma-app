import React from 'react';

const FeedProfile = ({ userSub, setActiveTab }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-black text-slate-900">Mi Perfil</h2>
      <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4 shadow-sm">
        <p className="text-sm text-slate-600">ID de usuario: {userSub || 'No autenticado'}</p>
        <button 
          onClick={() => setActiveTab('home')}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default FeedProfile;