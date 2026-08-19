import React from 'react'
import type { Role } from '../types/auth';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({allowedRoles}) => {
    const {isAuthenticated, user} = useAppSelector((state:RootState)=>state.auth)
    console.log(isAuthenticated)
    if (!isAuthenticated)
        return <Navigate to={"/login"} replace />
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet/>
}

export default ProtectedRoute