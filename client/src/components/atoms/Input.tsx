import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean | string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {
    const classNames = [
        'input-field',
        error ? 'input-error' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <input
            ref={ref}
            className={classNames}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;
