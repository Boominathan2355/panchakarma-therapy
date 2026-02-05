import React, { forwardRef } from 'react';
import './Input.css';


const Input = forwardRef(({ className = '', error, ...props }, ref) => {
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
