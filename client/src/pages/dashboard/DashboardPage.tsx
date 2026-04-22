import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../features/auth';
import { 
    useDashboardKPIs,
    useTherapyTrends,
    usePatientRiskTrends,
    useAvailability,
    useSessions
} from '../../hooks/useDashboard';

import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    AlertTriangle,
    AlertCircle,
    ShieldCheck,
    ShieldAlert
} from 'lucide-react';

import StatsCard from '../../components/molecules/StatsCard';
import TherapyTrendChart from '../../components/organisms/TherapyTrendChart';
import PatientRiskChart from '../../components/organisms/PatientRiskChart';
import AvailabilityTable, { ResourceItem } from '../../components/organisms/AvailabilityTable';
import UpcomingSchedule from '../../components/organisms/UpcomingSchedule';
import type { ScheduleEntry } from '../../types';
import './DashboardPage.css';

interface KPIs {
    totalSessions: number;
    activePatients: number;
    todaysRevenue?: number;
    occupancyRate?: number;
}

interface TrendData {
    dates: string[];
    values: number[];
}

interface RiskTrendData {
    dates: string[];
    high: number[];
    medium: number[];
    low: number[];
    emergency: number[];
}

interface AvailabilityData {
    therapists: ResourceItem[];
    rooms: ResourceItem[];
}

const RISK_LEVELS = ['Emergency', 'High', 'Medium', 'Low'] as const;
type RiskLevel = typeof RISK_LEVELS[number];

const getRiskForPatient = (patientId: string | number): RiskLevel => {
    const hash = String(patientId).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return RISK_LEVELS[hash % RISK_LEVELS.length];
};

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    const isDoctor = user?.role?.toLowerCase() === 'physician';

    const { data: kpisData, isLoading: kpisLoading } = useDashboardKPIs();
    const { data: trends, isLoading: trendsLoading } = useTherapyTrends();
    const { data: riskTrends, isLoading: riskLoading } = usePatientRiskTrends();
    const { data: availabilityData, isLoading: availLoading } = useAvailability();
    const { data: sessions = [], isLoading: sessionsLoading } = useSessions();

    const loading = kpisLoading || trendsLoading || riskLoading || availLoading || sessionsLoading;

    const availability = useMemo(() => ({
        therapists: (availabilityData?.therapists || []).map(t => ({ ...t, id: String(t.id) })),
        rooms: availabilityData?.rooms || []
    }), [availabilityData]);

    const doctorData = useMemo(() => {
        if (!isDoctor || !user) return null;
        
        const now = new Date();
        const userIdString = String(user.id);
        const doctorSessions = sessions.filter((s: ScheduleEntry) => String(s.therapistId) === userIdString);
        
        const uniquePatients = new Set(doctorSessions.map((s: ScheduleEntry) => s.patientId)).size;
        
        const upcoming = doctorSessions
            .filter((s: ScheduleEntry) => s.end && new Date(s.end) > now)
            .sort((a: ScheduleEntry, b: ScheduleEntry) => {
                if (!a.start || !b.start) return 0;
                return new Date(a.start).getTime() - new Date(b.start).getTime();
            })
            .slice(0, 10);

        return {
            totalSessions: doctorSessions.length,
            activePatients: uniquePatients,
            upcoming,
            allSessions: doctorSessions
        };
    }, [isDoctor, user, sessions]);

    const kpis = isDoctor ? {
        totalSessions: doctorData?.totalSessions || 0,
        activePatients: doctorData?.activePatients || 0,
        todaysRevenue: 0,
        occupancyRate: 0
    } : kpisData;


    const doctorSchedule = doctorData?.upcoming || [];
    const allDoctorSessions = doctorData?.allSessions || [];


    const riskCounts = useMemo(() => {
        const counts: Record<RiskLevel, number> = { Emergency: 0, High: 0, Medium: 0, Low: 0 };
        if (!isDoctor || allDoctorSessions.length === 0) {
            return counts;
        }
        const patientIds = [...new Set(allDoctorSessions.map((s: ScheduleEntry) => s.patientId))];
        patientIds.forEach(pid => {
            const risk = getRiskForPatient(pid);
            counts[risk] = (counts[risk] || 0) + 1;
        });
        return counts;
    }, [allDoctorSessions, isDoctor]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                {/* KPI Section */}
                <div className="stats-grid mb-8">
                    <StatsCard
                        title={isDoctor ? 'My Sessions' : 'Total Sessions'}
                        value={kpis?.totalSessions}
                        description={isDoctor ? 'Assigned to you' : 'Completed today'}
                        icon={Calendar}
                        trend={12}
                        loading={loading}
                    />
                    <StatsCard
                        title={isDoctor ? 'My Patients' : 'Active Patients'}
                        value={kpis?.activePatients}
                        description={isDoctor ? 'Under your care' : 'Currently admitted'}
                        icon={Users}
                        trend={5}
                        loading={loading}
                    />
                    {isDoctor ? (
                        <>
                            <StatsCard
                                title="Emergency"
                                value={riskCounts.Emergency}
                                description="Critical patients"
                                icon={AlertTriangle}
                                loading={loading}
                            />
                            <StatsCard
                                title="High Risk"
                                value={riskCounts.High}
                                description="Needs close monitoring"
                                icon={ShieldAlert}
                                loading={loading}
                            />
                            <StatsCard
                                title="Medium Risk"
                                value={riskCounts.Medium}
                                description="Moderate attention"
                                icon={AlertCircle}
                                loading={loading}
                            />
                            <StatsCard
                                title="Low Risk"
                                value={riskCounts.Low}
                                description="Stable patients"
                                icon={ShieldCheck}
                                loading={loading}
                            />
                        </>
                    ) : (
                        <>
                            <StatsCard
                                title="Today's Revenue"
                                value={kpis?.todaysRevenue ? `₹${kpis.todaysRevenue.toLocaleString()}` : '₹0'}
                                description="Estimated earnings"
                                icon={DollarSign}
                                trend={8}
                                loading={loading}
                            />
                            <StatsCard
                                title="Occupancy Rate"
                                value={kpis?.occupancyRate ? `${kpis.occupancyRate}%` : '0%'}
                                description="Room utilization"
                                icon={Activity}
                                trend={-2}
                                loading={loading}
                            />
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-content-stack">
                    {!isDoctor && (
                        <div className="dashboard-charts-grid">
                            <div className="dashboard-card-wrapper">
                                <TherapyTrendChart
                                    dates={trends?.dates || []}
                                    values={trends?.values || []}
                                    loading={loading}
                                />
                            </div>
                            <div className="dashboard-card-wrapper">
                                <PatientRiskChart
                                    dates={riskTrends?.dates || []}
                                    high={riskTrends?.high || []}
                                    medium={riskTrends?.medium || []}
                                    low={riskTrends?.low || []}
                                    emergency={riskTrends?.emergency || []}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    )}

                    <div className="card-container">
                        {isDoctor ? (
                            <UpcomingSchedule sessions={doctorSchedule as any[]} loading={loading} />
                        ) : (
                            <AvailabilityTable
                                therapists={availability.therapists}
                                rooms={availability.rooms}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
