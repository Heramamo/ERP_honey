import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function PrimaryButton({ children, icon, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full mt-6 py-3 px-6 bg-[var(--accent)] hover:bg-[var(--accent-strong)] active:bg-[var(--accent-strong)] text-slate-950 font-bold rounded-xl transition-colors shadow-[var(--shadow-soft)] flex items-center justify-center gap-2 text-sm ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
