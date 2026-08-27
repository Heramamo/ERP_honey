import React from 'react';

type StatusType = 'Validé' | 'Payé' | 'En attente' | 'En révision';

interface StatusBadgeProps {
  status: StatusType;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = false }) => {
  const styles: Record<StatusType, string> = {
    'Validé': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    'Payé': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    'En attente': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'En révision': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  };

  return (
    <span
      className={`font-mono text-[9px] font-semibold tracking-[0.12em] px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border uppercase ${styles[status]}`}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />}
      {status}
    </span>
  );
};