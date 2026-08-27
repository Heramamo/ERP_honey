import React from 'react';
import { PolesTable } from '../components/dashboard/finance/PolesTable';

export const PolesPage: React.FC = () => {
  return (
    <div className="p-6 bg-[var(--app-bg)] min-h-screen text-[var(--t1)] space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold tracking-tight">Gestion des Pôles</h1>
          <p className="text-xs text-[var(--t3)] mt-1">
            Liste des pôles d'activité du groupe et ajout de nouveaux pôles.
          </p>
        </div>
      </div>

      <PolesTable />
    </div>
  );
};

export default PolesPage;
