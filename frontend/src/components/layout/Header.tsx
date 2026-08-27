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

const getPeriodeCourt = () => {
  const label = new Date()
    .toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
    .replace('.', '');
  return label.toUpperCase();
};

/**
 * Frise du mois — alvéoles de ruche.
 * Chaque jour du mois est une cellule d'alvéole : les jours révolus sont
 * remplis de miel, le jour courant porte une tête de miel, l'avenir reste vide.
 */
const MonthComb: React.FC = () => {
  const now = new Date();
  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const periode = getPeriodeActuelle();

  const cells = [];
  for (let d = 1; d <= daysInMonth; d++) {
    if (d < today) {
      cells.push(
        <span
          key={d}
          className="comb-cell"
          style={{ background: 'var(--honey)', opacity: 0.85 }}
        />
      );
    } else if (d === today) {
      cells.push(
        <span
          key={d}
          className="comb-cell relative"
          style={{ background: 'var(--honey-soft)' }}
        >
          <span
            className="absolute"
            style={{
              inset: '2.5px',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'var(--honey)',
            }}
          />
        </span>
      );
    } else {
      cells.push(
        <span key={d} className="comb-cell" style={{ background: 'var(--ledger-rule)' }} />
      );
    }
  }

  return (
    <div
      title={`${periode} — jour ${today} sur ${daysInMonth}`}
      className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-hover)]"
    >
      <span className="font-mono text-[9px] font-semibold text-[var(--t3)] tracking-[0.2em]">
        {getPeriodeCourt()}
      </span>
      <span className="flex items-center gap-[3px]">{cells}</span>
      <span className="font-mono text-[9px] font-semibold text-[var(--t2)] tabular">
        {today}/{daysInMonth}
      </span>
    </div>
  );
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
    <header className="h-16 bg-[var(--shell-bg)] border-b border-[var(--border-subtle)] px-4 md:px-6 flex items-center justify-between gap-4 font-sans shrink-0">
      {/* Toggle Sidebar + Fil d'Ariane Dynamique */}
      <div className="flex items-center gap-3 text-xs font-semibold min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Afficher/Masquer le menu"
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition cursor-pointer shrink-0"
        >
          <Menu size={18} />
        </button>
        <span className="text-[var(--honey)]">›</span>
        <span
          className="font-display font-bold text-[15px] tracking-tight truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {pageTitle}
        </span>
      </div>

      {/* Frise du mois */}
      <MonthComb />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleToggleTheme}
          aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <ConfirmButton
          title="Déconnexion"
          description="Voulez-vous vraiment vous déconnecter de votre session ?"
          confirmLabel="Se déconnecter"
          tone="danger"
          buttonClassName="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-faint)] transition cursor-pointer"
          onConfirm={handleLogout}
        >
          <LogOut size={16} />
        </ConfirmButton>
      </div>
    </header>
  );
};