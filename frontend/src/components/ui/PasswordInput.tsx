import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Entrez votre mot de passe",
  label = "Mot de passe / PIN"
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <Lock size={18} />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};