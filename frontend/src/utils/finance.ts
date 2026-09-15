export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  const rounded = Math.round(value);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatAr = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '0 Ar';
  return `${formatNumber(value)} Ar`;
};

const POLE_PALETTE = [
  { iconBg: 'bg-[var(--info-bg)] text-[var(--info)] border border-[var(--info-line)]', dot: 'bg-[var(--info)]' },
  { iconBg: 'bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-line)]', dot: 'bg-[var(--success)]' },
  { iconBg: 'bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning-line)]', dot: 'bg-[var(--warning)]' },
  { iconBg: 'bg-[var(--info-bg)] text-[var(--info)] border border-[var(--info-line)]', dot: 'bg-[var(--info)]' },
  { iconBg: 'bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning-line)]', dot: 'bg-[var(--warning)]' },
  { iconBg: 'bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-line)]', dot: 'bg-[var(--success)]' },
  { iconBg: 'bg-[var(--surface-hover)] text-[var(--t2)] border border-[var(--line)]', dot: 'bg-[var(--t3)]' },
];

export const getPoleBadgeStyle = (id: number): string => POLE_PALETTE[id % POLE_PALETTE.length].iconBg;
export const getPoleDot = (id: number): string => POLE_PALETTE[id % POLE_PALETTE.length].dot;
