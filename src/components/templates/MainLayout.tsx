import React, { useState } from 'react';
import Sidebar from '../organisms/Sidebar';
import Navbar from '../organisms/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import './MainLayout.css';

const MainLayout: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    return (
        <div className={`main-layout ${isCollapsed ? 'collapsed' : ''}`}>
            <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
            <div className="main-container">
                {isDashboard && <Navbar />}
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
