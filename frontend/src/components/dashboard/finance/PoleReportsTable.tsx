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
import { formatAr, getPoleDot } from '../../../utils/finance';
import { formatMonthYear } from '../../../const/date';

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

  const kpiCard = (border: string, label: string, value: string, note: React.ReactNode) => (
    <div className={`bg-[var(--panel)] border border-[var(--line)] border-l-4 ${border} rounded-xl p-5 shadow-[var(--shadow-raised)]`}>
      <p className="text-xs font-semibold text-[var(--t3)]">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold text-[var(--t1)]">{value}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">{note}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 1. Cartes KPI Consolidation Financière */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiCard('border-l-[var(--success)]', 'Total Revenus', formatAr(totalRevenus), (
          <span className="flex items-center gap-1.5 text-[var(--success)]">
            <TrendingUp className="w-4 h-4" />
            <span>{formatMonthYear(mois)}</span>
          </span>
        ))}
        {kpiCard('border-l-[var(--danger)]', 'Total Charges', formatAr(totalCharges), (
          <span className="flex items-center gap-1.5 text-[var(--danger)]">
            <TrendingDown className="w-4 h-4" />
            <span>Charges consolidées</span>
          </span>
        ))}
        {kpiCard('border-l-[var(--warning)]', 'Bénéfice Net', formatAr(beneficeNet), (
          <span className="flex items-center gap-1.5 text-[var(--warning)]">
            <Scale className="w-4 h-4 text-[var(--warning)]" />
            <span>Marge nette globale : <strong>{margeGlobale.toFixed(1)}%</strong></span>
          </span>
        ))}
      </div>

      {/* Sélecteur de mois */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5 shadow-[var(--shadow-raised)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--t3)]" />
              <input
                type="month"
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                className="bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--t2)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />}
          </div>
          <div className="flex items-center gap-2 bg-[var(--panel-deep)] border border-[var(--line)] rounded-lg px-4 py-2.5 text-xs text-[var(--t3)] w-fit">
            <Info className="w-4 h-4 text-[var(--t3)] shrink-0" />
            <span>
              <strong className="text-[var(--t2)]">Bénéfice Net</strong> = Total Revenus - (Charges Fixes + Charges Variables)
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
                <tr className="border-b border-[var(--line)] text-[11px] font-bold text-[var(--t3)] uppercase tracking-wider">
                  <th className="py-3 px-4">Pôle d'activité</th>
                  <th className="py-3 px-4 text-right">Revenus Bruts (Ar)</th>
                  <th className="py-3 px-4 text-right">Charges Fixes (Ar)</th>
                  <th className="py-3 px-4 text-right">Charges Variables (Ar)</th>
                  <th className="py-3 px-4 text-right">Bénéfice Net (Ar)</th>
                  <th className="py-3 px-4 text-right">Marge Nette (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-sm">
                {poles.map((pole) => {
                  const bilan = bilans[pole.id];
                  const benefice = bilan ? bilan.beneficeNet : 0;
                  const marge = bilan && bilan.totalRevenu > 0 ? (bilan.beneficeNet / bilan.totalRevenu) * 100 : 0;
                  return (
                    <tr key={pole.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                      <td className="py-4 px-4 font-semibold text-[var(--t1)]">
                        <div className="flex items-center gap-3">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${getPoleDot(pole.id)}`} />
                          <span>{pole.nom}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-[var(--t2)] font-medium">
                        {bilan ? formatAr(bilan.totalRevenu) : <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--t3)] inline" />}
                      </td>
                      <td className="py-4 px-4 text-right text-[var(--t2)] font-medium">
                        {bilan ? formatAr(bilan.totalChargesFixe) : '-'}
                      </td>
                      <td className="py-4 px-4 text-right text-[var(--t2)] font-medium">
                        {bilan ? formatAr(bilan.totalChargeVariable) : '-'}
                      </td>
                      <td className={`py-4 px-4 text-right font-bold ${benefice >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                        {bilan ? formatAr(benefice) : '-'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {bilan ? (
                          <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md ${
                            marge >= 0
                              ? 'text-[var(--success)] bg-[var(--success-bg)] border border-[var(--success-line)]'
                              : 'text-[var(--danger)] bg-[var(--danger-bg)] border border-[var(--danger-line)]'
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
            <p className="text-sm text-[var(--t3)]">Générez ou téléchargez les bilans archivés.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[var(--panel-deep)] hover:bg-[var(--surface-hover)] border border-[var(--line)] text-[var(--t2)] text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-[var(--success)]" />
              Exporter en Excel
            </button>

            <button className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-slate-950 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
              Générer Bilan PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--panel)] border border-[var(--line)] hover:border-[var(--accent)]/50 rounded-xl p-4 flex items-center justify-center gap-2 transition-colors cursor-pointer text-[var(--t2)] hover:text-[var(--accent)]">
            <FolderArchive className="w-5 h-5 text-[var(--t3)]" />
            <span className="text-xs font-semibold">Voir toutes les archives</span>
          </div>
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-4 flex items-center justify-center gap-2 text-[var(--t3)]">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-semibold">Aucun rapport archivé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoleReportsTable;
