import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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
  'w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-md px-3 py-2 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-all';

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
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[var(--t2)]">
          Identifiant
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Adresse email"
          required
          className={inputBase}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[var(--t2)]">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className={`${inputBase} pr-9`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--t3)] hover:text-[var(--t1)] transition-colors"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div className="flex items-center pt-0.5">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-[var(--line-strong)] bg-[var(--panel-deep)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0 cursor-pointer accent-[var(--accent)]"
        />
        <label htmlFor="rememberMe" className="ml-2 text-xs text-[var(--t2)] cursor-pointer select-none">
          Rester connecté
        </label>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-1 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>Connexion...</span>
          </>
        ) : (
          <span>Se connecter</span>
        )}
      </button>
    </form>
  );
};
