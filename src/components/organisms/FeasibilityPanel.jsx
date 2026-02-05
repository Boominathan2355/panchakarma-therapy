import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Calendar, Users, Package } from 'lucide-react';
import Button from '../atoms/Button';
import './FeasibilityPanel.css';

const FeasibilityPanel = ({ therapy, feasibility, onCancel, onProceed }) => {
    if (!therapy || !feasibility) return null;

    const StatusIcon = ({ status }) => {
        if (status === 'ok') return <CheckCircle className="text-success" size={18} />;
        if (status === 'warning') return <AlertTriangle className="text-warning" size={18} />;
        return <XCircle className="text-error" size={18} />;
    };

    return (
        <div className="feasibility-panel">
            <div className="panel-header">
                <h3>Feasibility Assessment: {therapy.name}</h3>
                <span className="therapy-duration">{therapy.duration} mins / session</span>
            </div>

            <div className="assessment-section">
                <div className="section-header">
                    <Users size={18} />
                    <span>Therapist Availability</span>
                    <StatusIcon status={feasibility.therapists.status} />
                </div>
                <ul className="availability-list">
                    {feasibility.therapists.available.map((t, idx) => (
                        <li key={idx}>
                            <strong>{t.name}</strong>
                            <span className="time-slots">{t.slots}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="assessment-section">
                <div className="section-header">
                    <Package size={18} />
                    <span>Material Inventory</span>
                    <StatusIcon status={feasibility.materials.status} />
                </div>
                <ul className="material-list">
                    {feasibility.materials.items.map((m, idx) => (
                        <li key={idx} className={m.level}>
                            <span>{m.name}</span>
                            <span className="stock-level">{m.quantity} units</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="assessment-section">
                <div className="section-header">
                    <Calendar size={18} />
                    <span>Booking Window</span>
                    <StatusIcon status={feasibility.booking.status} />
                </div>
                <div className="booking-info">
                    <p>Next available slot: <strong>{feasibility.booking.nextSlot}</strong></p>
                    <p className="text-muted">{feasibility.booking.note}</p>
                </div>
            </div>

            <div className="panel-actions">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button variant="primary" onClick={onProceed}>Proceed to Schedule</Button>
            </div>
        </div>
    );
};

export default FeasibilityPanel;
