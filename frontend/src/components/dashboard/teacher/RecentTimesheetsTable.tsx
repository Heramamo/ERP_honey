import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../common/StatusBadge';
import { Card } from '../../ui/Card';
import { DataTable } from '../../ui/DataTable';
import type { DataColumn } from '../../ui/DataTable';
import type { SaisiePayload } from '../../../types/saisieFeuille';

interface TimesheetItem {
  id: string;
  date: string;
  type: string;
  heuresBase: string;
  heuresSupp: string;
  statut: 'Validé' | 'En révision' | 'En attente';
}

interface RecentTimesheetsTableProps {
  saisies?: SaisiePayload[];
}

const formatShortDate = (date: Date | string) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

const mapStatut = (statut: SaisiePayload['statut']): TimesheetItem['statut'] => {
  const value = String(statut);
  switch (value) {
    case 'VALIDE': return 'Validé';
    case 'REFUSE': return 'En révision';
    default: return 'En attente';
  }
};

export const RecentTimesheetsTable: React.FC<RecentTimesheetsTableProps> = ({ saisies = [] }) => {
  const navigate = useNavigate();

  const rows: TimesheetItem[] = saisies
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((s, index) => ({
      id: `${s.date}-${index}`,
      date: formatShortDate(s.date),
      type: s.typeActivite,
      heuresBase: `${s.heuresEffectuees}h`,
      heuresSupp: `${s.heuresSupp}h`,
      statut: mapStatut(s.statut),
    }));

  const columns: DataColumn<TimesheetItem>[] = [
    {
      header: 'Date',
      render: (row) => <span className="font-medium text-[var(--t2)] font-mono tabular-nums">{row.date}</span>,
    },
    {
      header: 'Activité',
      render: (row) => (
        <span className={`font-medium ${row.type === 'Cours' ? 'text-[var(--info)]' : 'text-[var(--t2)]'}`}>
          {row.type}
        </span>
      ),
    },
    {
      header: 'Base',
      align: 'center',
      render: (row) => <span className="text-[var(--t2)] font-mono tabular-nums">{row.heuresBase}</span>,
    },
    {
      header: 'Supp.',
      align: 'center',
      render: (row) => <span className="text-[var(--warning)] font-medium font-mono tabular-nums">{row.heuresSupp}</span>,
    },
    {
      header: 'Statut',
      align: 'right',
      render: (row) => <StatusBadge status={row.statut} />,
    },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-[var(--t1)]">Dernières feuilles de temps</h3>
        <button
          onClick={() => navigate('/dashboard/feuilles-de-temps')}
          className="text-xs text-[var(--accent)] hover:text-[var(--accent-strong)] transition font-medium cursor-pointer"
        >
          Tout voir
        </button>
      </div>

      {rows.length > 0 ? (
        <DataTable columns={columns} data={rows} rowKey={(row) => row.id} />
      ) : (
        <p className="text-xs text-[var(--t3)] py-5 text-center">Aucune feuille de temps enregistrée</p>
      )}
    </Card>
  );
};

export default RecentTimesheetsTable;
