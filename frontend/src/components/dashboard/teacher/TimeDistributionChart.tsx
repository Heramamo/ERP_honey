import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../../ui/Card';
import { chartSeries } from '../chartTheme';

interface DistributionItem {
  name: string;
  value: number;
}

interface TimeDistributionChartProps {
  data?: DistributionItem[];
  totalHours?: number;
}

const COLORS = [
  chartSeries.honey,
  chartSeries.sage,
  chartSeries.azure,
  chartSeries.lilac,
  chartSeries.clay,
  chartSeries.leaf,
];

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ data = [], totalHours = 0 }) => {
  const repartitionData = data
    .filter((item) => item.value > 0)
    .map((item, index) => ({ ...item, color: COLORS[index % COLORS.length] }));

  const totalValue = repartitionData.reduce((acc, item) => acc + item.value, 0);
  const displayTotal = totalValue > 0 ? totalValue : totalHours;

  return (
    <Card className="justify-between">
      <div className="flex items-center gap-2 text-[var(--honey)] mb-2">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-[var(--honey)] inline-block" />
        <h3 className="text-sm font-bold text-[var(--t1)]">Répartition du Temps</h3>
      </div>

      {repartitionData.length > 0 ? (
        <>
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
              <span className="text-2xl font-black text-[var(--t1)] block leading-none">
                {Math.round(displayTotal)} h
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--t3)] block mt-1">TOTAL</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-medium pt-2">
            {repartitionData.map((item) => {
              const pct = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                  <span className="text-[var(--t2)]">
                    {item.name} : <strong className="text-[var(--t1)]">{pct}%</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="h-44 flex items-center justify-center">
          <p className="text-xs text-[var(--t3)]">Aucune donnée de répartition</p>
        </div>
      )}
    </Card>
  );
};

export default TimeDistributionChart;