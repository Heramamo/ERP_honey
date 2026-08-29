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

const getPeriodeActuelle = () => {
  const label = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

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
    <header className="h-16 bg-[var(--shell-bg)] border-b border-[var(--line)] px-4 md:px-6 flex items-center justify-between font-sans shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Afficher/Masquer le menu"
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] transition cursor-pointer shrink-0"
        >
          <Menu size={18} />
        </button>
        <span className="text-[var(--t3)] select-none">›</span>
        <span className="font-semibold truncate" style={{ color: 'var(--t1)' }}>
          {pageTitle}
        </span>
      </div>

      {/* Current period */}
      <div
        title="Période courante"
        className="hidden sm:block text-[13px] font-medium px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-hover)]"
        style={{ color: 'var(--t2)' }}
      >
        {getPeriodeActuelle()}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleToggleTheme}
          aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <ConfirmButton
          title="Déconnexion"
          description="Voulez-vous vraiment vous déconnecter de votre session ?"
          confirmLabel="Se déconnecter"
          tone="danger"
          buttonClassName="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] transition cursor-pointer"
          onConfirm={handleLogout}
        >
          <LogOut size={16} />
        </ConfirmButton>
      </div>
    </header>
  );
};
