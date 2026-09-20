import React, { useState, useEffect } from 'react';
import { 
  Warehouse, 
  Search, 
  Filter, 
  AlertTriangle, 
  Sliders, 
  Clock, 
  Plus, 
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import StockAdjustmentModal from '../../components/admin/StockAdjustmentModal';
import api from '../../services/api';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const AdminInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [adjustingMed, setAdjustingMed] = useState(null);
  const [activeTab, setActiveTab] = useState('INVENTORY'); // INVENTORY or HISTORY

  useEffect(() => {
    fetchInventory();
  }, [statusFilter, search]);

  useEffect(() => {
    if (activeTab === 'HISTORY') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await api.get(`/admin/inventory?${params.toString()}`);
      if (res.data.success) {
        setInventory(res.data.data.inventory || []);
        setSummary(res.data.data.summary);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/admin/inventory/history');
      if (res.data.success) {
        setHistory(res.data.data.history || []);
      }
    } catch (err) {
      console.error('Error fetching inventory history:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Inventory & Stock Valuation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor dispensary stock, replenishment thresholds, and audit inventory transactions
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'INVENTORY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dispensary Stock
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'HISTORY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit History
          </button>
        </div>
      </div>

      {/* Summary KPI Strips */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-slate-500 uppercase tracking-wider block font-semibold">Total Stock Valuation</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(summary.totalInventoryValue)}</div>
            <span className="text-[11px] text-slate-400">At acquisition cost</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-slate-500 uppercase tracking-wider block font-semibold">Tracked Products</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{summary.totalItems} Medicines</div>
            <span className="text-[11px] text-teal-600 font-semibold">Active in dispensary</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-amber-700 uppercase tracking-wider block font-semibold">Low Stock Warnings</span>
            <div className="text-xl font-bold text-amber-600 mt-1">{summary.lowStockCount} Products</div>
            <span className="text-[11px] text-amber-600 font-medium">Below safety threshold</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-rose-700 uppercase tracking-wider block font-semibold">Out of Stock</span>
            <div className="text-xl font-bold text-rose-600 mt-1">{summary.outOfStockCount} Products</div>
            <span className="text-[11px] text-rose-600 font-medium">Immediate restock required</span>
          </div>
        </div>
      )}

      {activeTab === 'INVENTORY' ? (
        <>
          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicine or brand..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-500">Stock Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Items</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock Alert</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Medicine</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3 text-right">Cost Price</th>
                    <th className="py-3 px-3 text-right">Selling Price</th>
                    <th className="py-3 px-3 text-right">Current Stock</th>
                    <th className="py-3 px-3 text-right">Valuation</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10 text-slate-400">Loading stock records...</td>
                    </tr>
                  ) : inventory.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10 text-slate-400">No stock records found.</td>
                    </tr>
                  ) : (
                    inventory.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500">{item.brand}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{item.category}</td>
                        <td className="py-3 px-3 text-right text-slate-600 font-mono">
                          {formatCurrency(item.costPrice)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          {formatCurrency(item.sellingPrice)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="font-bold text-slate-900">{item.currentStock}</div>
                          <div className="text-[10px] text-slate-400">Alert at &le; {item.lowStockThreshold}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-teal-700">
                          {formatCurrency(item.stockValue)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'IN_STOCK'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.status === 'LOW_STOCK'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setAdjustingMed(item)}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold transition"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Inventory History Tab */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Dispensary Stock Transaction Ledger (Recent 50 Events)
            </h3>
            <p className="text-[11px] text-slate-500">Every stock modification, customer fulfillment, and restock event</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-3">Medicine</th>
                  <th className="py-3 px-3">Transaction Type</th>
                  <th className="py-3 px-3 text-right">Change</th>
                  <th className="py-3 px-3 text-right">Balance</th>
                  <th className="py-3 px-4">Reason / Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      No stock history recorded yet.
                    </td>
                  </tr>
                ) : (
                  history.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 text-slate-500">{formatDateTime(tx.createdAt)}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{tx.medicine?.name || 'Medicine'}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] font-semibold text-slate-700">
                          {tx.changeType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`font-bold ${tx.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {tx.newStock}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {tx.reason || 'Manual Adjustment'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingMed && (
        <StockAdjustmentModal
          medicine={adjustingMed}
          onClose={() => setAdjustingMed(null)}
          onAdjusted={() => {
            fetchInventory();
            if (activeTab === 'HISTORY') fetchHistory();
          }}
        />
      )}
    </div>
  );
};

export default AdminInventoryPage;
