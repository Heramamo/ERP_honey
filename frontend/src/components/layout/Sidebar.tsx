import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PieChart,
  Settings,
  Clock,
  FileText,
  Wallet,
  LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { formatDisplayName, getInitials } from '../../utils/user';
import type { Role } from '../../types/auth';

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  end?: boolean;
}

const MANAGEMENT_ROLES: Role[] = ['ADMIN', 'RH', 'FINANCE'];

const adminNavItems: NavItem[] = [
  { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard', end: true },
  { label: 'RH & Paie', icon: Users, path: '/dashboard/rh-paie' },
  { label: 'Finance', icon: PieChart, path: '/dashboard/finance' },
];

const teacherNavItems: NavItem[] = [
  { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard', end: true },
  { label: 'Mes Heures', icon: Clock, path: '/dashboard/mes-heures' },
  { label: 'Feuilles de temps', icon: FileText, path: '/dashboard/feuilles-de-temps' },
  { label: 'Ma Paie', icon: Wallet, path: '/dashboard/paie' },
];

const getNavItems = (role?: Role): NavItem[] =>
  role && MANAGEMENT_ROLES.includes(role) ? adminNavItems : teacherNavItems;

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const navItems = getNavItems(user?.role);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#0b0e17] text-slate-300 flex flex-col justify-between h-screen sticky top-0 font-sans select-none shrink-0 border-r border-slate-800/60">
      <div>
        {/* Logo HONEY GROUP */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/40">
          <div className="w-9 h-9 rounded-lg bg-[#f59e0b] flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
            H
          </div>
          <div>
            <h1 className="font-black text-white text-sm tracking-wide leading-none uppercase">HONEY GROUP</h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-1">ERP INTERNE</span>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="px-3 space-y-1.5 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#f59e0b] text-slate-950 shadow-lg shadow-[#f59e0b]/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151c2e]'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bas de Sidebar */}
      <div className="p-3 space-y-3 border-t border-slate-800/40">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
              isActive
                ? 'text-white bg-[#151c2e]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#151c2e]'
            }`
          }
        >
          <Settings size={18} />
          <span>Paramètres</span>
        </NavLink>

        <div className="pt-2 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
            {getInitials(user?.email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{formatDisplayName(user?.email)}</p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">
              {user?.role ?? 'Utilisateur'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Déconnexion"
            className="p-1.5 text-slate-500 hover:text-white hover:bg-[#151c2e] rounded-lg transition cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
