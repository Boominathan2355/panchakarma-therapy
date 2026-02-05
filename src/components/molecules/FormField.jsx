import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import './FormField.css';

const FormField = ({ label, id, type = 'text', placeholder, error, ...props }) => {
    return (
        <div className="form-field-group">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                error={!!error}
                {...props}
            />
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default FormField;
