import React, { useEffect } from 'react';
import { Loader2, Inbox } from 'lucide-react';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';
import type { SaisiePayload } from '../../../types/saisieFeuille';
import { fetchAllSaisies } from '../../../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

interface AllSaisiesTableProps {
  allowedRoles?: Role[];
}

const STATUT_STYLES: Record<string, string> = {
  VALIDE: 'text-[var(--success)] bg-[var(--success-bg)] border-[var(--success-line)]',
  REFUSE: 'text-[var(--danger)] bg-[var(--danger-bg)] border-[var(--danger-line)]',
  EN_ATTENTE: 'text-[var(--warning)] bg-[var(--warning-bg)] border-[var(--warning-line)]',
};

const getStatutStyle = (statut: SaisiePayload['statut']) =>
  STATUT_STYLES[String(statut)] ?? 'bg-[var(--chip)] text-[var(--t2)] border-[var(--line)]';

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
        <div className="px-4 py-3 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-sm">
          {error}
        </div>
      )}

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl overflow-hidden shadow-[var(--shadow-raised)] flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
            <span className="text-sm">Chargement des feuilles de saisie...</span>
          </div>
        ) : all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
            <Inbox className="w-8 h-8 text-[var(--t3)]" />
            <span className="text-sm">Aucune feuille de saisie pour le moment.</span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto scroll-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--line)] text-[11px] font-bold text-[var(--t3)] tracking-wider uppercase bg-[var(--panel-deep)]">
                <th className="py-4 px-6">ENSEIGNANT</th>
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">TYPE D'ACTIVITÉ</th>
                <th className="py-4 px-6">HEURES DE BASE</th>
                <th className="py-4 px-6">HEURES SUPP.</th>
                <th className="py-4 px-6">STATUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-sm">
              {all.map((saisie: SaisiePayload) => (
                <tr key={saisie.id ?? `${saisie.enseignantId}-${saisie.date}`} className="hover:bg-[var(--chip)] transition-colors">
                  <td className="py-4 px-6 font-bold text-[var(--t1)]">
                    {saisie.enseignant
                      ? `${saisie.enseignant.utilisateur.nom} ${saisie.enseignant.utilisateur.prenom}`
                      : `Enseignant #${saisie.enseignantId}`}
                    {saisie.enseignant && (
                      <span className="block text-xs font-normal text-[var(--t3)]">{saisie.enseignant.utilisateur.email}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-[var(--t3)] text-xs">{formatDate(saisie.date)}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border bg-[var(--info-bg)] text-[var(--info)] border-[var(--info-line)]">
                      {saisie.typeActivite}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-[var(--t2)]">{saisie.heuresEffectuees} h</td>
                  <td className="py-4 px-6 font-mono font-semibold text-[var(--warning)]">{saisie.heuresSupp} h</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${getStatutStyle(saisie.statut)}`}>
                      {getStatutLabel(saisie.statut)}
                    </span>
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
