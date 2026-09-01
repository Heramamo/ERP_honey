import React from 'react';
import { PolesTable } from '../components/dashboard/finance/PolesTable';

export const PolesPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 w-full max-w-[1600px] mx-auto text-[var(--t1)] space-y-5 font-sans">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Gestion des pôles</h1>
        <p className="text-xs text-[var(--t3)] mt-0.5">
          Pôles d'activité du groupe et ajout de nouveaux pôles.
        </p>
      </div>

      <PolesTable />
    </div>
  );
};

export default PolesPage;
