import React from 'react';
import { Check, X, Eye } from 'lucide-react';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';

interface HoursSubmission {
  id: string;
  teacherName: string;
  period: string;
  hoursCount: number;
  estimatedTotal: number;
  status: 'EN ATTENTE' | 'VALIDÉ' | 'REFUSÉ';
}

const MOCK_HOURS: HoursSubmission[] = [
  { id: '1', teacherName: 'Rakotoarisoa J.', period: '01 - 15 Août 2026', hoursCount: 32, estimatedTotal: 800000, status: 'EN ATTENTE' },
  { id: '2', teacherName: 'Ramanantsoa M.', period: '01 - 15 Août 2026', hoursCount: 40, estimatedTotal: 1200000, status: 'EN ATTENTE' },
  { id: '3', teacherName: 'Andriamihaja H.', period: '01 - 15 Août 2026', hoursCount: 25, estimatedTotal: 700000, status: 'EN ATTENTE' },
  { id: '4', teacherName: 'Rasoanaivo T.', period: '01 - 15 Août 2026', hoursCount: 18, estimatedTotal: 396000, status: 'EN ATTENTE' },
];

interface HoursValidationTableProps {
  allowedRoles?: Role[];
}

export const HoursValidationTable: React.FC<HoursValidationTableProps> = ({ allowedRoles }) => {
  const content = (
    <div className="bg-[#12161f] border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-[#0e1118]">
            <th className="py-4 px-6">ENSEIGNANT</th>
            <th className="py-4 px-6">DATE</th>
            <th className="py-4 px-6">HEURES DÉCLARÉES</th>
            <th className="py-4 px-6">MONTANT ESTIMÉ</th>
            <th className="py-4 px-6 text-right">DECISION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-sm">
          {MOCK_HOURS.map((item) => (
            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-4 px-6 font-bold text-slate-100">{item.teacherName}</td>
              <td className="py-4 px-6 text-slate-400 text-xs">{item.period}</td>
              <td className="py-4 px-6 font-mono font-semibold text-amber-400">{item.hoursCount} hrs</td>
              <td className="py-4 px-6 font-semibold text-slate-200">
                {item.estimatedTotal.toLocaleString('fr-FR')} Ar
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Détails">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900 text-emerald-400 transition-colors" title="Valider">
                    <Check className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900 text-rose-400 transition-colors" title="Refuser">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return allowedRoles ? (
    <RoleGuard allowedRoles={allowedRoles}>{content}</RoleGuard>
  ) : (
    content
  );
};

export default HoursValidationTable;