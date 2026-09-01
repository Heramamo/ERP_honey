import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputField({ label, disabled, className = '', ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">
        {label}
      </label>
      <input
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-md text-sm transition ${
          disabled
            ? 'bg-[var(--surface-hover)]/50 border border-[var(--line)] text-[var(--t3)] cursor-not-allowed select-none'
            : 'bg-[var(--panel-deep)] border border-[var(--line)] text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
