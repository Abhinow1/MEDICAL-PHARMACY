import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Pill, 
  FileText, 
  ShoppingBag, 
  User 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  const isCurrent = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
    },
    {
      label: 'Medicines',
      path: '/medicines',
      icon: Pill,
    },
    {
      label: 'Prescription',
      path: '/prescriptions',
      icon: FileText,
    },
    {
      label: 'Cart',
      path: '/cart',
      icon: ShoppingBag,
      badge: itemCount,
    },
    {
      label: isAuthenticated ? 'Account' : 'Login',
      path: isAuthenticated ? '/profile' : '/login',
      icon: User,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] pt-1 px-2"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isCurrent(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[50px] relative transition-transform active:scale-90 ${
                active ? 'text-[#0c3c2f]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    active ? 'stroke-[2.5] text-[#0c3c2f]' : 'stroke-[1.8]'
                  }`} 
                />

                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#0c3c2f] text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span 
                className={`text-[10px] mt-1 tracking-tight font-medium ${
                  active ? 'font-black text-[#0c3c2f]' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>

              {active && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#8ee055]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
