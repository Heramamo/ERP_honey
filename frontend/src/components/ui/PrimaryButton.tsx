import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function PrimaryButton({ children, icon, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full mt-6 py-3 px-6 bg-[#D4AF37] hover:bg-[#c29f2f] active:bg-[#b08f27] text-slate-900 font-bold rounded-xl transition duration-200 shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 text-sm ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}