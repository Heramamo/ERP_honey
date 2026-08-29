import React from 'react';

export type GlowColor = 'blue' | 'amber' | 'emerald' | 'teal' | 'purple';

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  iconColor?: string;
  glowColor?: GlowColor;
  rightIndicator?: React.ReactNode;
  className?: string;
}

// Subtle, professional accent treatment — a soft tinted icon chip,
// not a neon glow. Designed to read as a calm, crafted surface.
const accentStyles: Record<GlowColor, { chip: string; icon: string }> = {
  blue: { chip: 'bg-[var(--info-bg)] border-[var(--info-line)]', icon: 'text-[var(--info)]' },
  amber: { chip: 'bg-[var(--accent-soft)] border-[var(--accent)]/25', icon: 'text-[var(--accent)]' },
  emerald: { chip: 'bg-[var(--success-bg)] border-[var(--success-line)]', icon: 'text-[var(--success)]' },
  teal: { chip: 'bg-[var(--success-bg)] border-[var(--success-line)]', icon: 'text-[var(--success)]' },
  purple: { chip: 'bg-[var(--info-bg)] border-[var(--info-line)]', icon: 'text-[var(--info)]' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  glowColor = 'blue',
  rightIndicator,
  className = '',
}) => {
  const accent = accentStyles[glowColor] || accentStyles.blue;
  const finalIconColor = iconColor || accent.icon;

  return (
    <div
      className={`bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-[var(--line-strong)] hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`flex items-center gap-2.5 min-w-0`}>
          {icon && (
            <span className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center ${accent.chip} ${finalIconColor}`}>
              {icon}
            </span>
          )}
          <span className="text-[13px] font-semibold text-[var(--t2)] truncate">{title}</span>
        </div>
        {rightIndicator && <div className="shrink-0">{rightIndicator}</div>}
      </div>

      <div className="mt-4">
        <h2 className="text-[26px] font-bold text-[var(--t1)] tracking-tight leading-tight">{value}</h2>
        {subtitle && (
          <p className="text-[12px] text-[var(--t3)] font-medium mt-1.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
