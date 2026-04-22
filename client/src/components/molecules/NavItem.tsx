import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import './NavItem.scss';

export interface NavItemProps {
    to: string;
    icon: LucideIcon;
    label: string;
    exact?: boolean;
    className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
    to, 
    icon: Icon, 
    label, 
    exact = false, 
    className = '' 
}) => {
    return (
        <NavLink
            to={to}
            end={exact}
            className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''} ${className}`
            }
        >
            <Icon size={20} className="nav-icon" />
            <span className="nav-label">{label}</span>
        </NavLink>
    );
};

export default NavItem;
