import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Users, Shield } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--t1)]">Tableau de bord</h1>
        <p className="text-sm text-[var(--t3)] mt-1">
          Bienvenue, {user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
              <Shield className="text-[var(--accent)]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--t3)]">Votre rôle</p>
              <p className="text-lg font-semibold text-[var(--t1)]">Administrateur</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--info-bg)] flex items-center justify-center">
              <Users className="text-[var(--info)]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--t3)]">Gestion</p>
              <p className="text-lg font-semibold text-[var(--t1)]">Utilisateurs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-[var(--panel)] rounded-xl border border-[var(--line)] p-6">
        <h2 className="text-lg font-semibold text-[var(--t1)] mb-4">Actions rapides</h2>
        <div className="space-y-3">
          <a
            href="/users"
            className="flex items-center gap-3 p-4 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--chip-hover)] transition-colors"
          >
            <Users className="text-[var(--accent)]" size={20} />
            <div>
              <p className="font-medium text-[var(--t1)]">Créer un utilisateur</p>
              <p className="text-sm text-[var(--t3)]">Ajouter un nouveau compte (RH, Admin, Enseignant)</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
