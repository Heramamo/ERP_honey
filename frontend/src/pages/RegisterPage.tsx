import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import type { RegisterFormValues } from '../components/auth/RegisterForm';
import { api } from '../service/api';
import { getApiErrorMessage } from '../service/error';

export default function RegisterPage(): React.ReactElement {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const handleRegister = async (values: RegisterFormValues) => {
    setError(null)
    try {
        await api.post(`/user/register`, {
            nom: values.lastName,
            prenom: values.firstName,
            email: values.email,
            role: values.role,
            mot_de_passe: values.password
        });
        navigate('/login')
    } catch (err) {
        setError(getApiErrorMessage(err, "Erreur lors de l'inscription"));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--app-bg)] text-[var(--t1)] flex flex-col p-6 md:p-10 relative overflow-hidden font-sans">
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

      <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

          {/* CÔTÉ GAUCHE : Branding */}
          <div className="hidden lg:flex flex-col justify-between min-h-[580px] rounded-3xl border border-[var(--border-subtle)] bg-[var(--panel-deep)] comb-paper p-10 relative overflow-hidden">
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
                Rejoignez l'ERP interne.
              </h1>
              <p className="text-[var(--t3)] text-[15px] leading-relaxed font-medium max-w-md">
                Un compte pour déclarer vos heures, faire valider vos feuilles de temps et suivre votre paie.
              </p>
            </div>

            <div className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--t3)]">
              Feuilles de temps · Mois courant
              <span className="block mt-3 flex items-center gap-[3px]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className="comb-cell"
                    style={{ background: i < 3 ? 'var(--honey)' : 'var(--ledger-rule)' }}
                  />
                ))}
              </span>
            </div>
          </div>

          {/* CÔTÉ DROIT : Formulaire */}
          <div className="w-full max-w-md mx-auto">
            <div className="folio rounded-2xl border border-[var(--border-subtle)] bg-[var(--panel)] p-8 shadow-2xl">
              <div className="mb-6">
                <span className="font-mono text-[10px] font-semibold text-[var(--honey)] tracking-[0.22em] uppercase block mb-2">
                  NOUVEL UTILISATEUR
                </span>
                <h2 className="font-display text-[1.6rem] font-bold text-[var(--t1)] leading-tight tracking-tight">
                  Créer un compte
                </h2>
                <p className="text-sm text-[var(--t3)] font-medium mt-1">
                  Renseignez vos informations pour configurer votre accès à l'ERP.
                </p>
              </div>

              <RegisterForm onSubmit={handleRegister} error={error} />

              <div className="mt-8 text-center text-xs font-medium text-[var(--t3)]">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-[var(--honey)] font-bold hover:underline">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}