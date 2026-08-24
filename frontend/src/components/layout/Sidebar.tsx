import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  PieChart,
  Settings,
  Clock,
  FileText,
  Wallet,
  LogOut,
  ChevronsLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { ConfirmButton } from '../common/ConfirmButton';
import { formatDisplayName, getInitials } from '../../utils/user';
import type { Role } from '../../types/auth';

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  end?: boolean;
}

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onToggleCollapsed?: () => void;
}

const MANAGEMENT_ROLES: Role[] = ['ADMIN', 'RH', 'FINANCE'];

const adminNavItems: NavItem[] = [
  { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard', end: true },
  { label: 'Enseignants', icon: GraduationCap, path: '/dashboard/enseignants' },
  { label: 'Feuilles de Saisie', icon: FileText, path: '/dashboard/feuilles-de-saisie' },
  { label: 'Gestion de Paie', icon: Wallet, path: '/dashboard/gestion-paie' },
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

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
  onToggleCollapsed,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const navItems = getNavItems(user?.role);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop mobile */}
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`bg-[var(--shell-bg)] text-[var(--t2)] flex flex-col justify-between border-r border-[var(--border-subtle)] font-sans select-none shrink-0 overflow-hidden transition-all duration-300
          fixed inset-y-0 left-0 z-50 w-64 lg:static lg:h-full lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'lg:w-[76px]' : 'lg:w-64'}
        `}
      >
        <div className="flex-1 min-h-0 overflow-y-auto scroll-thin">
          {/* Logo HONEY GROUP */}
          <div
            className={`p-5 flex items-center gap-3 border-b border-[var(--border-subtle)] ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-[#f59e0b] flex items-center justify-center text-slate-950 font-black text-lg shadow-md shrink-0">
              H
            </div>
            <div className={collapsed ? 'lg:hidden' : ''}>
              <h1 className="font-black text-[var(--t1)] text-sm tracking-wide leading-none uppercase">HONEY GROUP</h1>
              <span className="text-[10px] font-semibold text-[var(--t3)] tracking-wider uppercase block mt-1">ERP INTERNE</span>
            </div>
          </div>

          {/* Liens de navigation */}
          <nav className="px-3 space-y-1.5 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onCloseMobile}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                    collapsed ? 'lg:justify-center lg:px-0' : ''
                  } ${
                    isActive
                      ? 'bg-[#f59e0b] text-slate-950 shadow-lg shadow-[#f59e0b]/20'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bouton réduction (desktop uniquement) */}
          <div className="hidden lg:flex px-3 mt-4 justify-center">
            <button
              onClick={onToggleCollapsed}
              title={collapsed ? 'Déplier le menu' : 'Réduire le menu'}
              className={`p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition cursor-pointer ${
                collapsed ? '' : 'rotate-180'
              }`}
            >
              <ChevronsLeft size={16} />
            </button>
          </div>
        </div>

        {/* Bas de Sidebar */}
        <div className="p-3 space-y-3 border-t border-[var(--border-subtle)]">
          <NavLink
            to="/dashboard/settings"
            onClick={onCloseMobile}
            title="Paramètres"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              } ${
                isActive
                  ? 'text-[var(--t1)] bg-[var(--surface-hover)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`
            }
          >
            <Settings size={18} />
            <span className={collapsed ? 'lg:hidden' : ''}>Paramètres</span>
          </NavLink>

          <div
            className={`pt-2 items-center gap-3 px-2 ${
              collapsed ? 'lg:flex-col lg:px-0' : ''
            } flex`}
          >
            <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              {getInitials(user?.email)}
            </div>
            <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="text-xs font-bold text-[var(--t1)] truncate">{formatDisplayName(user?.email)}</p>
              <p className="text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider truncate">
                {user?.role ?? 'Utilisateur'}
              </p>
            </div>
            <ConfirmButton
              title="Déconnexion"
              description="Voulez-vous vraiment vous déconnecter de votre session ?"
              confirmLabel="Se déconnecter"
              tone="danger"
              buttonClassName="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition cursor-pointer shrink-0"
              onConfirm={handleLogout}
            >
              <LogOut size={16} />
            </ConfirmButton>
          </div>
        </div>
      </aside>
    </>
  );
};
