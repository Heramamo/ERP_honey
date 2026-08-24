import React, { useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Clock, 
  Building2, 
  ArrowUpRight,
  DollarSign,
  BarChart3,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Composants globaux réutilisables
import { StatCard } from '../components/dashboard/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import type { DataColumn } from '../components/ui/DataTable';
import { chartAxis, chartGridStroke, chartTooltipStyle } from '../components/dashboard/chartTheme';
import { useAppDispatch } from '../store/hooks';
import { fetchAllTeachers } from '../store/slices/teacherSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

// 1. Données Évolution Temporelle (Revenus vs Dépenses)
const progressionData = [
  { mois: 'Jan', revenus: 28, depenses: 14 },
  { mois: 'Fév', revenus: 32, depenses: 16 },
  { mois: 'Mar', revenus: 35, depenses: 15 },
  { mois: 'Avr', revenus: 40, depenses: 18 },
  { mois: 'Mai', revenus: 38, depenses: 17 },
  { mois: 'Juin', revenus: 42, depenses: 19 },
  { mois: 'Juil', revenus: 45, depenses: 20 },
  { mois: 'Août', revenus: 48, depenses: 18.45 },
];

// 2. Données Comparatif Revenus vs Charges PAR PÔLE
const polePerformanceData = [
  { pole: 'Pôle IT', revenus: 21.6, charges: 8.3 },
  { pole: 'Formation', revenus: 14.4, charges: 5.5 },
  { pole: 'Événement', revenus: 7.2, charges: 2.8 },
  { pole: 'Tourisme', revenus: 4.8, charges: 1.85 },
];

// 3. Données Répartition Masse Salariale - Palette Tripartite Harmonisée
const budgetDistributionData = [
  { name: 'Pôle IT', value: 45, color: '#3b82f6' },       // Bleu Institutionnel
  { name: 'Formation', value: 30, color: '#14b8a6' },    // Teal Émeraude
  { name: 'Événementiel', value: 15, color: '#f59e0b' }, // Or / Miel Chaud
  { name: 'Tourisme', value: 10, color: '#38bdf8' },     // Bleu Ciel Accent
];

// 4. Demandes Récentes (Feuilles de temps à valider)
interface RecentRequest {
  id: string;
  enseignant: string;
  detail: string;
  pole: string;
  poleClass: string;
  statut: 'Validé' | 'En attente';
}

const recentRequests: RecentRequest[] = [
  { id: '1', enseignant: 'Rakotoarisoa J.', detail: '12/08 • 5.5h', pole: 'IT', poleClass: 'text-blue-400', statut: 'En attente' },
  { id: '2', enseignant: 'Ramanantsoa M.', detail: '11/08 • 4.0h', pole: 'Form.', poleClass: 'text-teal-400', statut: 'Validé' },
  { id: '3', enseignant: 'Andriamihaja H.', detail: '10/08 • 6.0h', pole: 'Évén.', poleClass: 'text-amber-400', statut: 'Validé' },
];

const requestColumns: DataColumn<RecentRequest>[] = [
  {
    header: 'ENSEIGNANT',
    render: (row) => (
      <>
        <span className="font-semibold text-[var(--t1)]">{row.enseignant}</span>
        <span className="block text-[10px] text-[var(--t3)] font-normal">{row.detail}</span>
      </>
    ),
  },
  {
    header: 'PÔLE',
    align: 'center',
    render: (row) => <span className={`font-bold text-[11px] ${row.poleClass}`}>{row.pole}</span>,
  },
  {
    header: 'STATUT',
    align: 'right',
    render: (row) => <StatusBadge status={row.statut} showDot />,
  },
];

// Légende couleur commune aux graphiques (Revenus vs Dépenses)
const RevenueExpenseLegend: React.FC = () => (
  <div className="flex items-center gap-4 text-xs font-medium">
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm bg-teal-500 inline-block" />
      <span className="text-[var(--t2)]">Revenus</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
      <span className="text-[var(--t2)]">Dépenses</span>
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  useEffect(()=>{
    dispatch(fetchAllTeachers())
  },[dispatch])
  const teachers = useSelector((state:RootState)=>state.teachers.enseignants)
  console.log(teachers)
  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full font-sans text-[var(--t1)]">
      
      {/* ==================== 1. CARTES KPI HARMONISÉES ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 : Teal (Revenus Globaux / Entrées) */}
        <StatCard
          title="Revenus Globaux"
          value={
            <div className="flex items-baseline gap-1">
              <span>48 000 000</span>
              <span className="text-xl font-bold text-teal-400">Ar</span>
            </div>
          }
          subtitle="Projections encaissées d'Août"
          icon={<TrendingUp size={16} className="text-teal-400" />}
          glowColor="teal"
          rightIndicator={
            <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +12%
            </span>
          }
        />

        {/* KPI 2 : Bleu Entreprise (Dépenses / Charges) */}
        <StatCard
          title="Dépenses Globales"
          value={
            <div className="flex items-baseline gap-1">
              <span>18 450 000</span>
              <span className="text-xl font-bold text-blue-400">Ar</span>
            </div>
          }
          subtitle="Masse salariale & fonctionnement"
          icon={<TrendingDown size={16} className="text-blue-400" />}
          glowColor="blue"
        />

        {/* KPI 3 : Or / Miel Chaud (Bénéfice Net / Marge) */}
        <StatCard
          title="Bénéfice Net Estimé"
          value={
            <div className="flex items-baseline gap-1">
              <span className="text-amber-100">29 550 000</span>
              <span className="text-xl font-bold text-amber-400">Ar</span>
            </div>
          }
          subtitle="Marge nette opérationnelle"
          icon={<DollarSign size={16} className="text-amber-400" />}
          glowColor="amber"
        />

        {/* KPI 4 : Miel / Ambre (Paies en Attente) */}
        <StatCard
          title="Paies en Attente"
          value={
            <div className="flex items-baseline gap-1">
              <span>4 500 000</span>
              <span className="text-xl font-bold text-amber-400">Ar</span>
            </div>
          }
          subtitle="6 fiches de paie à valider"
          icon={<Clock size={16} className="text-amber-400" />}
          glowColor="amber"
          rightIndicator={<StatusBadge status="En attente" showDot />}
        />

      </div>

      {/* ==================== 2. GRAPHIQUES - RANGÉE 1 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graphique 1 : Progression Financière Mensuelle */}
        <Card className="lg:col-span-2 justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
                <Wallet size={16} className="text-blue-400" />
                Graphe de Progression Financière
              </h3>
              <p className="text-xs text-[var(--t3)] mt-0.5">Évolution comparative des revenus et charges (en M Ar)</p>
            </div>
            <RevenueExpenseLegend />
          </div>

          <div className="h-60 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="mois" {...chartAxis} />
                <YAxis {...chartAxis} unit="M" />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}M Ar`, '']} />
                <Area type="monotone" dataKey="revenus" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenus)" name="Revenus" />
                <Area type="monotone" dataKey="depenses" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDepenses)" name="Dépenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Graphique 2 : Pie Chart Ventilation du Budget */}
        <Card className="justify-between">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
              <Building2 size={16} className="text-amber-400" />
              Ventilation Masse Salariale
            </h3>
            <span className="text-[11px] text-[var(--t3)] font-medium">Par Pôle</span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetDistributionData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {budgetDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, 'Part']} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute text-center">
              <span className="text-xl font-black text-amber-400 block leading-none">100%</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--t3)] block mt-1">VENTILATION</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-3 border-t border-[var(--border-subtle)]">
            {budgetDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                <span className="text-[var(--t2)] text-[11px]">{item.name} : <strong className="text-[var(--t1)]">{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* ==================== 3. GRAPHIQUES - RANGÉE 2 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graphique 3 : BARCHART Revenus vs Charges PAR PÔLE */}
        <Card className="lg:col-span-2 justify-between">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
                <BarChart3 size={16} className="text-teal-400" />
                Revenus vs Charges par Pôle
              </h3>
              <p className="text-xs text-[var(--t3)] mt-0.5">Comparatif de rentabilité brute par activité (en Millions Ar)</p>
            </div>
            <RevenueExpenseLegend />
          </div>

          <div className="h-60 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={polePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="pole" {...chartAxis} />
                <YAxis {...chartAxis} unit="M" />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}M Ar`, '']} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                <Bar dataKey="revenus" fill="#14b8a6" radius={[6, 6, 0, 0]} barSize={22} name="Revenus" />
                <Bar dataKey="charges" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={22} name="Charges" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tableau Compact : Demandes Récentes */}
        <Card className="justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
                <Layers size={16} className="text-amber-400" />
                Demandes Récentes
              </h3>
              <button className="text-[11px] text-blue-400 hover:text-blue-300 transition font-semibold cursor-pointer">
                Voir tout →
              </button>
            </div>

            <DataTable columns={requestColumns} data={recentRequests} rowKey={(row) => row.id} />
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] text-center mt-4">
            <span className="text-[11px] text-[var(--t3)]">Total : <strong className="text-blue-400">15.5 heures</strong> en cours de suivi</span>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default AdminDashboard;
