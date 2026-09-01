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
  statut: 'En attente' | 'Payé' | 'Validé';
}

interface PayrollHistoryTableProps {
  rows?: PayrollItem[];
}

const columns: DataColumn<PayrollItem>[] = [
  {
    header: 'Période',
    render: (row) => <span className="font-medium text-[var(--t1)]">{row.periode}</span>,
  },
  {
    header: 'Total heures',
    align: 'center',
    render: (row) => <span className="text-[var(--t2)] font-mono tabular-nums">{row.totalHeures}</span>,
  },
  {
    header: 'Montant',
    align: 'center',
    render: (row) => <span className="font-medium text-[var(--t1)] font-mono tabular-nums">{row.montant}</span>,
  },
  {
    header: 'Statut',
    align: 'right',
    render: (row) => <StatusBadge status={row.statut} />,
  },
];

export const PayrollHistoryTable: React.FC<PayrollHistoryTableProps> = ({ rows = [] }) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-[var(--t1)]">Historique des bulletins</h3>
        <button className="text-xs text-[var(--accent)] hover:text-[var(--accent-strong)] transition font-medium cursor-pointer">
          Voir archives
        </button>
      </div>

      {rows.length > 0 ? (
        <DataTable columns={columns} data={rows} rowKey={(row) => row.id} />
      ) : (
        <p className="text-xs text-[var(--t3)] py-5 text-center">Aucun bulletin de paie pour le moment</p>
      )}
    </Card>
  );
};

export default PayrollHistoryTable;
