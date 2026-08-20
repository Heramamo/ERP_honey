import React from 'react';
import type { Role } from '../types/auth';
import { useAppSelector } from '../store/hooks';
import UnauthorizedPage from '../pages/Unauthorizedpage';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user && !allowedRoles.includes(user.role)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

export default RoleGuard;