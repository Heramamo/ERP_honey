import React from 'react';
import { Download } from 'lucide-react';
import {StatusBadge} from '../../common/StatusBadge';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';
import { formatNumber } from '../../../utils/finance';

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

interface PayrollTableProps {
  allowedRoles?: Role[];
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ allowedRoles }) => {
  const content = (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--line)] text-[10px] font-semibold text-[var(--t3)] tracking-wider uppercase">
            <th className="py-3 px-5">Enseignant</th>
            <th className="py-3 px-5">Période de paie</th>
            <th className="py-3 px-5 text-right">Montant net</th>
            <th className="py-3 px-5">Statut</th>
            <th className="py-3 px-5 text-right">Document</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)] text-sm">
          {MOCK_PAYROLL.map((payroll) => (
            <tr key={payroll.id} className="hover:bg-[var(--chip)]/50 transition-colors">
              <td className="py-3 px-5 font-medium text-[var(--t1)]">{payroll.teacherName}</td>
              <td className="py-3 px-5 text-[var(--t3)] text-xs">{payroll.month}</td>
              <td className="py-3 px-5 text-right font-medium font-mono tabular-nums text-[var(--success)]">
                {formatNumber(payroll.netAmount)} Ar
              </td>
              <td className="py-3 px-5">
                <StatusBadge status={payroll.status} />
              </td>
              <td className="py-3 px-5 text-right">
                <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--line)] hover:bg-[var(--chip)] text-[var(--t2)] text-xs font-medium transition-colors">
                  <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
                  PDF
                </button>
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

export default PayrollTable;