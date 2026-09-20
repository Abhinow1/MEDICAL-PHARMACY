import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Pill, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  FileText, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import IndianMedicineSearchModal from '../../components/IndianMedicineSearchModal';

const AdminMedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [indianModalOpen, setIndianModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedicines();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, page]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/medicines/categories');
      if (res.data.success) {
        setCategories(res.data.data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await api.get(`/admin/medicines?${params.toString()}`);
      if (res.data.success) {
        setMedicines(res.data.data.medicines || []);
        setPagination(res.data.data.pagination || { total: 0, totalPages: 1, page: 1 });
      }
    } catch (err) {
      console.error('Error fetching admin medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate product "${name}"? It will be hidden from customer storefront but preserved for past orders.`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/medicines/${id}`);
      if (res.data.success) {
        fetchMedicines();
      } else {
        alert(res.data.message || 'Deactivation failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deactivating medicine');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Medicine Catalog Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure pharmaceutical products, pricing, cost margins, and prescription mandates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIndianModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>Import from Indian Drug Index</span>
          </button>

          <Link
            to="/admin/medicines/add"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add New Medicine
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, generic, brand..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 flex-shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Departments</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Medicine Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-3 text-right">Cost Price</th>
                <th className="py-3 px-3 text-right">Stock</th>
                <th className="py-3 px-3 text-center">Rx Required</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    Loading medicine catalog...
                  </td>
                </tr>
              ) : medicines.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    No medicines match the specified search or filter.
                  </td>
                </tr>
              ) : (
                medicines.map((med) => (
                  <tr key={med._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={med.image}
                          alt={med.name}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{med.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {med.genericName} • <span className="font-medium text-slate-600">{med.brand}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {med.category?.name || 'General'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(med.price)}
                      {med.discount > 0 && (
                        <div className="text-[10px] text-emerald-600">({med.discount}% off)</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 font-mono">
                      {formatCurrency(med.costPrice)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-bold ${med.stock <= med.lowStockThreshold ? 'text-amber-600' : 'text-slate-800'}`}>
                        {med.stock}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {med.prescriptionRequired ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Yes (Rx)
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">OTC</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        med.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {med.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/medicines/edit/${med._id}`}
                          className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Edit medicine"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {med.isActive && (
                          <button
                            onClick={() => handleDeactivate(med._id, med.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Deactivate medicine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-slate-500 font-medium">
              Page {page} of {pagination.totalPages} ({pagination.total} items)
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

      {/* Indian Medicine Directory Import Modal */}
      <IndianMedicineSearchModal
        isOpen={indianModalOpen}
        onClose={() => setIndianModalOpen(false)}
        isAdminMode={true}
        onImportSuccess={() => fetchMedicines()}
      />
    </div>
  );
};

export default AdminMedicinesPage;
