import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAvailabilityWindow } from '../../store/slices/patientSlice';
import Badge from '../atoms/Badge';
import Skeleton from '../atoms/Skeleton';
import './AvailabilityManager.css';

const AvailabilityManager = ({ windows = [], loading = false }) => {
    const dispatch = useDispatch();
    const [isAdding, setIsAdding] = useState(false);
    const [newWindow, setNewWindow] = useState({ start: '', end: '' });

    if (loading) {
        return (
            <div className="availability-card loading">
                <h3 className="section-title">Patient Availability</h3>
                <div className="windows-list">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="window-item">
                            <Skeleton width="100%" height="40px" />
                        </div>
                    ))}
                </div>
                <Skeleton width="100px" height="32px" style={{ marginTop: '1rem' }} />
            </div>
        );
    }

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setNewWindow({ start: '', end: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newWindow.start && newWindow.end) {
            dispatch(addAvailabilityWindow({ ...newWindow, confirmed: true }));
            handleCancel();
        }
    };

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

            {isAdding ? (
                <form className="add-window-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Start Time</label>
                        <input
                            type="datetime-local"
                            value={newWindow.start}
                            onChange={(e) => setNewWindow({ ...newWindow, start: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <input
                            type="datetime-local"
                            value={newWindow.end}
                            onChange={(e) => setNewWindow({ ...newWindow, end: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="submit-btn">Save Window</button>
                    </div>
                </form>
            ) : (
                <button className="add-window-btn" onClick={handleAddClick}>+ Add Window</button>
            )}
        </div>
    );
};

export default AvailabilityManager;
