import React from 'react';
import { StatusBadge } from '../../common/StatusBadge';
import { Card } from '../../ui/Card';
import { DataTable } from '../../ui/DataTable';
import type { DataColumn } from '../../ui/DataTable';

interface TimesheetItem {
  id: string;
  date: string;
  type: string;
  heuresBase: string;
  heuresSupp: string;
  statut: 'Validé' | 'En révision' | 'En attente';
}

const mockTimesheets: TimesheetItem[] = [
  { id: '1', date: '12/08', type: 'Cours', heuresBase: '4h', heuresSupp: '1h', statut: 'Validé' },
  { id: '2', date: '10/08', type: 'Préparation', heuresBase: '3h', heuresSupp: '0h', statut: 'Validé' },
  { id: '3', date: '08/08', type: 'Cours', heuresBase: '2h', heuresSupp: '2h', statut: 'En révision' },
];

const columns: DataColumn<TimesheetItem>[] = [
  {
    header: 'DATE',
    render: (row) => <span className="font-semibold text-slate-300">{row.date}</span>,
  },
  {
    header: "TYPE D'ACTIVITÉ",
    render: (row) => (
      <span className={`font-bold ${row.type === 'Cours' ? 'text-blue-400' : 'text-slate-300'}`}>
        {row.type}
      </span>
    ),
  },
  {
    header: 'HEURES DE BASE',
    align: 'center',
    render: (row) => <span className="text-slate-200 font-medium">{row.heuresBase}</span>,
  },
  {
    header: 'HEURES SUPP.',
    align: 'center',
    render: (row) => <span className="text-amber-400 font-bold">{row.heuresSupp}</span>,
  },
  {
    header: 'STATUT',
    align: 'right',
    render: (row) => <StatusBadge status={row.statut} />,
  },
];

export const RecentTimesheetsTable: React.FC = () => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-white">Dernières Feuilles de Temps</h3>
        <button className="text-xs text-amber-500 hover:text-amber-400 transition font-semibold cursor-pointer">
          Voir tout
        </button>
      </div>

      <DataTable columns={columns} data={mockTimesheets} rowKey={(row) => row.id} />
    </Card>
  );
};
