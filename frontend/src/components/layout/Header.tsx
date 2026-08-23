import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, Calendar as CalendarIcon, ChevronDown, LogOut, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { getInitials } from '../../utils/user';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/feuilles-de-saisie': 'Feuilles de Saisie',
  '/dashboard/gestion-paie': 'Gestion de Paie',
  '/dashboard/enseignants': 'Enseignants',
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
    <header className="h-16 bg-[#0b0e17] border-b border-slate-800/60 px-6 flex items-center justify-between font-sans shrink-0">
      {/* Fil d'Ariane Dynamique */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-slate-400">Honey ERP</span>
        <span className="text-slate-600">›</span>
        <span className="text-slate-100 font-semibold">{pageTitle}</span>
      </div>

      {/* Contrôles & Profil */}
      <div className="flex items-center gap-4">
        {/* Sélecteur de Période */}
        <div className="hidden md:flex items-center gap-2 bg-[#182234] border border-slate-700/60 text-slate-200 text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:border-slate-500 transition">
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
