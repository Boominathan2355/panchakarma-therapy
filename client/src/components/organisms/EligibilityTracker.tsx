import React, { useState } from 'react';
import { useTherapies } from '../../hooks/useTherapy';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Skeleton from '../atoms/Skeleton';
import './EligibilityTracker.css';

export interface EligibilityTrackerProps {
    patientConditions?: string[];
    loading?: boolean;
}

const EligibilityTracker: React.FC<EligibilityTrackerProps> = ({ 
    patientConditions = [], 
    loading = false 
}) => {
    const { data: therapies = [] } = useTherapies();
    const [selectedTherapyId, setSelectedTherapyId] = useState('');


    if (loading) {
        return (
            <div className="eligibility-card loading">
                <h3 className="section-title">Eligibility Checker</h3>
                <div className="eligibility-controls">
                    <Skeleton width="100%" height="40px" />
                </div>
                <div className="eligibility-result-skeleton" style={{ marginTop: '1rem' }}>
                    <Skeleton width="100%" height="80px" />
                </div>
            </div>
        );
    }

    const selectedTherapy = therapies.find(t => t.id === selectedTherapyId);

    let conflicts: string[] = [];
    if (selectedTherapy && patientConditions) {
        if (selectedTherapy.contraindications) {
            conflicts = patientConditions.filter(condition =>
                selectedTherapy.contraindications?.some(contra =>
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
                                {conflicts.map((c, i) => (
                                    <li key={i}>Patient has condition "<strong>{c}</strong>" which conflicts with this therapy.</li>
                                ))}
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
