import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  error?: string | null;
}

const inputBase =
  'w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25 transition-all';

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ username, password, rememberMe });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Champ Identifiant */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[var(--t2)]">
          Identifiant / Nom d'utilisateur
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--t3)]">
            <User size={18} />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre identifiant"
            required
            className={inputBase}
          />
        </div>
      </div>

      {/* Champ Mot de passe */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[var(--t2)]">
          Mot de passe / PIN
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--t3)]">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
            className={`${inputBase} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--t3)] hover:text-[var(--t1)] transition-colors"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Case à cocher */}
      <div className="flex items-center pt-1">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--line-strong)] bg-[var(--panel-deep)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0 cursor-pointer accent-[var(--accent)]"
        />
        <label htmlFor="rememberMe" className="ml-2.5 text-xs text-[var(--t2)] cursor-pointer select-none">
          Rester connecté sur cette session locale
        </label>
      </div>

      {/* Message d'erreur renvoyé par le back */}
      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-sm">
          {error}
        </div>
      )}

      {/* Bouton de connexion */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-slate-950 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Connexion en cours...</span>
          </>
        ) : (
          <>
            <LogIn size={16} />
            <span>Se connecter</span>
          </>
        )}
      </button>
    </form>
  );
};
