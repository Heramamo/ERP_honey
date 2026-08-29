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

  const kpiCard = (border: string, label: string, value: string, valueClass: string, note: string, icon: React.ReactNode) => (
    <div className={`bg-[var(--panel)] border border-[var(--line)] border-l-4 ${border} rounded-xl p-5 shadow-[var(--shadow-raised)] relative overflow-hidden`}>
      <p className="text-xs font-semibold text-[var(--t3)]">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <span className={`text-2xl font-bold ${valueClass}`}>{value}</span>
      </div>
      <p className="text-xs text-[var(--t3)] mt-2">{note}</p>
      <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none">{icon}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 1. Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpiCard('border-l-[var(--success)]', 'Total Encaissé', formatAr(total), 'text-[var(--success)]', `${filteredRevenus.length} encaissement${filteredRevenus.length > 1 ? 's' : ''}`, <TrendingUp className="w-16 h-16 text-[var(--success)]" />)}
        {kpiCard('border-l-[var(--info)]', "Nombre d'Encaissements", String(filteredRevenus.length), 'text-[var(--t1)]', 'Recettes enregistrées', <Receipt className="w-16 h-16 text-[var(--info)]" />)}
      </div>

      {/* 2. Barre d'outils et Tableau */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5 shadow-[var(--shadow-raised)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
              <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </div>

            <select
              value={selectedPole}
              onChange={(e) => { setSelectedPole(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg px-4 py-2 text-sm text-[var(--t2)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              <option value="all">Tous les Pôles</option>
              {poles.map((pole) => (
                <option key={pole.id} value={String(pole.id)}>{pole.nom}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onOpenModal('RECETTE')}
            className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Nouvel Encaissement
          </button>
        </div>

        {error && !loading && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-sm">{error}</div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
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
                <tr className="border-b border-[var(--line)] text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider">
                  <th className="py-3 px-4">Source de la recette</th>
                  <th className="py-3 px-4">Pôle d'affectation</th>
                  <th className="py-3 px-4 text-right">Montant Encaissé</th>
                  <th className="py-3 px-4">Date d'encaissement</th>
                  <th className="py-3 px-4 text-center">Facture / Reçu</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-sm">
                {pageRevenus.map((revenu) => (
                  <tr key={revenu.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="py-4 px-4 font-medium text-[var(--t1)]">{revenu.libelle}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md ${getPoleBadgeStyle(revenu.idPole)}`}>
                        {poleName(revenu.idPole)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-[var(--success)]">+ {formatAr(revenu.montant)}</td>
                    <td className="py-4 px-4 text-[var(--t3)] text-xs">{formatDateShort(revenu.date)}</td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-[var(--t3)] hover:text-[var(--accent)] transition-colors cursor-pointer">
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
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--line)] text-xs text-[var(--t3)]">
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
                className="p-1.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] hover:bg-[var(--surface-hover)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page <span className="font-bold text-[var(--t1)]">{safePage}</span> / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] hover:bg-[var(--surface-hover)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
