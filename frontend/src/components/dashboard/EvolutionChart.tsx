import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const evolutionData = [
  { mois: 'Mar', revenus: 8000000, charges: 3000000 },
  { mois: 'Avr', revenus: 9500000, charges: 3200000 },
  { mois: 'Mai', revenus: 11000000, charges: 3500000 },
  { mois: 'Juin', revenus: 15500000, charges: 3300000 },
  { mois: 'Juil', revenus: 17000000, charges: 3800000 },
  { mois: 'Aoû', revenus: 20950000, charges: 5300000 },
];

export const EvolutionChart: React.FC = () => {
  return (
    <div className="bg-[#101625] border border-slate-800/80 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-white">Évolution du résultat</h3>
        <span className="text-[11px] text-slate-500 font-medium">6 derniers mois</span>
      </div>

      <div className="h-60 w-full min-h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={evolutionData}>
            <XAxis dataKey="mois" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val / 1000000}M`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
            />
            <Line type="monotone" dataKey="revenus" stroke="#3b82f6" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="charges" stroke="#f59e0b" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};