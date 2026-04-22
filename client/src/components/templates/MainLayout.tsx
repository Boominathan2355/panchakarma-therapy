import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';
import Navbar from '../organisms/Navbar';
import { useUIStore } from '../../store/uiStore';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
    const { sidebarOpen, toggleSidebar } = useUIStore();
    const isCollapsed = !sidebarOpen;

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
