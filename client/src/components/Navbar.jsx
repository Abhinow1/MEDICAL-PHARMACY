import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  MessageCircle, 
  LogOut, 
  Package, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createWhatsAppUrl } from '../utils/formatters';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setMobileMenuOpen(false);
    }
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top emergency & trust bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online Pharmacy & Home Delivery • Certified Pharmacists</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>Customer Helpline: <strong className="text-white">+91 98765 43210</strong></span>
            {isAdmin && (
              <Link to="/admin/dashboard" className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-xl font-black text-[#0c3c2f] tracking-tight uppercase flex items-center">
              MEDICARE<span className="text-[#8ee055] text-2xl font-black ml-0.5 leading-none">.</span>
            </span>
          </Link>

          {/* Quick Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search medicines, generic names, brands..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c3c2f] focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link to="/" className={`hover:text-[#0c3c2f] transition ${isCurrent('/') ? 'text-[#0c3c2f] font-bold' : ''}`}>
              Home
            </Link>
            <Link to="/medicines" className={`hover:text-[#0c3c2f] transition ${isCurrent('/medicines') ? 'text-[#0c3c2f] font-bold' : ''}`}>
              Medicines
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className={`hover:text-[#0c3c2f] transition ${isCurrent('/orders') ? 'text-[#0c3c2f] font-bold' : ''}`}>
                  Orders
                </Link>
                <Link to="/prescriptions" className={`hover:text-[#0c3c2f] transition ${isCurrent('/prescriptions') ? 'text-[#0c3c2f] font-bold' : ''}`}>
                  Prescriptions
                </Link>
              </>
            )}
            <Link to="/contact" className={`hover:text-[#0c3c2f] transition ${isCurrent('/contact') ? 'text-[#0c3c2f] font-bold' : ''}`}>
              Contact
            </Link>
          </nav>

          {/* Actions: Cart, User Auth */}
          <div className="flex items-center gap-3">
            {/* Cart Icon with badge */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-slate-700 hover:bg-slate-100 hover:text-[#0c3c2f] transition"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0c3c2f] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                >
                  <User className="w-3.5 h-3.5 text-[#0c3c2f]" />
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-full hover:bg-rose-50"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-1.5 text-slate-700 hover:text-[#0c3c2f] transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-4 py-2 rounded-full bg-[#0c3c2f] text-white hover:bg-[#144d3d] shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search medicines..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <nav className="flex flex-col space-y-2 pt-2 text-sm font-medium text-slate-700">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              Home
            </Link>
            <Link
              to="/medicines"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              Medicines Catalog
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                >
                  <Package className="w-4 h-4 text-teal-600" /> My Orders
                </Link>
                <Link
                  to="/prescriptions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-teal-600" /> Prescriptions
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-teal-600" /> My Account
                </Link>
              </>
            )}
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Contact & Store Hours
            </Link>
            <a
              href={createWhatsAppUrl('Hello Pharmacist, I need help finding a medicine.')}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-2 font-semibold"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
