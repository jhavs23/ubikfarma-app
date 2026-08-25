import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createPharmacyProfile } from '../graphql/mutations';

const client = generateClient();

export default function PharmacyRegistrationForm({ userSub, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    rif: '',
    phone: '',
    whatsapp: '',
    address: '',
    state: 'Carabobo',
    city: 'Valencia',
    zone: 'El Trigal',
    latitude: 10.2186,
    longitude: -68.0063,
    delivery_available: true,
    pickup_available: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fecha de prueba de vencimiento inicial (30 días de gracia/prueba)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      const input = {
        owner_id: userSub, // ID único del usuario autenticado en Cognito
        name: formData.name,
        rif: formData.rif.toUpperCase(),
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        zone: formData.zone,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        delivery_available: formData.delivery_available,
        pickup_available: formData.pickup_available,
        subscription_status: 'PENDING_APPROVAL', // Entra en estado pendiente de aprobación
        subscription_expires_at: expirationDate.toISOString(),
      };

      const result = await client.graphql({
        query: createPharmacyProfile,
        variables: { input },
      });

      console.log('Farmacia registrada con éxito:', result);
      if (onSuccess) onSuccess(result.data.createPharmacyProfile);
    } catch (err) {
      console.error('Error al registrar farmacia:', err);
      setError('Hubo un problema al registrar la farmacia. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 text-white rounded-xl p-6 shadow-xl">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-emerald-400">Registro de Nueva Farmacia</h2>
        <p className="text-slate-400 text-sm">Completa el perfil comercial para activar tus cotizaciones en Ubikfarma.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Comercial</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej: Farmacia San Rafael"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">RIF Jurídico</label>
            <input
              type="text"
              name="rif"
              required
              placeholder="J-12345678-0"
              value={formData.rif}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Principal</label>
            <input
              type="text"
              name="phone"
              required
              placeholder="0241-8500000"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp de Ventas</label>
            <input
              type="text"
              name="whatsapp"
              required
              placeholder="+584121234567"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección Física</label>
          <textarea
            name="address"
            rows="2"
            required
            placeholder="Av. Bolivar, C.C. Norte, Local 12"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estado</label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Zona / Parroquia</label>
            <input
              type="text"
              name="zone"
              required
              value={formData.zone}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
            <input
              type="checkbox"
              name="delivery_available"
              checked={formData.delivery_available}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
            />
            Ofrece Delivery
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
            <input
              type="checkbox"
              name="pickup_available"
              checked={formData.pickup_available}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
            />
            Retiro en Tienda
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 text-white"
        >
          {loading ? 'Registrando Farmacia...' : 'Completar Registro'}
        </button>
      </form>
    </div>
  );
}