import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavItem.css';

const NavItem = ({ to, icon: Icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
            <Icon size={20} className="nav-icon" />
            <span className="nav-label">{label}</span>
        </NavLink>
    );
};

export default NavItem;
