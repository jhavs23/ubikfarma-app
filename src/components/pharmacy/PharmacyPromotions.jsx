import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listPromotions } from '../../graphql/queries';
import { createPromotion, updatePromotion, deletePromotion } from '../../graphql/mutations';
import { Plus, Edit, Trash2, Calendar, Tag, DollarSign, Percent, X, Save } from 'lucide-react';

const client = generateClient();

// Iconos personalizados para error y éxito
const AlertCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PharmacyPromotions = ({ pharmacyId }) => {
  // ✅ Log para verificar que el componente se monta
  console.log('✅ PharmacyPromotions montado con pharmacyId:', pharmacyId);

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    discount_fixed_usd: '',
    code: '',
    valid_from: '',
    valid_to: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (pharmacyId) {
      fetchPromotions();
    } else {
      console.warn('⚠️ PharmacyPromotions: No se recibió pharmacyId');
    }
  }, [pharmacyId]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching promotions for pharmacy:', pharmacyId);
      const result = await client.graphql({
        query: listPromotions,
        variables: { filter: { pharmacy_id: { eq: pharmacyId } } },
        authMode: 'apiKey'
      });
      const items = result.data.listPromotions.items || [];
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPromotions(items);
      console.log('✅ Promotions fetched:', items.length);
    } catch (error) {
      console.error('❌ Error fetching promotions:', error);
      setError('Error al cargar las promociones.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      discount_percentage: '',
      discount_fixed_usd: '',
      code: '',
      valid_from: '',
      valid_to: '',
      active: true,
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleEdit = (promo) => {
    setEditingPromotion(promo);
    setFormData({
      title: promo.title || '',
      description: promo.description || '',
      discount_percentage: promo.discount_percentage?.toString() || '',
      discount_fixed_usd: promo.discount_fixed_usd?.toString() || '',
      code: promo.code || '',
      valid_from: promo.valid_from?.split('T')[0] || '',
      valid_to: promo.valid_to?.split('T')[0] || '',
      active: promo.active ?? true,
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDelete = async (promoId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta promoción?')) return;
    try {
      await client.graphql({
        query: deletePromotion,
        variables: { input: { id: promoId } },
        authMode: 'apiKey'
      });
      setPromotions(promotions.filter(p => p.id !== promoId));
      setSuccess('Promoción eliminada correctamente.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting promotion:', error);
      setError('Error al eliminar la promoción.');
    }
  };

  const handleToggleActive = async (promoId, currentStatus) => {
    try {
      await client.graphql({
        query: updatePromotion,
        variables: { input: { id: promoId, active: !currentStatus } },
        authMode: 'apiKey'
      });
      setPromotions(promotions.map(p =>
        p.id === promoId ? { ...p, active: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error toggling promotion:', error);
      alert('Error al cambiar el estado.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (!formData.discount_percentage && !formData.discount_fixed_usd) {
      setError('Debes especificar un descuento (porcentaje o monto fijo).');
      return;
    }
    if (formData.discount_percentage && (parseFloat(formData.discount_percentage) <= 0 || parseFloat(formData.discount_percentage) > 100)) {
      setError('El porcentaje debe ser entre 1 y 100.');
      return;
    }
    if (formData.valid_from && formData.valid_to && formData.valid_from > formData.valid_to) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const input = {
        pharmacy_id: pharmacyId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        discount_fixed_usd: formData.discount_fixed_usd ? parseFloat(formData.discount_fixed_usd) : null,
        code: formData.code.trim() || null,
        valid_from: formData.valid_from || null,
        valid_to: formData.valid_to || null,
        active: formData.active,
      };

      let result;
      if (editingPromotion) {
        result = await client.graphql({
          query: updatePromotion,
          variables: { input: { id: editingPromotion.id, ...input } },
          authMode: 'apiKey'
        });
        const updated = result.data.updatePromotion;
        setPromotions(promotions.map(p => p.id === updated.id ? updated : p));
        setSuccess('Promoción actualizada correctamente.');
      } else {
        result = await client.graphql({
          query: createPromotion,
          variables: { input },
          authMode: 'apiKey'
        });
        const created = result.data.createPromotion;
        setPromotions([created, ...promotions]);
        setSuccess('Promoción creada correctamente.');
      }
      setTimeout(() => setSuccess(''), 3000);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving promotion:', error);
      setError('Error al guardar la promoción. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const renderFormModal = () => {
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-slate-900">
              {editingPromotion ? 'Editar Promoción' : 'Crear Promoción'}
            </h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej. Descuento de verano"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalles de la promoción..."
                rows="2"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                  <Percent className="w-4 h-4" /> % Descuento
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  placeholder="10"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> Descuento fijo (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discount_fixed_usd}
                  onChange={(e) => setFormData({ ...formData, discount_fixed_usd: e.target.value })}
                  placeholder="5.00"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                <Tag className="w-4 h-4" /> Código promocional
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ej. VERANO2026"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Desde
                </label>
                <input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Hasta
                </label>
                <input
                  type="date"
                  value={formData.valid_to}
                  onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-emerald-600"
              />
              <label className="text-sm font-medium text-slate-700">Activa</label>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> {success}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? 'Guardando...' : <><Save className="w-5 h-5" /> {editingPromotion ? 'Actualizar' : 'Crear'}</>}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      );
    }

    if (promotions.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">Sin promociones</h3>
          <p className="text-slate-500 text-sm">Crea tu primera promoción para atraer más clientes.</p>
          <button onClick={handleAdd} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" /> Crear promoción
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Título</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3 hidden sm:table-cell">Descuento</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3 hidden md:table-cell">Código</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3 hidden lg:table-cell">Vigencia</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Estado</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-bold text-slate-900">{promo.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {promo.discount_percentage && <span className="text-emerald-600 font-bold">{promo.discount_percentage}%</span>}
                    {promo.discount_fixed_usd && <span className="text-blue-600 font-bold">${promo.discount_fixed_usd}</span>}
                    {!promo.discount_percentage && !promo.discount_fixed_usd && '-'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">{promo.code || '-'}</code>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-600 text-xs">
                    {promo.valid_from && promo.valid_to ? (
                      `${new Date(promo.valid_from).toLocaleDateString()} - ${new Date(promo.valid_to).toLocaleDateString()}`
                    ) : (
                      'Sin fecha'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(promo.id, promo.active)}
                      className={`text-xs font-bold px-2 py-0.5 rounded-full transition ${
                        promo.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {promo.active ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(promo)} className="text-blue-600 hover:text-blue-800 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(promo.id)} className="text-red-600 hover:text-red-800 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-600" />
            Promociones
          </h2>
          <p className="text-sm text-slate-500">Crea descuentos y ofertas para atraer más clientes.</p>
        </div>
        <div className="text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          Total: {promotions.length} promociones
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Crear promoción
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {renderTable()}
      {renderFormModal()}
    </div>
  );
};

export default PharmacyPromotions;