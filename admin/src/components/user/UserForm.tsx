import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { CreateUserRequest } from '../../service/user.service';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  loading: boolean;
  error?: string | null;
  success?: string | null;
  initialData?: Partial<CreateUserRequest>;
}

const EMPTY_INITIAL_DATA: Partial<CreateUserRequest> = {};

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  error,
  success,
  initialData = EMPTY_INITIAL_DATA,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserRequest>({
    defaultValues: {
      email: '',
      mot_de_passe: '',
      nom: '',
      prenom: '',
      role: 'RH',
      ...initialData,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        email: '',
        mot_de_passe: '',
        nom: '',
        prenom: '',
        role: 'RH',
        ...initialData,
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: CreateUserRequest) => {
    await onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[var(--panel)] rounded-xl border border-[var(--line)] shadow-[var(--shadow-modal)] animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-[var(--line)]">
          <h2 className="text-lg font-semibold text-[var(--t1)]">Créer un compte</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--t3)] hover:bg-[var(--surface-hover)] hover:text-[var(--t1)] transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
                Prénom
              </label>
              <input
                {...register('prenom', { required: 'Prénom requis' })}
                type="text"
                required
                className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                  text-[var(--t1)] placeholder-[var(--t3)]
                  focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                  transition-colors text-sm"
                placeholder="Jean"
                disabled={loading}
              />
              {errors.prenom && (
                <p className="mt-1 text-xs text-[var(--danger)]">{errors.prenom.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
                Nom
              </label>
              <input
                {...register('nom', { required: 'Nom requis' })}
                type="text"
                required
                className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                  text-[var(--t1)] placeholder-[var(--t3)]
                  focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                  transition-colors text-sm"
                placeholder="Dupont"
                disabled={loading}
              />
              {errors.nom && (
                <p className="mt-1 text-xs text-[var(--danger)]">{errors.nom.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide',
                },
              })}
              type="email"
              required
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                text-[var(--t1)] placeholder-[var(--t3)]
                focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                transition-colors text-sm"
              placeholder="jean.dupont@exemple.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[var(--danger)]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
              Mot de passe
            </label>
            <input
              {...register('mot_de_passe', {
                required: 'Mot de passe requis',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 caractères',
                },
              })}
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                text-[var(--t1)] placeholder-[var(--t3)]
                focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                transition-colors text-sm"
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.mot_de_passe && (
              <p className="mt-1 text-xs text-[var(--danger)]">{errors.mot_de_passe.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
              Rôle
            </label>
            <select
              {...register('role', { required: 'Rôle requis' })}
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                text-[var(--t1)]
                focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                transition-colors text-sm"
              disabled={loading}
            >
              <option value="ADMIN">Administrateur</option>
              <option value="RH">Ressources Humaines</option>
              <option value="FINANCE">Finance</option>
              <option value="ENSEIGNANT">Enseignant</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-[var(--danger)]">{errors.role.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] animate-shake">
              <p className="text-sm text-[var(--danger)]">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-[var(--success-bg)] border border-[var(--success-line)]">
              <p className="text-sm text-[var(--success)]">{success}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                bg-[var(--chip)] hover:bg-[var(--chip-hover)] text-[var(--t2)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              {loading ? 'Création...' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};