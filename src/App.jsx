import { signIn, signUp, signOut, getCurrentUser } from 'aws-amplify/auth';
import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Navigation, Upload, Sparkles, Stethoscope, Building2, User, Lock, 
  Menu, X, Plus, Trash2, Hospital, ShoppingBag, ExternalLink, PhoneCall, ChevronRight, History,
  Heart, Bell, Filter, Users, LogIn, UserPlus, CreditCard, LayoutDashboard, ArrowLeft
} from 'lucide-react';
import { generateClient } from 'aws-amplify/api';
import { createQuoteRequest } from './graphql/mutations';
import { uploadData, getUrl } from 'aws-amplify/storage';

import logoImg from "./assets/ubikfarma-logo.png";

// Importación de módulos
import PharmacyRegistrationForm from './components/PharmacyRegistrationForm';
import PatientHistory from './components/PatientHistory';
import { checkPatientLimit, incrementPatientUsage } from './utils/usageLimits';

const client = generateClient();

const VENEZUELA_STATES = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", 
  "Carabobo", "Cojedes", "Delta Amacuro", "Dependencias Federales", 
  "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", 
  "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", 
  "La Guaira (Vargas)", "Yaracuy", "Zulia"
];

const SPECIALTIES = [
  "Cardiología", "Pediatría", "Dermatología", "Neurología", "Ginecología",
  "Oftalmología", "Ortopedia", "Psiquiatría", "Medicina Interna", "Cirugía General",
  "Fisioterapia", "Psicología", "Odontología", "Masaje Terapéutico"
];

const PRESENTATIONS = [
  "Tabletas / Comprimidos", "Cápsulas Blandas", "Jarabes", 
  "Suspensiones Pediátricas", "Cremas / Geles Tópicos", 
  "Óvulos / Supositorios", "Parches Transdérmicos", 
  "Ampollas / Inyectables", "Gotas Oftálmicas / Otológicas", 
  "Inhaladores / Sprays", "Soluciones Fisiológicas", 
  "Insumos Médicos (Sillas de Ruedas, Muletas, etc.)", "Otro..."
];

// Datos mock de doctores
const DOCTORS_DATA = [
  {
    id: 1,
    name: "Dr. Roberto Mendoza",
    specialty: "Cardiología",
    clinic: "Clínica Lugo - Maracay",
    phone: "+58 412-5550192",
    state: "Aragua",
    city: "Maracay",
    photo: "https://ui-avatars.com/api/?name=Roberto+Mendoza&background=0D8ABC&color=fff&size=64",
    bio: "Especialista en cardiología intervencionista con más de 15 años de experiencia."
  },
  {
    id: 2,
    name: "Dra. Carolina Gómez",
    specialty: "Pediatría",
    clinic: "Centro Médico de Cagua",
    phone: "+58 414-5550833",
    state: "Aragua",
    city: "Cagua",
    photo: "https://ui-avatars.com/api/?name=Carolina+Gomez&background=8B5CF6&color=fff&size=64",
    bio: "Pediatra con enfoque en neonatología y desarrollo infantil."
  },
  {
    id: 3,
    name: "Dr. Alberto Rojas",
    specialty: "Neurología",
    clinic: "Hospital Clínico de Caracas",
    phone: "+58 412-5551020",
    state: "Distrito Capital",
    city: "Caracas",
    photo: "https://ui-avatars.com/api/?name=Alberto+Rojas&background=16A34A&color=fff&size=64",
    bio: "Neurólogo con subespecialidad en enfermedades neurodegenerativas."
  },
  {
    id: 4,
    name: "Dra. María Fernanda",
    specialty: "Dermatología",
    clinic: "Centro Estético Avanzado",
    phone: "+58 414-5552040",
    state: "Carabobo",
    city: "Valencia",
    photo: "https://ui-avatars.com/api/?name=Maria+Fernanda&background=E11D48&color=fff&size=64",
    bio: "Dermatóloga con experiencia en tratamientos láser y oncológicos."
  },
  {
    id: 5,
    name: "Dr. Luis Torres",
    specialty: "Fisioterapia",
    clinic: "Centro de Rehabilitación Física",
    phone: "+58 412-5553060",
    state: "Miranda",
    city: "Los Teques",
    photo: "https://ui-avatars.com/api/?name=Luis+Torres&background=F59E0B&color=fff&size=64",
    bio: "Fisioterapeuta especializado en terapia deportiva y rehabilitación post-quirúrgica."
  },
  {
    id: 6,
    name: "Dra. Ana Lucía",
    specialty: "Psicología",
    clinic: "Centro de Salud Mental",
    phone: "+58 414-5554080",
    state: "Distrito Capital",
    city: "Caracas",
    photo: "https://ui-avatars.com/api/?name=Ana+Lucia&background=6D28D9&color=fff&size=64",
    bio: "Psicóloga clínica con enfoque en terapia cognitivo-conductual y ansiedad."
  }
];

export default function App() {
  // Estado de navegación
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [useGps, setUseGps] = useState(false);
  const [rateBcv] = useState(772.54);

  // 🔥 ESTADOS DE AUTENTICACIÓN
  const [userSub, setUserSub] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estado del formulario de cotización
  const [medicinesList, setMedicinesList] = useState([
    { id: 1, medicine: '', dosage: '', presentation: 'Tabletas / Comprimidos', quantity: 1 }
  ]);

  const [locationData, setLocationData] = useState({
    state: 'Aragua',
    city: 'Maracay',
    parish: '',
    exactAddress: '',
    referencePoint: ''
  });

  // Filtros de doctores
  const [doctorFilter, setDoctorFilter] = useState({
    specialty: '',
    state: '',
    search: ''
  });

  // Estado para el modal de suscripción/login
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Estado para límites del usuario
  const [userPlan, setUserPlan] = useState('FREE');
  const [remainingRequests, setRemainingRequests] = useState(2);

  // Estado para mensajes de error en el modal
  const [authError, setAuthError] = useState('');

  // Datos mock
  const mockQuotes = [
    {
      id: 1,
      pharmacy: "Farmacia Botica Central",
      location: "Maracay - Centro (Cerca Clínica Lugo)",
      priceUsd: 8.50,
      badge: "Más Cercana",
      time: "Disponible de inmediato"
    },
    {
      id: 2,
      pharmacy: "FarmaSaas Corinsa",
      location: "Cagua - Urb. Corinsa",
      priceUsd: 7.90,
      badge: "Mejor Precio",
      time: "Disponible en 30 min"
    },
    {
      id: 3,
      pharmacy: "Farmavalor San José",
      location: "Maracay - Av. Bolívar",
      priceUsd: 8.10,
      badge: "Cadena Aliada",
      time: "Disponible de inmediato"
    }
  ];

  const adsProducts = [
    {
      id: 1,
      title: "Nebulizador Ultrasónico Portátil",
      pharmacy: "FarmaSaas Corinsa",
      priceUsd: 28.00,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
      tag: "Patrocinado"
    },
    {
      id: 2,
      title: "Tensiómetro Digital de Brazo",
      pharmacy: "Farmacia Botica Central",
      priceUsd: 22.50,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&auto=format&fit=crop&q=80",
      tag: "Oferta Insumos"
    },
    {
      id: 3,
      title: "Collarín Cervical Ajustable Semi-Rígido",
      pharmacy: "Farmavalor San José",
      priceUsd: 14.00,
      image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80",
      tag: "Equipo Médico"
    }
  ];

  // --- Funciones de manejo de medicamentos ---
  const handleAddMedicine = () => {
    setMedicinesList([
      ...medicinesList,
      { id: Date.now(), medicine: '', dosage: '', presentation: 'Tabletas / Comprimidos', quantity: 1 }
    ]);
  };

  const handleRemoveMedicine = (id) => {
    if (medicinesList.length > 1) {
      setMedicinesList(medicinesList.filter(item => item.id !== id));
    }
  };

  const handleMedicineChange = (id, field, value) => {
    setMedicinesList(medicinesList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleGpsToggle = () => {
    if (!useGps) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUseGps(true);
            setLocationData(prev => ({
              ...prev,
              referencePoint: `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
            }));
          },
          () => alert("No se pudo obtener la ubicación.")
        );
      }
    } else {
      setUseGps(false);
    }
  };

  // --- 🔥 CARGAR USUARIO AUTENTICADO AL INICIAR LA APP ---
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        const sub = user.userId;
        setUserSub(sub);
        setIsAuthenticated(true);
        const data = await checkPatientLimit(sub);
        setUserPlan(data.plan);
        setRemainingRequests(data.remainingRequests);
        console.log("✅ Usuario autenticado:", sub);
      } catch (error) {
        const guestId = "guest-" + Date.now();
        setUserSub(guestId);
        setIsAuthenticated(false);
        const data = await checkPatientLimit(guestId);
        setUserPlan(data.plan);
        setRemainingRequests(data.remainingRequests);
        console.log("👤 Usuario invitado:", guestId);
      }
    };
    checkUser();
  }, []);

  // --- Envío de cotización ---
  const handleSendQuote = async (e) => {
    e.preventDefault();

    const validMedicines = medicinesList.filter(item => item.medicine.trim() !== '');
    if (validMedicines.length === 0) {
      alert("Por favor ingresa al menos un medicamento.");
      return;
    }

    if (userPlan === 'FREE' && validMedicines.length > 2) {
      alert("Como usuario gratuito, solo puedes cotizar hasta 2 medicamentos por consulta. Suscríbete por $0.99/mes para cotizar más.");
      return;
    }

    if (remainingRequests <= 0) {
      alert("Has alcanzado el límite de 2 consultas gratis este mes. Suscríbete por $0.99/mes para consultas ilimitadas.");
      return;
    }

    let prescriptionImageUrl = null;
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      try {
        const file = fileInput.files[0];
        if (!file.type.startsWith('image/')) {
          alert("Por favor selecciona una imagen válida (JPEG, PNG, etc.).");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert("La imagen es demasiado grande. Máximo 5MB.");
          return;
        }
        const fileName = `prescriptions/${userSub}/${Date.now()}_${file.name}`;
        const uploadResult = await uploadData({
          path: fileName,
          data: file,
          options: {
            contentType: file.type,
            accessLevel: 'guest'
          }
        }).result;
        const urlResult = await getUrl({
          path: uploadResult.path,
          options: { accessLevel: 'guest' }
        });
        prescriptionImageUrl = urlResult.url;
        console.log("Receta subida a S3:", prescriptionImageUrl);
      } catch (error) {
        console.error("Error al subir la receta:", error);
        alert("Error al subir la receta. Intenta de nuevo.");
        return;
      }
    }

    const first = validMedicines[0];
    const allMedicinesJSON = JSON.stringify(validMedicines);

    try {
      const maxResponses = userPlan === 'FREE' ? 2 : 4;
      const inputData = {
        patient_id: userSub,
        patient_name: "",
        patient_phone: "",
        medicine_name: first.medicine,
        dosage_mg: first.dosage || null,
        presentation: first.presentation || null,
        quantity: first.quantity || 1,
        notes: allMedicinesJSON,
        prescription_image_url: prescriptionImageUrl,
        state: locationData.state,
        city: locationData.city,
        zone: locationData.parish || locationData.zone || "N/A",
        latitude: null,
        longitude: null,
        is_guest: !isAuthenticated,
        max_responses_allowed: maxResponses,
        status: "OPEN",
        urgency_level: null,
        preferred_brands: null
      };

      const response = await client.graphql({
        query: createQuoteRequest,
        variables: { input: inputData },
        authMode: 'apiKey'
      });

      await incrementPatientUsage(userSub);
      setRemainingRequests(prev => prev - 1);

      if (fileInput) {
        fileInput.value = '';
      }

      console.log("Cotización guardada en DynamoDB:", response.data.createQuoteRequest);
      alert("¡Cotización enviada con éxito a las farmacias!");
    } catch (error) {
      console.error("Error al guardar cotización:", error);
      alert("Error al procesar la cotización.");
    }
  };

  // --- Función para abrir el modal de autenticación ---
  const handleOpenAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthError('');
    setShowAuthModal(true);
  };

  // --- Cerrar sesión ---
  const handleLogout = async () => {
    try {
      await signOut();
      setUserSub(null);
      setIsAuthenticated(false);
      const guestId = "guest-" + Date.now();
      setUserSub(guestId);
      const data = await checkPatientLimit(guestId);
      setUserPlan(data.plan);
      setRemainingRequests(data.remainingRequests);
      alert("Sesión cerrada correctamente.");
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  // --- Filtrado de doctores ---
  const filteredDoctors = DOCTORS_DATA.filter(doc => {
    const matchSpecialty = doctorFilter.specialty === '' || doc.specialty === doctorFilter.specialty;
    const matchState = doctorFilter.state === '' || doc.state === doctorFilter.state;
    const matchSearch = doc.name.toLowerCase().includes(doctorFilter.search.toLowerCase()) ||
                        doc.specialty.toLowerCase().includes(doctorFilter.search.toLowerCase()) ||
                        doc.city.toLowerCase().includes(doctorFilter.search.toLowerCase());
    return matchSpecialty && matchState && matchSearch;
  });

  // --- Renderizado condicional de páginas ---
  const renderPage = () => {
    switch (activeTab) {
      case 'patient_history':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <button 
              onClick={() => setActiveTab('home')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mb-4"
            >
              ← Volver al buscador
            </button>
            {userSub ? (
              <PatientHistory patientId={userSub} />
            ) : (
              <p className="text-center text-slate-500">Cargando usuario...</p>
            )}
          </div>
        );
      case 'pharmacy_register':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <button 
              onClick={() => setActiveTab('home')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mb-4"
            >
              ← Volver al buscador
            </button>
            <PharmacyRegistrationForm 
              userSub={userSub || "guest"} 
              onSuccess={() => {
                alert('¡Farmacia registrada!');
                setActiveTab('home');
              }} 
            />
          </div>
        );
      case 'login':
        return (
          <div className="max-w-md mx-auto px-4 py-12">
            <h2 className="text-2xl font-black text-center mb-6">Iniciar Sesión</h2>
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
              <input type="email" placeholder="Correo electrónico" className="w-full border rounded-lg px-4 py-2" />
              <input type="password" placeholder="Contraseña" className="w-full border rounded-lg px-4 py-2" />
              <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl">Entrar</button>
              <p className="text-center text-sm">¿No tienes cuenta? <button onClick={() => setActiveTab('onboarding')} className="text-blue-600 font-bold">Regístrate</button></p>
            </div>
          </div>
        );
      case 'onboarding':
        return (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-black text-center mb-8">¡Crea tu cuenta y elige tu plan!</h2>
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
              <input type="text" placeholder="Nombre completo" className="w-full border rounded-lg px-4 py-2" />
              <input type="email" placeholder="Correo electrónico" className="w-full border rounded-lg px-4 py-2" />
              <input type="password" placeholder="Contraseña" className="w-full border rounded-lg px-4 py-2" />
              <select className="w-full border rounded-lg px-4 py-2">
                <option value="paciente">Paciente</option>
                <option value="farmacia">Farmacia</option>
                <option value="doctor">Médico / Especialista</option>
              </select>
              <button className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl">Registrarse</button>
              <p className="text-center text-sm">¿Ya tienes cuenta? <button onClick={() => setActiveTab('login')} className="text-blue-600 font-bold">Inicia sesión</button></p>
            </div>
          </div>
        );
      case 'plans':
        return (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-black text-center mb-8">Elige tu plan ideal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Cliente Gratuito */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200 hover:border-blue-500 transition">
                <h3 className="text-xl font-black">Cliente Gratuito</h3>
                <p className="text-3xl font-bold my-4">$0</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">✅ 2 consultas/mes</li>
                  <li className="flex items-center gap-2">✅ 2 medicamentos por consulta</li>
                  <li className="flex items-center gap-2">✅ 2 respuestas por consulta</li>
                </ul>
                <button className="w-full mt-6 bg-blue-600 text-white font-bold py-2 rounded-xl">Seleccionar</button>
              </div>
              {/* Plan Cliente Suscripción */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-500 hover:border-emerald-600 transition relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">Popular</span>
                <h3 className="text-xl font-black">Cliente Suscripción</h3>
                <p className="text-3xl font-bold my-4">$0.99<small className="text-base font-normal text-slate-500">/mes</small></p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">✅ Consultas ilimitadas</li>
                  <li className="flex items-center gap-2">✅ Medicamentos ilimitados</li>
                  <li className="flex items-center gap-2">✅ 4+ respuestas por consulta</li>
                </ul>
                <button className="w-full mt-6 bg-emerald-600 text-white font-bold py-2 rounded-xl">Suscribirse</button>
              </div>
              {/* Plan Farmacia Premium */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-500 hover:border-blue-600 transition">
                <h3 className="text-xl font-black">Farmacia Premium</h3>
                <p className="text-3xl font-bold my-4">$9.99<small className="text-base font-normal text-slate-500">/mes</small></p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">✅ Cotizaciones ilimitadas</li>
                  <li className="flex items-center gap-2">✅ Prioridad en respuestas</li>
                  <li className="flex items-center gap-2">✅ Soporte 24/7</li>
                  <li className="flex items-center gap-2">✅ Alertas de publicidad Meta/Google</li>
                </ul>
                <button className="w-full mt-6 bg-blue-600 text-white font-bold py-2 rounded-xl">Contratar</button>
              </div>
              {/* Plan Farmacia Pro */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-500 hover:border-purple-600 transition">
                <h3 className="text-xl font-black">Farmacia Pro</h3>
                <p className="text-3xl font-bold my-4">$19.99<small className="text-base font-normal text-slate-500">/mes</small></p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">✅ Todo de Premium</li>
                  <li className="flex items-center gap-2">✅ Panel de estadísticas avanzadas</li>
                  <li className="flex items-center gap-2">✅ Publicidad destacada en Meta y Google</li>
                </ul>
                <button className="w-full mt-6 bg-purple-600 text-white font-bold py-2 rounded-xl">Contratar</button>
              </div>
              {/* Plan Médico VIP */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-teal-500 hover:border-teal-600 transition">
                <h3 className="text-xl font-black">Médico VIP</h3>
                <p className="text-3xl font-bold my-4">$9.99<small className="text-base font-normal text-slate-500">/mes</small></p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">✅ Perfil destacado</li>
                  <li className="flex items-center gap-2">✅ Anuncios contextuales</li>
                  <li className="flex items-center gap-2">✅ Canal directo con clientes</li>
                  <li className="flex items-center gap-2">✅ Anuncios en Meta y Google</li>
                </ul>
                <button className="w-full mt-6 bg-teal-600 text-white font-bold py-2 rounded-xl">Contratar</button>
              </div>
            </div>
          </div>
        );
      default:
        return renderHome();
    }
  };

  // --- Página principal (HOME) ---
  const renderHome = () => (
    <>
      <section className="px-4 pt-6 pb-2 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Ubica, compara y <span className="text-blue-600">Compra...</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-700 font-semibold mt-1.5">
          Cotiza 1 o múltiples medicamentos en farmacias cercanas.
        </p>
      </section>

      {/* 🔥 BANNER DE LÍMITES PARA USUARIOS GRATUITOS */}
      {userPlan === 'FREE' && (
        <div className="max-w-7xl mx-auto px-4 mt-2">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-center shadow-sm">
            <p className="text-sm sm:text-base font-medium text-amber-800">
              ⚡ Como usuario gratuito, puedes realizar hasta <span className="font-black text-amber-900">2 consultas al mes</span> (máximo <span className="font-black text-amber-900">2 medicamentos por consulta</span>).
              Te quedan <span className="font-black text-amber-900">{remainingRequests}</span> consultas este mes.
              Suscríbete por solo <span className="font-black text-amber-900">$0.99/mes</span> para consultas ilimitadas y más respuestas.
              <button 
                onClick={() => handleOpenAuthModal('register')}
                className="ml-2 text-sm sm:text-base font-bold text-blue-700 hover:underline"
              >
                ¡Suscríbete ahora!
              </button>
            </p>
          </div>
        </div>
      )}

      {/* 🏥 SECCIÓN INFORMATIVA: PARA QUIÉN ES UBIKFARMA */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-2">
          ¿Para quién es <span className="text-blue-600">UBIK</span><span className="text-emerald-500">FARMA</span>?
        </h2>
        <p className="text-center text-slate-600 text-sm mb-8 max-w-2xl mx-auto">
          Conectamos a los pacientes con las farmacias y los profesionales de la salud de una manera rápida, segura y moderna.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta: Pacientes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Para Pacientes</h3>
            <p className="text-sm text-slate-600 mt-2">
              Cotiza medicamentos en segundos, compara precios y elige la farmacia más cercana. 
              <span className="font-bold text-blue-600">consultas ilimitadas por 0.99$ al mes (Tasa BCV).</span>
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              <li className="flex items-center gap-2">✅ Encuentra tu medicamento al mejor precio</li>
              <li className="flex items-center gap-2">✅ Recibe respuestas de varias farmacias</li>
              <li className="flex items-center gap-2">✅ Sube tu receta médica de forma segura</li>
              <li className="flex items-center gap-2">✅ Gratis solo 2 consultas al mes</li>
              <li className="flex items-center gap-2">✅ Consultas ilimitadas por solo 0.99$ al mes</li>
            </ul>
            <button 
              onClick={() => handleOpenAuthModal('register')}
              className="mt-4 text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Regístrate Aquì. <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tarjeta: Farmacias */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm hover:shadow-md transition group relative">
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">Principal</div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Para Farmacias</h3>
            <p className="text-sm text-slate-600 mt-2">
              Recibe solicitudes de pacientes en tu zona, responde con precios y haz crecer tu negocio.
              <span className="font-bold text-emerald-600"> Planes desde $9.99/mes.</span>
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              <li className="flex items-center gap-2">✅ Cotizaciones ilimitadas (Premium/Pro)</li>
              <li className="flex items-center gap-2">✅ Prioridad en respuestas</li>
              <li className="flex items-center gap-2">✅ Panel de estadísticas y ventas</li>
              <li className="flex items-center gap-2">✅ Publicidad destacada en Meta y Google</li>
            </ul>
            <button 
              onClick={() => setActiveTab('plans')}
              className="mt-4 text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              Ver planes <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tarjeta: Profesionales de la Salud */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <Stethoscope className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Para Profesionales de la Salud</h3>
            <p className="text-sm text-slate-600 mt-2">
              Médicos, fisioterapeutas, psicólogos, masajistas y más. Conecta con miles de pacientes.
              <span className="font-bold text-purple-600"> Plan VIP desde $9.99/mes.</span>
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              <li className="flex items-center gap-2">✅ Perfil destacado en el directorio médico</li>
              <li className="flex items-center gap-2">✅ Anuncios contextuales según búsquedas</li>
              <li className="flex items-center gap-2">✅ Canal directo con pacientes</li>
              <li className="flex items-center gap-2">✅ Anuncios en Meta y Google</li>
            </ul>
            <button 
              onClick={() => setActiveTab('plans')}
              className="mt-4 text-sm font-bold text-purple-600 hover:underline flex items-center gap-1"
            >
              Ver planes VIP <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FORMULARIO DE BÚSQUEDA */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-300 p-4 sm:p-6 shadow-sm space-y-6">
          <form onSubmit={handleSendQuote} className="space-y-6">
            {/* Medicamentos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Search className="w-6 h-6 text-blue-600" />
                  <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">
                    1. Medicamentos a Cotizar ({medicinesList.length})
                  </h3>
                </div>
                <button 
                  type="button"
                  onClick={handleAddMedicine}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl border border-blue-300 flex items-center gap-1.5 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-4">
                {medicinesList.map((item, index) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-300 relative shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-blue-950 bg-blue-200 border border-blue-300 px-2.5 py-1 rounded-md">
                        Item #{index + 1}
                      </span>
                      {medicinesList.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMedicine(item.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Quitar</span>
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">Nombre / Principio Activo</label>
                        <input 
                          type="text"
                          value={item.medicine}
                          onChange={(e) => handleMedicineChange(item.id, 'medicine', e.target.value)}
                          placeholder="Ej. Acetaminofén, Losartán..."
                          className="w-full bg-white border border-slate-400 rounded-lg px-3.5 py-2.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">Dosis / Concentración</label>
                          <input 
                            type="text"
                            value={item.dosage}
                            onChange={(e) => handleMedicineChange(item.id, 'dosage', e.target.value)}
                            placeholder="Ej. 500mg, 120mg/5ml"
                            className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">Cantidad</label>
                          <input 
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleMedicineChange(item.id, 'quantity', e.target.value)}
                            className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2 text-sm font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">Presentación</label>
                          <select 
                            value={item.presentation}
                            onChange={(e) => handleMedicineChange(item.id, 'presentation', e.target.value)}
                            className="w-full bg-white border border-slate-400 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-900"
                          >
                            {PRESENTATIONS.map((pres, idx) => (
                              <option key={idx} value={pres}>{pres}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <hr className="border-slate-200" />

            {/* Ubicación */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">2. Ubicación</h3>
                </div>
                <button 
                  type="button" 
                  onClick={handleGpsToggle}
                  className={`text-xs font-extrabold px-3 py-2 rounded-lg border transition ${
                    useGps ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  {useGps ? 'GPS Activado ✓' : 'Usar GPS'}
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">Estado</label>
                    <select 
                      value={locationData.state}
                      onChange={(e) => setLocationData({ ...locationData, state: e.target.value })}
                      className="w-full bg-white border border-slate-400 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                    >
                      {VENEZUELA_STATES.map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">Municipio / Ciudad</label>
                    <input 
                      type="text" 
                      value={locationData.city}
                      onChange={(e) => setLocationData({ ...locationData, city: e.target.value })}
                      placeholder="Ej. Maracay..." 
                      className="w-full bg-white border border-slate-400 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">Parroquia / Zona</label>
                    <input 
                      type="text" 
                      value={locationData.parish}
                      onChange={(e) => setLocationData({ ...locationData, parish: e.target.value })}
                      placeholder="Ej. Centro, Calicanto..." 
                      className="w-full bg-white border border-slate-400 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Hospital className="w-4 h-4 text-blue-600" />
                      <span>Calle / Clínica / Hospital</span>
                    </label>
                    <input 
                      type="text" 
                      value={locationData.exactAddress}
                      onChange={(e) => setLocationData({ ...locationData, exactAddress: e.target.value })}
                      placeholder="Ej. Clínica Lugo, Av. 19 de Abril" 
                      className="w-full bg-white border border-slate-400 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">Punto de Referencia</label>
                    <input 
                      type="text" 
                      value={locationData.referencePoint}
                      onChange={(e) => setLocationData({ ...locationData, referencePoint: e.target.value })}
                      placeholder="Ej. Frente a la plaza" 
                      className="w-full bg-white border border-slate-400 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="border-slate-200" />

            {/* Receta */}
            <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Upload className="w-5 h-5 text-blue-700" />
                <span className="text-sm font-bold text-slate-900">Adjuntar Récipe (Opcional)</span>
              </div>
              <input type="file" className="text-xs text-slate-700 cursor-pointer font-medium" />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2">
              <Search className="w-6 h-6" />
              <span>Consultar Todo ({medicinesList.length} Medicamento{medicinesList.length > 1 ? 's' : ''})</span>
            </button>
          </form>
        </div>

        {/* LATERAL DERECHO */}
        <div className="lg:col-span-5 space-y-6">
          {/* Respuestas en Tiempo Real */}
          <div className="bg-white rounded-2xl border border-slate-300 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div>
                <h2 className="font-black text-slate-950 text-lg">Respuestas en Tiempo Real</h2>
                <p className="text-xs font-bold text-slate-600">Cotizaciones disponibles</p>
              </div>
              <div className="text-right bg-emerald-100 border border-emerald-300 rounded-xl px-3 py-1.5">
                <span className="block text-[10px] font-black text-emerald-900 uppercase tracking-wider">Tasa BCV</span>
                <span className="text-sm font-black text-emerald-950">{rateBcv.toFixed(2)} Bs/USD</span>
              </div>
            </div>

            <div className="space-y-4">
              {mockQuotes.slice(0, 2).map((quote) => {
                const priceBcv = (quote.priceUsd * rateBcv).toLocaleString('es-VE', { minimumFractionDigits: 2 });
                return (
                  <div key={quote.id} className="p-4 rounded-xl border border-slate-300 bg-slate-50 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-blue-200 text-blue-950 border border-blue-300 uppercase">
                        {quote.badge}
                      </span>
                      <span className="text-xs text-slate-600 font-bold">{quote.time}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-950 text-base">{quote.pharmacy}</h4>
                    <p className="text-xs font-semibold text-slate-600 mb-2.5">{quote.location}</p>
                    <div className="flex items-baseline justify-between border-t border-slate-200 pt-2.5">
                      <div>
                        <span className="text-lg font-black text-slate-950">${quote.priceUsd.toFixed(2)} USD</span>
                        <span className="block text-xs font-extrabold text-emerald-700">Bs. {priceBcv}</span>
                      </div>
                      <button className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-3.5 py-2 rounded-lg">
                        Contactar WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* 🔥 BOTÓN DE SUSCRIPCIÓN */}
              <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-200 shadow-sm">
                  <h4 className="font-black text-slate-950 text-base">¡Desbloquea más cotizaciones!</h4>
                  <p className="text-xs font-semibold text-slate-600 mb-3">Crea tu cuenta para recibir cotizaciones ilimitadas.</p>
                  <button 
                    onClick={() => handleOpenAuthModal('register')}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-black text-sm py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Suscribirse por $0.99/mes
                  </button>
                </div>
              </div>

              {/* Cotizaciones bloqueadas */}
              <div className="relative pt-1 border-t border-slate-200">
                <div className="space-y-3 filter blur-[4px] pointer-events-none opacity-30">
                  {mockQuotes.slice(2).map((quote) => (
                    <div key={quote.id} className="p-3 rounded-xl border border-slate-300 bg-slate-50">
                      <h4 className="font-bold text-slate-950 text-sm">{quote.pharmacy}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Productos Destacados */}
          <div className="bg-white rounded-2xl border border-slate-300 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-slate-950 text-base">Ofertas e Insumos</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {adsProducts.map((prod) => (
                <div key={prod.id} className="flex gap-3 items-center p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition">
                  <img src={prod.image} alt={prod.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">{prod.tag}</span>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{prod.title}</h4>
                    <p className="text-[11px] font-semibold text-slate-500 truncate">{prod.pharmacy}</p>
                    <span className="text-xs font-black text-slate-900 mt-0.5 block">${prod.priceUsd.toFixed(2)} USD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DIRECTORIO MÉDICO */}
          <div className="bg-white rounded-2xl border border-slate-300 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-950 text-base">Directorio Médico</h3>
              </div>
              <span className="text-[10px] font-black text-white bg-emerald-600 px-2 py-1 rounded-full">+{DOCTORS_DATA.length}</span>
            </div>

            {/* Filtros */}
            <div className="mb-4 space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text"
                    placeholder="🔍 Buscar médico, especialidad o ciudad..."
                    value={doctorFilter.search}
                    onChange={(e) => setDoctorFilter({ ...doctorFilter, search: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    value={doctorFilter.specialty}
                    onChange={(e) => setDoctorFilter({ ...doctorFilter, specialty: e.target.value })}
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Todas</option>
                    {SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <select 
                    value={doctorFilter.state}
                    onChange={(e) => setDoctorFilter({ ...doctorFilter, state: e.target.value })}
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Todos</option>
                    {VENEZUELA_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de doctores con scroll */}
            <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {filteredDoctors.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No se encontraron médicos.</p>
              ) : (
                filteredDoctors.map((doc) => (
                  <div key={doc.id} className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition group">
                    <img 
                      src={doc.photo} 
                      alt={doc.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-200 group-hover:border-emerald-500 transition flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                          <p className="text-xs font-semibold text-emerald-700">{doc.specialty}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{doc.state}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{doc.clinic}</p>
                      <p className="text-[11px] text-slate-500 truncate">{doc.city}</p>
                      {doc.bio && (
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 italic">{doc.bio}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200">
                        <span className="text-xs font-semibold text-slate-700">{doc.phone}</span>
                        <button className="text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition px-3 py-1 rounded-lg flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" /> Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredDoctors.length >= 4 && (
              <div className="mt-4 text-center">
                <button className="text-xs font-bold text-blue-600 hover:underline transition flex items-center justify-center gap-1">
                  Ver más especialistas <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );

  // --- 🔥 MODAL DE AUTENTICACIÓN REAL (con diseño mejorado) ---
  const renderAuthModal = () => {
    if (!showAuthModal) return null;

    const handleLogin = async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      setAuthError('');
      try {
        await signIn({ username: email, password });
        setShowAuthModal(false);
        const user = await getCurrentUser();
        setUserSub(user.userId);
        setIsAuthenticated(true);
        const data = await checkPatientLimit(user.userId);
        setUserPlan(data.plan);
        setRemainingRequests(data.remainingRequests);
        alert("✅ Inicio de sesión exitoso");
      } catch (error) {
        setAuthError(error.message);
      }
    };

    const handleRegister = async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      const confirmPassword = e.target.confirmPassword?.value;
      const fullName = e.target.fullName?.value || "";
      
      if (password !== confirmPassword) {
        setAuthError("Las contraseñas no coinciden.");
        return;
      }
      
      setAuthError('');
      try {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              name: fullName,
            },
          },
        });
        alert("✅ Registro exitoso. Revisa tu correo para confirmar.");
        setAuthMode('login');
        setAuthError('Registro exitoso. Ahora inicia sesión.');
      } catch (error) {
        setAuthError(error.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Cabecera con logo */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-4 flex justify-center items-center gap-3">
            <img src={logoImg} alt="UBIKFARMA" className="h-10 w-auto object-contain" />
            <span className="font-black text-2xl text-white tracking-tight">
              UBIK<span className="text-emerald-200">FARMA</span>
            </span>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-900 text-lg">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {authError && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${authError.includes('exitoso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {authError}
              </div>
            )}

            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre completo</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    placeholder="Ej. Juan Pérez" 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo electrónico</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="tu@email.com" 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Mínimo 8 caracteres" 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                  minLength="8"
                />
              </div>
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar contraseña</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Repite la contraseña" 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                    minLength="8"
                  />
                </div>
              )}
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition duration-200"
              >
                {authMode === 'login' ? 'Entrar' : 'Registrarme'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button 
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 text-center">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" /> Volver a la página principal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Render principal ---
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col justify-between">
      
      <div>
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <img src={logoImg} alt="UBIKFARMA Logo" className="h-10 sm:h-12 w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl sm:text-3xl tracking-tight">
                  <span className="text-blue-600">UBIK</span><span className="text-emerald-500">FARMA</span>
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden sm:block">
                  Diferentes opciones, un solo lugar
                </span>
              </div>
            </div>

            {/* Menú Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('home')}
                className={`text-sm font-bold px-3 py-2 rounded-lg transition ${activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:text-blue-600'}`}
              >
                Buscar Cotización
              </button>
              <button 
                onClick={() => setActiveTab('patient_history')}
                className={`flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg transition ${activeTab === 'patient_history' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-800 hover:text-emerald-600'}`}
              >
                <History className="w-4 h-4" /> <span>Mis Cotizaciones</span>
              </button>
              <button 
                onClick={() => setActiveTab('pharmacy_register')}
                className={`flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg border transition ${activeTab === 'pharmacy_register' ? 'bg-blue-600 text-white border-blue-600' : 'text-blue-800 bg-blue-50 border-blue-200 hover:bg-blue-100'}`}
              >
                <Building2 className="w-4 h-4" /> <span>¿Eres Farmacia?</span>
              </button>
              
              {/* 🔥 Botón de autenticación / Cerrar sesión */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">👤 {userSub?.slice(0,8)}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-bold text-red-600 hover:text-red-800 transition px-2"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleOpenAuthModal('login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition"
                >
                  Iniciar Sesión
                </button>
              )}
              
              <button 
                onClick={() => setActiveTab('plans')}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition px-2"
              >
                Planes
              </button>
            </div>

            {/* Menú Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 px-2"
                >
                  Cerrar sesión
                </button>
              ) : (
                <button 
                  onClick={() => handleOpenAuthModal('login')} 
                  className="bg-blue-600 text-white font-bold text-sm px-3 py-1.5 rounded-lg"
                >
                  Entrar
                </button>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 rounded-lg text-slate-800 hover:bg-slate-100">
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>

          {/* Menú desplegable mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-3 pb-3 px-2 border-t border-slate-200 mt-2 space-y-2 bg-white">
              <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm font-bold text-slate-800">
                <Search className="w-5 h-5 text-blue-600" /> Buscar Cotización
              </button>
              <button onClick={() => { setActiveTab('patient_history'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm font-bold text-slate-800">
                <History className="w-5 h-5 text-emerald-600" /> Mis Cotizaciones
              </button>
              <button onClick={() => { setActiveTab('pharmacy_register'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm font-bold text-blue-800 bg-blue-50">
                <Building2 className="w-5 h-5 text-blue-600" /> ¿Eres Farmacia?
              </button>
              <button onClick={() => { setActiveTab('plans'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Planes
              </button>
              {!isAuthenticated && (
                <button onClick={() => { handleOpenAuthModal('login'); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm font-bold text-blue-600">
                  <LogIn className="w-5 h-5" /> Iniciar Sesión
                </button>
              )}
            </div>
          )}
        </header>

        {/* CONTENIDO PRINCIPAL */}
        {renderPage()}
        
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 mt-12 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 UBIKFARMA - Todos los derechos reservados.</p>
          <div className="flex gap-4 font-semibold">
            <button onClick={() => setActiveTab('plans')} className="hover:text-white transition">Planes</button>
            <a href="#" className="hover:text-white transition">Términos</a>
            <a href="#" className="hover:text-white transition">Privacidad</a>
            <a href="#" className="hover:text-white transition">Contacto</a>
          </div>
        </div>
      </footer>

      {/* Modal de autenticación */}
      {renderAuthModal()}
      
    </div>
  );
}