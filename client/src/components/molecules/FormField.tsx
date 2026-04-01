import React from 'react';
import Label from '../atoms/Label';
import './FormField.css';

export interface FormFieldProps {
    label?: string;
    error?: string;
    children: React.ReactNode;
    id?: string;
    className?: string;
    required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    children,
    id,
    className = '',
    required = false
}) => {
    return (
        <div className={`form-field ${className} ${error ? 'has-error' : ''}`}>
            {label && (
                <Label htmlFor={id} className="field-label">
                    {label}
                    {required && <span className="required-star">*</span>}
                </Label>
            )}
            <div className="field-control">
                {children}
            </div>
            {error && <span className="field-error-message">{error}</span>}
        </div>
    );
};

export default FormField;
