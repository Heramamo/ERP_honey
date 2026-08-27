import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function PrimaryButton({ children, icon, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      type="submit"
      className={`btn-honey w-full mt-6 py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}