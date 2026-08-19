import React from 'react';
import { Download, FileText } from 'lucide-react';
import {StatusBadge} from '../../common/StatusBadge';

interface PayrollRecord {
  id: string;
  teacherName: string;
  month: string;
  netAmount: number;
  status: 'PAYÉ' | 'EN ATTENTE';
}

const MOCK_PAYROLL: PayrollRecord[] = [
  { id: '1', teacherName: 'Ramanantsoa M.', month: 'Juillet 2026', netAmount: 2400000, status: 'PAYÉ' },
  { id: '2', teacherName: 'Andriamihaja H.', month: 'Juillet 2026', netAmount: 1960000, status: 'PAYÉ' },
  { id: '3', teacherName: 'Müller K.', month: 'Juillet 2026', netAmount: 2560000, status: 'PAYÉ' },
  { id: '4', teacherName: 'Rakotoarisoa J.', month: 'Juillet 2026', netAmount: 1500000, status: 'EN ATTENTE' },
];

export const PayrollTable: React.FC = () => {
  return (
    <div className="bg-[#12161f] border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#0e1118]">
            <th className="py-4 px-6">ENSEIGNANT</th>
            <th className="py-4 px-6">PERIODE DE PAIE</th>
            <th className="py-4 px-6">MONTANT NET</th>
            <th className="py-4 px-6">STATUT PAIEMENT</th>
            <th className="py-4 px-6 text-right">DOCUMENT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-sm">
          {MOCK_PAYROLL.map((payroll) => (
            <tr key={payroll.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-4 px-6 font-bold text-slate-100">{payroll.teacherName}</td>
              <td className="py-4 px-6 text-slate-400 text-xs">{payroll.month}</td>
              <td className="py-4 px-6 font-semibold text-emerald-400">
                {payroll.netAmount.toLocaleString('fr-FR')} Ar
              </td>
              <td className="py-4 px-6">
                <StatusBadge status={payroll.status} />
              </td>
              <td className="py-4 px-6 text-right">
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors">
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;