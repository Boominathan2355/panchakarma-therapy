import React from 'react';
import { Clock } from 'lucide-react';
import './MedicalHistory.css';

const MedicalHistory = ({ history }) => {
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
                                <p className="timeline-desc">{item.notes}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No history recorded.</p>
                )}
            </div>
        </div>
    );
};

export default MedicalHistory;
