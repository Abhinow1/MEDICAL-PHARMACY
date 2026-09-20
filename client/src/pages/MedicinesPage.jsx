import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  FileText, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  Pill,
  Sparkles
} from 'lucide-react';
import MedicineCard from '../components/MedicineCard';
import IndianMedicineSearchModal from '../components/IndianMedicineSearchModal';
import api from '../services/api';

const MedicinesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [rxRequired, setRxRequired] = useState('');
  const [sort, setSort] = useState('popularity');
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [indianModalOpen, setIndianModalOpen] = useState(false);

  // Fetch Categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/medicines/categories');
        if (res.data.success) {
          setCategories(res.data.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Update state if URL search query changes
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    const urlCat = searchParams.get('category');
    if (urlQuery !== null && urlQuery !== search) setSearch(urlQuery);
    if (urlCat !== null && urlCat !== category) setCategory(urlCat);
  }, [searchParams]);

  // Load medicines based on filters with debouncing on search
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      fetchMedicines();
    }, 250);

    return () => clearTimeout(delayTimer);
  }, [search, category, minPrice, maxPrice, inStockOnly, rxRequired, sort, page]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category && category !== 'all') params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (inStockOnly) params.set('inStock', 'true');
      if (rxRequired !== '') params.set('prescriptionRequired', rxRequired);
      if (sort) params.set('sort', sort);
      params.set('page', page.toString());
      params.set('limit', '12');

      const res = await api.get(`/medicines?${params.toString()}`);
      if (res.data.success) {
        setMedicines(res.data.data.medicines || []);
        setPagination(res.data.data.pagination || { total: 0, totalPages: 1, page: 1 });
      }
    } catch (err) {
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setRxRequired('');
    setSort('popularity');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="py-4 sm:py-6 space-y-6 max-w-7xl mx-auto pb-28 md:pb-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Medicines & Healthcare Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {pagination.total} certified pharmaceutical items
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIndianModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#0c3c2f] hover:bg-teal-700 hover:text-white transition text-xs font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap group"
              title="Search official Indian medicine directory, active ingredients, and generic substitutes"
            >
              <Pill className="w-3.5 h-3.5 text-teal-600 group-hover:text-white transition" />
              <span>Indian Drug Index & Salts</span>
            </button>

            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, generic, brand..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-semibold"
              >
                <Filter className="w-4 h-4 text-teal-600" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" /> Filters
            </span>
            <button
              onClick={handleClearFilters}
              className="text-[11px] text-teal-600 hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">Category</label>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => { setCategory('all'); setPage(1); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  category === 'all'
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => { setCategory(cat.slug); setPage(1); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    category === cat.slug
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Prescription Required Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Prescription Requirement
            </label>
            <div className="space-y-1.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rxFilter"
                  checked={rxRequired === ''}
                  onChange={() => { setRxRequired(''); setPage(1); }}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span>All Products</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rxFilter"
                  checked={rxRequired === 'false'}
                  onChange={() => { setRxRequired('false'); setPage(1); }}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span>Over-the-Counter (OTC)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rxFilter"
                  checked={rxRequired === 'true'}
                  onChange={() => { setRxRequired('true'); setPage(1); }}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-rose-600 font-semibold">Prescription (Rx) Required</span>
              </label>
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">Price Range (₹)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
              />
              <span className="text-slate-400 text-xs">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sorting & Filter status strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap text-slate-500">
              <span>Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="popularity">Popularity / Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {(category !== 'all' || search || rxRequired !== '' || inStockOnly) && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" /> Clear active filters
              </button>
            )}
          </div>

          {/* Medicines Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 h-72 animate-pulse" />
              ))}
            </div>
          ) : medicines.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No matching medicines found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your current filters or search term. Try clearing filters or searching for generic names.
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {medicines.map((medicine) => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-slate-500 font-medium">
                Page <strong className="text-slate-900">{page}</strong> of {pagination.totalPages}
              </span>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 flex items-center gap-1 font-semibold"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto p-5 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-teal-600" /> Filter Medicines
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Category</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setCategory('all'); setPage(1); }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                      category === 'all'
                        ? 'bg-teal-50 text-teal-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => { setCategory(cat.slug); setPage(1); }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                        category === cat.slug
                          ? 'bg-teal-50 text-teal-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prescription Required Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Prescription Requirement
                </label>
                <div className="space-y-2 text-xs text-slate-700">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mobileRxFilter"
                      checked={rxRequired === ''}
                      onChange={() => { setRxRequired(''); setPage(1); }}
                      className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span>All Products</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mobileRxFilter"
                      checked={rxRequired === 'false'}
                      onChange={() => { setRxRequired('false'); setPage(1); }}
                      className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span>Over-the-Counter (OTC)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mobileRxFilter"
                      checked={rxRequired === 'true'}
                      onChange={() => { setRxRequired('true'); setPage(1); }}
                      className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="text-rose-600 font-semibold">Rx Required</span>
                  </label>
                </div>
              </div>

              {/* In Stock Only */}
              <div>
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Price Range (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
                  />
                  <span className="text-slate-400 text-xs">—</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
              >
                Apply Filters ({pagination.total} items)
              </button>
              <button
                onClick={() => { handleClearFilters(); setMobileFilterOpen(false); }}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition active:scale-95"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indian Drug Directory Search Modal */}
      <IndianMedicineSearchModal
        isOpen={indianModalOpen}
        onClose={() => setIndianModalOpen(false)}
      />
    </div>
  );
};

export default MedicinesPage;
