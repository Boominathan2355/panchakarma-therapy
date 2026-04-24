import React from 'react';
import './Avatar.scss';

export interface AvatarProps {
    name?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 'medium', className = '' }) => {
    const getInitials = (n?: string): string => {
        if (!n) return '?';
        const parts = n.trim().split(' ');
        if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
        return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
    };

    return (
        <div className={`avatar avatar-${size} ${className}`} id={`avatar-${name?.replace(/\s+/g, '-').toLowerCase()}`}>
            <span className="avatar-text">{getInitials(name)}</span>
        </div>
    );
};

export default Avatar;
