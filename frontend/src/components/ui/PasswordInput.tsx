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
        <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-[var(--t3)]">
          <Lock size={18} />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={currentValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="field pl-10 pr-10 text-sm"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-[var(--t3)] hover:text-[var(--t1)] transition-colors cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};