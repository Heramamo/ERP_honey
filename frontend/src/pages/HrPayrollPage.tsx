import React, { useEffect, useState } from 'react';
import HoursValidationTable from '../components/dashboard/hr/HoursValidationTable';
import AllSaisiesTable from '../components/dashboard/hr/AllSaisiesTable';
import RoleGuard from '../components/RoleGuard';
import { fetchPendingSaisies } from '../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Role } from '../types/auth';

interface HrPayrollPageProps {
  allowedRoles?: Role[];
}

export const HrPayrollPage: React.FC<HrPayrollPageProps> = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const pendingCount = useAppSelector((state) => state.saisies.pending.length);
  const [activeTab, setActiveTab] = useState<'validation' | 'toutes'>('validation');

  useEffect(() => {
    dispatch(fetchPendingSaisies());
  }, [dispatch]);

  // Mappage des titres principaux selon la sous-section active
  const pageTitles = {
    validation: 'Feuilles en Attente de Validation',
    toutes: 'Toutes les Feuilles de Saisie',
  };

  const content = (
    <div className="w-full h-full text-[var(--t1)] font-sans p-6 flex flex-col min-h-0">
      {/* Titre dynamique */}
      <h1 className="text-2xl font-bold tracking-tight mb-6 text-[var(--t1)] transition-all shrink-0">
        {pageTitles[activeTab]}
      </h1>

      {/* Navigation par sous-sections / Onglets */}
      <div className="flex items-center gap-8 border-b border-[var(--line)] mb-6 text-sm font-semibold shrink-0">
        <button
          onClick={() => setActiveTab('validation')}
          className={`pb-3 relative transition-colors flex items-center gap-2 ${
            activeTab === 'validation' ? 'text-[var(--t1)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'
          }`}
        >
          En Attente de Validation
          <span className="bg-[var(--chip)] text-[var(--t2)] text-xs px-2 py-0.5 rounded-full font-bold">
            {pendingCount}
          </span>
          {activeTab === 'validation' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('toutes')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'toutes' ? 'text-[var(--t1)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'
          }`}
        >
          Toutes les Feuilles
          {activeTab === 'toutes' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-full" />
          )}
        </button>
      </div>

      {/* Affichage du contenu dynamique */}
      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === 'validation' && <HoursValidationTable allowedRoles={allowedRoles} />}
        {activeTab === 'toutes' && <AllSaisiesTable allowedRoles={allowedRoles} />}
      </div>
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default HrPayrollPage;
