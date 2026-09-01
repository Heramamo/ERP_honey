import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../../ui/Card';

interface DistributionItem {
  name: string;
  value: number;
}

interface TimeDistributionChartProps {
  data?: DistributionItem[];
  totalHours?: number;
}

const COLORS = ['#c8932a', '#8c6d3f', '#5b7a6d', '#7a6a9e', '#a8634a', '#6d7f8c'];

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ data = [], totalHours = 0 }) => {
  const repartitionData = data
    .filter((item) => item.value > 0)
    .map((item, index) => ({ ...item, color: COLORS[index % COLORS.length] }));

  const totalValue = repartitionData.reduce((acc, item) => acc + item.value, 0);
  const displayTotal = totalValue > 0 ? totalValue : totalHours;

  return (
    <Card className="justify-between">
      <h3 className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-3">
        Répartition du temps
      </h3>

      {repartitionData.length > 0 ? (
        <>
          <div className="h-44 w-full relative flex items-center justify-center my-1">
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
              <span className="text-xl font-semibold text-[var(--t1)] font-mono tabular-nums block leading-none">
                {Math.round(displayTotal)} h
              </span>
              <span className="text-[9px] uppercase font-medium tracking-wider text-[var(--t3)] block mt-0.5">Total</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1.5 text-xs pt-2">
            {repartitionData.map((item) => {
              const pct = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm inline-block shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[var(--t2)] text-[11px]">
                    {item.name}{' '}
                    <span className="font-mono font-semibold text-[var(--t1)] tabular-nums">{pct}%</span>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="h-40 flex items-center justify-center">
          <p className="text-xs text-[var(--t3)]">Aucune donnée de répartition</p>
        </div>
      )}
    </Card>
  );
};

export default TimeDistributionChart;
