import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ShieldCheck, Users } from 'lucide-react';

export interface RegisterFormValues {
  lastName: string;
  firstName: string;
  email: string;
  role: string;
  password: string;
}

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void> | void;
  error?: string | null;
}

const ROLES = [
  { id: 'ADMIN', label: 'Admin', icon: ShieldCheck },
  { id: 'RH', label: 'Ressources Humaines', icon: Users },
];

const inputBase =
  'w-full px-4 py-2.5 bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25 transition-all';

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, error }) => {
  const [lastName, setLastName] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('ADMIN');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        lastName,
        firstName,
        email,
        role: selectedRole,
        password,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Ligne 1 : Nom + Prénom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">
            Nom
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="ex: ANDRIAMIHAJA"
            required
            className={inputBase}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">
            Prénom
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="ex: Henitsoa"
            required
            className={inputBase}
          />
        </div>
      </div>

      {/* Ligne 2 : Choix du Rôle */}
      <div>
        <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">
          Choix du Rôle
        </label>
        <div
          role="radiogroup"
          aria-label="Choix du rôle"
          className="relative grid grid-cols-2 p-1.5 bg-[var(--panel-deep)] rounded-lg border border-[var(--line)]"
        >
          <span
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-lg bg-[var(--accent)] shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{
              transform: `translateX(${ROLES.findIndex((r) => r.id === selectedRole) * 100}%)`,
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
          {ROLES.map((role) => {
            const isActive = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setSelectedRole(role.id)}
                className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold text-center cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 active:scale-[0.98] motion-reduce:active:scale-100 ${
                  isActive ? 'text-slate-950' : 'text-[var(--t3)] hover:text-[var(--t1)]'
                }`}
              >
                <role.icon
                  size={15}
                  className={`shrink-0 transition-all duration-300 motion-reduce:transition-none ${
                    isActive ? 'text-slate-950 scale-110' : 'text-[var(--t3)]'
                  }`}
                />
                {role.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ligne 3 : Email + Mot de Passe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: contact@honeygroup.mg"
            required
            className={inputBase}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">
            Mot de Passe
          </label>
          <div className="relative flex items-center">
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
              className="absolute right-3 text-[var(--t3)] hover:text-[var(--t1)] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Message d'erreur renvoyé par le back */}
      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-sm">
          {error}
        </div>
      )}

      {/* Bouton de création */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-3.5 px-4 bg-[var(--accent)] hover:bg-[var(--accent-strong)] disabled:opacity-70 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-[var(--shadow-soft)] flex items-center justify-center gap-2 cursor-pointer"
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
