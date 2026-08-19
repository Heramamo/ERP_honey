export const getInitials = (email?: string): string => {
  if (!email) return 'HG';
  const parts = email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  return initials || 'HG';
};

export const formatDisplayName = (email?: string): string => {
  if (!email) return 'Utilisateur';
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};
