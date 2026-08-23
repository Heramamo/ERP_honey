import React, { useEffect } from 'react';
import { Loader2, Wallet } from 'lucide-react';
import type { PaiePayload } from '../types/paie';
import { fetchMyPaies, clearError as clearPaieError } from '../store/slices/paieSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const formatMois = (mois: string) => {
  const [year, month] = mois.split('-');
  const label = MONTHS_FR[Number(month) - 1];
  return label ? `${label} ${year}` : mois;
};

const STATUT_STYLES: Record<string, string> = {
  PAYE: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
  EN_ATTENTE: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
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
    <div className="p-8 max-w-[1200px] mx-auto w-full font-sans text-slate-100">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Ma Paie</h1>
        <p className="text-sm text-slate-400 mt-1">
          Historique de vos fiches de paie mensuelles
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#12161f] border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-sm">Chargement de vos fiches de paie...</span>
          </div>
        ) : mine.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Wallet className="w-8 h-8 text-slate-600" />
            <span className="text-sm">Aucune fiche de paie pour le moment.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#0e1118]">
                <th className="py-4 px-6">PÉRIODE</th>
                <th className="py-4 px-6">DATE D'ÉMISSION</th>
                <th className="py-4 px-6">MONTANT TOTAL</th>
                <th className="py-4 px-6">STATUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {mine.map((paie: PaiePayload) => (
                <tr key={paie.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-100">{formatMois(paie.mois)}</td>
                  <td className="py-4 px-6 text-slate-400 text-xs">
                    {new Date(paie.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-6 font-semibold text-emerald-400">
                    {paie.totalSalaire.toLocaleString('fr-FR')} Ar
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${STATUT_STYLES[paie.statutpaie] ?? 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                      {getStatutLabel(paie.statutpaie)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyPaiesTable;
