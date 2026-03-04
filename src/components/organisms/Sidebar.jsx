import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard,
    Stethoscope,
    Users,
    Calendar,
    Settings,
    FileText,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    Menu
} from 'lucide-react';
import NavItem from '../molecules/NavItem';
import './Sidebar.css';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/therapies', label: 'Therapies', icon: Stethoscope },
    { to: '/scheduler', label: 'Scheduler', icon: Calendar },
    { to: '/resources', label: 'Resources', icon: FileText },
    { to: '/audit', label: 'Audit Log', icon: ShieldAlert },
    { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ isCollapsed, onToggle }) => {
    const { user } = useSelector((state) => state.auth);
    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!isCollapsed && <span className="brand-logo">AyurSoft</span>}
                <button className="sidebar-toggle-btn" onClick={onToggle} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems
                    .filter(item => {
                        const isDoctor = user?.role?.toLowerCase() === 'physician';
                        if (isDoctor && (item.label === 'Resources' || item.label === 'Audit Log')) {
                            return false;
                        }
                        return true;
                    })
                    .map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            label={item.label}
                            icon={item.icon}
                            isCollapsed={isCollapsed}
                        />
                    ))}
            </nav>

            <div className="sidebar-footer">
                {/* User profile or other footer items could go here */}
            </div>
        </aside>
    );
};

export default Sidebar;
