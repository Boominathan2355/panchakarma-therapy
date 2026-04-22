import React from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    ClipboardList, 
    Package, 
    ShieldCheck,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';
import NavItem from '../molecules/NavItem';
import './Sidebar.scss';

export interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const navGroups = [
        {
            title: 'Overview',
            items: [
                { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { to: '/scheduler', icon: Calendar, label: 'Scheduling' },
            ]
        },
        {
            title: 'Management',
            items: [
                { to: '/patients', icon: Users, label: 'Patients' },
                { to: '/therapies', icon: ClipboardList, label: 'Therapies' },
                { to: '/resources', icon: Package, label: 'Resources' },
            ]
        },
        {
            title: 'System',
            items: [
                { to: '/audit', icon: ShieldCheck, label: 'Audit Logs' },
                { to: '/settings', icon: Settings, label: 'Settings' },
            ]
        }
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!isCollapsed && (
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Search..." />
                    </div>
                )}
                <button className="toggle-btn" onClick={onToggle}>
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <div className="sidebar-content">
                {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="nav-group">
                        {!isCollapsed && <h5 className="group-title">{group.title}</h5>}
                        {group.items.map((item, itemIdx) => (
                            <NavItem
                                key={itemIdx}
                                to={item.to}
                                icon={item.icon}
                                label={item.label}
                                className={isCollapsed ? 'collapsed' : ''}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="system-status">
                        <div className="status-dot online" />
                        <span>System Online</span>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
