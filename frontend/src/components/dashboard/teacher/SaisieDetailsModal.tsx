import React from 'react';
import { X } from 'lucide-react';
import type { SaisiePayload } from '../../../types/saisieFeuille';

interface SaisieDetailsModalProps {
  open: boolean;
  saisie: SaisiePayload | null;
  onClose: () => void;
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

export const SaisieDetailsModal: React.FC<SaisieDetailsModalProps> = ({ open, saisie, onClose }) => {
  if (!open || !saisie) return null;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Date', value: formatDate(saisie.date) },
    {
      label: "Type d'activité",
      value: (
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border bg-[var(--info-bg)] text-[var(--info)] border-[var(--info-line)]">
          {saisie.typeActivite}
        </span>
      ),
    },
    { label: 'Heures de base', value: `${saisie.heuresEffectuees} h` },
    { label: 'Heures supplémentaires', value: `${saisie.heuresSupp} h` },
    {
      label: 'Statut',
      value: (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${getStatutStyle(saisie.statut)}`}>
          {getStatutLabel(saisie.statut)}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-[var(--shadow-raised)] overflow-y-auto scroll-thin">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--panel-deep)]">
          <h2 className="text-sm font-bold text-[var(--t1)] uppercase tracking-wider">Détails de la Saisie</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--chip)] rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <dl className="space-y-3">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <dt className="text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider">{row.label}</dt>
                <dd className="text-sm font-semibold text-[var(--t2)] text-right">{row.value}</dd>
              </div>
            ))}
          </dl>

          {/* Validateur */}
          <div className="pt-4 border-t border-[var(--line)]">
            <p className="text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider mb-3">Validation</p>
            {saisie.validePar ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)]">
                <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  {(saisie.validePar.prenom[0] ?? '') + (saisie.validePar.nom[0] ?? '')}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--t1)] truncate">
                    {saisie.validePar.nom} {saisie.validePar.prenom}
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--t3)] truncate">
                    {saisie.validePar.role} • {saisie.validePar.email}
                  </p>
                </div>
                <span
                  className={`ml-auto inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border shrink-0 ${getStatutStyle(saisie.statut)}`}
                >
                  {getStatutLabel(saisie.statut)}
                </span>
              </div>
            ) : (
              <p className="text-xs text-[var(--t3)]">Pas encore validée.</p>
            )}
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[var(--line)] text-sm font-semibold text-[var(--t2)] hover:bg-[var(--chip)] transition cursor-pointer"
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
