import React from 'react';
import { Clock } from 'lucide-react';
import Skeleton from '../atoms/Skeleton';
import './MedicalHistory.css';

export interface HistoryEntry {
    date: string;
    type: string;
    notes?: string;
}

export interface MedicalHistoryProps {
    history?: HistoryEntry[];
    loading?: boolean;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ history = [], loading = false }) => {
    if (loading) {
        return (
            <div className="history-card loading">
                <h3 className="section-title">Medical History</h3>
                <div className="timeline">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <Skeleton width="100px" height="0.8rem" className="mb-2" />
                                <Skeleton width="150px" height="1.2rem" className="mb-1" />
                                <Skeleton width="100%" height="0.8rem" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="history-card">
            <h3 className="section-title">Medical History</h3>

            <div className="timeline">
                {history.length > 0 ? (
                    history.map((item, idx) => (
                        <div key={idx} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <div className="timeline-date">
                                    <Clock size={14} className="mr-1" />
                                    {item.date}
                                </div>
                                <h4 className="timeline-title">{item.type}</h4>
                                {item.notes && <p className="timeline-desc">{item.notes}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-history">No history recorded.</p>
                )}
            </div>
        </div>
    );
};

export default MedicalHistory;
