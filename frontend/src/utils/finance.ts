export const formatAr = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '0 Ar';
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar`;
};

const POLE_PALETTE = [
  { iconBg: 'bg-[#1E293B] text-[#38BDF8] border border-[#0284C7]/30', dot: 'bg-[#38BDF8]' },
  { iconBg: 'bg-[#064E3B] text-[#34D399] border border-[#059669]/30', dot: 'bg-[#34D399]' },
  { iconBg: 'bg-[#2D1B18] text-[#F97316] border border-[#7C2D12]/40', dot: 'bg-[#F97316]' },
  { iconBg: 'bg-[#134E4A] text-[#2DD4BF] border border-[#0D9488]/30', dot: 'bg-[#2DD4BF]' },
  { iconBg: 'bg-[#3B0764] text-[#C084FC] border border-[#7E22CE]/30', dot: 'bg-[#C084FC]' },
  { iconBg: 'bg-[#172554] text-[#60A5FA] border border-[#1D4ED8]/30', dot: 'bg-[#60A5FA]' },
  { iconBg: 'bg-gray-800 text-gray-300 border border-gray-700', dot: 'bg-gray-400' },
];

export const getPoleBadgeStyle = (id: number): string => POLE_PALETTE[id % POLE_PALETTE.length].iconBg;
export const getPoleDot = (id: number): string => POLE_PALETTE[id % POLE_PALETTE.length].dot;
