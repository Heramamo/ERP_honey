import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, HelpCircle, Calendar, ChevronDown } from 'lucide-react';

interface HeaderProps {
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ userName = 'Henitsoa ANDRIAMIHAJA' }) => {
  const location = useLocation();

  // Détection dynamique du titre selon le chemin d'accès
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard/rh-paie':
        return 'RH & Paie';
      case '/dashboard/finance':
        return 'Finance';
      case '/dashboard/settings':
        return 'Paramètres';
      case '/dashboard':
      default:
        return 'Tableau de bord';
    }
  };

  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-[#0b0e17] border-b border-slate-800/60 px-6 flex items-center justify-between font-sans shrink-0">
      {/* Fil d'Ariane Dynamique */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-slate-400">Honey ERP</span>
        <span className="text-slate-600">›</span>
        <span className="text-white font-bold">{getPageTitle()}</span>
      </div>

      {/* Raccourcis et Profil */}
      <div className="flex items-center gap-3">
        {/* Selecteur de Periode */}
        <button className="flex items-center gap-2 bg-[#12161f] border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition">
          <span>Août 2026</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {/* Notifications & Actions */}
        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-2 hover:bg-slate-800/60 rounded-lg hover:text-slate-200 transition relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>
          <button className="p-2 hover:bg-slate-800/60 rounded-lg hover:text-slate-200 transition">
            <HelpCircle size={16} />
          </button>
          <button className="p-2 hover:bg-slate-800/60 rounded-lg hover:text-slate-200 transition">
            <Calendar size={16} />
          </button>
        </div>

        {/* Avatar Profil */}
        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 ml-2">
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Header;