import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavItem.css';

const NavItem = ({ to, icon: Icon, label, isCollapsed }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
            title={label}
        >
            <Icon size={20} className="nav-icon" />
            {!isCollapsed && <span className="nav-label">{label}</span>}
        </NavLink>
    );
};

export default NavItem;
