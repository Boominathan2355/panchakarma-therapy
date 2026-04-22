import React from 'react';
import './Skeleton.css';

export interface SkeletonProps {
    variant?: 'text' | 'circle' | 'rectangle';
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
    variant = 'text', 
    width, 
    height, 
    borderRadius, 
    className = '',
    style = {}
}) => {
    const computedStyle: React.CSSProperties = {
        width: width || (variant === 'circle' ? '40px' : '100%'),
        height: height || (variant === 'text' ? '1rem' : '40px'),
        borderRadius: borderRadius || (variant === 'circle' ? '50%' : 'var(--radius-md)')
    };

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={{ ...computedStyle, ...style }}
        ></div>
    );
};

export default Skeleton;
