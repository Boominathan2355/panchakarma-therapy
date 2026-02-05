import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import './AlertItem.css';

const AlertItem = ({ type, message, time }) => {
    const icons = {
        warning: <AlertTriangle className="text-warning" size={18} />,
        error: <AlertCircle className="text-error" size={18} />,
        success: <CheckCircle className="text-success" size={18} />,
        info: <Info className="text-info" size={18} />,
    };

    return (
        <div className={`alert-item alert-item-${type}`}>
            <div className="alert-icon-wrapper">
                {icons[type] || icons.info}
            </div>
            <div className="alert-content">
                <p className="alert-message">{message}</p>
                <span className="alert-time">{time}</span>
            </div>
        </div>
    );
};

export default AlertItem;
