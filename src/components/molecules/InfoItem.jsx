import React from 'react';
import './InfoItem.css';

const InfoItem = ({ label, value }) => {
    return (
        <div className="info-item">
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
        </div>
    );
};

export default InfoItem;
