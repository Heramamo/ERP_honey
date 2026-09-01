import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';
import type { SaisiePayload } from '../../../types/saisieFeuille';
import { fetchAllSaisies } from '../../../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { StatusBadge } from '../../common/StatusBadge';

interface AllSaisiesTableProps {
  allowedRoles?: Role[];
}

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

export const AllSaisiesTable: React.FC<AllSaisiesTableProps> = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { all, loading, error } = useAppSelector((state) => state.saisies);

  useEffect(() => {
    dispatch(fetchAllSaisies());
  }, [dispatch]);

  const content = (
    <div className="space-y-4 flex-1 min-h-0 flex flex-col">
      {error && (
        <div className="px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs">
          {error}
        </div>
      )}

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2.5 text-[var(--t3)]">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
            <span className="text-xs">Chargement des feuilles de saisie...</span>
          </div>
        ) : all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--t3)]">
            <span className="text-xs">Aucune feuille de saisie pour le moment.</span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto scroll-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] tracking-wider uppercase bg-[var(--panel-deep)]">
                <th className="py-3 px-5">Enseignant</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Activité</th>
                <th className="py-3 px-5">Heures de base</th>
                <th className="py-3 px-5">Heures supp.</th>
                <th className="py-3 px-5">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-sm">
              {all.map((saisie: SaisiePayload) => (
                <tr key={saisie.id ?? `${saisie.enseignantId}-${saisie.date}`} className="hover:bg-[var(--chip)]/50 transition-colors">
                  <td className="py-3 px-5 font-medium text-[var(--t1)]">
                    {saisie.enseignant
                      ? `${saisie.enseignant.utilisateur.nom} ${saisie.enseignant.utilisateur.prenom}`
                      : `Enseignant #${saisie.enseignantId}`}
                    {saisie.enseignant && (
                      <span className="block text-[11px] font-normal text-[var(--t3)]">{saisie.enseignant.utilisateur.email}</span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-[var(--t3)] text-xs font-mono tabular-nums">{formatDate(saisie.date)}</td>
                  <td className="py-3 px-5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--info-bg)] text-[var(--info)]">
                      {saisie.typeActivite}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono font-medium text-[var(--t2)] tabular-nums">{saisie.heuresEffectuees} h</td>
                  <td className="py-3 px-5 font-mono font-medium text-[var(--warning)] tabular-nums">{saisie.heuresSupp} h</td>
                  <td className="py-3 px-5">
                    <StatusBadge status={getStatutLabel(saisie.statut)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default AllSaisiesTable;
