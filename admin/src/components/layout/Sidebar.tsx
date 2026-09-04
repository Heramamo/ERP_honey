import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  onCloseMobile,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/users', icon: Users, label: 'Utilisateurs' },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          h-full flex flex-col
          bg-[var(--panel)] border-r border-[var(--line)]
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-[68px]' : 'w-[240px]'}
        `}
      >
        <div className="h-16 flex items-center px-4 border-b border-[var(--line)]">
          {!collapsed && (
            <span className="text-lg font-semibold text-[var(--t1)]">
              Admin
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scroll-thin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${isActive
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'text-[var(--t2)] hover:bg-[var(--surface-hover)] hover:text-[var(--t1)]'
                }
                ${collapsed ? 'justify-center' : ''}`
              }
            >
              <link.icon size={20} />
              {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-[var(--line)]">
          {!collapsed && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-[var(--t3)] truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
              text-[var(--t2)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]
              transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
