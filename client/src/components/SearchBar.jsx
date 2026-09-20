import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Search medicines, generic names, brands (e.g. Paracetamol)...' }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Debounce query for autocomplete suggestions
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/medicines?search=${encodeURIComponent(query.trim())}&limit=5`);
        if (res.data.success) {
          setSuggestions(res.data.data.medicines || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Search suggestion error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close autocomplete
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/medicines?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectSuggestion = (medicine) => {
    setShowDropdown(false);
    navigate(`/medicines/${medicine._id}`);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-teal-600 focus:outline-none rounded-xl pl-12 pr-12 py-3.5 text-sm sm:text-base text-slate-900 shadow-sm transition"
        />
        <Search className="w-5 h-5 text-teal-600 absolute left-4 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              if (onSearch) onSearch('');
            }}
            className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Auto-suggest dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
          <div className="px-3.5 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
            Suggested Medicines
          </div>
          {suggestions.map((med) => (
            <button
              key={med._id}
              onClick={() => handleSelectSuggestion(med)}
              className="w-full text-left px-4 py-2.5 hover:bg-teal-50/50 flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={med.image}
                  alt={med.name}
                  className="w-8 h-8 object-contain rounded bg-slate-100 p-1"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-teal-700">
                    {med.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {med.genericName} • <span className="font-medium">{med.brand}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">₹{med.price}</div>
                {med.prescriptionRequired && (
                  <span className="text-[10px] text-rose-600 font-bold">Rx</span>
                )}
              </div>
            </button>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full text-center py-2 text-xs font-medium text-teal-600 hover:bg-slate-50 transition"
          >
            View all results for "{query}" →
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
