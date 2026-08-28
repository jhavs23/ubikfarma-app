import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listPharmacyInventories } from '../../graphql/queries';
import { createPharmacyInventory, updatePharmacyInventory, deletePharmacyInventory } from '../../graphql/mutations';
import { Plus, Edit, Trash2, Search, Upload, Package, DollarSign, AlertCircle, CheckCircle, X, Save, FileSpreadsheet } from 'lucide-react';

const client = generateClient();

// Lista extendida de presentaciones
const PRESENTATION_OPTIONS = [
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
  'Insumos Médicos (Sillas de Ruedas, Muletas, etc.)',
  'Equipos de Diagnóstico (Glucómetros, Tensiómetros)',
  'Material de Curación (Gasas, Vendas, Apósitos)',
  'Productos de Ortodoncia',
  'Suplementos Nutricionales',
  'Productos de Higiene y Cuidado Personal',
  'Medicamentos Homeopáticos',
  'Productos Naturales / Herbolarios',
  'Otro',
];

const PharmacyInventory = ({ pharmacyId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    active_ingredient: '',
    concentration: '',
    presentation: '',
    presentation_other: '', // para cuando selecciona "Otro"
    price_usd: '',
    stock_quantity: 1,
    is_available: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (pharmacyId) fetchInventory();
  }, [pharmacyId]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const result = await client.graphql({
        query: listPharmacyInventories,
        variables: { filter: { pharmacy_id: { eq: pharmacyId } } },
        authMode: 'apiKey',
      });
      const items = result.data.listPharmacyInventories.items || [];
      items.sort((a, b) => a.custom_name?.localeCompare(b.custom_name) || 0);
      setProducts(items);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Error al cargar el inventario.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.custom_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.presentation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.active_ingredient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.concentration?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      active_ingredient: '',
      concentration: '',
      presentation: '',
      presentation_other: '',
      price_usd: '',
      stock_quantity: 1,
      is_available: true,
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    // Verificar si la presentación está en la lista o es "Otro"
    const isCustom = !PRESENTATION_OPTIONS.includes(product.presentation || '');
    setFormData({
      active_ingredient: product.active_ingredient || '',
      concentration: product.concentration || '',
      presentation: isCustom ? 'Otro' : (product.presentation || ''),
      presentation_other: isCustom ? (product.presentation || '') : '',
      price_usd: product.price_usd?.toString() || '',
      stock_quantity: product.stock_quantity || 1,
      is_available: product.is_available ?? true,
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await client.graphql({
        query: deletePharmacyInventory,
        variables: { input: { id: productId } },
        authMode: 'apiKey',
      });
      setProducts(products.filter((p) => p.id !== productId));
      setSuccess('Producto eliminado correctamente.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error al eliminar el producto.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.active_ingredient.trim()) {
      setError('El nombre del medicamento es obligatorio.');
      return;
    }
    if (!formData.price_usd || parseFloat(formData.price_usd) <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }

    // Determinar la presentación final
    let finalPresentation = formData.presentation;
    if (formData.presentation === 'Otro') {
      if (!formData.presentation_other.trim()) {
        setError('Por favor especifica la presentación personalizada.');
        return;
      }
      finalPresentation = formData.presentation_other.trim();
    }

    setSaving(true);
    setError('');
    try {
      // Concatenar para el nombre completo
      const fullName = [
        formData.active_ingredient.trim(),
        formData.concentration.trim(),
      ].filter(Boolean).join(' ');

      const input = {
        pharmacy_id: pharmacyId,
        custom_name: fullName,
        active_ingredient: formData.active_ingredient.trim(),
        concentration: formData.concentration.trim(),
        price_usd: parseFloat(formData.price_usd),
        price_bs: parseFloat(formData.price_usd) * 772.54,
        stock_quantity: parseInt(formData.stock_quantity) || 1,
        is_available: formData.is_available,
        presentation: finalPresentation,
      };

      let result;
      if (editingProduct) {
        result = await client.graphql({
          query: updatePharmacyInventory,
          variables: { input: { id: editingProduct.id, ...input } },
          authMode: 'apiKey',
        });
        const updated = result.data.updatePharmacyInventory;
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        setSuccess('Producto actualizado correctamente.');
      } else {
        result = await client.graphql({
          query: createPharmacyInventory,
          variables: { input },
          authMode: 'apiKey',
        });
        const created = result.data.createPharmacyInventory;
        setProducts([created, ...products].sort((a, b) => a.custom_name?.localeCompare(b.custom_name) || 0));
        setSuccess('Producto agregado correctamente.');
      }
      setTimeout(() => setSuccess(''), 3000);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Error al guardar el producto. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleImportCSV = async () => {
    if (!csvFile) {
      alert('Selecciona un archivo CSV.');
      return;
    }
    setImporting(true);
    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter((line) => line.trim() !== '');
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const nameIdx = headers.findIndex((h) => h.includes('nombre') || h.includes('name'));
      const concIdx = headers.findIndex((h) => h.includes('concentracion') || h.includes('concentration') || h.includes('dosis'));
      const presIdx = headers.findIndex((h) => h.includes('presentacion') || h.includes('presentation'));
      const priceIdx = headers.findIndex((h) => h.includes('precio') || h.includes('price'));
      const stockIdx = headers.findIndex((h) => h.includes('stock') || h.includes('cantidad'));

      if (nameIdx === -1 || priceIdx === -1) {
        alert('El CSV debe tener columnas: nombre, precio (y opcional: concentración, presentación, stock)');
        setImporting(false);
        return;
      }

      const productsToAdd = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        const name = cols[nameIdx] || '';
        const concentration = concIdx !== -1 ? cols[concIdx] || '' : '';
        const presentation = presIdx !== -1 ? cols[presIdx] || '' : '';
        const price = parseFloat(cols[priceIdx]) || 0;
        const stock = stockIdx !== -1 ? parseInt(cols[stockIdx]) || 1 : 1;
        if (name && price > 0) {
          const fullName = [name, concentration].filter(Boolean).join(' ');
          productsToAdd.push({
            pharmacy_id: pharmacyId,
            custom_name: fullName,
            active_ingredient: name,
            concentration: concentration,
            price_usd: price,
            price_bs: price * 772.54,
            stock_quantity: stock,
            is_available: true,
            presentation: presentation || 'No especificada',
          });
        }
      }

      if (productsToAdd.length === 0) {
        alert('No se encontraron productos válidos en el archivo.');
        setImporting(false);
        return;
      }

      const promises = productsToAdd.map((p) =>
        client.graphql({
          query: createPharmacyInventory,
          variables: { input: p },
          authMode: 'apiKey',
        })
      );
      await Promise.all(promises);

      setSuccess(`${productsToAdd.length} productos importados correctamente.`);
      setTimeout(() => setSuccess(''), 3000);
      fetchInventory();
      setCsvFile(null);
      setShowImportModal(false);
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Error al importar el archivo. Verifica el formato.');
    } finally {
      setImporting(false);
    }
  };

  // MODAL DE FORMULARIO (AGREGAR/EDITAR)
  const renderFormModal = () => {
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-slate-900">{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Medicamento *</label>
                <input
                  type="text"
                  value={formData.active_ingredient}
                  onChange={(e) => setFormData({ ...formData, active_ingredient: e.target.value })}
                  placeholder="Ej. Acetaminofén"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Concentración / Dosis</label>
                <input
                  type="text"
                  value={formData.concentration}
                  onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                  placeholder="Ej. 500mg, 120mg/5ml"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Presentación</label>
              <select
                value={formData.presentation}
                onChange={(e) => setFormData({ ...formData, presentation: e.target.value, presentation_other: '' })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">Selecciona una presentación</option>
                {PRESENTATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {formData.presentation === 'Otro' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Especificar presentación *</label>
                <input
                  type="text"
                  value={formData.presentation_other}
                  onChange={(e) => setFormData({ ...formData, presentation_other: e.target.value })}
                  placeholder="Ej. Parche transdérmico de liberación prolongada"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> Precio (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price_usd}
                  onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                  placeholder="0.00"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 text-emerald-600"
              />
              <label className="text-sm font-medium text-slate-700">Disponible en inventario</label>
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
              {saving ? 'Guardando...' : <><Save className="w-5 h-5" /> {editingProduct ? 'Actualizar' : 'Agregar'}</>}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // MODAL DE IMPORTACIÓN CSV
  const renderImportModal = () => {
    if (!showImportModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowImportModal(false)}>
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6" /> Importar desde CSV
            </h3>
            <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            El archivo debe tener encabezados: <strong>nombre, precio, concentración (opcional), presentación (opcional), stock (opcional)</strong>.
          </p>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleImportCSV}
              disabled={!csvFile || importing}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {importing ? 'Importando...' : 'Importar'}
            </button>
            <button
              onClick={() => setShowImportModal(false)}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Puedes descargar una plantilla de ejemplo.</p>
        </div>
      </div>
    );
  };

  // TABLA DE PRODUCTOS
  const renderTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">Sin productos</h3>
          <p className="text-slate-500 text-sm">Agrega tu primer producto o importa desde un archivo CSV.</p>
          <div className="flex gap-3 mt-4 justify-center flex-wrap">
            <button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2">
              <Plus className="w-5 h-5" /> Agregar producto
            </button>
            <button onClick={() => setShowImportModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2">
              <Upload className="w-5 h-5" /> Importar CSV
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Producto</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3 hidden sm:table-cell">Presentación</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Precio (USD)</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3 hidden md:table-cell">Stock</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Estado</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-bold text-slate-900">{product.custom_name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-slate-600">{product.presentation || '-'}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">${product.price_usd?.toFixed(2)}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-700">{product.stock_quantity || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {product.is_available ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 p-1">
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

  // RENDER PRINCIPAL
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" /> Inventario
          </h2>
          <p className="text-sm text-slate-500">Gestiona los productos de tu farmacia.</p>
        </div>
        <div className="text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          Total: {products.length} productos
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por medicamento, concentración o presentación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Agregar
          </button>
          <button onClick={() => setShowImportModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" /> Importar CSV
          </button>
        </div>
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
      {renderImportModal()}
    </div>
  );
};

export default PharmacyInventory;