import React, { useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Building2,
  DollarSign,
  BarChart3,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { StatCard } from '../components/dashboard/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import type { DataColumn } from '../components/ui/DataTable';
import { chartAxis, chartGridStroke, chartTooltipStyle } from '../components/dashboard/chartTheme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRevenus } from '../store/slices/revenuSlice';
import { fetchCharges } from '../store/slices/chargeSlice';
import { fetchPoles } from '../store/slices/poleSlice';
import { fetchAllPaies } from '../store/slices/paieSlice';
import { fetchPendingSaisies } from '../store/slices/saisieSlice';
import { formatAr } from '../utils/finance';
import { formatDateShort } from '../const/date';

const POLE_CHART_COLORS = ['#14b8a6', '#3b82f6', '#d97706', '#0ea5e9', '#8b5cf6', '#ec4899', '#10b981'];

const recentRequestStatus = (statut: string) => {
  const s = String(statut).toUpperCase();
  return s === 'VALIDE' || s === 'PAYE' ? 'Validé' : 'En attente';
};

const RevenueExpenseLegend: React.FC = () => (
  <div className="flex items-center gap-4 text-xs font-medium">
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#14b8a6' }} />
      <span className="text-[var(--t2)]">Revenus</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#3b82f6' }} />
      <span className="text-[var(--t2)]">Dépenses</span>
    </div>
  </div>
);

interface RecentRequest {
  id: string;
  enseignant: string;
  detail: string;
  pole: string;
  poleClass: string;
  statut: 'Validé' | 'En attente';
}

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
    header: 'ACTIVITÉ',
    align: 'center',
    render: (row) => <span className={`font-bold text-[11px] ${row.poleClass}`}>{row.pole}</span>,
  },
  {
    header: 'STATUT',
    align: 'right',
    render: (row) => <StatusBadge status={row.statut} showDot />,
  },
];

export const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const revenus = useAppSelector((state) => state.revenus.revenus);
  const charges = useAppSelector((state) => state.charges.charges);
  const poles = useAppSelector((state) => state.poles.poles);
  const paies = useAppSelector((state) => state.paie.all);
  const pendingSaisies = useAppSelector((state) => state.saisies.pending);

  useEffect(() => {
    dispatch(fetchRevenus());
    dispatch(fetchCharges());
    dispatch(fetchPoles());
    dispatch(fetchAllPaies());
    dispatch(fetchPendingSaisies());
  }, [dispatch]);

  const poleName = (id: number) => poles.find((p) => p.id === id)?.nom ?? `Pôle ${id}`;

  const totalRevenus = useMemo(() => revenus.reduce((s, r) => s + r.montant, 0), [revenus]);
  const totalCharges = useMemo(() => charges.reduce((s, c) => s + c.montant, 0), [charges]);
  const beneficeNet = totalRevenus - totalCharges;

  const paiesEnAttente = useMemo(
    () => paies.filter((p) => String(p.statutpaie).toUpperCase() === 'EN_ATTENTE'),
    [paies]
  );
  const totalPaiesEnAttente = useMemo(
    () => paiesEnAttente.reduce((s, p) => s + (p.totalSalaire ?? 0), 0),
    [paiesEnAttente]
  );


  const poleChargeMap = useMemo(() => {
    const map = new Map<number, number>();
    charges.forEach((c) => {
      map.set(c.idPole, (map.get(c.idPole) ?? 0) + c.montant);
    });
    return map;
  }, [charges]);

  const totalPoleCharges = useMemo(
    () => [...poleChargeMap.values()].reduce((s, v) => s + v, 0),
    [poleChargeMap]
  );

  const budgetDistributionData = useMemo(
    () =>
      [...poleChargeMap.entries()].map(([idPole, value], idx) => ({
        name: poleName(idPole),
        value: totalPoleCharges > 0 ? Math.round((value / totalPoleCharges) * 1000) / 10 : 0,
        color: POLE_CHART_COLORS[idx % POLE_CHART_COLORS.length],
      })),
    [poleChargeMap, totalPoleCharges, poles]
  );

  const poleRevenuMap = useMemo(() => {
    const map = new Map<number, number>();
    revenus.forEach((r) => map.set(r.idPole, (map.get(r.idPole) ?? 0) + r.montant));
    return map;
  }, [revenus]);

  const polePerformanceData = useMemo(
    () =>
      poles.map((pole) => ({
        pole: pole.nom.length > 10 ? pole.nom.slice(0, 10) + '…' : pole.nom,
        revenus: Math.round((poleRevenuMap.get(pole.id) ?? 0) / 1_000_000 * 100) / 100,
        charges: Math.round((poleChargeMap.get(pole.id) ?? 0) / 1_000_000 * 100) / 100,
      })),
    [poles, poleRevenuMap, poleChargeMap]
  );

 
  const recentRequests: RecentRequest[] = useMemo(() => {
    const rows: RecentRequest[] = [];
    pendingSaisies.slice(0, 4).forEach((s) => {
      const enseignant = s.enseignant?.utilisateur
        ? `${s.enseignant.utilisateur.nom} ${s.enseignant.utilisateur.prenom}`
        : `Enseignant ${s.enseignantId}`;
      rows.push({
        id: `s-${s.id}`,
        enseignant,
        detail: `${formatDateShort(s.date)} • ${(s.heuresEffectuees ?? 0) + (s.heuresSupp ?? 0)}h`,
        pole: (s.typeActivite || 'Feuille de temps').slice(0, 12),
        poleClass: 'text-[var(--warning)]',
        statut: recentRequestStatus(s.statut as string),
      });
    });

    paiesEnAttente.slice(0, 4).forEach((p) => {
      const personne = p.enseignant?.utilisateur
        ? `${p.enseignant.utilisateur.nom} ${p.enseignant.utilisateur.prenom}`
        : `Enseignant ${p.enseignantId}`;
      rows.push({
        id: `p-${p.id}`,
        enseignant: personne,
        detail: `Paie ${p.mois || ''} • ${formatAr(p.totalSalaire)}`,
        pole: 'Paie',
        poleClass: 'text-[var(--info)]',
        statut: 'En attente',
      });
    });

    return rows.slice(0, 5);
  }, [pendingSaisies, paiesEnAttente]);

  const totalHeuresSuivi = useMemo(
    () => pendingSaisies.reduce((s, x) => s + (x.heuresEffectuees ?? 0) + (x.heuresSupp ?? 0), 0),
    [pendingSaisies]
  );

  const margeNetta = totalRevenus > 0 ? (beneficeNet / totalRevenus) * 100 : 0;

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full font-sans text-[var(--t1)]">
      {/* ==================== 1. CARTES KPI ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Revenus Globaux"
          value={
            <div className="flex items-baseline gap-1">
              <span>{formatAr(totalRevenus)}</span>
            </div>
          }
          subtitle={`${revenus.length} opération${revenus.length > 1 ? 's' : ''} enregistrée${revenus.length > 1 ? 's' : ''}`}
          icon={<TrendingUp size={16} />}
          glowColor="teal"
        />

        <StatCard
          title="Dépenses Globales"
          value={
            <div className="flex items-baseline gap-1">
              <span>{formatAr(totalCharges)}</span>
            </div>
          }
          subtitle={`${charges.length} charge${charges.length > 1 ? 's' : ''} enregistrée${charges.length > 1 ? 's' : ''}`}
          icon={<TrendingDown size={16} />}
          glowColor="blue"
        />

        <StatCard
          title="Bénéfice Net"
          value={
            <div className="flex items-baseline gap-1">
              <span>{formatAr(beneficeNet)}</span>
            </div>
          }
          subtitle={`Marge nette : ${margeNetta.toFixed(1)}%`}
          icon={<DollarSign size={16} />}
          glowColor="amber"
        />

        <StatCard
          title="Paies en Attente"
          value={
            <div className="flex items-baseline gap-1">
              <span>{formatAr(totalPaiesEnAttente)}</span>
            </div>
          }
          subtitle={`${paiesEnAttente.length} fiche${paiesEnAttente.length > 1 ? 's' : ''} de paie à valider`}
          icon={<Clock size={16} />}
          glowColor="amber"
          rightIndicator={paiesEnAttente.length > 0 ? <StatusBadge status="En attente" showDot /> : undefined}
        />
      </div>

    
      {/* ==================== 2. RÉPARTITION DES CHARGES + DEMANDES RÉCENTES ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 justify-between">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
              <Building2 size={16} className="text-[var(--accent)]" />
              Répartition des Charges
            </h3>
            <span className="text-[11px] text-[var(--t3)] font-medium">Par Pôle</span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-2">
            {budgetDistributionData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-[var(--t3)]">
                Aucune donnée.
              </div>
            ) : (
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
            )}

            <div className="absolute text-center">
              <span className="text-xl font-black text-[var(--accent)] block leading-none">
                {totalPoleCharges > 0 ? '100%' : '—'}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--t3)] block mt-1">RÉPARTITION</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-3 border-t border-[var(--line)]">
            {budgetDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                <span className="text-[var(--t2)] text-[11px]">{item.name} : <strong className="text-[var(--t1)]">{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
                <Layers size={16} className="text-[var(--accent)]" />
                Demandes Récentes
              </h3>
              <button className="text-[11px] text-[var(--accent)] hover:text-[var(--accent-strong)] transition font-semibold cursor-pointer">
                Voir tout →
              </button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="py-10 text-center text-sm text-[var(--t3)]">
                Aucune demande en attente.
              </div>
            ) : (
              <DataTable columns={requestColumns} data={recentRequests} rowKey={(row) => row.id} />
            )}
          </div>

          <div className="pt-3 border-t border-[var(--line)] text-center mt-4">
            <span className="text-[11px] text-[var(--t3)]">
              Total : <strong className="text-[var(--accent)]">{totalHeuresSuivi.toFixed(1)} heures</strong> en cours de suivi
            </span>
          </div>
        </Card>
      </div>

      {/* ==================== 3. REVENUS VS CHARGES PAR PÔLE (pleine largeur) ==================== */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="justify-between">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-sm font-bold text-[var(--t1)] flex items-center gap-2">
                <BarChart3 size={16} className="text-[var(--success)]" />
                Revenus vs Charges par Pôle
              </h3>
              <p className="text-xs text-[var(--t3)] mt-0.5">Comparatif de rentabilité brute par activité (en M Ar)</p>
            </div>
            <RevenueExpenseLegend />
          </div>

          <div className="h-60 w-full min-h-[220px]">
            {polePerformanceData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-[var(--t3)]">
                Aucun pôle enregistré.
              </div>
            ) : (
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
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
