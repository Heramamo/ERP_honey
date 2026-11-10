import React, { useEffect } from 'react';
import { Loader2, Inbox } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';
import type { SaisiePayload } from '../../../types/saisieFeuille';
import { fetchMySaisie, clearError } from '../../../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

const getStatutLabel = (statut: SaisiePayload['statut']) => {
  switch (String(statut)) {
    case 'VALIDE': return 'Validé';
    case 'REFUSE': return 'Refusé';
    case 'EN_ATTENTE': return 'En attente';
    default: return String(statut);
  }
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
};

interface PayrollTableProps {
  allowedRoles?: Role[];
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { saisies, loading, error } = useAppSelector((state) => state.saisies);

  useEffect(() => {
    dispatch(fetchMySaisie());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const content = (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden">
      {error && (
        <div className="px-3 py-2 bg-[var(--danger-bg)] border-b border-[var(--danger-line)] text-[var(--danger)] text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2.5 text-[var(--t3)]">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
          <span className="text-xs">Chargement de vos heures...</span>
        </div>
      ) : saisies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--t3)]">
          <Inbox className="w-6 h-6" />
          <span className="text-xs">Aucune heure enregistrée pour le moment.</span>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] tracking-wider uppercase">
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Activité</th>
              <th className="py-3 px-5">Heures de base</th>
              <th className="py-3 px-5">Heures supp.</th>
              <th className="py-3 px-5">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] text-sm">
            {saisies.map((saisie: SaisiePayload, index: number) => (
              <tr key={saisie.id ?? `${saisie.date}-${index}`} className="hover:bg-[var(--chip)]/50 transition-colors">
                <td className="py-3 px-5 font-medium text-[var(--t2)] font-mono tabular-nums">{formatDate(saisie.date)}</td>
                <td className="py-3 px-5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--info-bg)] text-[var(--info)]">
                    {saisie.typeActivite}
                  </span>
                </td>
                <td className="py-3 px-5 font-mono font-semibold text-[var(--t2)] tabular-nums">
                  {saisie.heuresEffectuees} h
                </td>
                <td className="py-3 px-5 font-mono font-semibold text-[var(--warning)] tabular-nums">
                  {saisie.heuresSupp} h
                </td>
                <td className="py-3 px-5">
                  <StatusBadge status={getStatutLabel(saisie.statut)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default PayrollTable;
