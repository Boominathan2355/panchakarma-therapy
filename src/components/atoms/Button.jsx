import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    disabled = false,
    className = '',
    ...props
}) => {
    // Base class 'btn' + variant class + size class
    const classNames = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="spinner" size={16} />}
            {children}
        </button>
    );
};

export default Button;
