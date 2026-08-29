import React from 'react';
import { Download } from 'lucide-react';
import {StatusBadge} from '../../common/StatusBadge';
import RoleGuard from '../../RoleGuard';
import type { Role } from '../../../types/auth';

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
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl overflow-hidden shadow-[var(--shadow-raised)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--line)] text-[11px] font-bold text-[var(--t3)] tracking-wider uppercase bg-[var(--panel-deep)]">
            <th className="py-4 px-6">ENSEIGNANT</th>
            <th className="py-4 px-6">PERIODE DE PAIE</th>
            <th className="py-4 px-6">MONTANT NET</th>
            <th className="py-4 px-6">STATUT PAIEMENT</th>
            <th className="py-4 px-6 text-right">DOCUMENT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)] text-sm">
          {MOCK_PAYROLL.map((payroll) => (
            <tr key={payroll.id} className="hover:bg-[var(--chip)] transition-colors">
              <td className="py-4 px-6 font-bold text-[var(--t1)]">{payroll.teacherName}</td>
              <td className="py-4 px-6 text-[var(--t3)] text-xs">{payroll.month}</td>
              <td className="py-4 px-6 font-semibold text-[var(--success)]">
                {payroll.netAmount.toLocaleString('fr-FR')} Ar
              </td>
              <td className="py-4 px-6">
                <StatusBadge status={payroll.status} />
              </td>
              <td className="py-4 px-6 text-right">
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--chip)] hover:bg-[var(--chip-hover)] text-[var(--t2)] text-xs font-semibold transition-colors">
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