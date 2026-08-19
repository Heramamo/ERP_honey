import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, Calendar as CalendarIcon, ChevronDown, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { getInitials } from '../../utils/user';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/rh-paie': 'RH & Paie',
  '/dashboard/finance': 'Finance',
  '/dashboard/mes-heures': 'Mes Heures',
  '/dashboard/feuilles-de-temps': 'Feuilles de temps',
  '/dashboard/paie': 'Ma Paie',
  '/dashboard/settings': 'Paramètres',
};

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Tableau de bord';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#0f172a]/60 border-b border-slate-800/60 px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className="text-slate-400">Honey ERP</span>
        <span className="text-slate-600">›</span>
        <span className="text-slate-100 font-semibold">{pageTitle}</span>
      </div>

      {/* Contrôles & Profil */}
      <div className="flex items-center gap-4">
        {/* Sélecteur de Période */}
        <div className="hidden md:flex items-center gap-2 bg-[#182234] border border-slate-700/60 text-slate-200 text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:border-slate-500 transition">
          <span>Août 2026</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Actions rapides */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg relative transition cursor-pointer">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition cursor-pointer">
            <HelpCircle size={16} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition cursor-pointer">
            <CalendarIcon size={16} />
          </button>
          <button
            onClick={handleLogout}
            title="Déconnexion"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Avatar */}
        <div
          title={user?.email ?? 'Utilisateur'}
          className="w-8 h-8 rounded-full bg-[#e0aa25] text-slate-950 font-bold text-xs flex items-center justify-center cursor-pointer shadow-md"
        >
          {getInitials(user?.email)}
        </div>
      </div>
    </header>
  );
};
