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
    <div className="w-screen min-h-screen bg-[var(--app-bg)] text-[var(--t1)] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="relative w-full max-w-5xl bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">

        {/* Left panel: Branding */}
        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between bg-[var(--panel-deep)] border-b lg:border-b-0 lg:border-r border-[var(--line)]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-[var(--accent)] flex items-center justify-center shrink-0">
                <span className="text-[#1a1408] font-bold text-sm">H</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-[var(--t1)]">Honey Group</p>
                <p className="text-[10px] text-[var(--t3)]">ERP interne</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-widest mb-2.5">
                Pourquoi Honey ERP
              </p>
              <h1 className="text-lg md:text-xl font-bold text-[var(--t1)] leading-snug tracking-tight">
                Vos opérations, regroupées dans un seul espace de travail.
              </h1>
            </div>
          </div>

          <p className="mt-8 pt-4 border-t border-[var(--line)] text-[11px] text-[var(--t3)]">
            Accès sécurisé réservé au réseau d'entreprise
          </p>
        </div>

        {/* Right panel: Form */}
        <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <span className="text-[10px] font-semibold text-[var(--accent)] tracking-widest uppercase block mb-1.5">
                Nouvel utilisateur
              </span>
              <h2 className="text-xl font-bold text-[var(--t1)] tracking-tight">
                Créer un compte
              </h2>
              <p className="text-sm text-[var(--t3)] mt-0.5">
                Renseignez vos informations pour configurer votre accès.
              </p>
            </div>

            <RegisterForm onSubmit={handleRegister} error={error} />

            <div className="mt-6 text-center text-xs text-[var(--t3)]">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-[var(--accent)] font-semibold hover:underline">
                Se connecter
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
