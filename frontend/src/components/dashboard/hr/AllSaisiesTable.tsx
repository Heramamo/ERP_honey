import React, { useEffect } from 'react';
import { Loader2, Inbox } from 'lucide-react';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';
import type { SaisiePayload } from '../../../types/saisieFeuille';
import { fetchAllSaisies } from '../../../store/slices/saisieSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

interface AllSaisiesTableProps {
  allowedRoles?: Role[];
}

const STATUT_STYLES: Record<string, string> = {
  VALIDE: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
  REFUSE: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
  EN_ATTENTE: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
};

const getStatutStyle = (statut: SaisiePayload['statut']) =>
  STATUT_STYLES[String(statut)] ?? 'bg-slate-800 text-slate-300 border-slate-700';

const getStatutLabel = (statut: SaisiePayload['statut']) => {
  switch (String(statut)) {
    case 'VALIDE': return 'Validé';
    case 'REFUSE': return 'Refusé';
    case 'EN_ATTENTE': return 'En attente';
    default: return String(statut);
  }
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
};

export const AllSaisiesTable: React.FC<AllSaisiesTableProps> = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { all, loading, error } = useAppSelector((state) => state.saisies);

  useEffect(() => {
    dispatch(fetchAllSaisies());
  }, [dispatch]);

  const content = (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#12161f] border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-sm">Chargement des feuilles de saisie...</span>
          </div>
        ) : all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Inbox className="w-8 h-8 text-slate-600" />
            <span className="text-sm">Aucune feuille de saisie pour le moment.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#0e1118]">
                <th className="py-4 px-6">ENSEIGNANT</th>
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">TYPE D'ACTIVITÉ</th>
                <th className="py-4 px-6">HEURES DE BASE</th>
                <th className="py-4 px-6">HEURES SUPP.</th>
                <th className="py-4 px-6">STATUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {all.map((saisie: SaisiePayload) => (
                <tr key={saisie.id ?? `${saisie.enseignantId}-${saisie.date}`} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-100">
                    {saisie.enseignant
                      ? `${saisie.enseignant.utilisateur.nom} ${saisie.enseignant.utilisateur.prenom}`
                      : `Enseignant #${saisie.enseignantId}`}
                    {saisie.enseignant && (
                      <span className="block text-xs font-normal text-slate-500">{saisie.enseignant.utilisateur.email}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-xs">{formatDate(saisie.date)}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border bg-blue-950/60 text-blue-400 border-blue-800/50">
                      {saisie.typeActivite}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-slate-200">{saisie.heuresEffectuees} h</td>
                  <td className="py-4 px-6 font-mono font-semibold text-amber-400">{saisie.heuresSupp} h</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${getStatutStyle(saisie.statut)}`}>
                      {getStatutLabel(saisie.statut)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default AllSaisiesTable;
