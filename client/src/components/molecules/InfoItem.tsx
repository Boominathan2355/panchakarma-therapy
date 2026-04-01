import React from 'react';
import './InfoItem.css';

export interface InfoItemProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, className = '' }) => {
    return (
        <div className={`info-item ${className}`}>
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
        </div>
    );
};

export default InfoItem;
