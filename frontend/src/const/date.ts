const toDate = (value: string | Date): Date => {
  return value instanceof Date ? value : new Date(value);
};

export const formatDateShort = (value: string | Date): string => {
  const date = toDate(value);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR');
};

export const formatDateShortMonth = (value: string | Date): string => {
  const date = toDate(value);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

export const formatDateLong = (value: string | Date): string => {
  const date = toDate(value);
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatDateFull = (value: string | Date): string => {
  const date = toDate(value);
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatDateTime = (value: string | Date): string => {
  const date = toDate(value);
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const formatMonthYear = (value: string | Date): string => {
  const date = toDate(value);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};

export const formatTime = (value: string | Date): string => {
  const date = toDate(value);
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export const formatRelativeDate = (value: string | Date): string => {
  const date = toDate(value);
  if (isNaN(date.getTime())) return '-';

  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return formatDateShort(date);
};