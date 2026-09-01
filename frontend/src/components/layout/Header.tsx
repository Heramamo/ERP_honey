import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { ConfirmButton } from '../common/ConfirmButton';
import { getStoredTheme, setTheme } from '../../utils/theme';
import type { Theme } from '../../utils/theme';

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

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Tableau de bord';
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  const handleToggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-12 bg-[var(--shell-bg)] border-b border-[var(--line)] px-4 md:px-5 flex items-center justify-between font-sans shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-2.5 text-sm min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Afficher/Masquer le menu"
          className="p-1.5 rounded-md text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] transition cursor-pointer shrink-0 lg:hidden"
        >
          <Menu size={16} />
        </button>
        <h2 className="font-semibold text-[var(--t1)] text-[13px] truncate">
          {pageTitle}
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleToggleTheme}
          aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          className="p-1.5 rounded-md text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <ConfirmButton
          title="Déconnexion"
          description="Voulez-vous vraiment vous déconnecter de votre session ?"
          confirmLabel="Se déconnecter"
          tone="danger"
          buttonClassName="p-1.5 rounded-md text-[var(--t3)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] transition cursor-pointer"
          onConfirm={handleLogout}
        >
          <LogOut size={15} />
        </ConfirmButton>
      </div>
    </header>
  );
};
