import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputField({ label, className = '', ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">{label}</label>
      <input className={`field disabled:opacity-60 ${className}`} {...props} />
    </div>
  );
}