import React from 'react';
import AlertItem from '../molecules/AlertItem';
import './AlertsPanel.css';

const AlertsPanel = ({ alerts }) => {
    return (
        <div className="alerts-panel-container">
            <h3 className="section-title">System Alerts & Notifications</h3>
            <div className="alerts-list">
                {alerts.map((alert) => (
                    <AlertItem
                        key={alert.id}
                        type={alert.type}
                        message={alert.message}
                        time={alert.time}
                    />
                ))}
                {alerts.length === 0 && (
                    <p className="text-center text-muted py-4">No active alerts</p>
                )}
            </div>
        </div>
    );
};

export default AlertsPanel;
