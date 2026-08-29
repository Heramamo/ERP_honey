import React from 'react';
import { User, ChevronUp, ChevronDown } from 'lucide-react';

interface UserSelectorProps {
  name: string;
  role: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ name, role }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--t2)] mb-1.5">
        Utilisateur
      </label>
      <div className="flex items-center justify-between p-2.5 bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--chip)] flex items-center justify-center text-[var(--t3)]">
            <User size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--t1)] leading-tight">{name}</p>
            <p className="text-[11px] font-semibold text-[var(--success)] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] inline-block" />
              {role}
            </p>
          </div>
        </div>
        <div className="text-[var(--t3)] flex flex-col items-center">
          <ChevronUp size={12} className="-mb-1" />
          <ChevronDown size={12} />
        </div>
      </div>
    </div>
  );
};
