import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, PieChart, Wallet, Clock } from 'lucide-react';
import { AuthHeader } from '../components/ui/AuthHeader';
import { LoginForm } from '../components/auth/LoginForm';
import type { LoginFormValues } from '../components/auth/LoginForm';

import { api } from '../service/api';
import { getApiErrorMessage } from '../service/error';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

const HIGHLIGHTS = [
  { icon: PieChart, label: 'Pilotage financier', desc: 'Trésorerie, charges et pôles en un coup d’œil' },
  { icon: Wallet, label: 'Paie & RH', desc: 'Fiches de paie et statuts des enseignants' },
  { icon: Clock, label: 'Suivi des heures', desc: 'Déclaration et validation des feuilles de temps' },
];

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
    <div className="min-h-screen w-full bg-[var(--app-bg)] text-[var(--t1)] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      <div className="relative w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* CÔTÉ GAUCHE : Branding */}
          <div className="flex flex-col">
            {/* Marque */}
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <Hexagon size={44} className="text-[var(--accent)]" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-slate-950 font-black text-lg">
                  H
                </span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-[var(--t1)] tracking-tight">Honey Group</p>
                <p className="text-[11px] text-[var(--t3)] font-medium">ERP interne</p>
              </div>
            </div>

            {/* Accroche */}
            <div className="mt-12">
              <p className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-widest mb-3">
                Bienvenue sur Honey ERP
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Vos opérations, regroupées dans un seul espace de travail.
              </h1>
              <p className="text-[var(--t3)] text-base md:text-lg leading-relaxed mt-4 max-w-md">
                Accédez à la finance, aux pôles et à la paie depuis un environnement unique et sécurisé.
              </p>
            </div>

            {/* Points clés */}
            {/* <ul className="mt-10 space-y-5">
              {HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="w-8 h-8 shrink-0 rounded-lg border border-[var(--line-strong)] bg-[var(--panel)] flex items-center justify-center text-[var(--accent)]">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[13px] font-semibold text-[var(--t1)]">{label}</p>
                    <p className="text-xs text-[var(--t3)] mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul> */}
          </div>

          {/* CÔTÉ DROIT : Formulaire */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-8 shadow-[var(--shadow-modal)]">

              <AuthHeader
                tag="Honey Group • ERP interne"
                title="Authentification"
                subtitle="Accès sécurisé au réseau d'entreprise"
              />

              <LoginForm onSubmit={handleLogin} error={error} />

              <div className="mt-5 flex flex-col items-center gap-3 text-center">
                <a
                  href="#"
                  onClick={handleHelpClick}
                  className="text-xs text-[var(--t3)] hover:text-[var(--t1)] transition-colors"
                >
                  Problème de connexion ?
                </a>

                <div className="h-[1px] bg-[var(--line)] w-full my-1" />

                <p className="text-xs text-[var(--t3)]">
                  Vous n'avez pas encore de compte ?{' '}
                  <Link to="/register" className="text-[var(--accent)] font-bold hover:underline">
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
