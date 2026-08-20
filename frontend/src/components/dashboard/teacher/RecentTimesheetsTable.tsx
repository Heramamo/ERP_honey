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
  const value = typeof statut === 'string' ? statut : statut?.statut;
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

  return (
    <Card>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-white">Dernières Feuilles de Temps</h3>
        <button
          onClick={() => navigate('/dashboard/feuilles-de-temps')}
          className="text-xs text-amber-500 hover:text-amber-400 transition font-semibold cursor-pointer"
        >
          Voir tout
        </button>
      </div>

      {rows.length > 0 ? (
        <DataTable columns={columns} data={rows} rowKey={(row) => row.id} />
      ) : (
        <p className="text-xs text-slate-500 py-6 text-center">Aucune feuille de temps enregistrée</p>
      )}
    </Card>
  );
};

export default RecentTimesheetsTable;