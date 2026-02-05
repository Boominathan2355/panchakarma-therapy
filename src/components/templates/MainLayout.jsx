import React from 'react';
import Sidebar from '../organisms/Sidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
