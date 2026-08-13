import React from 'react';
import { Link } from 'react-router-dom';
import {  Building2 } from 'lucide-react';
import { AuthHeader } from '../components/ui/AuthHeader';
import { LoginForm } from '../components/auth/LoginForm';
import type { LoginFormValues } from '../components/auth/LoginForm';
import { Urls } from '../const/url';
import axios from 'axios';

export default function LoginPage(): React.ReactElement {
  const handleLogin = async (data: LoginFormValues) => {
    try {
      const res = await axios.post(`${Urls.baseUrl}/user/login`, {email: data.username, mot_de_passe:data.password})
      console.log(res)
    } catch (error) {
      console.log(error.response.data?.message || error.message);
    }
    console.log('Données saisies :', data);
  };

  const handleHelpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert("Veuillez contacter l'administrateur système du réseau d'entreprise.");
  };

  return (
    <div className="min-h-screen w-full bg-[#080d1a] text-slate-200 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Conteneur principal split screen */}
      <div className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
          
          {/* CÔTÉ GAUCHE : Branding */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="w-16 h-16 bg-[#d4af37] rounded-2xl shadow-lg shadow-[#d4af37]/10 flex items-center justify-center">
              <Building2 size={36} className="text-slate-950" />
            </div>

            <div className="space-y-4 max-w-lg">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Bienvenue dans votre espace ERP
              </h1>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                Accédez à vos outils de gestion intégrés avec un niveau de sécurité optimal pour votre environnement de travail.
              </p>
            </div>
          </div>

          {/* CÔTÉ DROIT : Formulaire */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-[#101827]/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              
              <AuthHeader 
                appName="HONEY GROUP"
                appSub="ERP INTERNE"
                title="Authentification Session Desktop"
                subtitle="Accès sécurisé au réseau d'entreprise"
              />

              <LoginForm onSubmit={handleLogin} />

              <div className="mt-5 flex flex-col items-center gap-3 text-center">
                <a 
                  href="#" 
                  onClick={handleHelpClick}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Problème de connexion ?
                </a>

                <div className="h-[1px] bg-slate-800 w-full my-1" />

                <p className="text-xs text-slate-400">
                  Vous n'avez pas encore de compte ?{' '}
                  <Link to="/register" className="text-[#d4af37] font-bold hover:underline">
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