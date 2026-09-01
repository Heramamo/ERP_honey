import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
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

const POLE_CHART_COLORS = ['#c8932a', '#8c6d3f', '#5b7a6d', '#7a6a9e', '#a8634a', '#6d7f8c', '#4b5563'];

const recentRequestStatus = (statut: string) => {
  const s = String(statut).toUpperCase();
  return s === 'VALIDE' || s === 'PAYE' ? 'Validé' : 'En attente';
};

const RevenueExpenseLegend: React.FC = () => (
  <div className="flex items-center gap-4 text-xs font-medium">
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#c8932a' }} />
      <span className="text-[var(--t2)]">Revenus</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#8c6d3f' }} />
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
    header: 'Enseignant',
    render: (row) => (
      <>
        <span className="font-medium text-[var(--t1)]">{row.enseignant}</span>
        <span className="block text-[10px] text-[var(--t3)]">{row.detail}</span>
      </>
    ),
  },
  {
    header: 'Activité',
    align: 'center',
    render: (row) => <span className={`font-medium text-[11px] ${row.poleClass}`}>{row.pole}</span>,
  },
  {
    header: 'Statut',
    align: 'right',
    render: (row) => <StatusBadge status={row.statut} showDot />,
  },
];

export const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    <div className="p-6 md:p-8 space-y-5 max-w-[1600px] mx-auto w-full font-sans text-[var(--t1)]">
      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenus"
          value={formatAr(totalRevenus)}
          subtitle={`${revenus.length} opération${revenus.length > 1 ? 's' : ''}`}
          icon={<TrendingUp size={14} />}
          glowColor="teal"
        />

        <StatCard
          title="Dépenses"
          value={formatAr(totalCharges)}
          subtitle={`${charges.length} charge${charges.length > 1 ? 's' : ''}`}
          icon={<TrendingDown size={14} />}
          glowColor="blue"
        />

        <StatCard
          title="Bénéfice net"
          value={formatAr(beneficeNet)}
          subtitle={`Marge : ${margeNetta.toFixed(1)}%`}
          icon={<DollarSign size={14} />}
          glowColor="amber"
        />

        <StatCard
          title="Paies en attente"
          value={formatAr(totalPaiesEnAttente)}
          subtitle={`${paiesEnAttente.length} fiche${paiesEnAttente.length > 1 ? 's' : ''} à valider`}
          icon={<Clock size={14} />}
          glowColor="amber"
          rightIndicator={paiesEnAttente.length > 0 ? <StatusBadge status="En attente" showDot /> : undefined}
        />
      </div>

      {/* Distribution + Recent requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 justify-between">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-[var(--t1)]">Répartition des charges</h3>
            <span className="text-[10px] text-[var(--t3)] font-medium uppercase tracking-wider">Par pôle</span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-1">
            {budgetDistributionData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--t3)]">
                Aucune donnée.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetDistributionData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
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
              <span className="text-lg font-semibold text-[var(--t1)] font-mono block leading-none tabular-nums">
                {totalPoleCharges > 0 ? '100%' : '—'}
              </span>
              <span className="text-[9px] uppercase font-medium tracking-wider text-[var(--t3)] block mt-0.5">Répartition</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs pt-3 border-t border-[var(--line)]">
            {budgetDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm inline-block shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[var(--t2)] text-[11px] truncate">{item.name} <span className="font-mono font-semibold text-[var(--t1)] tabular-nums">{item.value}%</span></span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-[var(--t1)]">Demandes récentes</h3>
              <button
                onClick={() => navigate('/dashboard/feuilles-de-saisie')}
                className="text-[11px] text-[var(--accent)] hover:text-[var(--accent-strong)] transition font-medium cursor-pointer"
              >
                Tout voir →
              </button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--t3)]">
                Aucune demande en attente.
              </div>
            ) : (
              <DataTable columns={requestColumns} data={recentRequests} rowKey={(row) => row.id} />
            )}
          </div>

          <div className="pt-3 border-t border-[var(--line)] text-center mt-3">
            <span className="text-[11px] text-[var(--t3)]">
              Total : <span className="font-mono font-semibold text-[var(--accent)] tabular-nums">{totalHeuresSuivi.toFixed(1)} h</span> en cours de suivi
            </span>
          </div>
        </Card>
      </div>

      {/* Revenue vs Expenses bar chart */}
      <Card className="justify-between">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--t1)]">Revenus vs charges par pôle</h3>
            <p className="text-xs text-[var(--t3)] mt-0.5">Rentabilité brute par activité (en M Ar)</p>
          </div>
          <RevenueExpenseLegend />
        </div>

        <div className="h-56 w-full min-h-[200px]">
          {polePerformanceData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[var(--t3)]">
              Aucun pôle enregistré.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={polePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="pole" {...chartAxis} />
                <YAxis {...chartAxis} unit="M" />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}M Ar`, '']} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                <Bar dataKey="revenus" fill="#c8932a" radius={[3, 3, 0, 0]} barSize={20} name="Revenus" />
                <Bar dataKey="charges" fill="#8c6d3f" radius={[3, 3, 0, 0]} barSize={20} name="Charges" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
