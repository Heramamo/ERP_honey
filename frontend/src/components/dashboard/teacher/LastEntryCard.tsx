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
  const value = typeof statut === 'string' ? statut : statut?.statut;
  switch (value) {
    case 'VALIDE': return 'Validé';
    case 'REFUSE': return 'Refusé';
    case 'EN_ATTENTE': return 'En attente';
    default: return String(value ?? '-');
  }
};

const getStatutClass = (statut: SaisiePayload['statut']) => {
  const value = typeof statut === 'string' ? statut : statut?.statut;
  if (value === 'VALIDE') return 'bg-emerald-500/20 text-emerald-400';
  if (value === 'REFUSE') return 'bg-rose-500/20 text-rose-400';
  return 'bg-amber-500/20 text-amber-400';
};

export const LastEntryCard: React.FC<LastEntryCardProps> = ({ saisie }) => {
  const hasEntry = Boolean(saisie);

  return (
    <Card className="justify-between">
      <div>
        <div className="flex items-center gap-2 text-amber-500 mb-6">
          <Activity size={18} />
          <h3 className="text-sm font-bold text-[var(--t1)]">Dernière Saisie Enregistrée</h3>
        </div>

        {hasEntry ? (
          <>
            <h2 className="text-3xl font-black text-[var(--t1)] tracking-tight">
              {formatDate(saisie!.date)}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="bg-[var(--chip)] border border-[var(--border-subtle)] text-[var(--t2)] text-xs font-semibold px-3 py-1.5 rounded-lg">
                {Number(saisie!.heuresEffectuees) + Number(saisie!.heuresSupp)} h total{' '}
                <span className="text-[var(--t3)] text-[11px]">
                  ({saisie!.heuresEffectuees}h Base + {saisie!.heuresSupp}h Supp)
                </span>
              </span>

              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1.5 rounded-lg">
                {saisie!.typeActivite}
              </span>

              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${getStatutClass(saisie!.statut)}`}>
                ● {getStatutLabel(saisie!.statut)}
              </span>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-3xl font-black text-slate-600 tracking-tight">—</p>
            <p className="text-xs text-[var(--t3)] mt-2">Aucune saisie pour le moment</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-[11px] text-[var(--t3)] font-medium">
        <RotateCw size={12} className="text-[var(--t3)]" />
        <span>Dernière mise à jour transmise aux RH</span>
      </div>
    </Card>
  );
};

export default LastEntryCard;