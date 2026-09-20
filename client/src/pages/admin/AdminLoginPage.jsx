import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin authentication failed. Access restricted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-900 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pharmacy Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Authorized pharmacy staff and administrators only
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@medicare.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition"
          >
            {loading ? 'Authenticating Admin Session...' : 'Authenticate & Enter Dashboard'}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="p-3.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-300 space-y-1">
          <div className="font-bold text-teal-400">Pre-configured Admin Credentials:</div>
          <div>Email: <code className="text-white font-mono font-semibold">admin@medicare.com</code></div>
          <div>Password: <code className="text-white font-mono font-semibold">Admin@12345</code></div>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
