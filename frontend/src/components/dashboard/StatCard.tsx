import React from 'react';

export type GlowColor = 'blue' | 'amber' | 'emerald' | 'teal' | 'purple';

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  glowColor?: GlowColor;
  rightIndicator?: React.ReactNode;
  className?: string;
}

// Configuration des ombres portées lumineuses et des bordures brillantes
const glowStyles: Record<GlowColor, { border: string; shadow: string; icon: string }> = {
  blue: {
    border: 'border-blue-500/50 hover:border-blue-400',
    shadow: 'shadow-[0_0_18px_rgba(59,130,246,0.22)] hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]',
    icon: 'text-blue-400',
  },
  amber: {
    border: 'border-amber-500/60 hover:border-amber-400',
    shadow: 'shadow-[0_0_18px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.40)]',
    icon: 'text-amber-500',
  },
  emerald: {
    border: 'border-emerald-500/50 hover:border-emerald-400',
    shadow: 'shadow-[0_0_18px_rgba(16,185,129,0.22)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    icon: 'text-emerald-400',
  },
  teal: {
    border: 'border-teal-500/50 hover:border-teal-400',
    shadow: 'shadow-[0_0_18px_rgba(20,184,166,0.22)] hover:shadow-[0_0_25px_rgba(20,184,166,0.35)]',
    icon: 'text-teal-400',
  },
  purple: {
    border: 'border-purple-500/50 hover:border-purple-400',
    shadow: 'shadow-[0_0_18px_rgba(168,85,247,0.22)] hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]',
    icon: 'text-purple-400',
  },
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
  const glow = glowStyles[glowColor] || glowStyles.blue;
  const finalIconColor = iconColor || glow.icon;

  return (
    <div
      className={`bg-[#111726] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${glow.border} ${glow.shadow} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${finalIconColor}`}>
          {icon}
          <span className="text-xs font-semibold text-slate-300">{title}</span>
        </div>
        {rightIndicator && <div>{rightIndicator}</div>}
      </div>

      <div className="mt-4">
        <h2 className="text-3xl font-black text-white tracking-tight">{value}</h2>
        {subtitle && (
          <p className="text-[11px] text-slate-400 font-medium mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};