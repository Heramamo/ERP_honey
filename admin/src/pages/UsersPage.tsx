import React, { useState } from 'react';
import { userService, type CreateUserRequest } from '../service/user.service';
import { UserPlus, X } from 'lucide-react';

const UsersPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    mot_de_passe: '',
    nom: '',
    prenom: '',
    role: 'RH',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await userService.create(formData);
      setSuccess(response.message);
      setFormData({ email: '', mot_de_passe: '', nom: '', prenom: '', role: 'RH' });
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--t1)]">Utilisateurs</h1>
          <p className="text-sm text-[var(--t3)] mt-1">Gérer les comptes utilisateurs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
            bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white
            transition-colors"
        >
          <UserPlus size={18} />
          Nouveau compte
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-[var(--panel)] rounded-xl border border-[var(--line)] shadow-[var(--shadow-modal)]">
            <div className="flex items-center justify-between p-5 border-b border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--t1)]">Créer un compte</h2>
              <button
                onClick={() => { setShowModal(false); setError(''); setSuccess(''); }}
                className="p-1.5 rounded-lg text-[var(--t3)] hover:bg-[var(--surface-hover)] hover:text-[var(--t1)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                      text-[var(--t1)] placeholder-[var(--t3)]
                      focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                      transition-colors text-sm"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                      text-[var(--t1)] placeholder-[var(--t3)]
                      focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                      transition-colors text-sm"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                    text-[var(--t1)] placeholder-[var(--t3)]
                    focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                    transition-colors text-sm"
                  placeholder="jean.dupont@exemple.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                    text-[var(--t1)] placeholder-[var(--t3)]
                    focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                    transition-colors text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--t2)] mb-1.5">
                  Rôle
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                    text-[var(--t1)]
                    focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                    transition-colors text-sm"
                >
                  <option value="ADMIN">Administrateur</option>
                  <option value="RH">Ressources Humaines</option>
                  <option value="FINANCE">Finance</option>
                  <option value="ENSEIGNANT">Enseignant</option>
                </select>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)]">
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
                  onClick={() => { setShowModal(false); setError(''); setSuccess(''); }}
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                    bg-[var(--chip)] hover:bg-[var(--chip-hover)] text-[var(--t2)]
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
      )}

      <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] p-6">
        <div className="text-center py-8">
          <UserPlus className="mx-auto text-[var(--t3)] mb-3" size={48} />
          <p className="text-[var(--t2)]">Cliquez sur "Nouveau compte" pour créer un utilisateur</p>
          <p className="text-sm text-[var(--t3)] mt-1">Les rôles disponibles sont : Administrateur, RH, Finance, Enseignant</p>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
