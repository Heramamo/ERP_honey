import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const effectifsData = [
  { name: 'IT', value: 45, color: '#3b82f6' },
  { name: 'Formation', value: 30, color: '#f59e0b' },
  { name: 'Évén. / Tourisme', value: 25, color: '#6366f1' },
];

export const EffectifsChart: React.FC = () => {
  return (
    <Card tone="subtle" className="justify-between">
      <h3 className="text-sm font-bold text-[var(--t1)] mb-2">Effectifs par Pôle</h3>

      <div className="h-44 w-full relative flex items-center justify-center min-h-[175px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={effectifsData}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
            >
              {effectifsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute text-center">
          <span className="text-2xl font-black text-[var(--t1)] block leading-none">17</span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--t3)] block mt-1">INTERVENANTS</span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {effectifsData.map((item) => (
          <div key={item.name} className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
              <span className="text-[var(--t2)] font-medium">{item.name}</span>
            </div>
            <span className="font-bold text-[var(--t3)]">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
