import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';
import { fetchAllTeachers } from '../../../store/slices/teacherSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { formatDateShort } from '../../../const/date';
import { CreateTeacherModal } from './CreateTeacherModal';
import { StatusBadge } from '../../common/StatusBadge';

export type TeacherStatus = 'Permanent' | 'Vacataire' | 'Prestataire';

interface Teacher {
  id: string;
  name: string;
  email: string;
  tauxHoraire: number;
  statutEnseignant: TeacherStatus;
  createdAt: string;
}

interface TeachersTableProps {
  role?: 'admin' | 'rh' | 'enseignant';
  allowedRoles?: Role[];
}

const PAGE_SIZE = 5;

export const TeachersTable: React.FC<TeachersTableProps> = ({ role = 'admin', allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { enseignants, loading, error } = useAppSelector((state) => state.teachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  const isHrOrAdmin = role === 'admin' || role === 'rh';

  const teachers: Teacher[] = enseignants.map((e) => {
    const prenom = e.utilisateur?.prenom ?? '';
    const nom = e.utilisateur?.nom ?? '';
    const name = `${prenom} ${nom}`.trim() || e.utilisateur?.email?.split('@')[0] || `Enseignant ${e.id}`;
    return {
      id: String(e.id),
      name,
      email: e.utilisateur?.email ?? '',
      tauxHoraire: e.tauxHoraireBase,
      statutEnseignant: (e.statut as TeacherStatus) || 'Prestataire',
      createdAt: formatDateShort(e.createdAt),
    };
  });

  const filteredTeachers = teachers.filter((teacher) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      teacher.name.toLowerCase().includes(term) ||
      teacher.email.toLowerCase().includes(term) ||
      teacher.statutEnseignant.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageTeachers = filteredTeachers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const content = (
    <div className="w-full h-full p-6 md:p-8 font-sans text-[var(--t1)] flex flex-col min-h-0">
      <div className="flex items-center justify-between gap-4 mb-5 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--t3)]" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, statut..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[var(--panel)] border border-[var(--line)] rounded-md pl-9 pr-3 py-2 text-sm text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-colors"
          />
        </div>

        {isHrOrAdmin && (
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 text-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Nouvel enseignant
          </button>
        )}
      </div>

      {error && !loading && (
        <div className="mb-5 px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs shrink-0">
          {error}
        </div>
      )}

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2.5 text-[var(--t3)]">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
            <span className="text-xs">Chargement des enseignants...</span>
          </div>
        ) : pageTeachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--t3)]">
            <span className="text-xs">Aucun enseignant trouvé.</span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto scroll-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] tracking-wider uppercase bg-[var(--panel-deep)]">
                <th className="py-3 px-5">Enseignant</th>
                {isHrOrAdmin && <th className="py-3 px-5">Statut</th>}
                <th className="py-3 px-5">Taux horaire</th>
                <th className="py-3 px-5">Date d'ajout</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-sm">
              {pageTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-[var(--chip)]/50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-[var(--chip)] border border-[var(--line)] flex items-center justify-center text-[var(--t2)] font-semibold text-xs">
                        {teacher.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--t1)]">{teacher.name}</div>
                        <div className="text-[11px] text-[var(--t3)] font-mono">{teacher.email}</div>
                      </div>
                    </div>
                  </td>

                  {isHrOrAdmin && (
                    <td className="py-3 px-5">
                      <StatusBadge status={teacher.statutEnseignant} />
                    </td>
                  )}

                  <td className="py-3 px-5 font-medium text-[var(--t2)] font-mono tabular-nums">
                    {teacher.tauxHoraire.toLocaleString('fr-FR')} Ar/h
                  </td>

                  <td className="py-3 px-5 text-[var(--t3)] text-xs">
                    {teacher.createdAt}
                  </td>

                  <td className="py-3 px-5 text-right">
                    <button className="text-[var(--t3)] hover:text-[var(--t2)] p-1.5 rounded-md hover:bg-[var(--chip)] transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        {!loading && filteredTeachers.length > 0 && (
          <div className="p-3.5 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--t3)] shrink-0">
            <div>
              Affichage de{' '}
              <span className="font-medium text-[var(--t2)] font-mono tabular-nums">{(safePage - 1) * PAGE_SIZE + 1}</span> à{' '}
              <span className="font-medium text-[var(--t2)] font-mono tabular-nums">{Math.min(safePage * PAGE_SIZE, filteredTeachers.length)}</span> sur{' '}
              <span className="font-medium text-[var(--t2)] font-mono tabular-nums">{filteredTeachers.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-md border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t3)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[var(--t3)]">
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-md border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t3)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateTeacherModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default TeachersTable;
