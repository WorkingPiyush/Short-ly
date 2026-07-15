import FullScreenLoader from '@/components/FullScreenLoader';
import { useUser } from '@/Hooks/useAuth'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedLayout() {
    const { data: user, isLoading } = useUser();
    if (isLoading) return <FullScreenLoader />;
    if (!user) return <Navigate to='/login' replace />;
    return <Outlet />;
}

export default ProtectedLayout
