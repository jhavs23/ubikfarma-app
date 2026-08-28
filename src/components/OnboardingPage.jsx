import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';

const OnboardingPage = ({ setActiveTab, setShowAuthModal, setAuthMode, setAuthError }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'paciente',
    plan: 'gratis', // para pacientes es gratis, para farmacias/médicos se selecciona
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, role, plan } = formData;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Registrar usuario en Cognito
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: fullName,
            // Podríamos guardar rol y plan como custom attributes, pero por ahora solo registramos
          },
        },
      });

      setSuccess(true);
      // Guardar email para confirmación
      setAuthError('Hemos enviado un código de verificación a tu correo. Introdúcelo en el modal de confirmación.');
      setAuthMode('login');
      setShowAuthModal(true);
      
      // Redirigir al home después de un breve delay
      setTimeout(() => {
        setActiveTab('home');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-emerald-800">✅ ¡Registro exitoso!</h2>
          <p className="text-emerald-700 mt-2">Revisa tu correo para confirmar tu cuenta.</p>
          <button 
            onClick={() => setActiveTab('home')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-black text-center mb-8">¡Crea tu cuenta gratis!</h2>
      <div className="bg-white rounded-2xl shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre completo</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="8"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="8"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Eres...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="paciente">Paciente (Gratis, consultas ilimitadas)</option>
              <option value="farmacia">Farmacia (30 días gratis, luego plan de pago)</option>
              <option value="doctor">Médico / Especialista (30 días gratis, luego plan VIP)</option>
            </select>
          </div>
          {formData.role !== 'paciente' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plan</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {formData.role === 'farmacia' && (
                  <>
                    <option value="farmacia-premium">Premium - $9.99/mes (30 días gratis)</option>
                    <option value="farmacia-pro">Pro - $19.99/mes (30 días gratis)</option>
                  </>
                )}
                {formData.role === 'doctor' && (
                  <option value="doctor-vip">VIP - $9.99/mes (30 días gratis)</option>
                )}
              </select>
            </div>
          )}
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          ¿Ya tienes cuenta? 
          <button 
            onClick={() => setActiveTab('login')}
            className="text-blue-600 font-bold ml-1"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;