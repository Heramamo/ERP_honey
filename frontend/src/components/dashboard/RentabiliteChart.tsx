import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from '../ui/Card';
import { chartAxis, chartGridStroke, chartTooltipStyle } from './chartTheme';

const rentabiliteData = [
  { pole: 'IT', revenus: 16000000, charges: 6500000 },
  { pole: 'Format.', revenus: 14000000, charges: 7800000 },
  { pole: 'Événem.', revenus: 7200000, charges: 8300000 },
  { pole: 'Touris.', revenus: 8800000, charges: 3500000 },
];

// Helper pour formater proprement les montants dans le survol (ex: 16 000 000 AR)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR').format(value) + ' AR';
};

export const RentabiliteChart: React.FC = () => {
  return (
    <Card tone="subtle">
      {/* En-tête de la carte */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[var(--t1)]">Rentabilité par pôle d'activité</h3>
        <div className="flex items-center gap-4 text-[11px] text-[var(--t3)] font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#6683a9] inline-block" />
            Revenus
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#e5a73a] inline-block" />
            Charges
          </span>
        </div>
      </div>

      {/* Conteneur du graphique */}
      <div className="h-60 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rentabiliteData} barGap={8}>
            {/* Lignes de repère horizontales subtiles */}
            <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />

            {/* Axe X (Pôles d'activité) */}
            <XAxis dataKey="pole" {...chartAxis} />

            {/* Axe Y (Repères de chiffres en Millions) */}
            <YAxis
              {...chartAxis}
              tickFormatter={(val) => `${val / 1000000}M`}
            />

            {/* Infobulle (Tooltip) avec formatage monétaire */}
            <Tooltip
              contentStyle={chartTooltipStyle}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
              formatter={(value) => [formatCurrency(Number(value)), '']}
            />

            {/* Barres du graphique */}
            <Bar dataKey="revenus" fill="#6683a9" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="charges" fill="#e5a73a" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
