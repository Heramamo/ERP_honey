import React from 'react';
import { Activity, RotateCw } from 'lucide-react';
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
  if (value === 'VALIDE') return 'text-[var(--success)] bg-[var(--success-bg)] border border-[var(--success-line)]';
  if (value === 'REFUSE') return 'text-[var(--danger)] bg-[var(--danger-bg)] border border-[var(--danger-line)]';
  return 'text-[var(--warning)] bg-[var(--warning-bg)] border border-[var(--warning-line)]';
};

export const LastEntryCard: React.FC<LastEntryCardProps> = ({ saisie }) => {
  const hasEntry = Boolean(saisie);

  return (
    <Card className="justify-between">
      <div>
        <div className="flex items-center gap-2 text-[var(--accent)] mb-6">
          <Activity size={18} />
          <h3 className="text-sm font-bold text-[var(--t1)]">Dernière Saisie Enregistrée</h3>
        </div>

        {hasEntry ? (
          <>
            <h2 className="text-3xl font-black text-[var(--t1)] tracking-tight">
              {formatDate(saisie!.date)}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="bg-[var(--chip)] border border-[var(--line)] text-[var(--t2)] text-xs font-semibold px-3 py-1.5 rounded-lg">
                {Number(saisie!.heuresEffectuees) + Number(saisie!.heuresSupp)} h total{' '}
                <span className="text-[var(--t3)] text-[11px]">
                  ({saisie!.heuresEffectuees}h Base + {saisie!.heuresSupp}h Supp)
                </span>
              </span>

              <span className="bg-[var(--info-bg)] text-[var(--info)] border border-[var(--info-line)] text-xs font-semibold px-3 py-1.5 rounded-lg">
                {saisie!.typeActivite}
              </span>

              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${getStatutClass(saisie!.statut)}`}>
                ● {getStatutLabel(saisie!.statut)}
              </span>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-3xl font-black text-[var(--t3)] tracking-tight">—</p>
            <p className="text-xs text-[var(--t3)] mt-2">Aucune saisie pour le moment</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-[var(--line)] flex items-center gap-2 text-[11px] text-[var(--t3)] font-medium">
        <RotateCw size={12} className="text-[var(--t3)]" />
        <span>Dernière mise à jour transmise aux RH</span>
      </div>
    </Card>
  );
};

export default LastEntryCard;