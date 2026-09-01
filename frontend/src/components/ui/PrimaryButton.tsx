import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function PrimaryButton({ children, icon, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full mt-6 py-2.5 px-5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] active:bg-[var(--accent-strong)] text-[#1a1408] font-semibold rounded-md transition-colors flex items-center justify-center gap-2 text-sm ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
