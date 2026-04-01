import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import NotificationBell from '../molecules/NotificationBell';
import Avatar from '../atoms/Avatar';
import { LogOut, Settings, User } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="brand-text">Panchakarma</span>
                <span className="brand-suffix">Therapy</span>
            </div>

            <div className="navbar-actions">
                <NotificationBell />
                
                <div className="user-profile">
                    <Avatar name={user?.name} size="small" />
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-role">{user?.role || 'Guest'}</span>
                    </div>
                    
                    <div className="user-dropdown">
                        <button className="dropdown-item">
                            <User size={16} /> Profile
                        </button>
                        <button className="dropdown-item">
                            <Settings size={16} /> Settings
                        </button>
                        <hr />
                        <button className="dropdown-item logout" onClick={handleLogout}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
