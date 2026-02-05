import React from 'react';
import Badge from '../atoms/Badge';
import './AvailabilityManager.css';

const AvailabilityManager = ({ windows }) => {
    return (
        <div className="availability-card">
            <h3 className="section-title">Patient Availability</h3>

            <div className="windows-list">
                {windows.length > 0 ? (
                    windows.map((win, idx) => (
                        <div key={idx} className="window-item">
                            <div className="window-dates">
                                <span className="date-label">From:</span> {win.start}
                                <span className="separator">→</span>
                                <span className="date-label">To:</span> {win.end}
                            </div>
                            <Badge variant="success">Confirmed</Badge>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No availability windows set.</p>
                )}
            </div>

            {/* Placeholder for Add Action */}
            <button className="add-window-btn">+ Add Window</button>
        </div>
    );
};

export default AvailabilityManager;
