import React, { useEffect } from 'react';
import { Clock, Clock3, Banknote, CalendarCheck } from 'lucide-react';

import { StatCard } from '../components/dashboard/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';

import { LastEntryCard } from '../components/dashboard/teacher/LastEntryCard';
import { TimeDistributionChart } from '../components/dashboard/teacher/TimeDistributionChart';
import { RecentTimesheetsTable } from '../components/dashboard/teacher/RecentTimesheetsTable';
import { PayrollHistoryTable } from '../components/dashboard/teacher/PayrollHistoryTable';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMySaisie } from '../store/slices/saisieSlice';
import { fetchMyProfile } from '../store/slices/enseignantSlice';
import type { SaisiePayload } from '../types/saisieFeuille';
import { formatNumber } from '../utils/finance';

const getRawStatut = (statut: SaisiePayload['statut']) => {
  return String(statut);
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
        montant: `${formatNumber((value.base + value.supp) * taux)} Ar`,
        statut: (value.allValidated ? 'Validé' : 'En attente') as 'Validé' | 'En attente',
      };
    })
    .sort((a, b) => b.periode.localeCompare(a.periode));

  const monthName = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const payStatus = monthSaisies.some((s) => getRawStatut(s.statut) !== 'VALIDE')
    ? 'En attente'
    : 'Validé';

  return (
    <div className="p-6 md:p-8 space-y-5 max-w-[1600px] mx-auto w-full font-sans text-[var(--t1)]">

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Heures effectuées"
          value={`${Math.round(totalBase * 10) / 10} h`}
          subtitle="Cumul du mois"
          icon={<Clock size={14} />}
          glowColor="blue"
        />

        <StatCard
          title="Heures supplémentaires"
          value={`${Math.round(totalSupp * 10) / 10} h`}
          subtitle="Cumul majoré"
          icon={<Clock3 size={14} />}
          glowColor="amber"
        />

        <StatCard
          title="Estimation salaire"
          value={
            taux > 0 ? (
              <span>{formatNumber(estimatedSalary)} <span className="text-base font-medium text-[var(--success)]">Ar</span></span>
            ) : (
              <span className="text-[var(--t3)]">N/A</span>
            )
          }
          subtitle="Montant brut calculé"
          icon={<Banknote size={14} />}
          glowColor="emerald"
        />

        <StatCard
          title="Statut paie"
          glowColor="purple"
          icon={<CalendarCheck size={14} />}
          rightIndicator={<StatusBadge status={payStatus} showDot />}
          value={
            <span className="text-base font-semibold text-[var(--t1)]">
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </span>
          }
          subtitle="Traitement RH prévu fin de mois"
        />

      </div>

      {/* Center section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LastEntryCard saisie={lastSaisie} />
        <TimeDistributionChart data={distribution} totalHours={totalBase} />
      </div>

      {/* History tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentTimesheetsTable saisies={saisies} />
        <PayrollHistoryTable rows={history} />
      </div>

    </div>
  );
};

export default TeacherDashboard;
