import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createQuoteRequest } from '../../graphql/mutations';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { Search, MapPin, Upload, Plus, Trash2, Hospital, CheckCircle } from 'lucide-react';

const client = generateClient();

const PRESENTATIONS = [
  'Tabletas / Comprimidos',
  'Cápsulas Blandas',
  'Jarabes',
  'Suspensiones Pediátricas',
  'Cremas / Geles Tópicos',
  'Óvulos / Supositorios',
  'Parches Transdérmicos',
  'Ampollas / Inyectables',
  'Gotas Oftálmicas / Otológicas',
  'Inhaladores / Sprays',
  'Soluciones Fisiológicas',
  'Otro',
];

const VENEZUELA_STATES = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", 
  "Carabobo", "Cojedes", "Delta Amacuro", "Dependencias Federales", 
  "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", 
  "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", 
  "La Guaira (Vargas)", "Yaracuy", "Zulia"
];

// Datos mock de respuestas de farmacias (para mostrar después de enviar)
const MOCK_RESPONSES = [
  {
    id: 'r1',
    pharmacy: 'Farmacia Botica Central',
    location: 'Maracay - Centro',
    price: 8.50,
    message: 'Disponible en 30 min',
  },
  {
    id: 'r2',
    pharmacy: 'FarmaSaas Corinsa',
    location: 'Cagua - Urb. Corinsa',
    price: 7.90,
    message: 'Entrega inmediata',
  },
];

const FeedQuoteForm = ({ userSub, isAuthenticated, onQuoteSent }) => {
  const [loading, setLoading] = useState(false);
  const [medicinesList, setMedicinesList] = useState([
    { id: 1, medicine: '', dosage: '', presentation: 'Tabletas / Comprimidos', quantity: 1 }
  ]);
  const [locationData, setLocationData] = useState({
    state: 'Aragua',
    city: '',
    parish: '',
    exactAddress: '',
    referencePoint: ''
  });
  const [useGps, setUseGps] = useState(false);
  const [gpsCoords, setGpsCoords] = useState({ lat: null, lng: null });
  const [showResponses, setShowResponses] = useState(false);
  const [responses, setResponses] = useState([]);
  const [quoteSent, setQuoteSent] = useState(false);

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
            setGpsCoords({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            });
            setLocationData(prev => ({
              ...prev,
              referencePoint: '📍 Ubicación GPS activada'
            }));
          },
          () => alert("No se pudo obtener la ubicación.")
        );
      }
    } else {
      setUseGps(false);
      setGpsCoords({ lat: null, lng: null });
      setLocationData(prev => ({
        ...prev,
        referencePoint: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validMedicines = medicinesList.filter(item => item.medicine.trim() !== '');
    if (validMedicines.length === 0) {
      alert("Por favor ingresa al menos un medicamento.");
      return;
    }

    setLoading(true);
    try {
      let prescriptionImageUrl = null;
      const file = document.querySelector('input[type="file"]')?.files[0];
      if (file) {
        const fileName = `prescriptions/${userSub || 'guest'}/${Date.now()}_${file.name}`;
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
      }

      const first = validMedicines[0];
      const allMedicinesJSON = JSON.stringify(validMedicines);

      const inputData = {
        patient_id: userSub || 'guest',
        patient_name: "",
        patient_phone: "",
        medicine_name: first.medicine,
        dosage_mg: first.dosage || null,
        presentation: first.presentation || null,
        quantity: first.quantity || 1,
        notes: allMedicinesJSON,
        prescription_image_url: prescriptionImageUrl,
        state: locationData.state,
        city: locationData.city || 'Maracay',
        zone: locationData.parish || "N/A",
        latitude: gpsCoords.lat || null,
        longitude: gpsCoords.lng || null,
        is_guest: !isAuthenticated,
        max_responses_allowed: 10,
        status: "OPEN",
        urgency_level: null,
        preferred_brands: null
      };

      await client.graphql({
        query: createQuoteRequest,
        variables: { input: inputData },
        authMode: 'apiKey'
      });

      // Limpiar formulario
      setMedicinesList([{ id: 1, medicine: '', dosage: '', presentation: 'Tabletas / Comprimidos', quantity: 1 }]);
      document.querySelector('input[type="file"]').value = '';
      setLocationData({
        state: 'Aragua',
        city: '',
        parish: '',
        exactAddress: '',
        referencePoint: ''
      });
      setUseGps(false);
      setGpsCoords({ lat: null, lng: null });

      // Mostrar respuestas mock
      setResponses(MOCK_RESPONSES);
      setShowResponses(true);
      setQuoteSent(true);
      if (onQuoteSent) onQuoteSent();
      alert("¡Cotización enviada con éxito!");
    } catch (error) {
      console.error("Error al guardar cotización:", error);
      alert("Error al procesar la cotización.");
    } finally {
      setLoading(false);
    }
  };

  if (quoteSent && showResponses) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle className="w-6 h-6" />
          <h3 className="text-xl font-bold">¡Cotización enviada!</h3>
        </div>
        <p className="text-sm text-slate-600">Las farmacias están respondiendo. Aquí verás sus ofertas:</p>
        {responses.map((resp) => (
          <div key={resp.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900">{resp.pharmacy}</h4>
                <p className="text-xs text-slate-500">{resp.location}</p>
                <p className="text-sm text-slate-700">{resp.message}</p>
              </div>
              <span className="text-lg font-black text-emerald-600">${resp.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            setShowResponses(false);
            setQuoteSent(false);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
        >
          Realizar otra cotización
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-600" />
        Cotizar medicamentos
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicamentos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-slate-700">
              Medicamentos ({medicinesList.length})
            </h4>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </div>

          {medicinesList.map((item, index) => (
            <div key={item.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-3 relative">
              {medicinesList.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(item.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase">Medicamento *</label>
                  <input
                    type="text"
                    value={item.medicine}
                    onChange={(e) => handleMedicineChange(item.id, 'medicine', e.target.value)}
                    placeholder="Ej. Acetaminofén"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase">Dosis</label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) => handleMedicineChange(item.id, 'dosage', e.target.value)}
                    placeholder="Ej. 500mg"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase">Presentación</label>
                  <select
                    value={item.presentation}
                    onChange={(e) => handleMedicineChange(item.id, 'presentation', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    {PRESENTATIONS.map((pres) => (
                      <option key={pres} value={pres}>{pres}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleMedicineChange(item.id, 'quantity', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ubicación */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Ubicación
            </h4>
            <button
              type="button"
              onClick={handleGpsToggle}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                useGps ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {useGps ? 'GPS Activado ✓' : 'Usar GPS'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase">Estado</label>
              <select
                value={locationData.state}
                onChange={(e) => setLocationData({ ...locationData, state: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              >
                {VENEZUELA_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase">Ciudad</label>
              <input
                type="text"
                value={locationData.city}
                onChange={(e) => setLocationData({ ...locationData, city: e.target.value })}
                placeholder="Maracay"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase">Zona</label>
              <input
                type="text"
                value={locationData.parish}
                onChange={(e) => setLocationData({ ...locationData, parish: e.target.value })}
                placeholder="Centro"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                <Hospital className="w-3 h-3" /> Dirección
              </label>
              <input
                type="text"
                value={locationData.exactAddress}
                onChange={(e) => setLocationData({ ...locationData, exactAddress: e.target.value })}
                placeholder="Clínica Lugo, Av. 19 de Abril"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase">Referencia</label>
              <input
                type="text"
                value={locationData.referencePoint}
                onChange={(e) => setLocationData({ ...locationData, referencePoint: e.target.value })}
                placeholder="Frente a la plaza"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
              <Upload className="w-3 h-3" /> Receta (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Enviando...' : <><Search className="w-5 h-5" /> Consultar Todo</>}
        </button>
      </form>
    </div>
  );
};

export default FeedQuoteForm;