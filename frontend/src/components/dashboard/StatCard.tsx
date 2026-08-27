import React from 'react';

export type GlowColor = 'blue' | 'amber' | 'emerald' | 'teal' | 'purple' | 'honey' | 'rose';

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

// Teinte du glyphe — l'alvéole de la carte reste en miel doux
const iconTints: Record<GlowColor, string> = {
  blue: 'text-[#6683a9]',
  amber: 'text-[var(--honey)]',
  emerald: 'text-[#3e8e5a]',
  teal: 'text-[#5ca493]',
  purple: 'text-[#9171b4]',
  honey: 'text-[var(--honey)]',
  rose: 'text-[#d85268]',
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
  const tint = iconTints[glowColor] || iconTints.blue;
  const finalIconColor = iconColor || tint;

  return (
    <div
      className={`folio rounded-2xl border border-[var(--border-subtle)] bg-[var(--panel)] p-5 flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_12px_32px_-16px_var(--honey-soft)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <span
              className="hex hidden sm:inline-flex items-center justify-center shrink-0"
              style={{
                width: '30px',
                height: '32px',
                background: 'var(--surface-faint)',
              }}
            >
              <span className={`flex items-center justify-center ${finalIconColor}`}>{icon}</span>
            </span>
          )}
          <span className="col-heat leading-tight">{title}</span>
        </div>
        {rightIndicator && <div className="shrink-0">{rightIndicator}</div>}
      </div>

      <div className="mt-4">
        <h2 className="font-display font-bold text-[1.85rem] leading-none tabular tracking-tight text-[var(--t1)]">
          {value}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-[var(--t3)] font-medium mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
};