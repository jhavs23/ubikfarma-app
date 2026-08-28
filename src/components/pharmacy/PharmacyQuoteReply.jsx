import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createQuoteResponse } from '../../graphql/mutations';
import { listPharmacyInventories } from '../../graphql/queries';
import { 
  X, MapPin, Package, DollarSign, Truck, Send, AlertCircle, 
  CheckCircle, Clock, User, Home, Phone, Map, Search
} from 'lucide-react';

const client = generateClient();

const PharmacyQuoteReply = ({ quote, pharmacyId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [formData, setFormData] = useState({
    unit_price_usd: '',
    delivery_cost_usd: 0,
    availability: 'available',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Cargar inventario al montar
  useEffect(() => {
    if (quote && pharmacyId) {
      fetchInventory();
    }
  }, [quote, pharmacyId]);

  const fetchInventory = async () => {
    try {
      const result = await client.graphql({
        query: listPharmacyInventories,
        variables: { filter: { pharmacy_id: { eq: pharmacyId } } },
        authMode: 'apiKey'
      });
      const items = result.data.listPharmacyInventories.items || [];
      setInventoryProducts(items);

      // Intentar encontrar una coincidencia automática
      const medicineName = quote.medicine_name?.toLowerCase().trim() || '';
      if (medicineName) {
        // Buscar coincidencia exacta o parcial en custom_name o active_ingredient
        const found = items.find(p => 
          p.custom_name?.toLowerCase().includes(medicineName) ||
          p.active_ingredient?.toLowerCase().includes(medicineName)
        );
        if (found) {
          setSelectedProduct(found);
          setFormData(prev => ({
            ...prev,
            unit_price_usd: found.price_usd?.toString() || '',
            availability: found.is_available ? 'available' : 'unavailable',
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      unit_price_usd: product.price_usd?.toString() || '',
      availability: product.is_available ? 'available' : 'unavailable',
    }));
    setShowProductSelector(false);
    setSearchTerm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.unit_price_usd || parseFloat(formData.unit_price_usd) <= 0) {
      setError('Por favor ingresa un precio válido.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const input = {
        quote_request_id: quote.id,
        pharmacy_id: pharmacyId,
        employee_user_id: null,
        availability: formData.availability,
        unit_price_usd: parseFloat(formData.unit_price_usd),
        total_price_usd: parseFloat(formData.unit_price_usd) * (quote.quantity || 1),
        delivery_cost_usd: parseFloat(formData.delivery_cost_usd || 0),
        notes: formData.notes,
      };

      await client.graphql({
        query: createQuoteResponse,
        variables: { input },
        authMode: 'apiKey'
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Error al enviar la respuesta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseWithoutReply = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar esta cotización sin responder?')) {
      onClose();
    }
  };

  // Filtrar productos para el selector
  const filteredProducts = inventoryProducts.filter(p =>
    p.custom_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.active_ingredient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.presentation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!quote) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            Responder a cotización
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Información del paciente y ubicación */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <User className="w-4 h-4" /> Paciente
              </p>
              <p className="text-sm font-bold text-slate-900">{quote.patient_name || 'Anónimo'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Package className="w-4 h-4" /> Medicamento solicitado
              </p>
              <p className="text-sm font-bold text-slate-900">{quote.medicine_name}</p>
              <p className="text-xs text-slate-600">
                Dosis: {quote.dosage_mg || 'No especificada'} | Cantidad: {quote.quantity || 1}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Ubicación del paciente
            </p>
            <p className="text-sm text-slate-800">
              {quote.state}, {quote.city} - {quote.zone || 'N/A'}
            </p>
            <div className="flex gap-2 mt-1 text-xs text-slate-500">
              <span><Map className="w-3 h-3 inline" /> {quote.latitude ? 'GPS activado' : 'Sin GPS'}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Distancia estimada: ~3.2 km
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Zona: {quote.zone || 'No especificada'}
              </span>
            </div>
          </div>

          {quote.prescription_image_url && (
            <div className="mt-2 pt-2 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase">Receta médica</p>
              <a href={quote.prescription_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                Ver imagen de la receta
              </a>
            </div>
          )}
        </div>

        {/* Selector de producto del inventario */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <Package className="w-4 h-4" /> Producto en inventario
            </label>
            {inventoryProducts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowProductSelector(!showProductSelector)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {selectedProduct ? 'Cambiar producto' : 'Seleccionar del inventario'}
              </button>
            )}
          </div>

          {selectedProduct ? (
            <div className="mt-1 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-slate-900">{selectedProduct.custom_name}</p>
                <p className="text-xs text-slate-600">{selectedProduct.presentation || 'Sin presentación'}</p>
                <p className="text-xs text-slate-500">Stock: {selectedProduct.stock_quantity || 0} unidades</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedProduct.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {selectedProduct.is_available ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-1">
              {inventoryProducts.length === 0 ? 'No hay productos en el inventario.' : 'Ningún producto coincide. Puedes ingresar el precio manualmente.'}
            </p>
          )}

          {/* Selector desplegable de productos */}
          {showProductSelector && (
            <div className="mt-2 border border-slate-300 rounded-lg p-2 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar en inventario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="max-h-40 overflow-y-auto mt-2 space-y-1">
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-2">No hay productos que coincidan.</p>
                ) : (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{product.custom_name}</p>
                        <p className="text-xs text-slate-500">{product.presentation || 'Sin presentación'} - Stock: {product.stock_quantity || 0}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">${product.price_usd?.toFixed(2)}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Formulario de respuesta */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Precio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> Precio unitario (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="unit_price_usd"
                value={formData.unit_price_usd}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            {selectedProduct && (
              <p className="text-xs text-emerald-600 mt-1">
                💡 Precio desde inventario: ${selectedProduct.price_usd}
              </p>
            )}
          </div>

          {/* Delivery */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <Truck className="w-4 h-4" /> Costo de delivery (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="delivery_cost_usd"
                value={formData.delivery_cost_usd}
                onChange={handleChange}
                placeholder="0.00 (gratis)"
                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              💡 Si el delivery es gratis, ingresa 0.
            </p>
          </div>

          {/* Disponibilidad */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase">Disponibilidad</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="available">✅ Disponible</option>
              <option value="substitute">🔄 Con sustituto</option>
              <option value="unavailable">❌ No disponible</option>
            </select>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase">Notas para el paciente</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Ej. Genérico disponible, entrega en 24h, etc."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> ✅ Respuesta enviada correctamente
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <Send className="w-5 h-5" />
              )}
              {loading ? 'Enviando...' : 'Enviar respuesta'}
            </button>
            <button
              type="button"
              onClick={handleCloseWithoutReply}
              disabled={loading}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-lg transition disabled:opacity-50"
            >
              Cerrar sin responder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PharmacyQuoteReply;