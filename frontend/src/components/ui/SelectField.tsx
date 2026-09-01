import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
}

export function SelectField({ label, options, className = '', ...props }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">
        {label}
      </label>
      <select
        className={`w-full px-3 py-2 rounded-md bg-[var(--panel-deep)] border border-[var(--line)] text-[var(--t1)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition appearance-none ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
