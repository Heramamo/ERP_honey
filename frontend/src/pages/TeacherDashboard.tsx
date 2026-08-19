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
import { useAppDispatch } from '../store/hooks';
import { fetchMySaisie } from '../store/slices/saisieSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const TeacherDashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchMySaisie());
  }, [dispatch]);
  const saisies = useSelector((state:RootState)=>state.saisies.saisies)
  console.log(saisies)
  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full font-sans text-slate-100">
      
      {/* ==================== 1. CARTES KPI BRILLANTES & HARMONISÉES ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 : Bleu (Temps) */}
        <StatCard
          title="Heures Effectuées"
          value="32 h"
          subtitle="Cumul des heures du mois"
          icon={<Clock size={16} />}
          glowColor="blue"
        />

        {/* KPI 2 : Ambre / Doré (Bonus) */}
        <StatCard
          title="Heures Supplémentaires"
          value="4 h"
          subtitle="Cumul des heures majorées"
          icon={<Clock3 size={16} />}
          glowColor="amber"
        />

        {/* KPI 3 : Émeraude / Vert (Argent) */}
        <StatCard
          title="Estimation du Salaire"
          value={
            <div className="flex items-baseline gap-1">
              <span>450 000</span>
              <span className="text-xl font-bold text-emerald-400">Ar</span>
            </div>
          }
          subtitle="Montant brut calculé"
          icon={<Banknote size={16} />}
          glowColor="emerald"
        />

        {/* KPI 4 : Violet Néon (Nouveau design Amélioré) */}
        <StatCard
          title="Statut de la Paie"
          glowColor="purple"
          icon={<CalendarCheck size={16} />}
          rightIndicator={<StatusBadge status="En attente" showDot />}
          value={
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-white tracking-tight">
                Août 2026
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
        <LastEntryCard />
        <TimeDistributionChart />
      </div>

      {/* ==================== 3. TABLEAUX HISTORIQUES ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTimesheetsTable />
        <PayrollHistoryTable />
      </div>

    </div>
  );
};

export default TeacherDashboard;