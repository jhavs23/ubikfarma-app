import React from 'react';
import { 
  Building2, Zap, Users, TrendingUp, Package, 
  Smartphone, Clock, Shield, ChevronRight, 
  CheckCircle, Truck, BarChart3, Megaphone
} from 'lucide-react';

const PharmacyRegistrationForm = ({ setActiveTab }) => {
  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      title: 'Más clientes, menos esfuerzo',
      description: 'Conectamos tu farmacia con pacientes que buscan tus productos en tu zona. Olvídate de buscar clientes, ellos te encuentran a ti.'
    },
    {
      icon: <Zap className="w-8 h-8 text-emerald-600" />,
      title: 'Respuestas en 1 clic',
      description: 'Recibe cotizaciones y responde con precios y disponibilidad en segundos. Tu inventario se sincroniza para que siempre tengas la información actualizada.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      title: 'Aumenta tus ventas digitales',
      description: 'Los pacientes comparan precios y eligen la mejor opción. Si tu oferta es competitiva, ganarás ventas sin salir de tu farmacia.'
    },
    {
      icon: <Package className="w-8 h-8 text-emerald-600" />,
      title: 'Vende más que medicamentos',
      description: 'Publica insumos médicos, equipos, productos de cuidado personal y más. Amplía tu catálogo y multiplica tus ingresos.'
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-600" />,
      title: 'Ahorra tiempo y recursos',
      description: 'Digitaliza tu atención: menos llamadas, menos visitas físicas, más eficiencia. Tu equipo se enfoca en lo importante.'
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-600" />,
      title: 'Clientes filtrados, conversiones reales',
      description: 'Los pacientes que llegan ya están interesados y listos para comprar. Nuestro sistema filtra a los curiosos y te trae compradores activos.'
    }
  ];

  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      price: '$0/mes',
      features: [
        'Cotizaciones ilimitadas',
        'Perfil de farmacia',
        'Inventario básico',
        'Soporte por correo'
      ],
      badge: 'Siempre gratis',
      highlighted: false,
      trial: ''
    },
    {
      id: 'pro',
      name: 'PRO',
      price: '$9.99/mes',
      features: [
        'Todo de Básico',
        'Publicidad destacada en Meta y Google',
        'Estadísticas avanzadas (gráficos, tendencias)',
        'Múltiples usuarios (gerente + empleados)',
        'Panel de control personalizado'
      ],
      badge: 'Popular',
      highlighted: true,
      trial: '30 días gratis'
    }
  ];

  const handleSubscribe = (planId) => {
    if (setActiveTab) {
      setActiveTab('onboarding');
    } else {
      window.location.href = '/onboarding';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Digitaliza tu farmacia y <br />
            <span className="text-emerald-200">multiplica tus ventas</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Conecta con miles de pacientes que buscan tus productos. Olvídate de perder ventas por no estar en el mundo digital.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSubscribe('pro')}
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Probar 30 días gratis <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSubscribe('basico')}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Ver planes <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
          ¿Por qué <span className="text-emerald-600">UBIKFARMA</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="mb-3">{benefit.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 px-4 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            ¿Cómo <span className="text-emerald-600">funciona</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-emerald-700">1</span>
              </div>
              <h3 className="font-bold text-slate-900">Regístrate gratis</h3>
              <p className="text-sm text-slate-600">Crea tu cuenta en minutos. Elige tu plan y activa tu prueba de 30 días.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-emerald-700">2</span>
              </div>
              <h3 className="font-bold text-slate-900">Configura tu farmacia</h3>
              <p className="text-sm text-slate-600">Sube tu logo, dirección, horarios y productos. Los pacientes te encontrarán.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-emerald-700">3</span>
              </div>
              <h3 className="font-bold text-slate-900">Recibe y responde cotizaciones</h3>
              <p className="text-sm text-slate-600">Los pacientes piden presupuestos, tú respondes con precio y disponibilidad. ¡Vende!</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-4">
          Elige el plan ideal para tu farmacia
        </h2>
        <p className="text-center text-slate-600 mb-12">
          Prueba 30 días gratis del plan PRO. Sin compromiso. Cancela cuando quieras.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition hover:shadow-md ${
                plan.highlighted ? 'border-emerald-500' : 'border-slate-200'
              } relative`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black uppercase px-3 py-1 rounded-full ${
                  plan.highlighted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {plan.badge}
                </span>
              )}
              <h3 className="text-2xl font-black text-slate-900 mt-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{plan.price}</p>
              {plan.trial && <p className="text-sm text-emerald-500 font-bold">{plan.trial}</p>}
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full mt-6 font-bold py-3 rounded-xl transition ${
                  plan.highlighted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                {plan.id === 'basico' ? 'Registrarse gratis' : 'Probar 30 días gratis'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION FINAL */}
      <section className="bg-emerald-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            ¿Listo para digitalizar tu farmacia?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Únete a cientos de farmacias que ya están vendiendo más con UBIKFARMA.
          </p>
          <button
            onClick={() => handleSubscribe('pro')}
            className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2"
          >
            Probar 30 días gratis <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default PharmacyRegistrationForm;