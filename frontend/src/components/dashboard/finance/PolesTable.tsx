import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPoles, createPole } from '../../../store/slices/poleSlice';
import type { CreatePoleDto } from '../../../service/finance.service';
import { formatDateShort } from '../../../const/date';
import { CreatePoleModal } from './CreatePoleModal';

const PAGE_SIZE = 18;

export const PolesTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { poles, loading, error } = useAppSelector((state) => state.poles);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPoles());
  }, [dispatch]);

  const filteredPoles = poles.filter((pole) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      pole.nom.toLowerCase().includes(term) ||
      (pole.description ?? '').toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredPoles.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagePoles = filteredPoles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleCreate = async (dto: CreatePoleDto) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await dispatch(createPole(dto)).unwrap();
      setCreateOpen(false);
    } catch (err) {
      setSubmitError(typeof err === 'string' ? err : "Erreur lors de la création du pôle");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--t1)]">Pôles d'activité</h2>
          <p className="text-sm text-[var(--t3)]">Gérez les pôles de revenus et de charges du groupe.</p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold text-sm px-3.5 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Ajouter un pôle
        </button>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[var(--line)]">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--t3)]" />
            <input
              type="text"
              placeholder="Rechercher un pôle..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-md pl-8 pr-3 py-1.5 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] focus:border-transparent"
            />
          </div>
          <span className="text-sm text-[var(--t3)]">
            <strong className="text-[var(--t1)] font-semibold">{poles.length}</strong> pôle{poles.length > 1 ? 's' : ''}
          </span>
        </div>

        {error && !loading && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2.5 text-[var(--t3)]">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
            <span className="text-sm">Chargement des pôles...</span>
          </div>
        ) : pagePoles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--t3)]">
            <span className="text-sm">
              {searchTerm ? 'Aucun pôle ne correspond à votre recherche.' : 'Aucun pôle enregistré.'}
            </span>
            {!searchTerm && (
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-1 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-strong)] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Créer le premier pôle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Nom du pôle</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Date d'ajout</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-sm">
                {pagePoles.map((pole) => (
                  <tr key={pole.id} className="hover:bg-[var(--chip)]/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--t1)]">{pole.nom}</td>
                    <td className="py-3 px-4 text-[var(--t3)] text-xs max-w-[320px]">
                      {pole.description || (
                        <span className="italic opacity-70">Aucune description</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[var(--t3)] text-xs font-mono tabular-nums whitespace-nowrap">
                      {pole.createdAt ? formatDateShort(pole.createdAt) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-[var(--t3)] hover:text-[var(--t1)] p-1 rounded-md hover:bg-[var(--chip)] transition-colors cursor-pointer">
                        <MoreVertical className="w-4 h-4 ml-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredPoles.length > 0 && (
          <div className="flex items-center justify-between gap-4 py-3 px-4 border-t border-[var(--line)] text-xs text-[var(--t3)]">
            <span>
              {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredPoles.length)} sur {filteredPoles.length}
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

      <CreatePoleModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        submitting={submitting}
        error={submitError}
      />
    </div>
  );
};

export default PolesTable;
