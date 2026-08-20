import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, Loader2, Users } from 'lucide-react';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';
import { fetchAllTeachers } from '../../../store/slices/teacherSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { formatDateShort } from '../../../const/date';

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

const getStatutBadgeStyle = (statut: TeacherStatus) => {
  switch (statut) {
    case 'Permanent': return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
    case 'Vacataire': return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
    case 'Prestataire': return 'bg-purple-950/60 text-purple-400 border-purple-800/50';
    default: return 'bg-slate-800 text-slate-300 border-slate-700';
  }
};

export const TeachersTable: React.FC<TeachersTableProps> = ({ role = 'admin', allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { enseignants, loading, error } = useAppSelector((state) => state.teachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  // Condition d'accès pour afficher le statut (RH & Admin uniquement)
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
    <>
      {/* Filtres & Recherche */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou statut..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#12161f] border border-slate-800/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {isHrOrAdmin && (
          <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-lg shadow-amber-500/10 cursor-pointer">
            <Plus className="w-4 h-4 stroke-[3]" />
            Nouvel Enseignant
          </button>
        )}
      </div>

      {error && !loading && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Tableau Répertoire */}
      <div className="bg-[#12161f] border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-sm">Chargement des enseignants...</span>
          </div>
        ) : pageTeachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Users className="w-8 h-8 text-slate-600" />
            <span className="text-sm">Aucun enseignant trouvé.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#0e1118]">
                <th className="py-4 px-6">ENSEIGNANT</th>
                {isHrOrAdmin && <th className="py-4 px-6">STATUT DE L'ENSEIGNANT</th>}
                <th className="py-4 px-6">TAUX HORAIRE</th>
                <th className="py-4 px-6">DATE D'AJOUT</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {pageTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* 1. Nom / Email */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                        {teacher.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">{teacher.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{teacher.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Statut (Visibilité RH / Admin uniquement) */}
                  {isHrOrAdmin && (
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${getStatutBadgeStyle(teacher.statutEnseignant)}`}>
                        {teacher.statutEnseignant}
                      </span>
                    </td>
                  )}

                  {/* 3. Taux horaire */}
                  <td className="py-4 px-6 font-semibold text-slate-200">
                    {teacher.tauxHoraire.toLocaleString('fr-FR')} Ar/h
                  </td>

                  {/* 4. Date d'ajout */}
                  <td className="py-4 px-6 text-slate-400 text-xs">
                    {teacher.createdAt}
                  </td>

                  {/* 5. Actions */}
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredTeachers.length > 0 && (
          <div className="p-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div>
              Affichage de{' '}
              <span className="font-bold text-slate-200">{(safePage - 1) * PAGE_SIZE + 1}</span> à{' '}
              <span className="font-bold text-slate-200">{Math.min(safePage * PAGE_SIZE, filteredTeachers.length)}</span> sur{' '}
              <span className="font-bold text-slate-200">{filteredTeachers.length}</span> enseignants
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
    </>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default TeachersTable;