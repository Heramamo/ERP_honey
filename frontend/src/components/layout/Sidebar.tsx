import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Settings,
  Clock,
  FileText,
  Wallet,
  LogOut,
  ChevronsLeft,
  Boxes,
  PieChart,
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
    `group flex items-center px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
      collapsed ? 'lg:justify-center lg:px-0' : ''
    } ${
      isActive
        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
        : 'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)]'
    }`;

  return (
    <>
      {/* Backdrop mobile */}
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`bg-[var(--shell-bg)] text-[var(--t2)] flex flex-col justify-between border-r border-[var(--line)] font-sans select-none shrink-0 overflow-hidden transition-all duration-200
          fixed inset-y-0 left-0 z-50 w-60 lg:static lg:h-full lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'lg:w-[60px]' : 'lg:w-60'}
        `}
      >
        <div className="flex-1 min-h-0 overflow-y-auto scroll-thin">
          {/* Brand */}
          <div
            className={`px-4 py-4 flex items-center border-b border-[var(--line)] ${
              collapsed ? 'lg:justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 shrink-0 rounded-md bg-[var(--accent)] flex items-center justify-center">
              <span className="text-[#1a1408] font-bold text-sm">H</span>
            </div>
            <div
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ease-out ${
                collapsed
                  ? 'lg:max-w-0 lg:opacity-0 lg:-translate-x-2'
                  : 'max-w-[140px] ml-2.5 opacity-100'
              }`}
            >
              <h1 className="font-semibold text-[var(--t1)] text-[13px] leading-none">Honey Group</h1>
              <span className="text-[10px] text-[var(--t3)] block mt-0.5">ERP interne</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`px-2 space-y-0.5 mt-3 ${collapsed ? 'lg:px-1.5' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onCloseMobile}
                title={item.label}
                className={navLinkClass}
              >
                <item.icon size={16} strokeWidth={2} className="shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ease-out ${
                    collapsed
                      ? 'lg:max-w-0 lg:opacity-0 lg:-translate-x-2'
                      : 'max-w-[160px] ml-2.5 opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Collapse toggle (desktop) */}
          <div className="hidden lg:flex px-2 mt-3 justify-center">
            <button
              onClick={onToggleCollapsed}
              title={collapsed ? 'Déplier le menu' : 'Réduire le menu'}
              className={`p-1.5 rounded-md text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer ${
                collapsed ? '' : 'rotate-180'
              }`}
            >
              <ChevronsLeft size={14} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-2 space-y-1 border-t border-[var(--line)]`}>
          <NavLink
            to="/dashboard/settings"
            onClick={onCloseMobile}
            title="Paramètres"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              } ${
                isActive
                  ? 'text-[var(--t1)] bg-[var(--surface-hover)]'
                  : 'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)]'
              }`
            }
          >
            <Settings size={16} strokeWidth={2} className="shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ease-out ${
                collapsed
                  ? 'lg:max-w-0 lg:opacity-0 lg:-translate-x-2'
                  : 'max-w-[140px] ml-2.5 opacity-100'
              }`}
            >
              Paramètres
            </span>
          </NavLink>

          <div
            className={`items-center gap-2.5 px-2 flex ${
              collapsed ? 'lg:flex-col lg:gap-y-2 lg:px-0' : ''
            }`}
          >
            <div className="w-7 h-7 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] font-semibold text-[11px] flex items-center justify-center shrink-0">
              {getInitials(user?.email)}
            </div>
            <div
              className={`min-w-0 overflow-hidden transition-all duration-200 ease-out ${
                collapsed
                  ? 'lg:max-h-0 lg:opacity-0 lg:-translate-y-1'
                  : 'max-h-12 opacity-100 flex-1'
              }`}
            >
              <p className="text-[12px] font-medium text-[var(--t1)] truncate">{formatDisplayName(user?.nom)}</p>
              <p className="text-[10px] text-[var(--t3)] truncate">
                {user?.role ?? 'Utilisateur'}
              </p>
            </div>
            <ConfirmButton
              title="Déconnexion"
              description="Voulez-vous vraiment vous déconnecter de votre session ?"
              confirmLabel="Se déconnecter"
              tone="danger"
              buttonClassName="p-1.5 text-[var(--t3)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-md transition cursor-pointer shrink-0"
              onConfirm={handleLogout}
            >
              <LogOut size={14} />
            </ConfirmButton>
          </div>
        </div>
      </aside>
    </>
  );
};
