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
  Boxes,
  Hexagon,
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
  { label: 'Pôles', icon: Boxes, path: '/dashboard/poles' },
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
      collapsed ? 'lg:justify-center lg:px-0' : ''
    } ${
      isActive
        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
        : 'text-[var(--text-muted)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)]'
    }`;

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
        className={`bg-[var(--shell-bg)] text-[var(--t2)] flex flex-col justify-between border-r border-[var(--line)] font-sans select-none shrink-0 overflow-hidden transition-all duration-300
          fixed inset-y-0 left-0 z-50 w-64 lg:static lg:h-full lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'lg:w-[76px]' : 'lg:w-64'}
        `}
      >
        <div className="flex-1 min-h-0 overflow-y-auto scroll-thin">
          {/* Brand */}
          <div
            className={`p-5 flex items-center border-b border-[var(--line)] ${
              collapsed ? 'lg:justify-center' : ''
            }`}
          >
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
              <Hexagon size={40} className="text-[var(--accent)]" strokeWidth={1.5} />
              <span className="absolute inset-0 flex items-center justify-center text-slate-950 font-black text-base">
                H
              </span>
            </div>
            <div
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
                collapsed
                  ? 'lg:max-w-0 lg:opacity-0 lg:-translate-x-3'
                  : 'max-w-[160px] ml-3 opacity-100'
              }`}
            >
              <h1 className="font-bold text-[var(--t1)] text-[15px] leading-none">Honey Group</h1>
              <span className="text-[11px] font-medium text-[var(--t3)] block mt-1">ERP interne</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onCloseMobile}
                title={item.label}
                className={navLinkClass}
              >
                <item.icon size={18} strokeWidth={2} className="shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
                    collapsed
                      ? 'lg:max-w-0 lg:opacity-0 lg:-translate-x-3'
                      : 'max-w-[180px] ml-3.5 opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Collapse toggle (desktop) */}
          <div className="hidden lg:flex px-3 mt-4 justify-center">
            <button
              onClick={onToggleCollapsed}
              title={collapsed ? 'Déplier le menu' : 'Réduire le menu'}
              className={`p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer ${
                collapsed ? '' : 'rotate-180'
              }`}
            >
              <ChevronsLeft size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 space-y-3 border-t border-[var(--line)]">
          <NavLink
            to="/dashboard/settings"
            onClick={onCloseMobile}
            title="Paramètres"
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              } ${
                isActive
                  ? 'text-[var(--t1)] bg-[var(--surface-hover)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)]'
              }`
            }
          >
            <Settings size={18} strokeWidth={2} className="shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
                collapsed
                  ? 'lg:max-w-0 lg:opacity-0 lg:-translate-x-3'
                  : 'max-w-[160px] ml-3.5 opacity-100'
              }`}
            >
              Paramètres
            </span>
          </NavLink>

          <div
            className={`pt-2 items-center gap-3 px-2 flex ${
              collapsed ? 'lg:flex-col lg:gap-y-2 lg:px-0' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent)] font-bold text-sm flex items-center justify-center shrink-0">
              {getInitials(user?.email)}
            </div>
            <div
              className={`min-w-0 overflow-hidden transition-all duration-300 ease-out ${
                collapsed
                  ? 'lg:max-h-0 lg:opacity-0 lg:-translate-y-1'
                  : 'max-h-12 opacity-100 flex-1'
              }`}
            >
              <p className="text-[13px] font-semibold text-[var(--t1)] truncate">{formatDisplayName(user?.email)}</p>
              <p className="text-[11px] font-medium text-[var(--t3)] truncate">
                {user?.role ?? 'Utilisateur'}
              </p>
            </div>
            <ConfirmButton
              title="Déconnexion"
              description="Voulez-vous vraiment vous déconnecter de votre session ?"
              confirmLabel="Se déconnecter"
              tone="danger"
              buttonClassName="p-2 text-[var(--text-muted)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] rounded-lg transition cursor-pointer shrink-0"
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
