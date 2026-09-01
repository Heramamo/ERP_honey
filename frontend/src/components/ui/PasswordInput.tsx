import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Entrez votre mot de passe",
  label = "Mot de passe / PIN"
}) => {
  const [internalValue, setInternalValue] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const currentValue = value ?? internalValue;

  const handleChange = (nextValue: string) => {
    setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-[var(--t3)]">
          <Lock size={15} />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={currentValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2 bg-[var(--panel-deep)] border border-[var(--line)] rounded-md text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-[var(--t3)] hover:text-[var(--t1)] transition-colors cursor-pointer"
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};
