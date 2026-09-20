import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  ExternalLink, 
  Plus, 
  Check, 
  Loader2, 
  MessageCircle, 
  ShieldAlert, 
  Sparkles,
  Building2,
  Pill
} from 'lucide-react';
import api from '../services/api';
import { createWhatsAppUrl } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const QUICK_SEARCH_CHIPS = [
  'Dolo 650',
  'Augmentin',
  'Pan-D',
  'Telma 40',
  'Glycomet',
  'Montair-LC',
  'Paracetamol',
  'Azithral',
  'Shelcal'
];

const IndianMedicineSearchModal = ({ isOpen, onClose, isAdminMode = false, onImportSuccess }) => {
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState(null);
  const [importedMap, setImportedMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      handleSearch(query);
    }
  }, [isOpen]);

  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true);
      const res = await api.get('/external-medicines/search', {
        params: { query: searchTerm, limit: 30 },
      });
      if (res.data.success) {
        setMedicines(res.data.data.medicines || []);
      }
    } catch (err) {
      console.error('Failed to search Indian drug directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);
  };

  const handleChipClick = (chip) => {
    setQuery(chip);
    handleSearch(chip);
  };

  const handleImport = async (drug) => {
    try {
      setImportingId(drug.brandName);
      const res = await api.post('/external-medicines/import', {
        brandName: drug.brandName,
        initialStock: 100,
      });

      if (res.data.success) {
        setImportedMap((prev) => ({ ...prev, [drug.brandName]: true }));
        if (onImportSuccess) {
          onImportSuccess(res.data.data.medicine);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error importing medicine into catalog');
    } finally {
      setImportingId(null);
    }
  };

  const handleSearchStore = (brand) => {
    onClose();
    navigate(`/medicines?search=${encodeURIComponent(brand.split(' ')[0])}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92dvh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-teal-900 to-[#0c3c2f] text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur text-[#8ee055]">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Indian Medicine Directory & Drug Index
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#8ee055] text-slate-900">
                    CDSCO / DCGI
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  Search top-selling Indian pharmaceuticals, salts, manufacturers & generic substitutes
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="mt-5 relative">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search by brand name (e.g. Dolo 650), active molecule (Paracetamol), or manufacturer (Cipla)..."
              className="w-full bg-white text-slate-900 text-sm rounded-2xl pl-11 pr-4 py-3 border border-transparent shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8ee055] placeholder:text-slate-400 font-medium"
              autoFocus
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Quick Filter Chips */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] text-slate-300 font-semibold flex-shrink-0 mr-1">Popular:</span>
            {QUICK_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  query.toLowerCase() === chip.toLowerCase()
                    ? 'bg-[#8ee055] text-slate-900 font-bold'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Querying Indian drug catalog...</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No matching medicines found in directory</p>
              <p className="text-xs text-slate-400">Try searching with active molecule name or common Indian brand</p>
            </div>
          ) : (
            medicines.map((med, idx) => {
              const isImported = importedMap[med.brandName];
              const isImporting = importingId === med.brandName;

              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-teal-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        med.schedule === 'OTC'
                          ? 'bg-emerald-100 text-emerald-800'
                          : med.schedule === 'Schedule H1'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {med.schedule || 'Schedule H'}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm">{med.brandName}</h3>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {med.manufacturer}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Composition:</span> {med.genericComposition}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      <span><strong>Pack:</strong> {med.packSize}</span>
                      <span><strong>Form:</strong> {med.dosageForm}</span>
                      <span><strong>Class:</strong> {med.therapeuticClass}</span>
                      {med.prescriptionRequired && (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Rx Required
                        </span>
                      )}
                    </div>

                    {med.substitutes && med.substitutes.length > 0 && (
                      <div className="text-[11px] text-teal-800 pt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-teal-900">Generic Brands:</span>
                        {med.substitutes.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            onClick={() => handleChipClick(sub)}
                            className="bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2 py-0.5 rounded-md cursor-pointer text-teal-800 transition"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 flex-shrink-0 gap-2">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">MRP (INR)</span>
                      <span className="text-base font-black text-slate-900">₹{med.mrp.toFixed(2)}</span>
                    </div>

                    {isAdminMode ? (
                      <button
                        onClick={() => handleImport(med)}
                        disabled={isImported || isImporting}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                          isImported
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Importing...
                          </>
                        ) : isImported ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added to Store
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Import to Catalog
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSearchStore(med.brandName)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white border border-teal-200 transition flex items-center gap-1"
                        >
                          <Search className="w-3.5 h-3.5" /> Store Stock
                        </button>
                        <a
                          href={createWhatsAppUrl(`Hello Pharmacist, I am inquiring about "${med.brandName}" (${med.manufacturer}, MRP ₹${med.mrp}). Do you have it available?`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition"
                          title="Ask Pharmacist on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Database covers accredited Indian pharma manufacturers (Sun Pharma, Cipla, GSK, Dr. Reddy's, Micro Labs, Mankind, etc.)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
          >
            Close Index
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndianMedicineSearchModal;
