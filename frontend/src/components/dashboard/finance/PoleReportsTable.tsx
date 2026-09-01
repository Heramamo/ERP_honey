import React, { useEffect, useState } from 'react';
import {
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

  const kpi = (label: string, value: string, tone: string) => (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg p-4">
      <p className="text-[11px] font-medium text-[var(--t3)]">{label}</p>
      <p className={`mt-1.5 text-xl font-medium font-mono tabular-nums ${tone}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {kpi('Total revenus · ' + formatMonthYear(mois), formatAr(totalRevenus), 'text-[var(--success)]')}
        {kpi('Total charges', formatAr(totalCharges), 'text-[var(--danger)]')}
        {kpi('Bénéfice net', formatAr(beneficeNet), 'text-[var(--t1)]')}
      </div>

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--t3)]" />
              <input
                type="month"
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                className="bg-[var(--panel-deep)] border border-[var(--line)] rounded-md pl-8 pr-3 py-1.5 text-sm text-[var(--t2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] cursor-pointer"
              />
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />}
          </div>
          <span className="text-xs text-[var(--t3)]">
            Bénéfice net = Revenus - (Charges fixes + Charges variables)
          </span>
        </div>

        <div className="overflow-x-auto scroll-thin">
          {poles.length === 0 ? (
            <div className="flex items-center justify-center py-16 gap-2 text-[var(--t3)]">
              <span className="text-sm">Aucun pôle enregistré.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Pôle d'activité</th>
                  <th className="py-2.5 px-4 text-right">Revenus bruts</th>
                  <th className="py-2.5 px-4 text-right">Charges fixes</th>
                  <th className="py-2.5 px-4 text-right">Charges variables</th>
                  <th className="py-2.5 px-4 text-right">Bénéfice net</th>
                  <th className="py-2.5 px-4 text-right">Marge nette</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-sm">
                {poles.map((pole) => {
                  const bilan = bilans[pole.id];
                  const benefice = bilan ? bilan.beneficeNet : 0;
                  const marge = bilan && bilan.totalRevenu > 0 ? (bilan.beneficeNet / bilan.totalRevenu) * 100 : 0;
                  return (
                    <tr key={pole.id} className="hover:bg-[var(--chip)]/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-[var(--t1)]">
                        <span className="inline-flex items-center gap-2.5">
                          <span className={`inline-block h-2 w-2 rounded-full ${getPoleDot(pole.id)}`} />
                          {pole.nom}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-[var(--t2)] font-mono tabular-nums">
                        {bilan ? formatAr(bilan.totalRevenu) : <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--t3)] inline" />}
                      </td>
                      <td className="py-3 px-4 text-right text-[var(--t2)] font-mono tabular-nums">
                        {bilan ? formatAr(bilan.totalChargesFixe) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-[var(--t2)] font-mono tabular-nums">
                        {bilan ? formatAr(bilan.totalChargeVariable) : '-'}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium font-mono tabular-nums ${benefice >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                        {bilan ? formatAr(benefice) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {bilan ? (
                          <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-md ${
                            marge >= 0
                              ? 'text-[var(--success)] bg-[var(--success-bg)]'
                              : 'text-[var(--danger)] bg-[var(--danger-bg)]'
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

      <div className="space-y-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--t1)]">Rapports téléchargeables</h3>
            <p className="text-xs text-[var(--t3)]">Générez ou téléchargez les bilans archivés.</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-[var(--panel-deep)] hover:bg-[var(--chip)] border border-[var(--line)] text-[var(--t2)] text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-[var(--success)]" />
              Exporter en Excel
            </button>

            <button className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[#1a1408] text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer">
              Générer bilan PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[var(--panel)] border border-[var(--line)] hover:border-[var(--accent-muted)] rounded-lg p-4 flex items-center justify-center gap-2 transition-colors cursor-pointer text-[var(--t2)] hover:text-[var(--accent)]">
            <FolderArchive className="w-4 h-4 text-[var(--t3)]" />
            <span className="text-xs font-medium">Voir toutes les archives</span>
          </div>
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg p-4 flex items-center justify-center gap-2 text-[var(--t3)]">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium">Aucun rapport archivé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoleReportsTable;
