import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isLoading) {
        return <div className="p-8 text-center text-muted">Loading...</div>; // Simple loading state
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check
    if (allowedRoles) {
        const userRole = user?.role?.toLowerCase();
        const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

        if (!hasPermission) {
            return <div className="p-8 text-center text-error">Access Denied: You do not have permission to view this page.</div>;
        }
    }

    return <Outlet />;
};

PrivateRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
