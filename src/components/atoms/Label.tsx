import React from 'react';
import './Label.css';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, htmlFor, className = '', ...props }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`label ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;
