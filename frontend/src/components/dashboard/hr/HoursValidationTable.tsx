import React, { useEffect } from 'react';
import { Check, X, Loader2, Inbox } from 'lucide-react';
import RoleGuard from '../../RoleGuard';
import ConfirmButton from '../../common/ConfirmButton';
import type { Role } from '../../../types/auth';
import type { SaisiePayload } from '../../../types/saisieFeuille';
import {
  fetchPendingSaisies,
  validateSaisie,
  clearError,
} from '../../../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

interface HoursValidationTableProps {
  allowedRoles?: Role[];
}

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
};

export const HoursValidationTable: React.FC<HoursValidationTableProps> = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { pending, loading, error } = useAppSelector((state) => state.saisies);

  useEffect(() => {
    dispatch(fetchPendingSaisies());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleValidate = (id: number | undefined, statut: 'VALIDE' | 'REFUSE') => {
    if (!id) return;
    dispatch(validateSaisie({ id, statut }));
  };

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
            <span className="text-sm">Chargement des feuilles en attente...</span>
          </div>
        ) : pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
            <Inbox className="w-8 h-8 text-[var(--t3)]" />
            <span className="text-sm">Aucune feuille en attente de validation.</span>
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
                <th className="py-4 px-6 text-right">DECISION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-sm">
              {pending.map((saisie: SaisiePayload) => (
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
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ConfirmButton
                        title="Valider la feuille"
                        description={`Confirmez-vous la validation de la feuille de saisie du ${formatDate(saisie.date)} (${saisie.typeActivite}) ?`}
                        confirmLabel="Valider"
                        cancelLabel="Annuler"
                        tone="success"
                        buttonClassName="p-1.5 rounded-lg bg-[var(--success-bg)] border border-[var(--success-line)] hover:brightness-95 text-[var(--success)] transition-colors cursor-pointer"
                        onConfirm={() => handleValidate(saisie.id, 'VALIDE')}
                      >
                        <Check className="w-4 h-4" />
                      </ConfirmButton>
                      <ConfirmButton
                        title="Refuser la feuille"
                        description={`Confirmez-vous le refus de la feuille de saisie du ${formatDate(saisie.date)} (${saisie.typeActivite}) ?`}
                        confirmLabel="Refuser"
                        cancelLabel="Annuler"
                        tone="danger"
                        buttonClassName="p-1.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] hover:brightness-95 text-[var(--danger)] transition-colors cursor-pointer"
                        onConfirm={() => handleValidate(saisie.id, 'REFUSE')}
                      >
                        <X className="w-4 h-4" />
                      </ConfirmButton>
                    </div>
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

export default HoursValidationTable;
