import React, { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listQuoteRequests } from '../../graphql/queries';
import { onCreateQuoteRequest } from '../../graphql/subscriptions';
import { updateQuoteRequest } from '../../graphql/mutations';
import { 
  Search, Filter, Eye, Edit, CheckCircle, Clock, AlertCircle, 
  ChevronLeft, ChevronRight, Loader2, X, MapPin, User, Package, 
  Plus, Calendar, MessageSquare, Phone
} from 'lucide-react';

// ✅ Importación del nuevo componente de respuesta
import PharmacyQuoteReply from './PharmacyQuoteReply';

const client = generateClient();

const PharmacyQuotesList = ({ pharmacyState, pharmacyId }) => { // ← Se agrega pharmacyId como prop
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const subscriptionRef = useRef(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchQuotes();
    subscribeToNewQuotes();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [pharmacyState]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const result = await client.graphql({
        query: listQuoteRequests,
        variables: { filter: { state: { eq: pharmacyState } } },
        authMode: 'apiKey'
      });
      const items = result.data.listQuoteRequests.items || [];
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setQuotes(items);
      applyFilters(items);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (items = quotes) => {
    let result = [...items];
    if (statusFilter !== 'ALL') {
      result = result.filter(q => q.status === statusFilter);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(q =>
        q.medicine_name?.toLowerCase().includes(term) ||
        q.patient_name?.toLowerCase().includes(term) ||
        q.zone?.toLowerCase().includes(term) ||
        q.city?.toLowerCase().includes(term)
      );
    }
    const total = result.length;
    const totalPages = Math.ceil(total / itemsPerPage) || 1;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = result.slice(start, end);
    setFilteredQuotes(paginated);
    setTotalPages(totalPages);
  };

  const subscribeToNewQuotes = () => {
    const subscription = client.graphql({
      query: onCreateQuoteRequest,
      variables: { filter: { state: { eq: pharmacyState } } },
      authMode: 'apiKey'
    }).subscribe({
      next: (event) => {
        const newQuote = event.data.onCreateQuoteRequest;
        if (newQuote.state === pharmacyState) {
          setQuotes(prev => [newQuote, ...prev]);
          applyFilters([newQuote, ...quotes]);
        }
      },
      error: (error) => console.error('Subscription error:', error)
    });
    subscriptionRef.current = subscription;
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    const label = newStatus === 'IN_PROGRESS' ? 'En proceso' : 'Cerrada';
    if (!window.confirm(`¿Marcar esta cotización como "${label}"?`)) return;
    setUpdating(true);
    try {
      await client.graphql({
        query: updateQuoteRequest,
        variables: { input: { id: quoteId, status: newStatus } },
        authMode: 'apiKey'
      });
      const updatedQuotes = quotes.map(q => 
        q.id === quoteId ? { ...q, status: newStatus } : q
      );
      setQuotes(updatedQuotes);
      applyFilters(updatedQuotes);
      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote({ ...selectedQuote, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Error al actualizar el estado.');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewDetail = (quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleOpenReply = (quote) => {
    setSelectedQuote(quote);
    setShowReplyModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuote(null);
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setSelectedQuote(null);
  };

  const getStatusBadge = (status) => {
    const config = {
      OPEN: { label: 'Nueva', className: 'bg-blue-100 text-blue-700 border-blue-200' },
      IN_PROGRESS: { label: 'En proceso', className: 'bg-amber-100 text-amber-700 border-amber-200' },
      CLOSED: { label: 'Cerrada', className: 'bg-slate-100 text-slate-700 border-slate-200' }
    };
    const { label, className } = config[status] || config.OPEN;
    return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${className}`}>{label}</span>;
  };

  const parseMedicines = (quote) => {
    try {
      const notes = quote.notes || '';
      if (notes.startsWith('[')) {
        const parsed = JSON.parse(notes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [{ medicine: quote.medicine_name, dosage: quote.dosage_mg, quantity: quote.quantity }];
    } catch {
      return [{ medicine: quote.medicine_name, dosage: quote.dosage_mg, quantity: quote.quantity }];
    }
  };

  // --- MODAL DE DETALLE ---
  const renderDetailModal = () => {
    if (!selectedQuote) return null;
    const q = selectedQuote;
    const medicines = parseMedicines(q);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-black text-slate-900">Detalle de Cotización</h3>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Package className="w-4 h-4" /> Medicamentos
              </p>
              {medicines.map((med, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                  <p className="font-bold text-slate-900">{med.medicine}</p>
                  <p className="text-sm text-slate-600">
                    Dosis: {med.dosage || 'No especificada'} | Cantidad: {med.quantity || 1}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <User className="w-4 h-4" /> Paciente
                </p>
                <p className="text-sm">{q.patient_name || 'Anónimo'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Estado</p>
                {getStatusBadge(q.status)}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Ubicación
              </p>
              <p className="text-sm">{q.state}, {q.city} - {q.zone || 'N/A'}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Fecha
              </p>
              <p className="text-sm">{new Date(q.createdAt).toLocaleString()}</p>
            </div>

            {q.notes && !q.notes.startsWith('[') && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Notas adicionales</p>
                <p className="text-sm bg-slate-50 p-2 rounded border border-slate-200">{q.notes}</p>
              </div>
            )}

            {q.prescription_image_url && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Receta</p>
                <a href={q.prescription_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                  Ver imagen de la receta
                </a>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
              <button 
                onClick={() => handleStatusChange(q.id, 'IN_PROGRESS')}
                disabled={q.status === 'IN_PROGRESS' || updating}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                <Clock className="w-4 h-4 inline mr-1" /> En proceso
              </button>
              <button 
                onClick={() => handleStatusChange(q.id, 'CLOSED')}
                disabled={q.status === 'CLOSED' || updating}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 inline mr-1" /> Cerrar
              </button>
              <button 
                onClick={() => { closeModal(); handleOpenReply(q); }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2 rounded-lg transition"
              >
                <Edit className="w-4 h-4 inline mr-1" /> Responder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- MODAL DE RESPUESTA (AHORA CON PharmacyQuoteReply) ---
  const renderReplyModal = () => {
    if (!selectedQuote || !showReplyModal) return null;
    return (
      <PharmacyQuoteReply
        quote={selectedQuote}
        pharmacyId={pharmacyId} // ← Se pasa el ID de la farmacia
        onClose={closeReplyModal}
        onSuccess={() => {
          fetchQuotes(); // Refrescar la lista después de responder
          closeReplyModal();
        }}
      />
    );
  };

  // --- VISTA EN TARJETAS (MÓVIL) ---
  const renderMobileCards = () => {
    if (filteredQuotes.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">No hay cotizaciones que coincidan con los filtros.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:hidden">
        {filteredQuotes.map((quote) => (
          <div key={quote.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900">{quote.medicine_name}</h4>
                <p className="text-xs text-slate-500">{quote.patient_name || 'Anónimo'}</p>
                <p className="text-xs text-slate-500">{quote.city}, {quote.zone || ''}</p>
              </div>
              {getStatusBadge(quote.status)}
            </div>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => handleViewDetail(quote)}
                className="flex-1 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-bold"
              >
                <Eye className="w-4 h-4 inline mr-1" /> Ver
              </button>
              <button 
                onClick={() => handleOpenReply(quote)}
                className="flex-1 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs font-bold"
              >
                <Edit className="w-4 h-4 inline mr-1" /> Responder
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // --- VISTA EN TABLA (DESKTOP) ---
  const renderDesktopTable = () => {
    if (filteredQuotes.length === 0) return null;

    return (
      <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Medicamento</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3 hidden md:table-cell">Paciente</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3 hidden lg:table-cell">Ubicación</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Estado</th>
                <th className="text-left font-bold text-slate-600 px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-bold text-slate-900">{quote.medicine_name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-700">{quote.patient_name || 'Anónimo'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-600">{quote.city}, {quote.zone || ''}</td>
                  <td className="px-4 py-3">{getStatusBadge(quote.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewDetail(quote)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                      >
                        <Eye className="w-4 h-4" /> Ver
                      </button>
                      <button 
                        onClick={() => handleOpenReply(quote)}
                        className="text-emerald-600 hover:text-emerald-800 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
                      >
                        <Edit className="w-4 h-4" /> Responder
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">📋 Cotizaciones</h2>
          <p className="text-sm text-slate-500">Gestiona las solicitudes de medicamentos de los pacientes.</p>
        </div>
        <div className="text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          Total: {quotes.length} cotizaciones
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por medicamento, paciente o zona..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              applyFilters(quotes);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
              applyFilters(quotes);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="ALL">Todos los estados</option>
            <option value="OPEN">Nuevas</option>
            <option value="IN_PROGRESS">En proceso</option>
            <option value="CLOSED">Cerradas</option>
          </select>
        </div>
      </div>

      {renderDesktopTable()}
      {renderMobileCards()}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            <ChevronLeft className="w-4 h-4 inline" /> Anterior
          </button>
          <span className="text-sm text-slate-600">Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            Siguiente <ChevronRight className="w-4 h-4 inline" />
          </button>
        </div>
      )}

      {renderDetailModal()}
      {renderReplyModal()}
    </div>
  );
};

export default PharmacyQuotesList;