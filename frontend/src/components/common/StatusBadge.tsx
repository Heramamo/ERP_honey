import React from 'react';

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
  className?: string;
}

const normalize = (s: string): string => {
  const upper = s.trim().toUpperCase();
  if (upper === 'PAYÉ' || upper === 'PAYE' || upper === 'PAID') return 'PAYÉ';
  if (upper === 'VALIDE' || upper === 'VALIDATED' || upper === 'VALIDE') return 'Validé';
  if (upper === 'EN_ATTENTE' || upper === 'EN ATTENTE' || upper === 'PENDING') return 'En attente';
  if (upper === 'EN_REVISION' || upper === 'EN RÉVISION') return 'En révision';
  if (upper === 'PERMANENT') return 'Permanent';
  if (upper === 'VACATAIRE') return 'Vacataire';
  if (upper === 'PRESTATAIRE') return 'Prestataire';
  return s;
};

const group = (s: string): 'success' | 'warning' | 'info' | 'muted' => {
  const n = normalize(s);
  if (n === 'Validé' || n === 'Payé' || n === 'PAYÉ' || n === 'Permanent') return 'success';
  if (n === 'En attente' || n === 'En révision') return 'warning';
  if (n === 'Vacataire' || n === 'Prestataire') return 'info';
  return 'muted';
};

const styles: Record<string, string> = {
  success:
    'text-[var(--success)] bg-[var(--success-bg)] border-[var(--success-line)]',
  warning:
    'text-[var(--warning)] bg-[var(--warning-bg)] border-[var(--warning-line)]',
  info: 'text-[var(--info)] bg-[var(--info-bg)] border-[var(--info-line)]',
  muted: 'text-[var(--t2)] bg-[var(--chip)] border-[var(--line)]',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = false, className = '' }) => {
  const g = group(status);
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border whitespace-nowrap ${styles[g]} ${className}`}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />}
      {normalize(status)}
    </span>
  );
};
