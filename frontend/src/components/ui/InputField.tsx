import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputField({ label, disabled, className = '', ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">
        {label}
      </label>
      <input
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-lg text-sm transition ${
          disabled
            ? 'bg-[var(--surface-hover)]/50 border border-[var(--line)] text-[var(--t3)] font-medium cursor-not-allowed select-none'
            : 'bg-[var(--panel-deep)] border border-[var(--line)] text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
