import React from 'react';
import { Card } from '../../ui/Card';
import type { SaisiePayload } from '../../../types/saisieFeuille';

interface LastEntryCardProps {
  saisie?: SaisiePayload | null;
}

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return isNaN(d.getTime())
    ? '-'
    : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getStatutLabel = (statut: SaisiePayload['statut']) => {
  const value = String(statut);
  switch (value) {
    case 'VALIDE': return 'Validé';
    case 'REFUSE': return 'Refusé';
    case 'EN_ATTENTE': return 'En attente';
    default: return String(value ?? '-');
  }
};

const getStatutClass = (statut: SaisiePayload['statut']) => {
  const value = String(statut);
  if (value === 'VALIDE') return 'text-[var(--success)] bg-[var(--success-bg)]';
  if (value === 'REFUSE') return 'text-[var(--danger)] bg-[var(--danger-bg)]';
  return 'text-[var(--warning)] bg-[var(--warning-bg)]';
};

export const LastEntryCard: React.FC<LastEntryCardProps> = ({ saisie }) => {
  const hasEntry = Boolean(saisie);

  return (
    <Card className="justify-between">
      <div>
        <h3 className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-3">
          Dernière saisie
        </h3>

        {hasEntry ? (
          <>
            <h2 className="text-xl font-semibold text-[var(--t1)] tracking-tight">
              {formatDate(saisie!.date)}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="bg-[var(--chip)] text-[var(--t2)] text-xs font-medium px-2.5 py-1 rounded-md font-mono tabular-nums">
                {Number(saisie!.heuresEffectuees) + Number(saisie!.heuresSupp)} h{' '}
                <span className="text-[var(--t3)]">
                  ({saisie!.heuresEffectuees}h base + {saisie!.heuresSupp}h supp)
                </span>
              </span>

              <span className="bg-[var(--info-bg)] text-[var(--info)] text-xs font-medium px-2.5 py-1 rounded-md">
                {saisie!.typeActivite}
              </span>

              <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${getStatutClass(saisie!.statut)}`}>
                {getStatutLabel(saisie!.statut)}
              </span>
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <p className="text-xl font-semibold text-[var(--t3)] tracking-tight">—</p>
            <p className="text-xs text-[var(--t3)] mt-1.5">Aucune saisie pour le moment</p>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-[var(--line)] text-[11px] text-[var(--t3)]">
        Dernière mise à jour transmise aux RH
      </div>
    </Card>
  );
};

export default LastEntryCard;
