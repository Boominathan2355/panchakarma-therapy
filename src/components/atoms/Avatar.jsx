import React from 'react';
import './Avatar.css';

const Avatar = ({ name, size = 'medium', className = '' }) => {
    const getInitials = (n) => {
        if (!n) return '?';
        const parts = n.split(' ');
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <div className={`avatar avatar-${size} ${className}`}>
            <span className="avatar-text">{getInitials(name)}</span>
        </div>
    );
};

export default Avatar;
