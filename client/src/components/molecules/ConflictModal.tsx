import React from 'react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { AlertTriangle, X } from 'lucide-react';
import './ConflictModal.css';

export interface ConflictModalProps {
    isOpen?: boolean;
    onClose: () => void;
    conflict: {
        type: string;
        message: string;
        preemptionTarget?: any;
    } | null;
    onResolve?: (action: string) => void;
    onForce?: () => void;
    isProcessing?: boolean;
}

const ConflictModal: React.FC<ConflictModalProps> = ({
    isOpen,
    onClose,
    conflict,
    onResolve,
    onForce,
    isProcessing = false
}) => {
    // Both isOpen prop and conflict existence can trigger visibility
    const visible = isOpen !== undefined ? isOpen : !!conflict;
    if (!visible || !conflict) return null;

    return (
        <div className="modal-overlay">
            <Card className="conflict-modal">
                <div className="modal-header">
                    <div className="header-title">
                        <AlertTriangle className="text-warning mr-2" size={24} />
                        <h3>Scheduling Conflict Detected</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="conflict-info">
                        <p className="conflict-type"><strong>Type:</strong> {conflict.type}</p>
                        <p className="conflict-message">{conflict.message}</p>
                    </div>

                    {conflict.preemptionTarget && (
                        <div className="preemption-info">
                            <p className="hint">This conflict involves a lower priority session that can be preempted.</p>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
                        Cancel
                    </Button>
                    {onForce && (
                        <Button variant="warning" onClick={onForce} disabled={isProcessing}>
                            Force Schedule
                        </Button>
                    )}
                    {conflict.preemptionTarget && onResolve && (
                        <Button variant="danger" onClick={() => onResolve('preempt')} isLoading={isProcessing}>
                            Preempt Session
                        </Button>
                    )}
                    {!conflict.preemptionTarget && onResolve && (
                        <Button variant="primary" onClick={() => onResolve('reschedule')} isLoading={isProcessing}>
                            Find Alternative
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ConflictModal;
