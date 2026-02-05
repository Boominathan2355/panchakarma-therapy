import React from 'react';
import './StatsCard.css';


const StatsCard = ({ title, value, description, icon: Icon, trend }) => {
    return (
        <div className="stat-card">
            <div className="stat-header">
                <h3 className="stat-title">{title}</h3>
                {Icon && <Icon className="stat-icon" size={20} />}
            </div>
            <div className="stat-content">
                <p className="stat-value">{value}</p>
                {description && <p className="stat-description">{description}</p>}
                {trend && (
                    <span className={`stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
