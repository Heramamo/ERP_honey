import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  FileText,
  MoreVertical,
  TrendingUp,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchRevenus } from '../../../store/slices/revenuSlice';
import { fetchPoles } from '../../../store/slices/poleSlice';
import { formatAr, getPoleBadgeStyle } from '../../../utils/finance';
import { formatDateShort } from '../../../const/date';
import { StatCard } from '../StatCard';

export type TransactionType = 'DEPENSE' | 'RECETTE';

const PAGE_SIZE = 18;

interface RevenusTableProps {
  onOpenModal: (type: TransactionType) => void;
  refreshKey?: number;
}

export const RevenusTable: React.FC<RevenusTableProps> = ({ onOpenModal, refreshKey = 0 }) => {
  const dispatch = useAppDispatch();
  const { revenus, loading, error } = useAppSelector((state) => state.revenus);
  const poles = useAppSelector((state) => state.poles.poles);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPole, setSelectedPole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchRevenus());
    dispatch(fetchPoles());
  }, [dispatch, refreshKey]);

  const poleName = (id: number) => poles.find((p) => p.id === id)?.nom ?? `Pôle ${id}`;

  const filteredRevenus = revenus.filter((revenu) => {
    const term = searchTerm.trim().toLowerCase();
    const matchSearch = !term || revenu.libelle.toLowerCase().includes(term);
    const matchPole = selectedPole === 'all' || String(revenu.idPole) === selectedPole;
    return matchSearch && matchPole;
  });

  const total = filteredRevenus.reduce((sum, r) => sum + r.montant, 0);

  const totalPages = Math.max(1, Math.ceil(filteredRevenus.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageRevenus = filteredRevenus.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6 text-[var(--t1)]">
      {/* 1. Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Encaissé"
          value={<span className="text-[var(--positive)]">{formatAr(total)}</span>}
          subtitle={`${filteredRevenus.length} encaissement${filteredRevenus.length > 1 ? 's' : ''}`}
          icon={<TrendingUp size={16} />}
          glowColor="teal"
        />
        <StatCard
          title="Nombre d'Encaissements"
          value={`${filteredRevenus.length} opérations`}
          subtitle="Recettes enregistrées"
          icon={<Receipt size={16} />}
          glowColor="emerald"
        />
      </div>

      {/* 2. Barre d'outils et Tableau */}
      <div className="folio rounded-2xl border border-[var(--border-subtle)] bg-[var(--panel)] p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
              <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="field pl-9 text-sm"
              />
            </div>

            <select
              value={selectedPole}
              onChange={(e) => { setSelectedPole(e.target.value); setCurrentPage(1); }}
              className="field w-auto text-sm cursor-pointer"
            >
              <option value="all">Tous les Pôles</option>
              {poles.map((pole) => (
                <option key={pole.id} value={String(pole.id)}>{pole.nom}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onOpenModal('RECETTE')}
            className="btn-honey text-sm px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Nouvel Encaissement
          </button>
        </div>

        {error && !loading && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/40 text-[var(--danger)] text-xs">{error}</div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--honey)]" />
              <span className="text-sm">Chargement des recettes...</span>
            </div>
          ) : pageRevenus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
              <TrendingUp className="w-8 h-8 text-[var(--t3)]" />
              <span className="text-sm">Aucune recette. Cliquez sur « Nouvel Encaissement » pour commencer.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="py-3 px-4 col-heat">Source de la recette</th>
                  <th className="py-3 px-4 col-heat">Pôle d'affectation</th>
                  <th className="py-3 px-4 col-heat text-right">Montant Encaissé</th>
                  <th className="py-3 px-4 col-heat">Date d'encaissement</th>
                  <th className="py-3 px-4 col-heat text-center">Facture / Reçu</th>
                  <th className="py-3 px-4 col-heat text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {pageRevenus.map((revenu) => (
                  <tr key={revenu.id} className="hover:bg-[var(--chip)] transition-colors">
                    <td className="py-4 px-4 font-medium text-[var(--t1)]">{revenu.libelle}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md ${getPoleBadgeStyle(revenu.idPole)}`}>
                        {poleName(revenu.idPole)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-[var(--positive)]">+ {formatAr(revenu.montant)}</td>
                    <td className="py-4 px-4 text-[var(--t3)] text-xs">{formatDateShort(revenu.date)}</td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-[var(--t3)] hover:text-[var(--honey)] transition-colors cursor-pointer">
                        <FileText className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-[var(--t3)] hover:text-[var(--t1)] p-1 rounded transition-colors cursor-pointer">
                        <MoreVertical className="w-4 h-4 ml-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredRevenus.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--t3)]">
            <span>
              Affichage de{' '}
              <span className="font-bold text-[var(--t1)]">{(safePage - 1) * PAGE_SIZE + 1}</span> à{' '}
              <span className="font-bold text-[var(--t1)]">{Math.min(safePage * PAGE_SIZE, filteredRevenus.length)}</span> sur{' '}
              <span className="font-bold text-[var(--t1)]">{filteredRevenus.length}</span> encaissements
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--border-subtle)] hover:bg-[var(--chip)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page <span className="font-bold text-[var(--t1)]">{safePage}</span> / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--border-subtle)] hover:bg-[var(--chip)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenusTable;