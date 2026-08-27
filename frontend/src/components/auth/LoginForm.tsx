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
        <label className="col-heat block">Identifiant / Nom d'utilisateur</label>
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
            className="field pl-10 text-sm"
          />
        </div>
      </div>

      {/* Champ Mot de passe */}
      <div className="space-y-1.5">
        <label className="col-heat block">Mot de passe / PIN</label>
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
            className="field pl-10 pr-10 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--t3)] hover:text-[var(--t2)] transition-colors cursor-pointer"
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
          className="h-4 w-4 rounded border-[var(--border-subtle)] bg-[var(--panel-deep)] text-[var(--honey)] focus:ring-[var(--honey)] focus:ring-offset-0 cursor-pointer accent-[var(--honey)]"
        />
        <label htmlFor="rememberMe" className="ml-2.5 text-xs text-[var(--t3)] cursor-pointer select-none">
          Rester connecté sur cette session locale
        </label>
      </div>

      {/* Message d'erreur renvoyé par le back */}
      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Bouton de connexion */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-honey w-full mt-2 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Connexion en cours...</span>
          </>
        ) : (
          <>
            <LogIn size={16} />
            <span>[ Se Connecter à l'ERP ]</span>
          </>
        )}
      </button>
    </form>
  );
};