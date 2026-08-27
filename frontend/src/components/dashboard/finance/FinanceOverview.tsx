import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchRevenus } from '../../../store/slices/revenuSlice';
import { fetchCharges } from '../../../store/slices/chargeSlice';
import { fetchPoles } from '../../../store/slices/poleSlice';
import { formatAr } from '../../../utils/finance';
import { formatDateShort } from '../../../const/date';

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
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Total Revenus</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatAr(totalRevenus)}</p>
          <span className="text-xs text-gray-500 mt-2 inline-block">{revenus.length} recette{revenus.length > 1 ? 's' : ''}</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Total Charges</span>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatAr(totalCharges)}</p>
          <span className="text-xs text-gray-500 mt-2 inline-block">{charges.length} charge{charges.length > 1 ? 's' : ''}</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Bénéfice Net Consolidé</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${beneficeNet >= 0 ? 'text-amber-500' : 'text-rose-500'}`}>{formatAr(beneficeNet)}</p>
          <span className="text-xs text-gray-500 mt-2 inline-block">Revenus - Charges</span>
        </div>
      </div>

      {/* Mini-Tableau des Dernières Transactions */}
      <div className="bg-[#111827] rounded-xl border border-gray-800 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Opérations Récentes</h3>
        </div>
        {operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
            <TrendingUp className="w-8 h-8 text-gray-600" />
            <span className="text-sm">Aucune opération enregistrée.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {operations.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-[#161B26] rounded-lg border border-gray-800/50">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.pole} • {formatDateShort(item.date)}</p>
                </div>
                <span className={`text-sm font-bold ${item.type === 'revenu' ? 'text-emerald-400' : 'text-rose-400'}`}>
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
