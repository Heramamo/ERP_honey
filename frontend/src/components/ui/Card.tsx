import React from 'react';

export type CardTone = 'default' | 'subtle';

interface CardProps {
  children: React.ReactNode;
  tone?: CardTone;
  className?: string;
}

const toneStyles: Record<CardTone, string> = {
  default: 'bg-[#111726] border-slate-800/90',
  subtle: 'bg-[#101625] border-slate-800/80',
};

export const Card: React.FC<CardProps> = ({ children, tone = 'default', className = '' }) => {
  return (
    <div className={`flex flex-col rounded-2xl border p-6 shadow-lg ${toneStyles[tone]} ${className}`}>
      {children}
    </div>
  );
};
