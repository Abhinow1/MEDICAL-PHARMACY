import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Thermometer, 
  Activity, 
  HeartPulse, 
  Sparkles, 
  Smile, 
  Cross, 
  UserCheck 
} from 'lucide-react';

const categoryThemeMap = {
  'pain-relief': { icon: ShieldAlert, bg: 'bg-[#fef08a]', text: 'text-amber-900' },
  'cold-and-flu': { icon: Thermometer, bg: 'bg-[#f3e8ff]', text: 'text-purple-900' },
  'vitamins': { icon: Activity, bg: 'bg-[#e0f2fe]', text: 'text-sky-900' },
  'diabetes-care': { icon: HeartPulse, bg: 'bg-[#ffe4e6]', text: 'text-rose-900' },
  'skin-care': { icon: Sparkles, bg: 'bg-[#fed7aa]', text: 'text-orange-900' },
  'baby-care': { icon: Smile, bg: 'bg-[#dcfce7]', text: 'text-emerald-900' },
  'first-aid': { icon: Cross, bg: 'bg-[#ccfbf1]', text: 'text-teal-900' },
  'personal-care': { icon: UserCheck, bg: 'bg-[#f1f5f9]', text: 'text-slate-800' },
};

const CategoryList = ({ categories = [], activeSlug = '', onSelectCategory, variant = 'circles' }) => {
  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {categories.map((cat) => {
          const theme = categoryThemeMap[cat.slug] || { icon: Activity, bg: 'bg-teal-50', text: 'text-teal-700' };
          const IconComponent = theme.icon;
          const isActive = activeSlug === cat.slug;

          const content = (
            <div
              className={`py-2 px-1.5 rounded-xl border text-center transition duration-200 flex flex-col items-center justify-center gap-1 h-full ${
                isActive
                  ? 'bg-[#0c3c2f] border-[#0c3c2f] text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                  isActive ? 'bg-white/20 text-white' : `${theme.bg} ${theme.text}`
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-medium leading-tight line-clamp-2">
                {cat.name}
              </span>
            </div>
          );

          if (onSelectCategory) {
            return (
              <button
                key={cat._id || cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className="text-left w-full focus:outline-none"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={cat._id || cat.slug} to={`/medicines?category=${cat.slug}`} className="block">
              {content}
            </Link>
          );
        })}
      </div>
    );
  }

  // Circular pastel bubbles (Reference Design)
  return (
    <div className="flex overflow-x-auto sm:flex-wrap items-center sm:justify-center gap-4 sm:gap-8 max-w-5xl mx-auto py-2 -mx-3 px-3 sm:mx-auto sm:px-0 no-scrollbar snap-x snap-mandatory">
      {categories.map((cat) => {
        const theme = categoryThemeMap[cat.slug] || { icon: Activity, bg: 'bg-[#fef08a]', text: 'text-amber-900' };
        const IconComponent = theme.icon;
        const isActive = activeSlug === cat.slug;

        const content = (
          <div className="group flex flex-col items-center gap-2.5 text-center cursor-pointer">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xs ${theme.bg} ${theme.text} ${
                isActive ? 'ring-3 ring-[#0c3c2f] ring-offset-2' : 'hover:shadow-md'
              }`}
            >
              <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0c3c2f] max-w-[90px] leading-tight transition">
              {cat.name}
            </span>
          </div>
        );

        if (onSelectCategory) {
          return (
            <button
              key={cat._id || cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className="focus:outline-none"
            >
              {content}
            </button>
          );
        }

        return (
          <Link key={cat._id || cat.slug} to={`/medicines?category=${cat.slug}`}>
            {content}
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryList;
