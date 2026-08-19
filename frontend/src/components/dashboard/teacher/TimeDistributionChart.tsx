import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../../ui/Card';

const repartitionData = [
  { name: 'Cours', value: 75, color: '#10b981' },
  { name: 'Préparation', value: 25, color: '#f59e0b' },
];

export const TimeDistributionChart: React.FC = () => {
  return (
    <Card className="justify-between">
      <div className="flex items-center gap-2 text-amber-500 mb-2">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 inline-block" />
        <h3 className="text-sm font-bold text-white">Répartition du Temps</h3>
      </div>

      {/* Graphique Donut */}
      <div className="h-44 w-full relative flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={repartitionData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {repartitionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute text-center">
          <span className="text-2xl font-black text-white block leading-none">32 h</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mt-1">TOTAL</span>
        </div>
      </div>

      {/* Légende */}
      <div className="flex justify-center items-center gap-6 text-xs font-medium pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" />
          <span className="text-slate-300">Cours : <strong className="text-white">75%</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
          <span className="text-slate-300">Préparation : <strong className="text-white">25%</strong></span>
        </div>
      </div>
    </Card>
  );
};
