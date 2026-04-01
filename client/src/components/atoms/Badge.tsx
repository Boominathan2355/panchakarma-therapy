import React from 'react';
import './Badge.css';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'badge-default',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'badge-info',
    };

    const baseClass = 'badge';
    const variantClass = variants[variant] || variants.default;

    return (
        <span className={`${baseClass} ${variantClass} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
