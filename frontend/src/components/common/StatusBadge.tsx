import React from 'react';

type StatusType = 'Validé' | 'Payé' | 'En attente' | 'En révision';

interface StatusBadgeProps {
  status: StatusType;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = false }) => {
  const styles: Record<StatusType, string> = {
    'Validé': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Payé': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'En attente': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    'En révision': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border uppercase ${styles[status]}`}>
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />}
      {status}
    </span>
  );
};