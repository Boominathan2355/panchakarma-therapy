import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import Button from '../atoms/Button';
import './ConflictModal.css';

const ConflictModal = ({ conflict, onClose, onForce }) => {
    if (!conflict) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="header-title">
                        <AlertCircle className="text-error" size={24} />
                        <h3>Scheduling Conflict</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <p>The session <strong>{conflict.title}</strong> overlaps with an existing appointment in this room/time slot.</p>
                    <div className="conflict-details">
                        <p>Requested: {conflict.start.toLocaleTimeString()} - {conflict.end.toLocaleTimeString()}</p>
                    </div>
                </div>

                <div className="modal-footer">
                    <Button variant="outline" onClick={onClose}>Cancel Move</Button>
                    <Button variant="primary" className="bg-error" onClick={() => onForce(conflict)}>Force Schedule</Button>
                </div>
            </div>
        </div>
    );
};

export default ConflictModal;
