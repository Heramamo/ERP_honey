import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export interface RegisterFormValues {
  fullName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void> | void;
}

const ROLES = [
  { id: 'admin', label: 'Admin' },
  { id: 'rh', label: 'Ressources Humaines' },
  { id: 'enseignant', label: 'Enseignant' },
];

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        fullName,
        email,
        role: selectedRole,
        password,
        confirmPassword,
      });
    } catch (err) {
      setError('Une erreur est survenue lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Ligne 1: Nom & Prénom + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Nom & Prénom
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="ex: Henitsoa ANDRIAMIHAJA"
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Email Professionnel
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: contact@honeygroup.mg"
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
          />
        </div>
      </div>

      {/* Ligne 2: Choix du Rôle */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Choix du Rôle
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role.id)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                selectedRole === role.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ligne 3: Mot de Passe + Confirmation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Mot de Passe
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Confirmation du Mot de Passe
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
          />
        </div>
      </div>

      {/* Bouton de création */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-3.5 px-4 bg-[#d4af37] hover:bg-[#c29f2e] active:bg-[#b08f25] disabled:opacity-70 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Création du compte en cours...</span>
          </>
        ) : (
          <span>S'inscrire & Créer le Compte</span>
        )}
      </button>
    </form>
  );
};