import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, LogOut, User, Menu } from 'lucide-react';
import { logout, reset } from '../../store/slices/authSlice';
import NotificationBell from '../molecules/NotificationBell';
import Avatar from '../atoms/Avatar';
import './Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard';
        if (path.startsWith('/patients')) return 'Patients Management';
        if (path.startsWith('/therapies')) return 'Therapy Plans';
        if (path.startsWith('/scheduler')) return 'Session Scheduler';
        if (path.startsWith('/resources')) return 'Resource Management';
        if (path.startsWith('/settings')) return 'Settings';
        return 'Panchakarma Care';
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button className="mobile-menu-btn">
                    <Menu size={20} />
                </button>
                <h2 className="navbar-title">{getPageTitle()}</h2>
            </div>

            <div className="navbar-center">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search patients, therapies..." />
                </div>
            </div>

            <div className="navbar-right">
                <NotificationBell />

                <div className="divider"></div>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{user ? user.name : 'User'}</span>
                        <span className="user-role">{user ? user.role : 'Staff'}</span>
                    </div>
                    <Avatar size="sm" src={user?.avatar} name={user?.name} />
                </div>

                <button className="logout-icon-btn" onClick={onLogout} title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
