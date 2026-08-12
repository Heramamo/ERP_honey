import React from 'react';
import { Building2 } from 'lucide-react';

interface AuthHeaderProps {
  appName: string;
  appSub: string;
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  appName,
  appSub,
  title,
  subtitle,
}) => {
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        {/* Conteneur du logo identique à la page Register */}
        <div className="w-16 h-16 bg-[#d4af37] rounded-2xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 mb-3">
          <Building2 size={32} className="text-slate-950" />
        </div>
        
        <h1 className="text-xl font-extrabold text-slate-900 tracking-wider">
          {appName}
        </h1>
        <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
          {appSub}
        </p>
      </div>

      <div className="w-full h-[1px] bg-slate-100 my-4" />

      <div className="text-center mb-6">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
      </div>
    </>
  );
};