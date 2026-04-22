import React, { useState, useEffect } from 'react';
import { useUpdateSession, useLogSessionNote } from '../../hooks/useSchedule';
import therapyService from '../../services/therapyService';
import {
    X,
    Play,
    CheckCircle,
    Clock,
    AlertTriangle,
    FileText,
    Box,
    Activity,
    ClipboardList
} from 'lucide-react';
import './SessionDetailModal.css';

export interface ClinicalNote {
    id: string;
    content: string;
    timestamp: string | Date;
}

export interface SessionData {
    id: string;
    therapyId: string;
    stepId?: string;
    type: string;
    title: string;
    start: string | Date;
    end: string | Date;
    status: 'scheduled' | 'in-progress' | 'completed';
    clinicalNotes?: ClinicalNote[];
}

export interface SessionDetailModalProps {
    session: SessionData | null;
    onClose: () => void;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, onClose }) => {
    const { mutate: updateSession } = useUpdateSession();
    const { mutate: logNote } = useLogSessionNote();
    const [therapy, setTherapy] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<any>(null);
    const [note, setNote] = useState('');
    const [status, setStatus] = useState<string>(session?.status || 'scheduled');

    useEffect(() => {
        if (session?.therapyId) {
            loadTherapyData();
        }
    }, [session]);

    const loadTherapyData = async () => {
        if (!session) return;
        const therapyData = await therapyService.getTherapyById(session.therapyId);
        setTherapy(therapyData);

        if (therapyData && session.stepId) {
            const step = therapyData.workflow.find((w: any) => w.id === session.stepId);
            setCurrentStep(step);
        }
    };

    const handleStatusChange = (newStatus: 'scheduled' | 'in-progress' | 'completed') => {
        if (!session) return;
        setStatus(newStatus);
        updateSession({ id: session.id, updates: { status: newStatus } as any });
    };

    const handleAddNote = () => {
        if (!session || !note.trim()) return;
        logNote({ id: session.id, note });
        setNote('');
    };

    if (!session) return null;

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'scheduled': return 'var(--text-secondary)';
            case 'in-progress': return 'var(--primary-color)';
            case 'completed': return '#22c55e';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="session-detail-overlay">
            <div className="session-detail-modal">
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <span className="session-type">{session.type}</span>
                    <h2>{session.title}</h2>
                    <div className="session-meta">
                        <span className="meta-item">
                            <Clock size={16} />
                            {new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                            {new Date(session.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="meta-item status" style={{ color: getStatusColor(status) }}>
                            <Activity size={16} />
                            {status.replace('-', ' ')}
                        </span>
                    </div>
                </div>

                <div className="modal-content">
                    {/* Status Control */}
                    <div className="status-control">
                        <button
                            className={`status-btn ${status === 'scheduled' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('scheduled')}
                        >
                            Scheduled
                        </button>
                        <button
                            className={`status-btn in-progress ${status === 'in-progress' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('in-progress')}
                        >
                            <Play size={16} /> In Progress
                        </button>
                        <button
                            className={`status-btn completed ${status === 'completed' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('completed')}
                        >
                            <CheckCircle size={16} /> Completed
                        </button>
                    </div>

                    {/* Step Guidance */}
                    {currentStep && (
                        <div className="guidance-section">
                            <div className="section-title">
                                <ClipboardList size={20} />
                                <h3>Current Step: {currentStep.action}</h3>
                            </div>

                            <div className="step-details">
                                <div className="detail-row">
                                    <span className="label">Step Note:</span>
                                    <p>{currentStep.notes}</p>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Duration:</span>
                                    <span className="value">{currentStep.duration}</span>
                                </div>
                            </div>

                            {currentStep.requiredMaterials && (
                                <div className="materials-list">
                                    <h4><Box size={16} /> Required Materials</h4>
                                    <ul>
                                        {currentStep.requiredMaterials.map((mat: any, idx: number) => (
                                            <li key={idx}>
                                                <span className="mat-name">{mat.name}</span>
                                                <span className="mat-qty">{mat.quantity} {mat.unit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {currentStep.precautions && (
                                <div className="precautions-list">
                                    <h4><AlertTriangle size={16} /> Precautions & Safety</h4>
                                    <ul>
                                        {currentStep.precautions.map((p: any, idx: number) => (
                                            <li key={idx}>{p}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Clinical Notes */}
                    <div className="notes-section">
                        <div className="section-title">
                            <FileText size={20} />
                            <h3>Clinical Notes</h3>
                        </div>

                        <div className="notes-list">
                            {session.clinicalNotes?.map((n) => (
                                <div key={n.id} className="note-item">
                                    <p>{n.content}</p>
                                    <span className="note-time">
                                        {new Date(n.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="add-note">
                            <textarea
                                placeholder="Add clinical observation..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <button onClick={handleAddNote} disabled={!note.trim()}>
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionDetailModal;
