import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Info,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  Loader2,
  Calendar,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPoles } from '../../../store/slices/poleSlice';
import { fetchBilanPole } from '../../../store/slices/bilanSlice';
import { formatAr, getPoleBadgeStyle } from '../../../utils/finance';
import { formatMonthYear } from '../../../const/date';
import { StatCard } from '../StatCard';

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const PoleReportsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const poles = useAppSelector((state) => state.poles.poles);
  const bilans = useAppSelector((state) => state.bilans.bilans);
  const loading = useAppSelector((state) => state.bilans.loading);

  const [mois, setMois] = useState(currentMonth());

  useEffect(() => {
    dispatch(fetchPoles());
  }, [dispatch]);

  useEffect(() => {
    poles.forEach((pole) => dispatch(fetchBilanPole({ idPole: pole.id, mois })));
  }, [dispatch, poles, mois]);

  const totalRevenus = poles.reduce((s, p) => s + (bilans[p.id]?.totalRevenu ?? 0), 0);
  const totalCharges = poles.reduce((s, p) => s + (bilans[p.id]?.totalCharge ?? 0), 0);
  const beneficeNet = totalRevenus - totalCharges;
  const margeGlobale = totalRevenus > 0 ? (beneficeNet / totalRevenus) * 100 : 0;

  return (
    <div className="space-y-6 text-[var(--t1)]">
      {/* 1. Cartes KPI Consolidation Financière */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenus"
          value={formatAr(totalRevenus)}
          subtitle={formatMonthYear(mois)}
          icon={<TrendingUp size={16} />}
          glowColor="teal"
        />
        <StatCard
          title="Total Charges"
          value={formatAr(totalCharges)}
          subtitle="Charges consolidées"
          icon={<TrendingDown size={16} />}
          glowColor="rose"
        />
        <StatCard
          title="Bénéfice Net"
          value={<span className={beneficeNet >= 0 ? 'text-[var(--positive)]' : 'text-[var(--danger)]'}>{formatAr(beneficeNet)}</span>}
          subtitle={
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[var(--honey)]" />
              Marge nette globale : <strong>{margeGlobale.toFixed(1)}%</strong>
            </span>
          }
          icon={<Scale size={16} />}
          glowColor="honey"
        />
      </div>

      {/* Sélecteur de mois */}
      <div className="folio rounded-2xl border border-[var(--border-subtle)] bg-[var(--panel)] p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
              <input
                type="month"
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                className="field pl-9 pr-4 py-2 text-sm cursor-pointer"
              />
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--honey)]" />}
          </div>
          <div className="flex items-center gap-2 bg-[var(--panel-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-xs text-[var(--t3)] w-fit">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong className="text-[var(--t1)]">Bénéfice Net</strong> = Total Revenus - (Charges Fixes + Charges Variables)
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {poles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--t3)]">
              <FolderArchive className="w-8 h-8 text-[var(--t3)]" />
              <span className="text-sm">Aucun pôle enregistré.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider">
                  <th className="py-3 px-4 col-heat">Pôle d'activité</th>
                  <th className="py-3 px-4 text-right col-heat">Revenus Bruts (Ar)</th>
                  <th className="py-3 px-4 text-right col-heat">Charges Fixes (Ar)</th>
                  <th className="py-3 px-4 text-right col-heat">Charges Variables (Ar)</th>
                  <th className="py-3 px-4 text-right col-heat">Bénéfice Net (Ar)</th>
                  <th className="py-3 px-4 text-right col-heat">Marge Nette (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {poles.map((pole) => {
                  const bilan = bilans[pole.id];
                  const benefice = bilan ? bilan.beneficeNet : 0;
                  const marge = bilan && bilan.totalRevenu > 0 ? (bilan.beneficeNet / bilan.totalRevenu) * 100 : 0;
                  return (
                    <tr key={pole.id} className="hover:bg-[var(--chip)] transition-colors">
                      <td className="py-4 px-4 font-semibold text-[var(--t1)]">
                        <div className="flex items-center gap-3">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${getPoleBadgeStyle(pole.id)}`} />
                          <span>{pole.nom}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-[var(--t1)] font-medium tabular-nums">
                        {bilan ? formatAr(bilan.totalRevenu) : <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--t3)] inline" />}
                      </td>
                      <td className="py-4 px-4 text-right text-[var(--t1)] font-medium tabular-nums">
                        {bilan ? formatAr(bilan.totalChargesFixe) : '-'}
                      </td>
                      <td className="py-4 px-4 text-right text-[var(--t1)] font-medium tabular-nums">
                        {bilan ? formatAr(bilan.totalChargeVariable) : '-'}
                      </td>
                      <td className={`py-4 px-4 text-right font-bold tabular-nums ${benefice >= 0 ? 'text-[var(--positive)]' : 'text-[var(--danger)]'}`}>
                        {bilan ? formatAr(benefice) : '-'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {bilan ? (
                          <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md ${
                            marge >= 0
                              ? 'text-[var(--positive)] bg-[var(--positive)]/10 border border-[var(--positive)]/20'
                              : 'text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20'
                          }`}>
                            {marge.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-[var(--t3)]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 3. Section Rapports Téléchargeables */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[var(--t1)]">Rapports Téléchargeables</h3>
            <p className="text-xs text-[var(--t3)]">Générez ou téléchargez les bilans archivés.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[var(--panel-deep)] hover:bg-[var(--chip)] border border-[var(--border-subtle)] text-[var(--t1)] text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-[var(--positive)]" />
              Exporter en Excel
            </button>

            <button className="btn-honey text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
              Générer Bilan PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--panel)] border border-[var(--border-subtle)] hover:border-[var(--honey)]/50 rounded-xl p-4 flex items-center justify-center gap-2 transition-all cursor-pointer text-[var(--t3)] hover:text-[var(--honey)] group">
            <FolderArchive className="w-5 h-5 group-hover:text-[var(--honey)] transition-colors" />
            <span className="text-xs font-semibold">Voir toutes les archives</span>
          </div>
          <div className="bg-[var(--panel)] border border-[var(--border-subtle)] rounded-xl p-4 flex items-center justify-center gap-2 text-[var(--t3)]">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-semibold">Aucun rapport archivé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoleReportsTable;