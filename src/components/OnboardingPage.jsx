import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { Eye, EyeOff } from 'lucide-react';

const OnboardingPage = ({ setActiveTab, setShowAuthModal, setAuthMode, setAuthError }) => {
  const [step, setStep] = useState('register');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'paciente',
    plan: 'gratis',
  });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, role, plan } = formData;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: fullName,
            'custom:custom:role': role,
            'custom:custom:plan': plan,
          },
        },
      });
      setSuccess(true);
      setStep('confirm');
      setError('Hemos enviado un código de verificación a tu correo. Revisa tu bandeja de entrada y también la carpeta de spam.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!confirmationCode.trim()) {
      setError('Por favor ingresa el código de verificación.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await confirmSignUp({
        username: formData.email,
        confirmationCode: confirmationCode.trim(),
      });
      setSuccess(true);
      setError('✅ Cuenta confirmada exitosamente. Ahora inicia sesión.');
      setAuthMode('login');
      setShowAuthModal(true);
      setTimeout(() => {
        setActiveTab('home');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success && step === 'confirm') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-emerald-800">✅ ¡Cuenta confirmada!</h2>
          <p className="text-emerald-700 mt-2">Ya puedes iniciar sesión con tu correo y contraseña.</p>
          <button 
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
              setActiveTab('home');
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-black text-center mb-8">
        {step === 'register' ? '¡Crea tu cuenta gratis!' : 'Confirmar tu cuenta'}
      </h2>
      <div className="bg-white rounded-2xl shadow p-8">
        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${error.includes('exitoso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-5">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                      <option value="farmacia-basico">Básico - Gratis (sin publicidad)</option>
                      <option value="farmacia-pro">Pro - $9.99/mes (30 días gratis)</option>
                    </>
                  )}
                  {formData.role === 'doctor' && (
                    <option value="doctor-vip">VIP - $4.99/mes (30 días gratis)</option>
                  )}
                </select>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrarme'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-5">
            <p className="text-sm text-slate-600">Ingresa el código de 6 dígitos que enviamos a <strong>{formData.email}</strong></p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Código de verificación</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Ej. 123456"
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>
          </form>
        )}

        {step === 'register' && (
          <p className="text-center text-sm mt-4">
            ¿Ya tienes cuenta? 
            <button 
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
                setActiveTab('home');
              }}
              className="text-blue-600 font-bold ml-1"
            >
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;