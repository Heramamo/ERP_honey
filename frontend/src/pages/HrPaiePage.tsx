import React, { useEffect, useState } from 'react';
import { Loader2, Inbox, Plus } from 'lucide-react';
import RoleGuard from '../components/RoleGuard';
import type { Role } from '../types/auth';
import type { PaiePayload } from '../types/paie';
import { fetchAllPaies, updateStatutPaie, clearError as clearPaieError } from '../store/slices/paieSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { GeneratePaieModal } from '../components/dashboard/hr/GeneratePaieModal';

interface HrPaiePageProps {
  allowedRoles?: Role[];
}

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const formatMois = (mois: string) => {
  const [year, month] = mois.split('-');
  const label = MONTHS_FR[Number(month) - 1];
  return label ? `${label} ${year}` : mois;
};

const STATUT_STYLES: Record<string, string> = {
  PAYE: 'bg-[var(--positive)]/10 text-[var(--positive)] border-[var(--positive)]/25',
  EN_ATTENTE: 'bg-[var(--honey)]/10 text-[var(--honey)] border-[var(--honey)]/30',
};

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case 'PAYE': return 'Payé';
    case 'EN_ATTENTE': return 'En attente';
    default: return statut;
  }
};

export const HrPaiePage: React.FC<HrPaiePageProps> = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { all: paies, loading, error } = useAppSelector((state) => state.paie);
  const [moisFilter, setMoisFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPaies(moisFilter || undefined));
    return () => {
      dispatch(clearPaieError());
    };
  }, [dispatch, moisFilter]);

  const handleMarkPaid = (id: number | undefined) => {
    if (!id) return;
    dispatch(updateStatutPaie({ id, statutpaie: 'PAYE' }));
  };

  const content = (
    <div className="w-full h-full text-[var(--t1)] font-sans p-6 flex flex-col min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--t1)]">Gestion de la Paie</h1>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={moisFilter}
            onChange={(e) => setMoisFilter(e.target.value)}
            placeholder="Filtrer par mois"
            className="bg-[var(--panel-deep)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--t2)] focus:outline-none focus:border-[var(--honey)]/50 transition-colors [color-scheme:dark] cursor-pointer"
          />
          {moisFilter && (
            <button
              onClick={() => setMoisFilter('')}
              className="text-xs font-semibold text-[var(--t3)] hover:text-[var(--t1)] transition-colors cursor-pointer"
            >
              Réinitialiser
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-honey font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Générer une fiche
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/40 text-[var(--danger)] text-sm shrink-0">
          {error}
        </div>
      )}

      <div className="bg-[var(--panel)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-2xl flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--honey)]" />
            <span className="text-sm">Chargement des fiches de paie...</span>
          </div>
        ) : paies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
            <Inbox className="w-8 h-8 text-[var(--t3)]" />
            <span className="text-sm">Aucune fiche de paie pour le moment.</span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto scroll-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--t3)] tracking-wider uppercase bg-[var(--panel-deep)]">
                <th className="py-4 px-6">ENSEIGNANT</th>
                <th className="py-4 px-6">PÉRIODE</th>
                <th className="py-4 px-6">MONTANT TOTAL</th>
                <th className="py-4 px-6">STATUT</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
              {paies.map((paie: PaiePayload) => (
                <tr key={paie.id} className="hover:bg-[var(--chip)] transition-colors">
                  <td className="py-4 px-6 font-bold text-[var(--t1)]">
                    {paie.enseignant
                      ? `${paie.enseignant.utilisateur.nom} ${paie.enseignant.utilisateur.prenom}`
                      : `Enseignant #${paie.enseignantId}`}
                    {paie.enseignant && (
                      <span className="block text-xs font-normal text-[var(--t3)]">{paie.enseignant.utilisateur.email}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-[var(--t3)] text-xs">{formatMois(paie.mois)}</td>
                  <td className="py-4 px-6 font-semibold text-[var(--positive)]">
                    {paie.totalSalaire.toLocaleString('fr-FR')} Ar
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${STATUT_STYLES[paie.statutpaie] ?? 'bg-[var(--chip)] text-[var(--t2)] border-[var(--border-subtle)]'}`}>
                      {getStatutLabel(paie.statutpaie)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {paie.statutpaie === 'EN_ATTENTE' ? (
                      <button
                        onClick={() => handleMarkPaid(paie.id)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--positive)]/10 border border-[var(--positive)]/25 hover:bg-[var(--positive)]/20 text-[var(--positive)] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Marquer payé
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--t3)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <GeneratePaieModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default HrPaiePage;
