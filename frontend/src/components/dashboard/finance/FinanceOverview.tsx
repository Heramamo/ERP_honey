import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchRevenus } from '../../../store/slices/revenuSlice';
import { fetchCharges } from '../../../store/slices/chargeSlice';
import { fetchPoles } from '../../../store/slices/poleSlice';
import { formatAr } from '../../../utils/finance';
import { formatDateShort } from '../../../const/date';
import { StatCard } from '../StatCard';

interface RecentOperation {
  id: string;
  label: string;
  pole: string;
  amount: number;
  date: string;
  type: 'revenu' | 'charge';
}

export const FinanceOverview: React.FC<{ refreshKey?: number }> = ({ refreshKey = 0 }) => {
  const dispatch = useAppDispatch();
  const revenus = useAppSelector((state) => state.revenus.revenus);
  const charges = useAppSelector((state) => state.charges.charges);
  const poles = useAppSelector((state) => state.poles.poles);

  useEffect(() => {
    dispatch(fetchRevenus());
    dispatch(fetchCharges());
    dispatch(fetchPoles());
  }, [dispatch, refreshKey]);

  const poleName = (id: number) => poles.find((p) => p.id === id)?.nom ?? `Pôle ${id}`;

  const totalRevenus = revenus.reduce((s, r) => s + r.montant, 0);
  const totalCharges = charges.reduce((s, c) => s + c.montant, 0);
  const beneficeNet = totalRevenus - totalCharges;

  const operations: RecentOperation[] = [
    ...revenus.map((r) => ({
      id: `r-${r.id}`,
      label: r.libelle,
      pole: poleName(r.idPole),
      amount: r.montant,
      date: r.date,
      type: 'revenu' as const,
    })),
    ...charges.map((c) => ({
      id: `c-${c.id}`,
      label: c.libelle,
      pole: poleName(c.idPole),
      amount: c.montant,
      date: c.date,
      type: 'charge' as const,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total revenus"
          value={formatAr(totalRevenus)}
          subtitle={`${revenus.length} recette${revenus.length > 1 ? 's' : ''}`}
          icon={<TrendingUp size={14} />}
          glowColor="emerald"
        />
        <StatCard
          title="Total charges"
          value={formatAr(totalCharges)}
          subtitle={`${charges.length} charge${charges.length > 1 ? 's' : ''}`}
          icon={<TrendingDown size={14} />}
          glowColor="blue"
        />
        <StatCard
          title="Bénéfice net"
          value={formatAr(beneficeNet)}
          subtitle="Revenus - Charges"
          icon={<DollarSign size={14} />}
          glowColor="amber"
        />
      </div>

      {/* Recent operations */}
      <div className="bg-[var(--panel)] rounded-lg border border-[var(--line)] p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-[var(--t1)]">Opérations récentes</h3>
        </div>
        {operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-1.5 text-[var(--t3)]">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Aucune opération enregistrée.</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {operations.map((item) => (
              <div key={item.id} className="flex justify-between items-center px-3 py-2.5 rounded-md bg-[var(--panel-deep)] border border-[var(--line)]">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--t1)] truncate">{item.label}</p>
                  <p className="text-[11px] text-[var(--t3)]">{item.pole} · {formatDateShort(item.date)}</p>
                </div>
                <span className={`text-sm font-mono font-semibold tabular-nums shrink-0 ml-3 ${item.type === 'revenu' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {item.type === 'revenu' ? '+' : '-'}{formatAr(item.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceOverview;
