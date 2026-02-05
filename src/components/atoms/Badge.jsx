import React from 'react';
import './Badge.css';


const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'badge-default',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'badge-info',
    };

    // Vanilla CSS classes are defined in index.css (will update next)
    const baseClass = 'badge';
    const variantClass = variants[variant] || variants.default;

    return (
        <span className={`${baseClass} ${variantClass} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
