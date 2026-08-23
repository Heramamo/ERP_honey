import React, { useEffect, useState } from 'react';
import { Loader2, Inbox, Plus } from 'lucide-react';
import RoleGuard from '../components/RoleGuard';
import type { Role } from '../types/auth';
import type { PaiePayload } from '../types/paie';
import { fetchAllPaies, updateStatutPaie, clearError as clearPaieError } from '../store/slices/paieSlice';import { useAppDispatch, useAppSelector } from '../store/hooks';
import { GeneratePaieModal } from '../components/dashboard/hr/GeneratePaieModal';

interface HrPaiePageProps {
  allowedRoles?: Role[];
}

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

export const HrPaiePage: React.FC<HrPaiePageProps> = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { all: paies, loading, error } = useAppSelector((state) => state.paie);
  const [moisFilter, setMoisFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPaies(moisFilter || undefined));
    return () => {
      dispatch(clearPaieError());
    };
  }, [dispatch, moisFilter]);

  const handleMarkPaid = (id: number | undefined) => {
    if (!id) return;
    dispatch(updateStatutPaie({ id, statutpaie: 'PAYE' }));
  };

  const content = (
    <div className="w-full text-slate-100 font-sans p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Gestion de la Paie</h1>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={moisFilter}
            onChange={(e) => setMoisFilter(e.target.value)}
            placeholder="Filtrer par mois"
            className="bg-[#0e1118] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors [color-scheme:dark]"
          />
          {moisFilter && (
            <button
              onClick={() => setMoisFilter('')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Réinitialiser
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Générer une fiche
          </button>
        </div>
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
            <span className="text-sm">Chargement des fiches de paie...</span>
          </div>
        ) : paies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Inbox className="w-8 h-8 text-slate-600" />
            <span className="text-sm">Aucune fiche de paie pour le moment.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#0e1118]">
                <th className="py-4 px-6">ENSEIGNANT</th>
                <th className="py-4 px-6">PÉRIODE</th>
                <th className="py-4 px-6">MONTANT TOTAL</th>
                <th className="py-4 px-6">STATUT</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {paies.map((paie: PaiePayload) => (
                <tr key={paie.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-100">
                    {paie.enseignant
                      ? `${paie.enseignant.utilisateur.nom} ${paie.enseignant.utilisateur.prenom}`
                      : `Enseignant #${paie.enseignantId}`}
                    {paie.enseignant && (
                      <span className="block text-xs font-normal text-slate-500">{paie.enseignant.utilisateur.email}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-xs">{formatMois(paie.mois)}</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400">
                    {paie.totalSalaire.toLocaleString('fr-FR')} Ar
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${STATUT_STYLES[paie.statutpaie] ?? 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                      {getStatutLabel(paie.statutpaie)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {paie.statutpaie === 'EN_ATTENTE' ? (
                      <button
                        onClick={() => handleMarkPaid(paie.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900 text-emerald-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Marquer payé
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <GeneratePaieModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default HrPaiePage;
