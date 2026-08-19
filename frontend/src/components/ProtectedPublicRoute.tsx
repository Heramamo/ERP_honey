import React from 'react'
import type { Role } from '../types/auth';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedPublicRouteProps {
  allowedRoles?: Role[];
}

const ProtectedPublicRoute: React.FC<ProtectedPublicRouteProps> = () => {
    const {isAuthenticated} = useAppSelector((state:RootState)=>state.auth)
    console.log(isAuthenticated)
    if (isAuthenticated)
        return <Navigate to={"/dashboard"} replace />
    return <Outlet/>
}

export default ProtectedPublicRoute