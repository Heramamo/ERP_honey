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
    <div className="min-h-screen w-full bg-[var(--app-bg)] text-[var(--t1)] flex flex-col p-6 md:p-10 relative overflow-hidden font-sans">
      {/* Contexte — halo de miel */}
      <div className="absolute top-1/4 left-1/3 -translate-y-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-[var(--honey)]/6 rounded-full blur-3xl pointer-events-none" />

      {/* Marque mobile */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="hex-chip w-10 h-10 text-xl">
          <span className="font-display font-black leading-none">H</span>
        </div>
        <div>
          <p className="font-display font-bold text-lg leading-none tracking-tight uppercase">HONEY GROUP</p>
          <p className="font-mono text-[9px] font-semibold text-[var(--t3)] tracking-[0.2em] uppercase mt-1">ERP INTERNE</p>
        </div>
      </div>

      {/* Conteneur principal */}
      <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

          {/* CÔTÉ GAUCHE : Branding — la page du registre */}
          <div className="hidden lg:flex flex-col justify-between min-h-[520px] rounded-3xl border border-[var(--border-subtle)] bg-[var(--panel-deep)] comb-paper p-10 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="hex-chip w-11 h-11 text-xl shadow-[0_10px_30px_-12px_var(--honey)]">
                <span className="font-display font-black leading-none">H</span>
              </div>
              <div>
                <p className="font-display font-bold text-xl leading-none tracking-tight uppercase">HONEY GROUP</p>
                <p className="font-mono text-[9px] font-semibold text-[var(--t3)] tracking-[0.2em] uppercase mt-1.5">ERP INTERNE</p>
              </div>
            </div>

            <div className="space-y-6 py-10">
              <h1 className="font-display font-semibold text-[2.4rem] leading-[1.08] tracking-tight text-[var(--t1)]">
                Bienvenue dans votre espace ERP
              </h1>
              <p className="text-[var(--t3)] text-[15px] leading-relaxed font-medium max-w-md">
                Accédez à vos outils de gestion intégrés avec un niveau de sécurité optimal pour votre environnement de travail.
              </p>
            </div>

            <div className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--t3)]">
              Feuilles de temps · Mois courant
              <span className="block mt-3 flex items-center gap-[3px]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className="comb-cell"
                    style={{ background: i < 5 ? 'var(--honey)' : 'var(--ledger-rule)' }}
                  />
                ))}
              </span>
            </div>
          </div>

          {/* CÔTÉ DROIT : Formulaire */}
          <div className="w-full max-w-md mx-auto">
            <div className="folio rounded-2xl border border-[var(--border-subtle)] bg-[var(--panel)] p-8 shadow-2xl">

              <AuthHeader
                tag="HONEY GROUP • ERP INTERNE"
                title="Authentification Session Desktop"
                subtitle="Accès sécurisé au réseau d'entreprise"
              />

              <LoginForm onSubmit={handleLogin} error={error} />

              <div className="mt-5 flex flex-col items-center gap-3 text-center">
                <a
                  href="#"
                  onClick={handleHelpClick}
                  className="text-xs text-[var(--t3)] hover:text-[var(--t2)] transition-colors"
                >
                  Problème de connexion ?
                </a>

                <div className="h-px bg-[var(--border-subtle)] w-full my-1" />

                <p className="text-xs text-[var(--t3)]">
                  Vous n'avez pas encore de compte ?{' '}
                  <Link to="/register" className="text-[var(--honey)] font-bold hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}