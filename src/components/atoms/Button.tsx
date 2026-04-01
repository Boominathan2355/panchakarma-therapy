import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large' | 'icon';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    disabled = false,
    className = '',
    ...props
}) => {
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
