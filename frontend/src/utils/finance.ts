export const formatAr = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '0 Ar';
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar`;
};

const POLE_PALETTE = [
  { iconBg: 'bg-[#24463a] text-[#7fd0b8] border border-[#3e8e5a]/40', dot: 'bg-[#5CA493]' },
  { iconBg: 'bg-[#3a2a12] text-[#e5a73a] border border-[#8a5a14]/40', dot: 'bg-[#E5A73A]' },
  { iconBg: 'bg-[#33201d] text-[#d85268] border border-[#8a2424]/40', dot: 'bg-[#D85268]' },
  { iconBg: 'bg-[#2c2540] text-[#b08ac9] border border-[#7e4fa3]/40', dot: 'bg-[#9171B4]' },
  { iconBg: 'bg-[#1f2a3a] text-[#8aa6c8] border border-[#4a6a8f]/40', dot: 'bg-[#6683A9]' },
  { iconBg: 'bg-[#1e3526] text-[#7fc39a] border border-[#3e8e5a]/40', dot: 'bg-[#3E8E5A]' },
  { iconBg: 'bg-[var(--chip)] text-[var(--t2)] border border-[var(--border-subtle)]', dot: 'bg-[var(--t3)]' },
];

export const getPoleBadgeStyle = (id: number): string => POLE_PALETTE[id % POLE_PALETTE.length].iconBg;
export const getPoleDot = (id: number): string => POLE_PALETTE[id % POLE_PALETTE.length].dot;
