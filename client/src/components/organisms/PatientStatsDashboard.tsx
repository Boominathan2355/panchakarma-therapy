import React from 'react';
import { Calendar, ShieldAlert, CheckCircle, ArrowRightCircle, LucideIcon } from 'lucide-react';
import StatsCard from '../molecules/StatsCard';
import Skeleton from '../atoms/Skeleton';
import './PatientStatsDashboard.scss';

export interface PatientStatsDashboardProps {
    patient?: {
        name: string;
        conditions?: string[];
        history?: Array<{
            type: string;
            date: string;
        }>;
    };
    loading?: boolean;
}

const PatientStatsDashboard: React.FC<PatientStatsDashboardProps> = ({ patient, loading = false }) => {
    if (loading) {
        return (
            <div className="patient-stats-dashboard loading">
                <h3 className="dashboard-title">Patient Insights Dashboard</h3>
                <div className="stats-grid">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="stat-card">
                            <div className="stat-header">
                                <Skeleton width="60%" height="20px" />
                                <Skeleton variant="circle" width="24px" height="24px" />
                            </div>
                            <div className="stat-content">
                                <Skeleton width="40%" height="32px" className="mb-2" />
                                <Skeleton width="80%" height="16px" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!patient) return null;

    const getRiskLevel = () => {
        const count = patient.conditions?.length || 0;
        if (count >= 2) return { label: 'High', isUp: false, value: count };
        if (count === 1) return { label: 'Medium', isUp: false, value: count };
        return { label: 'Low', isUp: true, value: count };
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
                    icon={Calendar as LucideIcon}
                />
                <StatsCard
                    title="Sessions"
                    value={completedSessions}
                    description="Completed treatments"
                    icon={CheckCircle as LucideIcon}
                />
                <StatsCard
                    title="Risk Analysis"
                    value={risk.label}
                    description={`${risk.value} active conditions`}
                    icon={ShieldAlert as LucideIcon}
                    trend={{ value: risk.label === 'High' ? 15 : 5, isUp: risk.isUp }}
                />
                <StatsCard
                    title="Next Step"
                    value="Consultation"
                    description="Scheduled for tomorrow"
                    icon={ArrowRightCircle as LucideIcon}
                />
            </div>
        </div>
    );
};

export default PatientStatsDashboard;
