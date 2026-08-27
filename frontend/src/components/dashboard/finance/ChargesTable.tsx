import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Loader2,
  TrendingDown,
  Layers,
  Zap,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCharges } from '../../../store/slices/chargeSlice';
import { fetchPoles } from '../../../store/slices/poleSlice';
import { formatAr, getPoleBadgeStyle } from '../../../utils/finance';
import { formatDateShort } from '../../../const/date';
import { StatCard } from '../StatCard';

export type TransactionType = 'DEPENSE' | 'RECETTE';

const PAGE_SIZE = 18;

interface ChargesTableProps {
  onOpenModal: (type: TransactionType) => void;
  refreshKey?: number;
}

export const ChargesTable: React.FC<ChargesTableProps> = ({ onOpenModal, refreshKey = 0 }) => {
  const dispatch = useAppDispatch();
  const { charges, loading, error } = useAppSelector((state) => state.charges);
  const poles = useAppSelector((state) => state.poles.poles);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPole, setSelectedPole] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCharges());
    dispatch(fetchPoles());
  }, [dispatch, refreshKey]);

  const poleName = (id: number) => poles.find((p) => p.id === id)?.nom ?? `Pôle ${id}`;

  const filteredCharges = charges.filter((charge) => {
    const term = searchTerm.trim().toLowerCase();
    const matchSearch = !term || charge.libelle.toLowerCase().includes(term);
    const matchPole = selectedPole === 'all' || String(charge.idPole) === selectedPole;
    const matchType = selectedType === 'all' || charge.typeCharge === selectedType;
    return matchSearch && matchPole && matchType;
  });

  const total = filteredCharges.reduce((sum, c) => sum + c.montant, 0);
  const totalFixed = filteredCharges.filter((c) => c.typeCharge === 'FIXE').reduce((s, c) => s + c.montant, 0);
  const totalVariable = filteredCharges.filter((c) => c.typeCharge === 'VARIABLE').reduce((s, c) => s + c.montant, 0);

  const totalPages = Math.max(1, Math.ceil(filteredCharges.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageCharges = filteredCharges.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6 text-[var(--t1)]">
      {/* 1. Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Charges Totales"
          value={<span className="text-[var(--danger)]">{formatAr(total)}</span>}
          subtitle={`${filteredCharges.length} charge${filteredCharges.length > 1 ? 's' : ''}`}
          icon={<TrendingDown size={16} />}
          glowColor="blue"
        />
        <StatCard
          title="Charges Fixes"
          value={formatAr(totalFixed)}
          subtitle="Dépenses récurrentes"
          icon={<Layers size={16} />}
          glowColor="blue"
        />
        <StatCard
          title="Charges Variables"
          value={formatAr(totalVariable)}
          subtitle="Dépenses ponctuelles"
          icon={<Zap size={16} />}
          glowColor="purple"
        />
      </div>

      {/* 2. Filtres et Tableau */}
      <div className="folio rounded-2xl border border-[var(--border-subtle)] bg-[var(--panel)] p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
              <input
                type="text"
                placeholder="Rechercher une dépense..."
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
              <option value="all">Tous les pôles</option>
              {poles.map((pole) => (
                <option key={pole.id} value={String(pole.id)}>{pole.nom}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
              className="field w-auto text-sm cursor-pointer"
            >
              <option value="all">Toutes les natures</option>
              <option value="FIXE">Fixe</option>
              <option value="VARIABLE">Variable</option>
            </select>
          </div>

          <button
            onClick={() => onOpenModal('DEPENSE')}
            className="btn-honey text-sm px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Ajouter une dépense
          </button>
        </div>

        {error && !loading && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/40 text-[var(--danger)] text-xs">{error}</div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--honey)]" />
              <span className="text-sm">Chargement des dépenses...</span>
            </div>
          ) : pageCharges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
              <TrendingDown className="w-8 h-8 text-[var(--t3)]" />
              <span className="text-sm">Aucune dépense. Cliquez sur « Ajouter une dépense » pour commencer.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="py-3 px-4 col-heat">Libellé de la dépense</th>
                  <th className="py-3 px-4 col-heat">Pôle d'affectation</th>
                  <th className="py-3 px-4 col-heat">Nature</th>
                  <th className="py-3 px-4 col-heat text-right">Montant Décaissé</th>
                  <th className="py-3 px-4 col-heat">Date de paiement</th>
                  <th className="py-3 px-4 col-heat text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {pageCharges.map((charge) => (
                  <tr key={charge.id} className="hover:bg-[var(--chip)] transition-colors">
                    <td className="py-4 px-4 font-medium text-[var(--t1)]">{charge.libelle}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md ${getPoleBadgeStyle(charge.idPole)}`}>
                        {poleName(charge.idPole)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {charge.typeCharge === 'FIXE' ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-blue-300 bg-blue-950/80 border border-blue-800/50 rounded">FIXE</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-purple-300 bg-[#2E1065] border border-purple-800/50 rounded">VARIABLE</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-[var(--danger)]">- {formatAr(charge.montant)}</td>
                    <td className="py-4 px-4 text-[var(--t3)] text-xs">{formatDateShort(charge.date)}</td>
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

        {!loading && filteredCharges.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--t3)]">
            <span>
              Affichage de{' '}
              <span className="font-bold text-[var(--t1)]">{(safePage - 1) * PAGE_SIZE + 1}</span> à{' '}
              <span className="font-bold text-[var(--t1)]">{Math.min(safePage * PAGE_SIZE, filteredCharges.length)}</span> sur{' '}
              <span className="font-bold text-[var(--t1)]">{filteredCharges.length}</span> dépenses
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

export default ChargesTable;