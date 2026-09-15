import React, { useEffect, useState } from 'react';
import { Loader2, Inbox, Plus, FileDown } from 'lucide-react';
import RoleGuard from '../components/RoleGuard';
import type { Role } from '../types/auth';
import type { PaiePayload } from '../types/paie';
import type { SaisiePayload } from '../types/saisieFeuille';
import { fetchAllPaies, updateStatutPaie, clearError as clearPaieError } from '../store/slices/paieSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { GeneratePaieModal } from '../components/dashboard/hr/GeneratePaieModal';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatNumber } from '../utils/finance';
import { generateFichePaiePdf } from '../utils/fichePaiePdf';
import { downloadBlob } from '../utils/export';
import { saisieFeuilleService } from '../service/saisieFeuille.service';

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

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case 'PAYE': return 'Payé';
    case 'EN_ATTENTE': return 'En attente';
    default: return statut;
  }
};

const detailsFromSaisies = (paie: PaiePayload, saisies: SaisiePayload[]) => {
  const [year, month] = paie.mois.split('-');
  const validated = saisies.filter((s) => {
    const datePrefix = String(s.date).slice(0, 10);
    return (
      s.statut === 'VALIDE' &&
      s.enseignantId === paie.enseignantId &&
      datePrefix.startsWith(`${year}-${month}`)
    );
  });

  const taux = paie.enseignant?.tauxHoraireBase ?? 0;
  const heures = validated.reduce((acc, s) => acc + s.heuresEffectuees, 0);
  const heuresSupp = validated.reduce((acc, s) => acc + s.heuresSupp, 0);
  const COEFF = 1.25;
  const tauxSupp = taux * COEFF;

  const lignes = [
    { designation: 'Heures normales', heures, taux, montant: heures * taux },
    { designation: 'Heures supplémentaires (×1,25)', heures: heuresSupp, taux: tauxSupp, montant: heuresSupp * tauxSupp },
  ];
  const brut = lignes.reduce((acc, l) => acc + l.montant, 0);

  return { lignes, brut };
};

export const HrPaiePage: React.FC<HrPaiePageProps> = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { all: paies, loading, error } = useAppSelector((state) => state.paie);
  const [moisFilter, setMoisFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingId, setGeneratingId] = useState<number | null>(null);

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

  const handleGenerateFiche = async (paie: PaiePayload) => {
    setGeneratingId(paie.id);
    try {
      const saisies = await saisieFeuilleService.getAll();
      const { lignes, brut } = detailsFromSaisies(paie, saisies);
      const utilisateur = paie.enseignant?.utilisateur;
      const blob = await generateFichePaiePdf({
        paieId: paie.id,
        mois: paie.mois,
        date: paie.date,
        statut: paie.statutpaie,
        nom: utilisateur?.nom ?? '—',
        prenom: utilisateur?.prenom ?? '—',
        email: utilisateur?.email ?? '—',
        tauxHoraire: paie.enseignant?.tauxHoraireBase ?? 0,
        lignes,
        brut,
        netAPayer: paie.totalSalaire,
      });
      downloadBlob(blob, `fiche-de-paie-${paie.id}-${paie.mois}.pdf`);
    } finally {
      setGeneratingId(null);
    }
  };

  const content = (
    <div className="w-full h-full text-[var(--t1)] font-sans p-6 md:p-8 flex flex-col min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 shrink-0">
        <h1 className="text-lg font-semibold tracking-tight">Gestion de la paie</h1>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={moisFilter}
            onChange={(e) => setMoisFilter(e.target.value)}
            placeholder="Filtrer par mois"
            className="bg-[var(--panel-deep)] border border-[var(--line)] rounded-md px-3 py-2 text-sm text-[var(--t2)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-colors"
          />
          {moisFilter && (
            <button
              onClick={() => setMoisFilter('')}
              className="text-xs font-medium text-[var(--t3)] hover:text-[var(--t1)] transition-colors cursor-pointer"
            >
              Réinitialiser
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 text-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Générer une fiche
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-3 py-2 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-line)] text-[var(--danger)] text-xs shrink-0">
          {error}
        </div>
      )}

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2.5 text-[var(--t3)]">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
            <span className="text-xs">Chargement des fiches de paie...</span>
          </div>
        ) : paies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--t3)]">
            <Inbox className="w-6 h-6" />
            <span className="text-xs">Aucune fiche de paie pour le moment.</span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto scroll-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] tracking-wider uppercase bg-[var(--panel-deep)]">
                <th className="py-3 px-5">Enseignant</th>
                <th className="py-3 px-5">Période</th>
                <th className="py-3 px-5">Montant total</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-sm">
              {paies.map((paie: PaiePayload) => (
                <tr key={paie.id} className="hover:bg-[var(--chip)]/50 transition-colors">
                  <td className="py-3 px-5 font-medium text-[var(--t1)]">
                    {paie.enseignant
                      ? `${paie.enseignant.utilisateur.nom} ${paie.enseignant.utilisateur.prenom}`
                      : `Enseignant #${paie.enseignantId}`}
                    {paie.enseignant && (
                      <span className="block text-[11px] font-normal text-[var(--t3)]">{paie.enseignant.utilisateur.email}</span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-[var(--t3)] text-xs">{formatMois(paie.mois)}</td>
                  <td className="py-3 px-5 font-medium text-[var(--success)] font-mono tabular-nums">
                    {formatNumber(paie.totalSalaire)} Ar
                  </td>
                  <td className="py-3 px-5">
                    <StatusBadge status={getStatutLabel(paie.statutpaie)} />
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateFiche(paie)}
                        title="Générer la fiche de paie"
                        className="inline-flex items-center justify-center p-2 rounded-md border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {generatingId === paie.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                        ) : (
                          <FileDown className="w-4 h-4 text-[var(--accent)]" />
                        )}
                      </button>
                      {paie.statutpaie === 'EN_ATTENTE' ? (
                        <button
                          onClick={() => handleMarkPaid(paie.id)}
                          className="px-2.5 py-1 rounded-md bg-[var(--success-bg)] border border-[var(--success-line)] hover:brightness-95 text-[var(--success)] text-xs font-medium transition-colors cursor-pointer"
                        >
                          Marquer payé
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--t3)]">Payé</span>
                      )}
                    </div>
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
