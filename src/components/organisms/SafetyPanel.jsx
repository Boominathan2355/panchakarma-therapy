import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import './SafetyPanel.css';

const SafetyPanel = ({ contraindications = [], safetyNotes }) => {
    return (
        <div className="safety-panel">
            <div className="safety-section">
                <div className="section-head">
                    <AlertTriangle className="text-error" size={20} />
                    <h3>Contraindications</h3>
                </div>
                <ul className="contra-list">
                    {contraindications.map((item, idx) => (
                        <li key={idx}> {item}</li>
                    ))}
                    {contraindications.length === 0 && <li>None listed.</li>}
                </ul>
            </div>

            <div className="safety-section note-section">
                <div className="section-head">
                    <ShieldCheck className="text-info" size={20} />
                    <h3>Safety Protocols</h3>
                </div>
                <p className="safety-notes">{safetyNotes || "No specific safety notes provided."}</p>
            </div>
        </div>
    );
};

export default SafetyPanel;
