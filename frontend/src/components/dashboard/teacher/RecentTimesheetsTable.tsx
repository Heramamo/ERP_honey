import React from 'react';

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

export const RecentTimesheetsTable: React.FC = () => {
  return (
    <div className="bg-[#111726] border border-slate-800/90 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-white">Dernières Feuilles de Temps</h3>
        <button className="text-xs text-amber-500 hover:text-amber-400 transition font-semibold cursor-pointer">
          Voir tout
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800/80">
              <th className="pb-3 px-2">DATE</th>
              <th className="pb-3 px-2">TYPE D'ACTIVITÉ</th>
              <th className="pb-3 px-2 text-center">HEURES DE BASE</th>
              <th className="pb-3 px-2 text-center">HEURES SUPP.</th>
              <th className="pb-3 px-2 text-right">STATUT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {mockTimesheets.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5 px-2 font-semibold text-slate-300">{row.date}</td>
                <td className={`py-3.5 px-2 font-bold ${row.type === 'Cours' ? 'text-blue-400' : 'text-slate-300'}`}>
                  {row.type}
                </td>
                <td className="py-3.5 px-2 text-center text-slate-200 font-medium">{row.heuresBase}</td>
                <td className="py-3.5 px-2 text-center text-amber-400 font-bold">{row.heuresSupp}</td>
                <td className="py-3.5 px-2 text-right">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block border ${
                    row.statut === 'Validé'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {row.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};