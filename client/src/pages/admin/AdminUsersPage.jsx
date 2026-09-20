import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShoppingBag, 
  UserX, 
  UserCheck,
  Mail,
  Phone
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus, name) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} account for "${name}"?`)) return;

    try {
      const res = await api.put(`/admin/users/${id}/toggle-status`);
      if (res.data.success) {
        fetchUsers();
      } else {
        alert(res.data.message || 'Status toggle failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Registered Customers Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer lifetime value, order frequency, and account security controls
          </p>
        </div>

        <div className="relative w-full sm:w-72 self-start sm:self-auto text-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name, email, phone..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3 text-center">Registered Date</th>
                <th className="py-3 px-3 text-center">Orders</th>
                <th className="py-3 px-3 text-right">Lifetime Spend</th>
                <th className="py-3 px-3 text-center">Account Status</th>
                <th className="py-3 px-4 text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">Loading customer profiles...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">No customers found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {u._id.slice(-6)}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-700">{u.email}</div>
                      <div className="text-[11px] text-slate-500">{u.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {u.ordersCount}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-teal-700">
                      {formatCurrency(u.totalSpent)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u._id, u.isActive, u.name)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          u.isActive
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Reactivate'}
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
  );
};

export default AdminUsersPage;
