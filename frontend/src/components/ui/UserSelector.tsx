import React from 'react';
import { User, ChevronUp, ChevronDown } from 'lucide-react';

interface UserSelectorProps {
  name: string;
  role: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ name, role }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        Utilisateur
      </label>
      <div className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800 leading-tight">{name}</p>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {role}
            </p>
          </div>
        </div>
        <div className="text-gray-400 flex flex-col items-center">
          <ChevronUp size={12} className="-mb-1" />
          <ChevronDown size={12} />
        </div>
      </div>
    </div>
  );
};