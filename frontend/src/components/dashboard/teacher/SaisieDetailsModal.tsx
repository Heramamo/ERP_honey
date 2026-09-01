import React from 'react';
import { X } from 'lucide-react';
import type { SaisiePayload } from '../../../types/saisieFeuille';
import { StatusBadge } from '../../common/StatusBadge';

interface SaisieDetailsModalProps {
  open: boolean;
  saisie: SaisiePayload | null;
  onClose: () => void;
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

export const SaisieDetailsModal: React.FC<SaisieDetailsModalProps> = ({ open, saisie, onClose }) => {
  if (!open || !saisie) return null;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Date', value: <span className="font-mono tabular-nums">{formatDate(saisie.date)}</span> },
    {
      label: "Type d'activité",
      value: (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--info-bg)] text-[var(--info)]">
          {saisie.typeActivite}
        </span>
      ),
    },
    { label: 'Heures de base', value: <span className="font-mono tabular-nums">{saisie.heuresEffectuees} h</span> },
    { label: 'Heures supplémentaires', value: <span className="font-mono tabular-nums">{saisie.heuresSupp} h</span> },
    {
      label: 'Statut',
      value: <StatusBadge status={getStatutLabel(saisie.statut)} />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-[var(--panel)] border border-[var(--line)] rounded-lg shadow-[var(--shadow-raised)] overflow-y-auto scroll-thin">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)]">
          <h2 className="text-sm font-semibold text-[var(--t1)]">Détails de la saisie</h2>
          <button
            onClick={onClose}
            className="p-1 text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface-hover)] rounded-md transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <dl className="space-y-3">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <dt className="text-[11px] font-medium text-[var(--t3)]">{row.label}</dt>
                <dd className="text-sm font-medium text-[var(--t2)] text-right">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="pt-4 border-t border-[var(--line)]">
            <p className="text-[11px] font-medium text-[var(--t3)] mb-3">Validation</p>
            {saisie.validePar ? (
              <div className="flex items-center gap-3 px-3 py-3 rounded-md bg-[var(--panel-deep)] border border-[var(--line)]">
                <div className="w-8 h-8 rounded-md bg-[var(--accent)] text-[#1a1408] font-semibold text-[11px] flex items-center justify-center shrink-0">
                  {(saisie.validePar.prenom[0] ?? '') + (saisie.validePar.nom[0] ?? '')}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[var(--t1)] truncate">
                    {saisie.validePar.nom} {saisie.validePar.prenom}
                  </p>
                  <p className="text-[10px] text-[var(--t3)] truncate">
                    {saisie.validePar.role} · {saisie.validePar.email}
                  </p>
                </div>
                <span className="ml-auto shrink-0">
                  <StatusBadge status={getStatutLabel(saisie.statut)} />
                </span>
              </div>
            ) : (
              <p className="text-xs text-[var(--t3)]">Pas encore validée.</p>
            )}
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md border border-[var(--line)] text-sm font-medium text-[var(--t2)] hover:bg-[var(--chip)] transition cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaisieDetailsModal;
