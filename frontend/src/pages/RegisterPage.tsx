import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
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
    <div className="w-screen min-h-screen bg-[#0b132b] flex items-center justify-center p-4 md:p-8 m-0 font-sans">
      <div className="w-full max-w-5xl bg-[#0d162d] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] border border-slate-800">
        
        {/* Panneau Gauche - Branding */}
        <div className="lg:col-span-5 relative p-8 md:p-12 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br from-[#0c1328] via-[#0f1b3d] to-[#070d1e]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#d4af37] rounded-3xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 mb-6">
              <Building2 size={40} className="text-slate-950" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wider mb-2">
              HONEY GROUP
            </h1>
            <p className="text-sm font-medium text-slate-400 max-w-xs">
              Rejoignez l'ERP interne.
            </p>
          </div>
        </div>

        {/* Panneau Droit - Formulaire */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <span className="text-[11px] font-bold text-[#d4af37] tracking-widest uppercase block mb-1">
                NOUVEL UTILISATEUR
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Créer un compte
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Renseignez vos informations pour configurer votre accès à l'ERP.
              </p>
            </div>

            <RegisterForm onSubmit={handleRegister} error={error} />

            <div className="mt-8 text-center text-xs font-medium text-slate-500">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-slate-900 font-bold hover:underline">
                Se connecter
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}