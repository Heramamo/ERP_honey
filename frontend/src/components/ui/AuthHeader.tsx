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
  subtitle
}) => {
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center shadow-md mb-3">
          <div 
            className="w-5 h-5 bg-white" 
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} 
          />
        </div>
        <h1 className="text-xl font-bold text-[#1a2536] tracking-wider">{appName}</h1>
        <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mt-0.5">
          {appSub}
        </p>
      </div>

      <div className="w-full h-px bg-gray-100 my-4" />

      <div className="text-center mb-6">
        <h2 className="text-base font-bold text-[#1a2536]">{title}</h2>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </>
  );
};