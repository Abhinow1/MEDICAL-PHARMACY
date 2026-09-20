import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  Calendar, 
  FileSpreadsheet, 
  Layers, 
  ShoppingBag,
  Receipt,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminAnalyticsPage = () => {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expense creation modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'RENT',
    amount: '',
    notes: '',
  });

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [ovRes, trendRes, topRes, expRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get(`/admin/analytics/sales?days=${days}`),
        api.get('/admin/analytics/top-products?limit=8'),
        api.get('/admin/expenses'),
      ]);

      if (ovRes.data.success) setOverview(ovRes.data.data);
      if (trendRes.data.success) setTrend(trendRes.data.data.trend || []);
      if (topRes.data.success) setTopProducts(topRes.data.data.topProducts || []);
      if (expRes.data.success) setExpenses(expRes.data.data.expenses || []);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/expenses', newExpense);
      if (res.data.success) {
        setShowExpenseModal(false);
        setNewExpense({ title: '', category: 'RENT', amount: '', notes: '' });
        loadAnalytics();
      } else {
        alert(res.data.message || 'Failed to record expense');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this operational expense?')) return;
    try {
      const res = await api.delete(`/admin/expenses/${id}`);
      if (res.data.success) {
        loadAnalytics();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting expense');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pharmacy Profit & Loss (P&L) Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict distinction between Sales Revenue, Cost of Goods Sold (COGS), Gross Profit, and Net Profit
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Record Expense
          </button>
        </div>
      </div>

      {/* Financial Statement Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-slate-500 uppercase tracking-wider font-semibold">1. Total Sales Revenue</span>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(overview?.totalRevenue || 0)}
          </div>
          <p className="text-[11px] text-slate-400">Sum of (Selling Price &times; Qty)</p>
        </div>

        {/* Total Product Cost (COGS) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-slate-500 uppercase tracking-wider font-semibold">2. Product Cost (COGS)</span>
          <div className="text-2xl font-bold text-slate-700">
            {formatCurrency(overview?.totalProductCost || 0)}
          </div>
          <p className="text-[11px] text-slate-400">Sum of (Acquisition Cost &times; Qty)</p>
        </div>

        {/* Gross Profit */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-emerald-800 uppercase tracking-wider font-bold">3. Gross Profit (Revenue - Cost)</span>
          <div className="text-2xl font-bold text-emerald-700">
            {formatCurrency(overview?.totalGrossProfit || 0)}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">
            {Math.round(((overview?.totalGrossProfit || 0) / (overview?.totalRevenue || 1)) * 100)}% Gross Margin
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-teal-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-teal-300 uppercase tracking-wider font-bold">4. Net Profit (After Expenses)</span>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(overview?.netProfit || 0)}
          </div>
          <p className="text-[11px] text-teal-200">
            Less {formatCurrency(overview?.totalExpenses || 0)} total operational expenses
          </p>
        </div>
      </div>

      {/* Chart: Revenue vs Product Cost vs Operating Expenses */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Daily Financial Waterfall: Revenue, Cost, Expenses & Net Profit
          </h3>
          <p className="text-xs text-slate-500">
            Detailed daily performance tracking showing actual profitability
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" name="Product Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Operating Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two columns: Top Selling Medicines & Operational Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShoppingBag className="w-4 h-4 text-teal-600" />
            <span>Top Performing Medicines by Profit Contribution</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Medicine</th>
                  <th className="py-2.5 px-2 text-center">Qty Sold</th>
                  <th className="py-2.5 px-2 text-right">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Gross Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 truncate max-w-[150px]">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-700">
                      {p.totalQuantity}
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-slate-800">
                      {formatCurrency(p.totalRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                      {formatCurrency(p.grossProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Expenses Ledger */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-rose-600" />
              <span>Operational Business Expenses</span>
            </h3>
            <span className="text-xs font-bold text-slate-700">
              Total: {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}
            </span>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto pr-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Expense Title</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">
                      No operational expenses recorded.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{exp.title}</div>
                        <div className="text-[10px] text-slate-400">{formatDate(exp.date)}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-900">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Record Operational Business Expense
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  placeholder="e.g. Monthly Dispensary Rent"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expense Category *</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="RENT">Rent</option>
                    <option value="ELECTRICITY">Electricity & Power</option>
                    <option value="DELIVERY">Delivery & Couriers</option>
                    <option value="STAFF">Staff Salaries</option>
                    <option value="PACKAGING">Packaging Materials</option>
                    <option value="OTHER">Other Operational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="e.g. Paid via NEFT for cold storage power"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
