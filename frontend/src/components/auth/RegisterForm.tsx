import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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
  { id: 'ADMIN', label: 'Admin' },
  { id: 'RH', label: 'Ressources Humaines' },
];

const inputBase =
  'w-full px-3 py-2 bg-[var(--panel-deep)] border border-[var(--line)] rounded-md text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-all';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">
            Nom
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="ANDRIAMIHAJA"
            required
            className={inputBase}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">
            Prénom
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Henitsoa"
            required
            className={inputBase}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">
          Rôle
        </label>
        <div
          role="radiogroup"
          aria-label="Choix du rôle"
          className="grid grid-cols-2 p-1 bg-[var(--panel-deep)] rounded-md border border-[var(--line)] gap-1"
        >
          {ROLES.map((role) => {
            const isActive = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setSelectedRole(role.id)}
                className={`py-2 px-3 rounded-md text-xs font-semibold text-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 ${
                  isActive
                    ? 'bg-[var(--accent)] text-[#1a1408]'
                    : 'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {role.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@honeygroup.mg"
            required
            className={inputBase}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">
            Mot de passe
          </label>
          <div className="relative flex items-center">
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
              className="absolute right-3 text-[var(--t3)] hover:text-[var(--t1)] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-2.5 px-4 bg-[var(--accent)] hover:bg-[var(--accent-strong)] disabled:opacity-70 text-[#1a1408] font-semibold rounded-md text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>Création...</span>
          </>
        ) : (
          <span>Créer le compte</span>
        )}
      </button>
    </form>
  );
};
