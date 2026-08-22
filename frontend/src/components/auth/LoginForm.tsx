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
        <label className="block text-xs font-mono text-slate-400 tracking-wide">
          Identifiant / Nom d'utilisateur
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <User size={18} />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre identifiant"
            required
            className="w-full bg-[#182234] border border-slate-700/60 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
          />
        </div>
      </div>

      {/* Champ Mot de passe */}
      <div className="space-y-1.5">
        <label className="block text-xs font-mono text-slate-400 tracking-wide">
          Mot de passe / PIN
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
            className="w-full bg-[#182234] border border-slate-700/60 rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
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
          className="h-4 w-4 rounded border-slate-700 bg-[#182234] text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-0 cursor-pointer"
        />
        <label htmlFor="rememberMe" className="ml-2.5 text-xs text-slate-400 cursor-pointer select-none">
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
        className="w-full mt-2 bg-[#d4af37] hover:bg-[#c29f2e] text-slate-950 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-md font-mono text-xs cursor-pointer disabled:opacity-70"
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