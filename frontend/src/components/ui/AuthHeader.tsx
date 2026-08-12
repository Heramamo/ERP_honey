import React from 'react';

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
      <div className="text-center space-y-1 mb-4">
        <h2 className="text-xl font-bold tracking-wider text-white uppercase">
          {appName}
        </h2>
        <p className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
          {appSub}
        </p>
      </div>

      <div className="text-center space-y-1 mb-4">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="h-[1px] bg-slate-800 w-full my-5" />
    </>
  );
};