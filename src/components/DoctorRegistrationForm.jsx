import React from 'react';
import { Stethoscope, Users, TrendingUp, Clock, Shield } from 'lucide-react';

const DoctorRegistrationForm = ({ setActiveTab }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">¿Eres Médico o Profesional de la Salud?</h1>
          <p className="text-slate-600 mt-2">Conecta con pacientes que buscan tus servicios, <span className="font-bold text-purple-600">30 días gratis</span>.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-slate-900">Más pacientes</h3>
            </div>
            <p className="text-sm text-slate-600">Aparece en el directorio médico y recibe solicitudes de pacientes en tu zona.</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-slate-900">Visibilidad</h3>
            </div>
            <p className="text-sm text-slate-600">Tu perfil se destaca en búsquedas y anuncios contextuales en Meta y Google.</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-slate-900">Ahorra tiempo</h3>
            </div>
            <p className="text-sm text-slate-600">Digitaliza tu agenda, recibe citas y consultas sin llamadas innecesarias.</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-slate-900">Confianza</h3>
            </div>
            <p className="text-sm text-slate-600">Los pacientes te encuentran con reseñas verificadas y credenciales visibles.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 text-center">
          <h3 className="text-2xl font-black">Plan VIP - $4.99/mes</h3>
          <p className="text-sm opacity-90 mb-3">30 días gratis, sin compromiso. Cancela cuando quieras.</p>
          <button
            onClick={() => setActiveTab('onboarding')}
            className="bg-white text-purple-700 font-bold px-6 py-2.5 rounded-full hover:bg-purple-50 transition"
          >
            Registrarme como médico
          </button>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => setActiveTab('home')} className="text-xs text-slate-500 hover:text-slate-700 transition">
            ← Volver a la página principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistrationForm;