import React, { useEffect } from 'react';
import { Clock, Clock3, Banknote, CalendarCheck, Sparkles } from 'lucide-react';

// Composants globaux
import { StatCard } from '../components/dashboard/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';

// Sous-composants modulaires
import { LastEntryCard } from '../components/dashboard/teacher/LastEntryCard';
import { TimeDistributionChart } from '../components/dashboard/teacher/TimeDistributionChart';
import { RecentTimesheetsTable } from '../components/dashboard/teacher/RecentTimesheetsTable';
import { PayrollHistoryTable } from '../components/dashboard/teacher/PayrollHistoryTable';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMySaisie } from '../store/slices/saisieSlice';
import { fetchMyProfile } from '../store/slices/enseignantSlice';
import type { SaisiePayload } from '../types/saisieFeuille';

const getRawStatut = (statut: SaisiePayload['statut']) => {
  return typeof statut === 'string' ? statut : statut?.statut;
};

export const TeacherDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { saisies } = useAppSelector((state) => state.saisies);
  const { enseignant } = useAppSelector((state) => state.enseignant);

  useEffect(() => {
    dispatch(fetchMySaisie());
    dispatch(fetchMyProfile());
  }, [dispatch]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthSaisies = saisies.filter((s) => {
    const d = new Date(s.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalBase = monthSaisies.reduce((acc, s) => acc + (Number(s.heuresEffectuees) || 0), 0);
  const totalSupp = monthSaisies.reduce((acc, s) => acc + (Number(s.heuresSupp) || 0), 0);
  const taux = enseignant?.tauxHoraireBase ?? 0;
  const estimatedSalary = (totalBase + totalSupp) * taux;

  const lastSaisie = saisies
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const distMap = new Map<string, number>();
  monthSaisies.forEach((s) => {
    const key = s.typeActivite || 'Autre';
    distMap.set(key, (distMap.get(key) ?? 0) + (Number(s.heuresEffectuees) || 0));
  });
  const distribution = Array.from(distMap.entries()).map(([name, value]) => ({ name, value }));

  const monthMap = new Map<string, { base: number; supp: number; allValidated: boolean }>();
  saisies.forEach((s) => {
    const d = new Date(s.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const entry = monthMap.get(key) ?? { base: 0, supp: 0, allValidated: true };
    entry.base += Number(s.heuresEffectuees) || 0;
    entry.supp += Number(s.heuresSupp) || 0;
    if (getRawStatut(s.statut) !== 'VALIDE') entry.allValidated = false;
    monthMap.set(key, entry);
  });

  const history = Array.from(monthMap.entries())
    .map(([key, value], index) => {
      const [year, month] = key.split('-').map(Number);
      const label = new Date(year, month, 1).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      });
      return {
        id: String(index),
        periode: label.charAt(0).toUpperCase() + label.slice(1),
        totalHeures: `${Math.round((value.base + value.supp) * 10) / 10}h`,
        montant: `${((value.base + value.supp) * taux).toLocaleString('fr-FR')} Ar`,
        statut: (value.allValidated ? 'Validé' : 'En attente') as 'Validé' | 'En attente',
      };
    })
    .sort((a, b) => b.periode.localeCompare(a.periode));

  const monthName = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const payStatus = monthSaisies.some((s) => getRawStatut(s.statut) !== 'VALIDE')
    ? 'En attente'
    : 'Validé';

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full font-sans text-slate-100">

      {/* ==================== 1. CARTES KPI BRILLANTES & HARMONISÉES ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* KPI 1 : Bleu (Temps) */}
        <StatCard
          title="Heures Effectuées"
          value={`${Math.round(totalBase * 10) / 10} h`}
          subtitle="Cumul des heures du mois"
          icon={<Clock size={16} />}
          glowColor="blue"
        />

        {/* KPI 2 : Ambre / Doré (Bonus) */}
        <StatCard
          title="Heures Supplémentaires"
          value={`${Math.round(totalSupp * 10) / 10} h`}
          subtitle="Cumul des heures majorées"
          icon={<Clock3 size={16} />}
          glowColor="amber"
        />

        {/* KPI 3 : Émeraude / Vert (Argent) */}
        <StatCard
          title="Estimation du Salaire"
          value={
            taux > 0 ? (
              <div className="flex items-baseline gap-1">
                <span>{estimatedSalary.toLocaleString('fr-FR')}</span>
                <span className="text-xl font-bold text-emerald-400">Ar</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-slate-500">N/A</span>
            )
          }
          subtitle="Montant brut calculé"
          icon={<Banknote size={16} />}
          glowColor="emerald"
        />

        {/* KPI 4 : Violet Néon (Statut de la Paie) */}
        <StatCard
          title="Statut de la Paie"
          glowColor="purple"
          icon={<CalendarCheck size={16} />}
          rightIndicator={<StatusBadge status={payStatus} showDot />}
          value={
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-white tracking-tight">
                {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
              </span>
            </div>
          }
          subtitle={
            <span className="inline-flex items-center gap-1.5 text-purple-300/80 font-medium text-[11px]">
              <Sparkles size={12} className="text-purple-400" />
              Traitement RH prévu fin de mois
            </span>
          }
        />

      </div>

      {/* ==================== 2. SECTION CENTRALE ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LastEntryCard saisie={lastSaisie} />
        <TimeDistributionChart data={distribution} totalHours={totalBase} />
      </div>

      {/* ==================== 3. TABLEAUX HISTORIQUES ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTimesheetsTable saisies={saisies} />
        <PayrollHistoryTable rows={history} />
      </div>

    </div>
  );
};

export default TeacherDashboard;