import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCharges } from '../../../store/slices/chargeSlice';
import { fetchPoles } from '../../../store/slices/poleSlice';
import { formatAr, getPoleBadgeStyle } from '../../../utils/finance';
import { formatDateShort } from '../../../const/date';

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

  const kpi = (label: string, value: string, tone: string) => (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg p-4">
      <p className="text-[11px] font-medium text-[var(--t3)]">{label}</p>
      <p className={`mt-1.5 text-xl font-medium font-mono tabular-nums ${tone}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {kpi('Charges totales', formatAr(total), 'text-[var(--danger)]')}
        {kpi('Charges fixes', formatAr(totalFixed), 'text-[var(--t1)]')}
        {kpi('Charges variables', formatAr(totalVariable), 'text-[var(--t1)]')}
      </div>

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--t3)]" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-md pl-8 pr-3 py-1.5 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] focus:border-transparent"
              />
            </div>

            <select
              value={selectedPole}
              onChange={(e) => { setSelectedPole(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--panel-deep)] border border-[var(--line)] rounded-md px-3 py-1.5 text-sm text-[var(--t2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] cursor-pointer"
            >
              <option value="all">Tous les pôles</option>
              {poles.map((pole) => (
                <option key={pole.id} value={String(pole.id)}>{pole.nom}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--panel-deep)] border border-[var(--line)] rounded-md px-3 py-1.5 text-sm text-[var(--t2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] cursor-pointer"
            >
              <option value="all">Toutes les natures</option>
              <option value="FIXE">Fixe</option>
              <option value="VARIABLE">Variable</option>
            </select>
          </div>

          <button
            onClick={() => onOpenModal('DEPENSE')}
            className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold text-sm px-3.5 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Ajouter une dépense
          </button>
        </div>

        {error && !loading && (
          <div className="mx-4 mt-4 px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs">{error}</div>
        )}

        <div className="overflow-x-auto scroll-thin">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2.5 text-[var(--t3)]">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
              <span className="text-sm">Chargement des dépenses...</span>
            </div>
          ) : pageCharges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--t3)]">
              <span className="text-sm">Aucune dépense à afficher.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Libellé</th>
                  <th className="py-2.5 px-4">Pôle d'affectation</th>
                  <th className="py-2.5 px-4">Nature</th>
                  <th className="py-2.5 px-4 text-right">Montant</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-sm">
                {pageCharges.map((charge) => (
                  <tr key={charge.id} className="hover:bg-[var(--chip)]/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--t1)]">{charge.libelle}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-md ${getPoleBadgeStyle(charge.idPole)}`}>
                        {poleName(charge.idPole)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {charge.typeCharge === 'FIXE' ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-[var(--info)] bg-[var(--info-bg)] rounded">Fixe</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-[var(--warning)] bg-[var(--warning-bg)] rounded">Variable</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium font-mono tabular-nums text-[var(--danger)]">- {formatAr(charge.montant)}</td>
                    <td className="py-3 px-4 text-[var(--t3)] text-xs font-mono tabular-nums">{formatDateShort(charge.date)}</td>
                    <td className="py-3 px-4 text-right">
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
          <div className="flex items-center justify-between gap-4 p-4 border-t border-[var(--line)] text-xs text-[var(--t3)]">
            <span>
              {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredCharges.length)} sur {filteredCharges.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-md bg-[var(--panel-deep)] border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>{safePage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-md bg-[var(--panel-deep)] border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
