import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      {/* Champ de Saisie Identifiant / Utilisateur */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Identifiant / Nom d'utilisateur
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            <User size={18} />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="Entrez votre identifiant"
            required
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-slate-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
          />
        </div>
      </div>

      {/* Champ Mot de passe / PIN */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Mot de passe / PIN
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-slate-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 hover:text-slate-700 transition-colors cursor-pointer"
            title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Case à cocher */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37] cursor-pointer accent-[#d4af37]"
        />
        <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer select-none">
          Rester connecté sur cette session locale
        </label>
      </div>

      {/* Bouton de connexion */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 py-3 px-4 bg-[#d4af37] hover:bg-[#c29f2e] active:bg-[#b08f25] disabled:opacity-70 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
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