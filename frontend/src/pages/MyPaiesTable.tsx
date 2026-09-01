import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { PaiePayload } from '../types/paie';
import { fetchMyPaies, clearError as clearPaieError } from '../store/slices/paieSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusBadge } from '../components/common/StatusBadge';

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const formatMois = (mois: string) => {
  const [year, month] = mois.split('-');
  const label = MONTHS_FR[Number(month) - 1];
  return label ? `${label} ${year}` : mois;
};

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case 'PAYE': return 'Payé';
    case 'EN_ATTENTE': return 'En attente';
    default: return statut;
  }
};

export const MyPaiesTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mine, loading, error } = useAppSelector((state) => state.paie);

  useEffect(() => {
    dispatch(fetchMyPaies());
    return () => {
      dispatch(clearPaieError());
    };
  }, [dispatch]);

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto w-full font-sans text-[var(--t1)] h-full flex flex-col min-h-0">
      <div className="mb-5 shrink-0">
        <h1 className="text-lg font-semibold tracking-tight">Ma paie</h1>
        <p className="text-xs text-[var(--t3)] mt-0.5">
          Historique de vos fiches de paie mensuelles
        </p>
      </div>

      {error && (
        <div className="mb-5 px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs shrink-0">
          {error}
        </div>
      )}

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2.5 text-[var(--t3)]">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
            <span className="text-xs">Chargement de vos fiches de paie...</span>
          </div>
        ) : mine.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--t3)]">
            <span className="text-xs">Aucune fiche de paie pour le moment.</span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto scroll-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] tracking-wider uppercase bg-[var(--panel-deep)]">
                <th className="py-3 px-5">Période</th>
                <th className="py-3 px-5">Date d'émission</th>
                <th className="py-3 px-5">Montant total</th>
                <th className="py-3 px-5">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-sm">
              {mine.map((paie: PaiePayload) => (
                <tr key={paie.id} className="hover:bg-[var(--chip)]/50 transition-colors">
                  <td className="py-3 px-5 font-medium text-[var(--t1)]">{formatMois(paie.mois)}</td>
                  <td className="py-3 px-5 text-[var(--t3)] text-xs">
                    {new Date(paie.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-5 font-medium text-[var(--success)] font-mono tabular-nums">
                    {paie.totalSalaire.toLocaleString('fr-FR')} Ar
                  </td>
                  <td className="py-3 px-5">
                    <StatusBadge status={getStatutLabel(paie.statutpaie)} />
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
};

export default MyPaiesTable;
