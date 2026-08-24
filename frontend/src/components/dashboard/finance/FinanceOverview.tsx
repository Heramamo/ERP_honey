import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight } from 'lucide-react';

export const FinanceOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Cards KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Total Revenus</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">48 500 000 Ar</p>
          <span className="text-xs text-emerald-400 mt-2 inline-block">+12% ce mois</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Total Charges</span>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">21 200 000 Ar</p>
          <span className="text-xs text-rose-400 mt-2 inline-block">+4% ce mois</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Bénéfice Net Consolidé</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-500">27 300 000 Ar</p>
          <span className="text-xs text-emerald-400 mt-2 inline-block">+18% de marge brute</span>
        </div>
      </div>

      {/* Mini-Tableau des Dernières Transactions */}
      <div className="bg-[#111827] rounded-xl border border-gray-800 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Opérations Récentes</h3>
          <button className="text-xs text-amber-500 flex items-center gap-1 hover:underline">
            Voir tout <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Paiement Prestation Web', pole: 'IT', amount: '+ 15 000 000 Ar', date: '18 Aug 2026', type: 'revenu' },
            { label: 'Achat Serveur Rack', pole: 'IT', amount: '- 3 200 000 Ar', date: '15 Aug 2026', type: 'charge' },
            { label: 'Sponsor Événement Tech', pole: 'Événementiel', amount: '+ 8 500 000 Ar', date: '12 Aug 2026', type: 'revenu' },
            { label: 'Location Salle de Formation', pole: 'Formation', amount: '- 1 500 000 Ar', date: '10 Aug 2026', type: 'charge' },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-[#161B26] rounded-lg border border-gray-800/50">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-400">{item.pole} • {item.date}</p>
              </div>
              <span className={`text-sm font-bold ${item.type === 'revenu' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};