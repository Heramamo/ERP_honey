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

  const pageTitles = {
    validation: 'Feuilles en attente de validation',
    toutes: 'Toutes les feuilles de saisie',
  };

  const content = (
    <div className="w-full h-full text-[var(--t1)] font-sans p-6 md:p-8 flex flex-col min-h-0">
      <h1 className="text-lg font-semibold tracking-tight mb-5 text-[var(--t1)] shrink-0">
        {pageTitles[activeTab]}
      </h1>

      <div className="flex items-center gap-7 border-b border-[var(--line)] mb-5 text-sm shrink-0">
        <button
          onClick={() => setActiveTab('validation')}
          className={`pb-2.5 relative transition-colors flex items-center gap-2 text-[13px] font-medium ${
            activeTab === 'validation' ? 'text-[var(--t1)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'
          }`}
        >
          En attente
          <span className="bg-[var(--chip)] text-[var(--t2)] text-[11px] px-1.5 py-0.5 rounded font-semibold font-mono tabular-nums">
            {pendingCount}
          </span>
          {activeTab === 'validation' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('toutes')}
          className={`pb-2.5 relative transition-colors text-[13px] font-medium ${
            activeTab === 'toutes' ? 'text-[var(--t1)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'
          }`}
        >
          Toutes les feuilles
          {activeTab === 'toutes' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
          )}
        </button>
      </div>

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
