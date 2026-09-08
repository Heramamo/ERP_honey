import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthHeader } from '../components/ui/AuthHeader';
import { LoginForm } from '../components/auth/LoginForm';
import type { LoginFormValues } from '../components/auth/LoginForm';

import { api } from '../service/api';
import { getApiErrorMessage } from '../service/error';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

export default function LoginPage(): React.ReactElement {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const handleLogin = async (data: LoginFormValues) => {
    setError(null)
    try {
      const res = await api.post(`/user/login`, {email: data.username, mot_de_passe:data.password})
      const token = res.data.access_token
      dispatch(setCredentials({token}))
      navigate('/dashboard')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Échec de la connexion'));
    }
  };

  const handleHelpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert("Veuillez contacter l'administrateur système du réseau d'entreprise.");
  };

  return (
    <div className="min-h-screen w-full bg-[var(--app-bg)] text-[var(--t1)] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="relative w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Branding */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-[var(--accent)] flex items-center justify-center shrink-0">
                <span className="text-[#1a1408] font-bold text-sm">H</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-[var(--t1)]">Honey Group</p>
                <p className="text-[10px] text-[var(--t3)]">ERP interne</p>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-widest mb-2.5">
                Bienvenue sur Honey ERP
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug">
                Vos opérations, regroupées dans un seul espace de travail.
              </h1>
              <p className="text-[var(--t3)] text-sm leading-relaxed mt-3 max-w-md">
                Accédez à la finance, aux pôles et à la paie depuis un environnement sécurisé.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full max-w-sm mx-auto">
            <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg p-6">

              <AuthHeader
                tag="Honey Group"
                title="Connexion"
                subtitle="Accès réservé au réseau d'entreprise"
              />

              <LoginForm onSubmit={handleLogin} error={error} />

              <div className="mt-4 flex flex-col items-center gap-2.5 text-center">
                <a
                  href="#"
                  onClick={handleHelpClick}
                  className="text-xs text-[var(--t3)] hover:text-[var(--t1)] transition-colors"
                >
                  Problème de connexion ?
                </a>

                <div className="h-px bg-[var(--line)] w-full" />

                {/* <p className="text-xs text-[var(--t3)]">
                  Pas encore de compte ?{' '}
                  <Link to="/register" className="text-[var(--accent)] font-semibold hover:underline">
                    Créer un compte
                  </Link>
                </p> */}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
