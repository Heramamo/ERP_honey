import React from 'react';

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

export const PayrollHistoryTable: React.FC = () => {
  return (
    <div className="bg-[#111726] border border-slate-800/90 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-white">Historique des Bulletins de Paie</h3>
        <button className="text-xs text-amber-500 hover:text-amber-400 transition font-semibold cursor-pointer">
          Voir archives
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800/80">
              <th className="pb-3 px-2">PÉRIODE</th>
              <th className="pb-3 px-2 text-center">TOTAL HEURES</th>
              <th className="pb-3 px-2 text-center">MONTANT CALCULÉ</th>
              <th className="pb-3 px-2 text-right">STATUT DE PAIEMENT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {mockPayrolls.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5 px-2 font-bold text-white">{row.periode}</td>
                <td className="py-3.5 px-2 text-center text-slate-200 font-medium">{row.totalHeures}</td>
                <td className="py-3.5 px-2 text-center font-bold text-slate-100">{row.montant}</td>
                <td className="py-3.5 px-2 text-right">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block border ${
                    row.statut === 'Payé'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
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