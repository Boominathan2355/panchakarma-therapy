import React from 'react';
import { useAuth } from '../../features/auth';
import NotificationBell from '../molecules/NotificationBell';
import Avatar from '../atoms/Avatar';
import { LogOut, Settings, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.scss';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
    };


    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="brand-text">Panchakarma</span>
                <span className="brand-suffix">Therapy</span>
            </div>

            <div className="navbar-actions">
                <button 
                    className="btn-theme-toggle" 
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

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
