import React from 'react';
import './Skeleton.css';

const Skeleton = ({ variant = 'text', width, height, borderRadius, className = '' }) => {
    const style = {
        width: width || (variant === 'circle' ? '40px' : '100%'),
        height: height || (variant === 'text' ? '1rem' : '40px'),
        borderRadius: borderRadius || (variant === 'circle' ? '50%' : 'var(--radius-md)')
    };

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={style}
        ></div>
    );
};

export default Skeleton;
