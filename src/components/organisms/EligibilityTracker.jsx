import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../atoms/Button';
import './EligibilityTracker.css';

const EligibilityTracker = ({ patientConditions }) => {
    const { therapies } = useSelector(state => state.therapy);
    const [selectedTherapyId, setSelectedTherapyId] = useState('');

    // Find selected therapy details
    const selectedTherapy = therapies.find(t => t.id === selectedTherapyId);

    // Check contradictions
    let conflicts = [];
    if (selectedTherapy && patientConditions) {
        // Simple string matching for demo purposes
        // In real app, this would use mapped codes (ICD-10 etc)
        // Here we just check if any safety note or contraindication strictly includes the condition name
        // Use manual intersection for the Mock Data

        // Mock Logic:
        // Vamana (t1) contraindications: Cardiac conditions, Elderly.
        // Patient p1 has Spondylosis, Hypertension.
        // Patient p3 has Cardiac conditions.

        if (selectedTherapy.contraindications) {
            conflicts = patientConditions.filter(condition =>
                selectedTherapy.contraindications.some(contra =>
                    contra.toLowerCase().includes(condition.toLowerCase()) ||
                    condition.toLowerCase().includes(contra.toLowerCase())
                )
            );
        }
    }

    return (
        <div className="eligibility-card">
            <h3 className="section-title">Eligibility Checker</h3>

            <div className="eligibility-controls">
                <select
                    className="therapy-select"
                    value={selectedTherapyId}
                    onChange={(e) => setSelectedTherapyId(e.target.value)}
                >
                    <option value="">-- Select Therapy to Validate --</option>
                    {therapies.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>

            {selectedTherapy && (
                <div className={`eligibility-result ${conflicts.length > 0 ? 'ineligible' : 'eligible'}`}>
                    {conflicts.length > 0 ? (
                        <>
                            <div className="result-header">
                                <AlertTriangle className="text-error" size={24} />
                                <span className="result-title text-error">Warning: Potential Contraindications</span>
                            </div>
                            <ul className="conflict-list">
                                {conflicts.map((c, i) => <li key={i}>Patient has condition "<strong>{c}</strong>" which conflicts with this therapy.</li>)}
                            </ul>
                        </>
                    ) : (
                        <div className="result-header">
                            <CheckCircle className="text-success" size={24} />
                            <span className="result-title text-success">No Direct Contraindications Found</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EligibilityTracker;
