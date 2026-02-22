import React from 'react';
import { Calendar, ShieldAlert, CheckCircle, ArrowRightCircle } from 'lucide-react';
import StatsCard from '../molecules/StatsCard';
import './PatientStatsDashboard.css';

const PatientStatsDashboard = ({ patient, loading = false }) => {
    if (loading) {
        return (
            <div className="patient-stats-dashboard loading">
                <h3 className="dashboard-title">Patient Insights Dashboard</h3>
                <div className="stats-grid">
                    {[...Array(4)].map((_, i) => (
                        <StatsCard key={i} loading={true} />
                    ))}
                </div>
            </div>
        );
    }

    if (!patient) return null;

    // Calculate Risk Level based on conditions
    const getRiskLevel = () => {
        const count = patient.conditions?.length || 0;
        if (count >= 2) return { label: 'High', color: 'trend-down', value: count };
        if (count === 1) return { label: 'Medium', color: 'trend-warning', value: count };
        return { label: 'Low', color: 'trend-up', value: count };
    };

    const risk = getRiskLevel();
    const completedSessions = patient.history?.filter(h => h.type === 'Treatment').length || 0;
    const admissionDate = patient.history?.[0]?.date || 'N/A';

    return (
        <div className="patient-stats-dashboard">
            <h3 className="dashboard-title">Patient Insights Dashboard</h3>
            <div className="stats-grid">
                <StatsCard
                    title="Admitted Since"
                    value={admissionDate}
                    description="Initial consultation"
                    icon={Calendar}
                />
                <StatsCard
                    title="Sessions"
                    value={completedSessions}
                    description="Completed treatments"
                    icon={CheckCircle}
                />
                <StatsCard
                    title="Risk Analysis"
                    value={risk.label}
                    description={`${risk.value} active conditions`}
                    icon={ShieldAlert}
                    trend={risk.label === 'High' ? -15 : 5}
                />
                <StatsCard
                    title="Next Step"
                    value="Consultation"
                    description="Scheduled for tomorrow"
                    icon={ArrowRightCircle}
                />
            </div>
        </div>
    );
};

export default PatientStatsDashboard;
