import React from 'react';
import { User, MoreVertical } from 'lucide-react';
import type { User as UserType } from '../../types/user';

interface UserListProps {
  users: UserType[];
  loading: boolean;
}

export const UserList: React.FC<UserListProps> = ({ users, loading }) => {
  const roleColors: Record<string, string> = {
    ADMIN: 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20',
    RH: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
    FINANCE: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
    ENSEIGNANT: 'bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/20',
  };

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrateur',
    RH: 'Ressources Humaines',
    FINANCE: 'Finance',
    ENSEIGNANT: 'Enseignant',
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-[var(--panel)] rounded-xl border border-[var(--line)] animate-pulse">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-hover)]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-[var(--surface-hover)] rounded" />
              <div className="h-3 w-1/2 bg-[var(--surface-hover)] rounded" />
            </div>
            <div className="h-6 w-24 bg-[var(--surface-hover)] rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto text-[var(--t3)] mb-3" size={48} />
        <p className="text-[var(--t2)]">Aucun utilisateur trouvé</p>
        <p className="text-sm text-[var(--t3)] mt-1">Cliquez sur "Nouveau compte" pour en créer un</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id_utilisateur}
          className="flex items-center justify-between p-4 bg-[var(--panel)] rounded-xl border border-[var(--line)] hover:border-[var(--accent)]/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
              <User className="text-[var(--accent)]" size={20} />
            </div>
            <div>
              <p className="font-medium text-[var(--t1)]">
                {user.prenom} {user.nom}
              </p>
              <p className="text-sm text-[var(--t3)]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                roleColors[user.role] || 'bg-[var(--chip)] text-[var(--t2)] border-[var(--line)]'
              }`}
            >
              {roleLabels[user.role] || user.role}
            </span>

            <div className="relative">
              <button
                className="p-2 rounded-lg text-[var(--t3)] hover:bg-[var(--surface-hover)] hover:text-[var(--t1)] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};