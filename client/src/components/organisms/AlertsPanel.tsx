import React from 'react';
import Card from '../atoms/Card';
import AlertItem from '../molecules/AlertItem';
import { Bell, MoreHorizontal } from 'lucide-react';
import './AlertsPanel.css';

export interface Alert {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
}

export interface AlertsPanelProps {
    alerts: Alert[];
    className?: string;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, className = '' }) => {
    return (
        <Card 
            className={`alerts-panel ${className}`} 
            title="System Alerts"
            action={<button className="icon-btn"><MoreHorizontal size={20} /></button>}
        >
            <div className="alerts-container">
                {alerts.length > 0 ? (
                    alerts.map((alert) => (
                        <AlertItem
                            key={alert.id}
                            title={alert.title}
                            message={alert.message}
                            type={alert.type}
                        />
                    ))
                ) : (
                    <div className="empty-alerts">
                        <Bell size={32} className="empty-icon" />
                        <p>No new system alerts</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AlertsPanel;
