import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Pill, 
  Warehouse, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut, 
  PlusCircle,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/medicines', icon: Pill, label: 'Medicines' },
    { to: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
    { to: '/admin/prescriptions', icon: FileText, label: 'Prescriptions' },
    { to: '/admin/analytics', icon: TrendingUp, label: 'Analytics & P&L' },
    { to: '/admin/users', icon: Users, label: 'Customers' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Admin Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              MediCare <span className="text-[10px] bg-teal-900 text-teal-300 font-semibold px-1.5 py-0.5 rounded">Admin</span>
            </h2>
            <p className="text-[11px] text-slate-400">Pharmacy Operations</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Admin User Footer & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-xs">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@medicare.com'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
