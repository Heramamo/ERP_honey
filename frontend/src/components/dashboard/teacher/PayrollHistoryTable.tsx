import React from 'react';
import { StatusBadge } from '../../common/StatusBadge';
import { Card } from '../../ui/Card';
import { DataTable } from '../../ui/DataTable';
import type { DataColumn } from '../../ui/DataTable';

interface PayrollItem {
  id: string;
  periode: string;
  totalHeures: string;
  montant: string;
  statut: 'En attente' | 'Payé';
}

const mockPayrolls: PayrollItem[] = [
  { id: '1', periode: 'Août 2026', totalHeures: '32h', montant: '450k Ar', statut: 'En attente' },
  { id: '2', periode: 'Juillet 2026', totalHeures: '36h', montant: '510k Ar', statut: 'Payé' },
  { id: '3', periode: 'Juin 2026', totalHeures: '32h', montant: '450k Ar', statut: 'Payé' },
];

const columns: DataColumn<PayrollItem>[] = [
  {
    header: 'PÉRIODE',
    render: (row) => <span className="font-bold text-white">{row.periode}</span>,
  },
  {
    header: 'TOTAL HEURES',
    align: 'center',
    render: (row) => <span className="text-slate-200 font-medium">{row.totalHeures}</span>,
  },
  {
    header: 'MONTANT CALCULÉ',
    align: 'center',
    render: (row) => <span className="font-bold text-slate-100">{row.montant}</span>,
  },
  {
    header: 'STATUT DE PAIEMENT',
    align: 'right',
    render: (row) => <StatusBadge status={row.statut} />,
  },
];

export const PayrollHistoryTable: React.FC = () => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-white">Historique des Bulletins de Paie</h3>
        <button className="text-xs text-amber-500 hover:text-amber-400 transition font-semibold cursor-pointer">
          Voir archives
        </button>
      </div>

      <DataTable columns={columns} data={mockPayrolls} rowKey={(row) => row.id} />
    </Card>
  );
};
