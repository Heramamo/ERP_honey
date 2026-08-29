import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  Boxes,
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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/25 text-[var(--accent)]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--t1)]">Pôles d'activité</h2>
            <p className="text-sm text-[var(--t3)]">Gérez les pôles de revenus et de charges du groupe.</p>
          </div>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Ajouter un Pôle
        </button>
      </div>

      {/* Carte principale */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl shadow-[var(--shadow-raised)] overflow-hidden">
        {/* Barre d'outils */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-[var(--line)]">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
            <input
              type="text"
              placeholder="Rechercher un pôle..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--t2)] bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg px-3 py-2">
            <Boxes className="w-4 h-4 text-[var(--accent)]" />
            <span>
              <strong className="text-[var(--t1)]">{poles.length}</strong> pôle{poles.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {error && !loading && (
          <div className="mx-5 mt-4 px-4 py-2.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-sm">
            {error}
          </div>
        )}

        {/* Tableau */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
            <span className="text-sm">Chargement des pôles...</span>
          </div>
        ) : pagePoles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
            <Building2 className="w-8 h-8 text-[var(--t3)]" />
            <span className="text-sm">
              {searchTerm ? 'Aucun pôle ne correspond à votre recherche.' : 'Aucun pôle enregistré.'}
            </span>
            {!searchTerm && (
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-2 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Créer le premier pôle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider bg-[var(--panel-deep)]">
                  <th className="py-3 px-5">Nom du pôle</th>
                  <th className="py-3 px-5">Description</th>
                  <th className="py-3 px-5">Date d'ajout</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-sm">
                {pagePoles.map((pole) => (
                  <tr key={pole.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-[var(--accent)] shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-[var(--t1)]">{pole.nom}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[var(--t3)] text-xs max-w-[320px]">
                      {pole.description || (
                        <span className="text-[var(--t3)] italic opacity-70">Aucune description</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-[var(--t3)] text-xs whitespace-nowrap">
                      {pole.createdAt ? formatDateShort(pole.createdAt) : '-'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button className="text-[var(--t3)] hover:text-[var(--t1)] p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer">
                        <MoreVertical className="w-4 h-4 ml-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredPoles.length > 0 && (
          <div className="flex items-center justify-between mt-4 py-4 px-5 border-t border-[var(--line)] text-xs text-[var(--t3)]">
            <span>
              Affichage de{' '}
              <span className="font-bold text-[var(--t1)]">{(safePage - 1) * PAGE_SIZE + 1}</span> à{' '}
              <span className="font-bold text-[var(--t1)]">{Math.min(safePage * PAGE_SIZE, filteredPoles.length)}</span> sur{' '}
              <span className="font-bold text-[var(--t1)]">{filteredPoles.length}</span> pôles
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg bg-[var(--panel-deep)] border border-[var(--line)] hover:bg-[var(--surface-hover)] text-[var(--t3)] hover:text-[var(--t1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[var(--t3)]">
                Page <span className="font-bold text-[var(--t1)]">{safePage}</span> / {totalPages}
              </span>
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
