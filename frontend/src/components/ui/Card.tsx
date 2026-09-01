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
      className={`flex flex-col rounded-lg border p-5 ${toneStyles[tone]} ${className}`}
    >
      {children}
    </div>
  );
};
