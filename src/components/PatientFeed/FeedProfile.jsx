import React, { useState, useEffect } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { User, Mail, MapPin, Phone, Camera } from 'lucide-react';

const FeedProfile = ({ userSub, setActiveTab }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserData({
          name: attributes?.name || 'Usuario',
          email: attributes?.email || '',
          phone: attributes?.phone_number || '',
          address: attributes?.['custom:address'] || '',
          city: attributes?.['custom:city'] || '',
          state: attributes?.['custom:state'] || '',
          photoURL: attributes?.['custom:photo'] || '',
        });
        setTempData({});
      } catch (error) {
        console.error('Error cargando perfil:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleEdit = () => {
    setTempData(userData);
    setEditing(true);
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar en DynamoDB o en atributos personalizados
    setUserData(tempData);
    setEditing(false);
    alert('Perfil actualizado (simulación)');
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempData({ ...tempData, photoURL: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const displayData = editing ? tempData : userData;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-black text-slate-900">Mi Perfil</h2>
      <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4 shadow-sm">
        {/* Foto de perfil */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={displayData.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayData.name) + '&background=0D8ABC&color=fff&size=128'}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full border-4 border-emerald-200 object-cover"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-emerald-700 transition">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            )}
          </div>
          <h3 className="text-xl font-bold mt-2">{displayData.name}</h3>
          <p className="text-sm text-slate-500">{displayData.email}</p>
        </div>

        {/* Campos del perfil */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate-400 mt-1" />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Nombre completo</label>
              {editing ? (
                <input
                  type="text"
                  value={displayData.name}
                  onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">{displayData.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-slate-400 mt-1" />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Correo electrónico</label>
              <p className="text-sm font-medium text-slate-900">{displayData.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-slate-400 mt-1" />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Teléfono</label>
              {editing ? (
                <input
                  type="tel"
                  value={displayData.phone}
                  onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">{displayData.phone || 'No especificado'}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-slate-400 mt-1" />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Dirección de entrega</label>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Calle, número"
                    value={displayData.address}
                    onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={displayData.city}
                      onChange={(e) => setTempData({ ...tempData, city: e.target.value })}
                      className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Estado"
                      value={displayData.state}
                      onChange={(e) => setTempData({ ...tempData, state: e.target.value })}
                      className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-900">
                  {displayData.address || 'No especificada'}
                  {displayData.city && `, ${displayData.city}`}
                  {displayData.state && `, ${displayData.state}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition"
              >
                Guardar cambios
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
            >
              Editar perfil
            </button>
          )}
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="mt-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default FeedProfile;