import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2, Info } from 'lucide-react';
import type { SaisiePayload } from '../../../types/saisieFeuille';
import { fetchMySaisie } from '../../../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { CreateSaisieModal } from './CreateSaisieModal';
import { SaisieDetailsModal } from './SaisieDetailsModal';
import { StatusBadge } from '../../common/StatusBadge';

const PAGE_SIZE = 8;

const getStatutLabel = (statut: SaisiePayload['statut']) => {
  const value = String(statut);
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
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto w-full font-sans text-[var(--t1)] h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between gap-4 mb-5 shrink-0">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Mes feuilles de temps</h1>
          <p className="text-xs text-[var(--t3)] mt-0.5">
            Déclaration des heures effectuées par activité
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nouvelle saisie
        </button>
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
            <span className="text-xs">Chargement des feuilles de temps...</span>
          </div>
        ) : pageSaisies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--t3)]">
            <span className="text-xs">Aucune feuille de temps pour le moment.</span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto scroll-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] tracking-wider uppercase bg-[var(--panel-deep)]">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Activité</th>
                <th className="py-3 px-5">Heures de base</th>
                <th className="py-3 px-5">Heures supp.</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-sm">
              {pageSaisies.map((saisie: SaisiePayload, index: number) => (
                <tr key={`${saisie.date}-${index}`} className="hover:bg-[var(--chip)]/50 transition-colors">
                  <td className="py-3 px-5 font-medium text-[var(--t2)] font-mono tabular-nums">{formatDate(saisie.date)}</td>
                  <td className="py-3 px-5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--info-bg)] text-[var(--info)]">
                      {saisie.typeActivite}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono font-semibold text-[var(--t2)] tabular-nums">
                    {saisie.heuresEffectuees} h
                  </td>
                  <td className="py-3 px-5 font-mono font-semibold text-[var(--warning)] tabular-nums">
                    {saisie.heuresSupp} h
                  </td>
                  <td className="py-3 px-5">
                    <StatusBadge status={getStatutLabel(saisie.statut)} />
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button
                      onClick={() => setSelectedSaisie(saisie)}
                      className="p-1.5 rounded-md bg-[var(--chip)] hover:bg-[var(--chip-hover)] text-[var(--t2)] transition-colors cursor-pointer"
                      title="Plus d'informations"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        {!loading && saisies.length > 0 && (
          <div className="p-3.5 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--t3)] shrink-0">
            <div>
              Affichage de <span className="font-medium text-[var(--t2)] font-mono tabular-nums">{saisies.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}</span> à{' '}
              <span className="font-medium text-[var(--t2)] font-mono tabular-nums">{Math.min(safePage * PAGE_SIZE, saisies.length)}</span> sur{' '}
              <span className="font-medium text-[var(--t2)] font-mono tabular-nums">{saisies.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-md border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t3)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[var(--t3)]">{safePage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-md border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t3)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
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
