// src/components/pharmacy/PharmacyProfile.jsx
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { getPharmacyProfile, listPharmacyProfiles } from '../../graphql/queries';
import { createPharmacyProfile, updatePharmacyProfile } from '../../graphql/mutations';
import { Save, Building2, MapPin, Phone, Clock, Truck, User, Upload } from 'lucide-react';

const client = generateClient();

const PharmacyProfile = ({ pharmacyId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [profile, setProfile] = useState({
    owner_id: pharmacyId || '',
    name: '',
    rif: '',
    phone: '',
    whatsapp: '',
    address: '',
    state: '',
    city: '',
    zone: '',
    latitude: null,
    longitude: null,
    delivery_available: true,
    delivery_radius_km: 5,
    pickup_available: true,
    opening_hours: 'Lun-Vie 8:00-18:00',
    logo_url: '',
  });
  const [existingId, setExistingId] = useState(null);

  useEffect(() => {
    if (pharmacyId) {
      fetchProfile();
    }
  }, [pharmacyId]);

  const fetchProfile = async () => {
    try {
      const result = await client.graphql({
        query: listPharmacyProfiles,
        variables: { filter: { owner_id: { eq: pharmacyId } } },
        authMode: 'apiKey'
      });
      const items = result.data.listPharmacyProfiles.items || [];
      if (items.length > 0) {
        const found = items[0];
        setProfile(found);
        setLogoPreview(found.logo_url || null);
        setExistingId(found.id);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Subir logo si hay uno nuevo
      let logoUrl = profile.logo_url;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `pharmacies/${pharmacyId}/logo_${Date.now()}.${fileExt}`;
        const uploadResult = await uploadData({
          path: fileName,
          data: logoFile,
          options: {
            contentType: logoFile.type,
            accessLevel: 'guest'
          }
        }).result;
        const urlResult = await getUrl({
          path: uploadResult.path,
          options: { accessLevel: 'guest' }
        });
        logoUrl = urlResult.url;
      }

      const input = { ...profile, logo_url: logoUrl };
      delete input.id;
      delete input.createdAt;
      delete input.updatedAt;
      delete input.owner;
      delete input.__typename;

      let result;
      if (existingId) {
        result = await client.graphql({
          query: updatePharmacyProfile,
          variables: { input: { id: existingId, ...input } },
          authMode: 'apiKey'
        });
      } else {
        result = await client.graphql({
          query: createPharmacyProfile,
          variables: { input },
          authMode: 'apiKey'
        });
        setExistingId(result.data.createPharmacyProfile.id);
      }
      alert('✅ Perfil guardado correctamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-emerald-600" />
          Perfil de la Farmacia
        </h2>
        <p className="text-sm text-slate-500 mb-6">Configura los datos de tu farmacia para aparecer en las cotizaciones.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Logo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <Upload className="w-4 h-4" /> Logo de la farmacia
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="mt-2 h-20 w-20 object-cover rounded-lg border" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Nombre comercial</label>
              <input name="name" value={profile.name} onChange={handleChange} placeholder="Farmacia Ejemplo" className="w-full border rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">RIF</label>
              <input name="rif" value={profile.rif} onChange={handleChange} placeholder="J-12345678-9" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1"><Phone className="w-4 h-4" /> Teléfono</label>
              <input name="phone" value={profile.phone} onChange={handleChange} placeholder="+58 412-555-1212" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1"><Phone className="w-4 h-4" /> WhatsApp</label>
              <input name="whatsapp" value={profile.whatsapp} onChange={handleChange} placeholder="+58 414-555-1212" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1"><MapPin className="w-4 h-4" /> Dirección</label>
            <input name="address" value={profile.address} onChange={handleChange} placeholder="Av. Principal, Centro" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Estado</label>
              <input name="state" value={profile.state} onChange={handleChange} placeholder="Aragua" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Ciudad</label>
              <input name="city" value={profile.city} onChange={handleChange} placeholder="Maracay" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Zona / Sector</label>
              <input name="zone" value={profile.zone} onChange={handleChange} placeholder="Centro" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1"><Clock className="w-4 h-4" /> Horarios</label>
              <input name="opening_hours" value={profile.opening_hours} onChange={handleChange} placeholder="Lun-Vie 8:00-18:00" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1"><Truck className="w-4 h-4" /> Radio delivery (km)</label>
              <input name="delivery_radius_km" type="number" value={profile.delivery_radius_km} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input name="delivery_available" type="checkbox" checked={profile.delivery_available} onChange={handleChange} />
              Ofrecemos delivery
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input name="pickup_available" type="checkbox" checked={profile.pickup_available} onChange={handleChange} />
              Retiro en tienda
            </label>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PharmacyProfile;