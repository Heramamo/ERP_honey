import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../service/auth.service';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, mot_de_passe: motDePasse });
      const decoded = JSON.parse(atob(response.access_token.split('.')[1]));
      
      if (decoded.role !== 'ADMIN') {
        setError('Accès réservé aux administrateurs');
        return;
      }

      dispatch(setCredentials({ token: response.access_token }));
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] p-8 shadow-[var(--shadow-modal)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center mb-4">
              <LogIn className="text-[var(--accent)]" size={28} />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--t1)]">Administration</h1>
            <p className="text-sm text-[var(--t3)] mt-1">Accès réservé aux administrateurs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--t2)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                  text-[var(--t1)] placeholder-[var(--t3)]
                  focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                  transition-colors"
                placeholder="admin@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--t2)] mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] 
                  text-[var(--t1)] placeholder-[var(--t3)]
                  focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                  transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)]">
                <p className="text-sm text-[var(--danger)]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-medium text-white
                bg-[var(--accent)] hover:bg-[var(--accent-strong)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
