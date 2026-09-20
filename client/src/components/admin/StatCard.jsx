import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'teal', badge }) => {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const iconBgMap = {
    teal: 'bg-teal-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    blue: 'bg-blue-600 text-white',
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-600 text-white',
    purple: 'bg-purple-600 text-white',
    slate: 'bg-slate-800 text-white',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${iconBgMap[color] || iconBgMap.teal}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">{subtitle}</span>
        {badge && (
          <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border ${colorMap[color]}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
