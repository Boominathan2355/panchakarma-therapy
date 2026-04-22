import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth';

export interface PrivateRouteProps {
    allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 h-full">
                <div className="text-muted animate-pulse">Checking authorization...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user?.role?.toLowerCase();
        const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

        if (!hasPermission) {
            return (
                <div className="flex flex-col items-center justify-center p-8 h-full text-center">
                    <h3 className="text-error mb-2">Access Denied</h3>
                    <p className="text-muted">You do not have permission to view this page.</p>
                </div>
            );
        }
    }

    return <Outlet />;
};

export default PrivateRoute;
