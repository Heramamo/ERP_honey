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
      <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">{label}</label>
      <select className={`field cursor-pointer ${className}`} {...props}>
        <option value="">Sélectionner le statut</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}