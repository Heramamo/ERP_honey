import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputField({ label, disabled, className = '', ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-xl text-sm transition ${
          disabled
            ? 'bg-slate-100/80 border border-slate-200/80 text-slate-500 font-medium cursor-not-allowed select-none'
            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]'
        } ${className}`}
        {...props}
      />
    </div>
  );
}