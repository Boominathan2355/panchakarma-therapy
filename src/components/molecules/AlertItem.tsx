import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import './AlertItem.css';

export interface AlertItemProps {
    title: string;
    message?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    className?: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ 
    title, 
    message, 
    type = 'info', 
    className = '' 
}) => {
    const icons = {
        info: <Info className="alert-icon info" size={20} />,
        success: <CheckCircle className="alert-icon success" size={20} />,
        warning: <AlertTriangle className="alert-icon warning" size={20} />,
        error: <AlertCircle className="alert-icon error" size={20} />,
    };

    return (
        <div className={`alert-item alert-${type} ${className}`}>
            <div className="alert-icon-container">
                {icons[type]}
            </div>
            <div className="alert-content">
                <h4 className="alert-title">{title}</h4>
                {message && <p className="alert-message">{message}</p>}
            </div>
        </div>
    );
};

export default AlertItem;
