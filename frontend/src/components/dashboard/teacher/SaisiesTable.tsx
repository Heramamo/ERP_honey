import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2, Inbox, Info } from 'lucide-react';
import type { SaisiePayload } from '../../../types/saisieFeuille';
import { fetchMySaisie } from '../../../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { CreateSaisieModal } from './CreateSaisieModal';
import { SaisieDetailsModal } from './SaisieDetailsModal';

const PAGE_SIZE = 8;

const STATUT_STYLES: Record<string, string> = {
  VALIDE: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
  REFUSE: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
  EN_ATTENTE: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
};

const resolveStatut = (statut: SaisiePayload['statut']): string => {
  if (typeof statut === 'string') return statut;
  return statut?.statut ?? '';
};

const getStatutStyle = (statut: SaisiePayload['statut']) => {
  const value = resolveStatut(statut);
  return STATUT_STYLES[value] ?? 'bg-slate-800 text-slate-300 border-slate-700';
};

const getStatutLabel = (statut: SaisiePayload['statut']) => {
  const value = resolveStatut(statut);
  switch (value) {
    case 'VALIDE': return 'Validé';
    case 'REFUSE': return 'Refusé';
    case 'EN_ATTENTE': return 'En attente';
    default: return value;
  }
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
};

export const SaisiesTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { saisies, loading, error } = useAppSelector((state) => state.saisies);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSaisie, setSelectedSaisie] = useState<SaisiePayload | null>(null);

  useEffect(() => {
    dispatch(fetchMySaisie());
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(saisies.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageSaisies = saisies.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full font-sans text-slate-100">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Mes Feuilles de Temps</h1>
          <p className="text-sm text-slate-400 mt-1">
            Déclaration des heures effectuées par activité
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nouvelle saisie
        </button>
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
            <span className="text-sm">Chargement des feuilles de temps...</span>
          </div>
        ) : pageSaisies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Inbox className="w-8 h-8 text-slate-600" />
            <span className="text-sm">Aucune feuille de temps pour le moment.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#0e1118]">
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">TYPE D'ACTIVITÉ</th>
                <th className="py-4 px-6">HEURES DE BASE</th>
                <th className="py-4 px-6">HEURES SUPP.</th>
                <th className="py-4 px-6">STATUT</th>
                <th className="py-4 px-6 text-right">DÉTAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {pageSaisies.map((saisie: SaisiePayload, index: number) => (
                <tr key={`${saisie.date}-${index}`} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-200">{formatDate(saisie.date)}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border bg-blue-950/60 text-blue-400 border-blue-800/50">
                      {saisie.typeActivite}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-slate-200">
                    {saisie.heuresEffectuees} h
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-amber-400">
                    {saisie.heuresSupp} h
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${getStatutStyle(saisie.statut)}`}>
                      {getStatutLabel(saisie.statut)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedSaisie(saisie)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="Plus d'informations"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && saisies.length > 0 && (
          <div className="p-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div>
              Affichage de <span className="font-bold text-slate-200">{saisies.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}</span> à{' '}
              <span className="font-bold text-slate-200">{Math.min(safePage * PAGE_SIZE, saisies.length)}</span> sur{' '}
              <span className="font-bold text-slate-200">{saisies.length}</span> feuilles
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-400">
                Page <span className="font-bold text-slate-200">{safePage}</span> / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateSaisieModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <SaisieDetailsModal
        open={selectedSaisie !== null}
        saisie={selectedSaisie}
        onClose={() => setSelectedSaisie(null)}
      />
    </div>
  );
};

export default SaisiesTable;