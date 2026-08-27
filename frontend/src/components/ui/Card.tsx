import React from 'react';

export type CardTone = 'default' | 'subtle';

interface CardProps {
  children: React.ReactNode;
  tone?: CardTone;
  className?: string;
}

const toneStyles: Record<CardTone, string> = {
  default: 'bg-[var(--panel)]',
  subtle: 'bg-[var(--panel-deep)]',
};

export const Card: React.FC<CardProps> = ({ children, tone = 'default', className = '' }) => {
  return (
    <div
      className={`folio flex flex-col rounded-2xl border border-[var(--border-subtle)] p-6 shadow-lg ${toneStyles[tone]} ${className}`}
    >
      {children}
    </div>
  );
};