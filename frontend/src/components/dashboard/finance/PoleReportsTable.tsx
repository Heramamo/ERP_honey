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
    <div className="space-y-6 text-gray-100">
      {/* 1. Cartes KPI Consolidation Financière */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-emerald-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenus</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white">{formatAr(totalRevenus)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>{formatMonthYear(mois)}</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-red-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Charges</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white">{formatAr(totalCharges)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400 font-medium">
            <TrendingDown className="w-4 h-4" />
            <span>Charges consolidées</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 border-l-4 border-l-amber-500 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bénéfice Net</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-bold ${beneficeNet >= 0 ? 'text-amber-500' : 'text-rose-500'}`}>{formatAr(beneficeNet)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400 font-medium">
            <Scale className="w-4 h-4 text-amber-500" />
            <span>Marge nette globale : <strong>{margeGlobale.toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Sélecteur de mois */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="month"
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                className="bg-[#0B0F17] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
          </div>
          <div className="flex items-center gap-2 bg-[#0B0F17] border border-gray-800/80 rounded-lg px-4 py-2.5 text-xs text-gray-400 w-fit">
            <Info className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              <strong className="text-gray-200">Bénéfice Net</strong> = Total Revenus - (Charges Fixes + Charges Variables)
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {poles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <FolderArchive className="w-8 h-8 text-gray-600" />
              <span className="text-sm">Aucun pôle enregistré.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Pôle d'activité</th>
                  <th className="py-3 px-4 text-right">Revenus Bruts (Ar)</th>
                  <th className="py-3 px-4 text-right">Charges Fixes (Ar)</th>
                  <th className="py-3 px-4 text-right">Charges Variables (Ar)</th>
                  <th className="py-3 px-4 text-right">Bénéfice Net (Ar)</th>
                  <th className="py-3 px-4 text-right">Marge Nette (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {poles.map((pole) => {
                  const bilan = bilans[pole.id];
                  const benefice = bilan ? bilan.beneficeNet : 0;
                  const marge = bilan && bilan.totalRevenu > 0 ? (bilan.beneficeNet / bilan.totalRevenu) * 100 : 0;
                  return (
                    <tr key={pole.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${getPoleBadgeStyle(pole.id)}`} />
                          <span>{pole.nom}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-200 font-medium">
                        {bilan ? formatAr(bilan.totalRevenu) : <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-500 inline" />}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-200 font-medium">
                        {bilan ? formatAr(bilan.totalChargesFixe) : '-'}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-200 font-medium">
                        {bilan ? formatAr(bilan.totalChargeVariable) : '-'}
                      </td>
                      <td className={`py-4 px-4 text-right font-bold ${benefice >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {bilan ? formatAr(benefice) : '-'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {bilan ? (
                          <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md ${
                            marge >= 0
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          }`}>
                            {marge.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
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
            <h3 className="text-base font-bold text-white">Rapports Téléchargeables</h3>
            <p className="text-xs text-gray-400">Générez ou téléchargez les bilans archivés.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[#0B0F17] hover:bg-gray-800 border border-gray-800 text-gray-200 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Exporter en Excel
            </button>

            <button className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/10 cursor-pointer">
              Générer Bilan PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-gray-800 hover:border-amber-500/50 rounded-xl p-4 flex items-center justify-center gap-2 transition-all cursor-pointer text-gray-300 hover:text-amber-500 group">
            <FolderArchive className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
            <span className="text-xs font-semibold">Voir toutes les archives</span>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-semibold">Aucun rapport archivé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoleReportsTable;
