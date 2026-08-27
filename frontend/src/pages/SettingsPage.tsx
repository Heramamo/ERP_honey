import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import RoleGuard from '../components/RoleGuard';
import type { Role } from '../types/auth';
import { userService } from '../service/user.service';
import { getApiErrorMessage } from '../service/error';

interface SettingsPageProps {
  allowedRoles?: Role[];
}

const PasswordField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}> = ({ label, value, onChange, placeholder, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-[var(--panel-deep)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2.5 pr-10 text-sm text-[var(--t2)] placeholder-[var(--t3)]/60 focus:outline-none focus:border-[var(--honey)]/50 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--t3)] hover:text-[var(--t2)] transition-colors cursor-pointer"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC<SettingsPageProps> = ({ allowedRoles }) => {
  const [motDePasseActuel, setMotDePasseActuel] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (nouveauMotDePasse !== confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);
    try {
      await userService.changePassword({
        mot_de_passe_actuel: motDePasseActuel,
        nouveau_mot_de_passe: nouveauMotDePasse,
      });
      setSuccess(true);
      setMotDePasseActuel('');
      setNouveauMotDePasse('');
      setConfirmation('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors du changement de mot de passe'));
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="p-8 max-w-[720px] mx-auto w-full font-sans text-[var(--t1)]">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--t1)]">Paramètres</h1>
      <p className="text-sm text-[var(--t3)] mt-1">Gérez les paramètres de votre compte</p>

      <div className="mt-6 bg-[var(--panel)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--panel-deep)]">
          <KeyRound className="w-4 h-4 text-[var(--honey)]" />
          <h2 className="text-sm font-bold text-[var(--t1)] uppercase tracking-wider">Changer le mot de passe</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <PasswordField
            label="Mot de passe actuel"
            value={motDePasseActuel}
            onChange={setMotDePasseActuel}
            placeholder="Entrez votre mot de passe actuel"
            autoComplete="current-password"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordField
              label="Nouveau mot de passe"
              value={nouveauMotDePasse}
              onChange={setNouveauMotDePasse}
              placeholder="Minimum 6 caractères"
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirmer le mot de passe"
              value={confirmation}
              onChange={setConfirmation}
              placeholder="Ressaisissez le nouveau mot de passe"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/40 text-[var(--danger)] text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--positive)]/10 border border-[var(--positive)]/25 text-[var(--positive)] text-xs">
              <CheckCircle2 className="w-4 h-4" />
              Mot de passe modifié avec succès.
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || !motDePasseActuel || !nouveauMotDePasse || !confirmation}
              className="btn-honey font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Modification...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default SettingsPage;
