import React from 'react';

export type CardTone = 'default' | 'subtle';

interface CardProps {
  children: React.ReactNode;
  tone?: CardTone;
  className?: string;
}

const toneStyles: Record<CardTone, string> = {
  default: 'bg-[var(--panel)] border-[var(--line)]',
  subtle: 'bg-[var(--panel-deep)] border-[var(--line)]',
};

export const Card: React.FC<CardProps> = ({ children, tone = 'default', className = '' }) => {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 shadow-[var(--shadow-raised)] ${toneStyles[tone]} ${className}`}
    >
      {children}
    </div>
  );
};
