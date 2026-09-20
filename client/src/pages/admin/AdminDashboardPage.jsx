import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Warehouse, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminDashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [ovRes, trendRes, topRes, catRes, rxRes, invRes] = await Promise.all([
          api.get('/admin/analytics/overview'),
          api.get('/admin/analytics/sales?days=14'),
          api.get('/admin/analytics/top-products?limit=5'),
          api.get('/admin/analytics/categories'),
          api.get('/admin/prescriptions?status=PENDING'),
          api.get('/admin/inventory?status=LOW_STOCK'),
        ]);

        if (ovRes.data.success) setOverview(ovRes.data.data);
        if (trendRes.data.success) setTrendData(trendRes.data.data.trend || []);
        if (topRes.data.success) setTopProducts(topRes.data.data.topProducts || []);
        if (catRes.data.success) setCategoryData(catRes.data.data.categories || []);
        if (rxRes.data.success) setPendingPrescriptions(rxRes.data.data.prescriptions || []);
        if (invRes.data.success) setLowStockItems(invRes.data.data.inventory || []);
      } catch (err) {
        console.error('Failed to load dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const COLORS = ['#0d9488', '#0284c7', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#f43f5e', '#64748b'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-28 border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pharmacy Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time financial performance, inventory alerts, and order workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/analytics"
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4" /> Full P&L Analytics
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(overview?.todaySales || 0)}
          subtitle="Orders placed today"
          icon={DollarSign}
          color="teal"
          badge={`Gross Profit: ${formatCurrency(overview?.todayGrossProfit || 0)}`}
        />

        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(overview?.monthlySales || 0)}
          subtitle="This calendar month"
          icon={TrendingUp}
          color="blue"
          badge={`Net: ${formatCurrency(overview?.monthlyNetProfit || 0)}`}
        />

        <StatCard
          title="Total Orders"
          value={overview?.totalOrders || 0}
          subtitle={`${overview?.pendingOrders || 0} currently active`}
          icon={ShoppingBag}
          color="purple"
          badge={`${overview?.pendingPrescriptionsCount || 0} Rx Reviews`}
        />

        <StatCard
          title="Registered Customers"
          value={overview?.totalCustomers || 0}
          subtitle={`AOV: ${formatCurrency(overview?.averageOrderValue || 0)}`}
          icon={Users}
          color="emerald"
        />

        <StatCard
          title="Gross Profit (Lifetime)"
          value={formatCurrency(overview?.totalGrossProfit || 0)}
          subtitle={`Revenue: ${formatCurrency(overview?.totalRevenue || 0)} - Cost: ${formatCurrency(overview?.totalProductCost || 0)}`}
          icon={TrendingUp}
          color="emerald"
          badge={`${Math.round(((overview?.totalGrossProfit || 0) / (overview?.totalRevenue || 1)) * 100)}% Margin`}
        />

        <StatCard
          title="Net Profit (After Expenses)"
          value={formatCurrency(overview?.netProfit || 0)}
          subtitle={`Total Expenses: ${formatCurrency(overview?.totalExpenses || 0)}`}
          icon={DollarSign}
          color={(overview?.netProfit || 0) >= 0 ? 'teal' : 'rose'}
          badge={(overview?.netProfit || 0) >= 0 ? 'Profitable' : 'Loss'}
        />

        <StatCard
          title="Low Stock Medicines"
          value={overview?.lowStockCount || 0}
          subtitle="Items below threshold"
          icon={AlertTriangle}
          color="amber"
          badge="Restock Required"
        />

        <StatCard
          title="Pending Rx Prescriptions"
          value={overview?.pendingPrescriptionsCount || 0}
          subtitle="Awaiting pharmacist review"
          icon={FileText}
          color="rose"
          badge="Action Needed"
        />
      </div>

      {/* Main Charts: Daily Revenue & Gross Profit vs Net Profit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Profit Trends */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daily Sales, Gross Profit & Net Profit (Last 14 Days)
              </h3>
              <p className="text-[11px] text-slate-500">
                Revenue vs Cost and Net Profit after recorded business expenses
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="grossProfit" name="Gross Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#6366f1" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue Distribution */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Category Sales Distribution
            </h3>
            <p className="text-[11px] text-slate-500">
              Sales contribution by product department
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-700 truncate max-w-[130px]">{cat.category}</span>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(cat.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Queues: Pending Prescriptions & Urgent Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Prescriptions Queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Pending Doctor Prescriptions</span>
              </h3>
              <p className="text-[11px] text-slate-500">Customer orders waiting for pharmacist authorization</p>
            </div>
            <Link to="/admin/prescriptions" className="text-xs font-bold text-teal-600 hover:underline">
              View Queue ({pendingPrescriptions.length})
            </Link>
          </div>

          {pendingPrescriptions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No pending prescription reviews in the dispensary queue.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingPrescriptions.slice(0, 4).map((rx) => (
                <div key={rx._id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{rx.user?.name || 'Customer'}</div>
                    <div className="text-[11px] text-slate-500">
                      Order #{rx.order?.orderNumber || 'Pending'} • {formatDate(rx.createdAt)}
                    </div>
                  </div>
                  <Link
                    to="/admin/prescriptions"
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Review Document
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Low Stock Inventory Alerts</span>
              </h3>
              <p className="text-[11px] text-slate-500">Medicines requiring manufacturer restock purchase orders</p>
            </div>
            <Link to="/admin/inventory" className="text-xs font-bold text-teal-600 hover:underline">
              Manage Inventory ({lowStockItems.length})
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              All inventory levels are currently above reorder safety thresholds.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockItems.slice(0, 4).map((item) => (
                <div key={item._id} className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-500">{item.brand} • {item.category}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-700">
                      Stock: {item.currentStock} / {item.lowStockThreshold}
                    </span>
                    <div className="text-[10px] text-slate-400">Reorder Now</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
