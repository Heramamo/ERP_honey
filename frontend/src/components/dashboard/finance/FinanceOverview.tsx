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
    <div className="space-y-6">
      {/* Cards KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenus"
          value={<span>{formatAr(totalRevenus)}</span>}
          subtitle={`${revenus.length} recette${revenus.length > 1 ? 's' : ''}`}
          icon={<TrendingUp size={16} />}
          glowColor="emerald"
        />
        <StatCard
          title="Total Charges"
          value={<span>{formatAr(totalCharges)}</span>}
          subtitle={`${charges.length} charge${charges.length > 1 ? 's' : ''}`}
          icon={<TrendingDown size={16} />}
          glowColor="blue"
        />
        <StatCard
          title="Bénéfice Net Consolidé"
          value={<span>{formatAr(beneficeNet)}</span>}
          subtitle="Revenus - Charges"
          icon={<DollarSign size={16} />}
          glowColor="amber"
        />
      </div>

      {/* Mini-Tableau des Dernières Transactions */}
      <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] p-5 shadow-[var(--shadow-raised)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-[var(--t1)]">Opérations récentes</h3>
        </div>
        {operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-[var(--t3)]">
            <TrendingUp className="w-8 h-8 text-[var(--t3)]" />
            <span className="text-sm">Aucune opération enregistrée.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {operations.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-[var(--panel-deep)] rounded-lg border border-[var(--line)]">
                <div>
                  <p className="text-sm font-medium text-[var(--t1)]">{item.label}</p>
                  <p className="text-xs text-[var(--t3)]">{item.pole} • {formatDateShort(item.date)}</p>
                </div>
                <span className={`text-sm font-semibold ${item.type === 'revenu' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {item.type === 'revenu' ? '+' : '-'} {formatAr(item.amount)}
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
