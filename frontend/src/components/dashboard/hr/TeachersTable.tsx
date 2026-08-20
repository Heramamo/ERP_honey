import React, { useState } from 'react';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';

export type TeacherStatus = 'Permanent' | 'Vacataire' | 'Prestataire';

interface Teacher {
  id: string;
  name: string;
  email: string;
  formation: string;
  tauxHoraire: number;
  statutEnseignant: TeacherStatus;
}

interface TeachersTableProps {
  role?: 'admin' | 'rh' | 'enseignant';
  allowedRoles?: Role[];
}

const MOCK_TEACHERS: Teacher[] = [
  { id: '1', name: 'Rakotoarisoa J.', email: 'rakoto@honey.mg', formation: 'INFORMATIQUE', tauxHoraire: 25000, statutEnseignant: 'Vacataire' },
  { id: '2', name: 'Ramanantsoa M.', email: 'm.ramana@honey.mg', formation: 'FRANÇAIS', tauxHoraire: 30000, statutEnseignant: 'Permanent' },
  { id: '3', name: 'Andriamihaja H.', email: 'h.andria@honey.mg', formation: 'ANGLAIS', tauxHoraire: 28000, statutEnseignant: 'Prestataire' },
  { id: '4', name: 'Rasoanaivo T.', email: 't.rasoa@honey.mg', formation: 'MANDARIN', tauxHoraire: 22000, statutEnseignant: 'Vacataire' },
  { id: '5', name: 'Müller K.', email: 'k.muller@honey.mg', formation: 'ALLEMAND', tauxHoraire: 32000, statutEnseignant: 'Permanent' },
];

export const TeachersTable: React.FC<TeachersTableProps> = ({ role = 'admin', allowedRoles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormation, setSelectedFormation] = useState('ALL');

  // Condition d'accès pour afficher le statut (RH & Admin uniquement)
  const isHrOrAdmin = role === 'admin' || role === 'rh';

  const getFormationBadgeStyle = (formation: string) => {
    switch (formation) {
      case 'INFORMATIQUE': return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
      case 'FRANÇAIS': return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
      case 'ANGLAIS': return 'bg-amber-950/60 text-amber-500 border-amber-800/50';
      case 'MANDARIN': return 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50';
      case 'ALLEMAND': return 'bg-orange-950/60 text-orange-400 border-orange-800/50';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatutBadgeStyle = (statut: TeacherStatus) => {
    switch (statut) {
      case 'Permanent': return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
      case 'Vacataire': return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
      case 'Prestataire': return 'bg-purple-950/60 text-purple-400 border-purple-800/50';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const content = (
    <>
      {/* Filtres & Recherche */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#12161f] border border-slate-800/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <select
            value={selectedFormation}
            onChange={(e) => setSelectedFormation(e.target.value)}
            className="bg-[#12161f] border border-slate-800/80 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="ALL">Toutes les formations</option>
            <option value="INFORMATIQUE">Informatique</option>
            <option value="FRANÇAIS">Français</option>
            <option value="ANGLAIS">Anglais</option>
            <option value="MANDARIN">Mandarin</option>
            <option value="ALLEMAND">Allemand</option>
          </select>
        </div>

        {isHrOrAdmin && (
          <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-lg shadow-amber-500/10">
            <Plus className="w-4 h-4 stroke-[3]" />
            Nouvel Enseignant
          </button>
        )}
      </div>

      {/* Tableau Répertoire */}
      <div className="bg-[#12161f] border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#0e1118]">
              <th className="py-4 px-6">ENSEIGNANT</th>
              {isHrOrAdmin && <th className="py-4 px-6">STATUT DE L'ENSEIGNANT</th>}
              <th className="py-4 px-6">FORMATION</th>
              <th className="py-4 px-6">TAUX HORAIRE</th>
              <th className="py-4 px-6 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {MOCK_TEACHERS.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-slate-800/30 transition-colors">
                {/* 1. Nom / Email */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                      {teacher.name.charAt(0)}
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

                {/* 3. Formation */}
                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border ${getFormationBadgeStyle(teacher.formation)}`}>
                    {teacher.formation}
                  </span>
                </td>

                {/* 4. Taux horaire */}
                <td className="py-4 px-6 font-semibold text-slate-200">
                  {teacher.tauxHoraire.toLocaleString('fr-FR')} Ar/h
                </td>

                {/* 5. Actions */}
                <td className="py-4 px-6 text-right">
                  <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Affichage de <span className="font-bold text-slate-200">1</span> à <span className="font-bold text-slate-200">5</span> sur <span className="font-bold text-slate-200">42</span> enseignants
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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