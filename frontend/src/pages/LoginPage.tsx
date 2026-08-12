import React from 'react';
import { Link } from 'react-router-dom';
import { AuthHeader } from '../components/ui/AuthHeader';
import { LoginForm } from '../components/auth/LoginForm';
import type { LoginFormValues } from '../components/auth/LoginForm';

export default function LoginPage(): React.ReactElement {
  const handleLogin = async (data: LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Bienvenue ${data.username} !`);
  };

  const handleHelpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert("Veuillez contacter l'administrateur système du réseau d'entreprise.");
  };

  return (
    <div className="w-screen min-h-screen bg-[#0b132b] flex items-center justify-center p-4 m-0 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-[#d4af37]">
        <div className="p-8">
          <AuthHeader 
            appName="HONEY GROUP"
            appSub="ERP INTERNE"
            title="Authentification Session Desktop"
            subtitle="Accès sécurisé au réseau d'entreprise"
          />

          <LoginForm onSubmit={handleLogin} />

          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <a 
              href="#" 
              onClick={handleHelpClick}
              className="text-xs text-gray-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Problème de connexion ?
            </a>

            {/* Lien vers l'inscription */}
            <p className="text-xs text-slate-500 pt-2 border-t border-gray-100 w-full">
              Vous n'avez pas encore de compte ?{' '}
              <Link to="/register" className="text-slate-900 font-bold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}