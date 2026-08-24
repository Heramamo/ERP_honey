import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { chartAxisTight, chartTooltipStyle } from './chartTheme';

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
    <Card tone="subtle">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[var(--t1)]">Évolution du résultat</h3>
        <span className="text-[11px] text-[var(--t3)] font-medium">6 derniers mois</span>
      </div>

      <div className="h-60 w-full min-h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={evolutionData}>
            <XAxis dataKey="mois" {...chartAxisTight} />
            <YAxis
              {...chartAxisTight}
              tickFormatter={(val) => `${val / 1000000}M`}
            />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Line type="monotone" dataKey="revenus" stroke="#3b82f6" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="charges" stroke="#f59e0b" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
