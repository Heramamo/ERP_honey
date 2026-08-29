import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, PieChart, Wallet, Clock } from 'lucide-react';
import { RegisterForm } from '../components/auth/RegisterForm';
import type { RegisterFormValues } from '../components/auth/RegisterForm';
import { api } from '../service/api';
import { getApiErrorMessage } from '../service/error';

const HIGHLIGHTS = [
  { icon: PieChart, label: 'Pilotage financier', desc: 'Trésorerie, charges et pôles en un coup d’œil' },
  { icon: Wallet, label: 'Paie & RH', desc: 'Fiches de paie et statuts des enseignants' },
  { icon: Clock, label: 'Suivi des heures', desc: 'Déclaration et validation des feuilles de temps' },
];

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
    <div className="w-screen min-h-screen bg-[var(--app-bg)] text-[var(--t1)] flex items-center justify-center p-4 md:p-8 m-0 font-sans relative overflow-hidden">
      <div className="relative w-full max-w-5xl bg-[var(--panel)] border border-[var(--line)] rounded-3xl shadow-[var(--shadow-modal)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">

        {/* Panneau Gauche - Branding */}
        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-b from-[var(--panel-deep)] to-[var(--app-bg)] border-b lg:border-b-0 lg:border-r border-[var(--line)]">
          <div>
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
            <div className="mt-10">
              <p className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-widest mb-3">
                Pourquoi Honey ERP
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-[var(--t1)] leading-snug tracking-tight">
                Vos opérations, regroupées dans un seul espace de travail.
              </h1>
            </div>

            {/* Points clés */}
            {/* <ul className="mt-8 space-y-5">
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

          <p className="mt-8 pt-5 border-t border-[var(--line)] text-xs text-[var(--t3)]">
            Accès sécurisé réservé au réseau d’entreprise
          </p>
        </div>

        {/* Panneau Droit - Formulaire */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <span className="text-[11px] font-semibold text-[var(--accent)] tracking-widest uppercase block mb-1">
                Nouvel utilisateur
              </span>
              <h2 className="text-2xl font-bold text-[var(--t1)] tracking-tight">
                Créer un compte
              </h2>
              <p className="text-sm font-medium text-[var(--t3)] mt-1">
                Renseignez vos informations pour configurer votre accès à l'ERP.
              </p>
            </div>

            <RegisterForm onSubmit={handleRegister} error={error} />

            <div className="mt-8 text-center text-xs font-medium text-[var(--t3)]">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-[var(--accent)] font-bold hover:underline">
                Se connecter
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
