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
    <div className="w-full text-slate-100 font-sans p-6">
      {/* Titre dynamique */}
      <h1 className="text-3xl font-extrabold tracking-tight mb-6 text-white transition-all">
        {pageTitles[activeTab]}
      </h1>

      {/* Navigation par sous-sections / Onglets */}
      <div className="flex items-center gap-8 border-b border-slate-800/80 mb-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('validation')}
          className={`pb-3 relative transition-colors flex items-center gap-2 ${
            activeTab === 'validation' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          En Attente de Validation
          <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
            {pendingCount}
          </span>
          {activeTab === 'validation' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('toutes')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'toutes' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Toutes les Feuilles
          {activeTab === 'toutes' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Affichage du contenu dynamique */}
      {activeTab === 'validation' && <HoursValidationTable allowedRoles={allowedRoles} />}
      {activeTab === 'toutes' && <AllSaisiesTable allowedRoles={allowedRoles} />}
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default HrPayrollPage;
