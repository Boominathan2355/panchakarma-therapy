import React from 'react';
import Sidebar from '../organisms/Sidebar';
import Navbar from '../organisms/Navbar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-container">
                <Navbar />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
