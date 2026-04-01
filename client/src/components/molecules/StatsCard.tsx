import React from 'react';
import Card from '../atoms/Card';
import { LucideIcon } from 'lucide-react';
import './StatsCard.css';

export interface StatsCardProps {
    title: string;
    value: string | number | undefined;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    } | number;
    description?: string;
    className?: string;
    loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    description,
    className = '',
    loading = false
}) => {
    if (loading) {
        return (
            <Card className={`stats-card loading ${className}`}>
                <div className="stats-header">
                    <div className="skeleton-icon" />
                    <div className="skeleton-title" />
                </div>
                <div className="stats-body">
                    <div className="skeleton-value" />
                </div>
            </Card>
        );
    }

    const renderTrend = () => {
        if (!trend) return null;
        
        const trendValue = typeof trend === 'number' ? trend : trend.value;
        const isUp = typeof trend === 'number' ? trend >= 0 : trend.isUp;
        
        return (
            <div className={`stats-trend ${isUp ? 'trend-up' : 'trend-down'}`}>
                {isUp ? '+' : ''}{trendValue}%
            </div>
        );
    };

    return (
        <Card className={`stats-card ${className}`}>
            <div className="stats-header">
                <div className="stats-icon-wrapper">
                    <Icon size={24} className="stats-icon" />
                </div>
                <h4 className="stats-title">{title}</h4>
            </div>
            <div className="stats-body">
                <div className="stats-value">{value ?? 0}</div>
                {renderTrend()}
            </div>
            {description && <p className="stats-description">{description}</p>}
        </Card>
    );
};

export default StatsCard;
