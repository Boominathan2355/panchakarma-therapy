import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Users, Calendar, Settings, FileText, ShieldAlert } from 'lucide-react';
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

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="brand-logo">AyurSoft</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavItem
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        icon={item.icon}
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
