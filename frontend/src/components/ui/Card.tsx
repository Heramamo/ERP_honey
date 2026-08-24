import React from 'react';

export type CardTone = 'default' | 'subtle';

interface CardProps {
  children: React.ReactNode;
  tone?: CardTone;
  className?: string;
}

const toneStyles: Record<CardTone, string> = {
  default: 'bg-[var(--panel)] border-[var(--border-subtle)]',
  subtle: 'bg-[var(--panel-deep)] border-[var(--border-subtle)]',
};

export const Card: React.FC<CardProps> = ({ children, tone = 'default', className = '' }) => {
  return (
    <div className={`flex flex-col rounded-2xl border p-6 shadow-lg ${toneStyles[tone]} ${className}`}>
      {children}
    </div>
  );
};
