import React, { useEffect, useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
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
import dashboardService from '../../services/dashboardService';
import scheduleService from '../../services/scheduleService';
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
    // Explicitly use RootState to ensure correct state inference
    const { user } = useAppSelector((state: RootState) => state.auth);
    const isDoctor = user?.role?.toLowerCase() === 'physician';

    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [trends, setTrends] = useState<TrendData | null>(null);
    const [riskTrends, setRiskTrends] = useState<RiskTrendData | null>(null);
    const [availability, setAvailability] = useState<AvailabilityData>({ therapists: [], rooms: [] });
    const [doctorSchedule, setDoctorSchedule] = useState<ScheduleEntry[]>([]);
    const [allDoctorSessions, setAllDoctorSessions] = useState<ScheduleEntry[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kpiData, trendData, riskData, availData, sessions] = await Promise.all([
                    dashboardService.getKPIs(),
                    dashboardService.getTherapyTrends(),
                    dashboardService.getPatientRiskTrends(),
                    dashboardService.getAvailability(),
                    scheduleService.getSessions()
                ]);

                setTrends(trendData);
                setRiskTrends(riskData);
                
                // Map availability to ResourceItem (string IDs)
                setAvailability({
                    therapists: availData.therapists.map(t => ({ ...t, id: String(t.id) })),
                    rooms: availData.rooms
                });

                if (isDoctor && user) {
                    const now = new Date();
                    const userIdString = String(user.id);
                    const doctorSessions = sessions.filter((s: ScheduleEntry) => String(s.therapistId) === userIdString);
                    setAllDoctorSessions(doctorSessions);

                    const uniquePatients = new Set(doctorSessions.map((s: ScheduleEntry) => s.patientId)).size;

                    setKpis({
                        totalSessions: doctorSessions.length,
                        activePatients: uniquePatients
                    });

                    const upcoming = doctorSessions
                        .filter((s: ScheduleEntry) => s.end && new Date(s.end) > now)
                        .sort((a: ScheduleEntry, b: ScheduleEntry) => {
                            if (!a.start || !b.start) return 0;
                            return new Date(a.start).getTime() - new Date(b.start).getTime();
                        })
                        .slice(0, 10);
                    setDoctorSchedule(upcoming);
                } else {
                    setKpis(kpiData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                // Simulate a slight delay for smoother transition
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchData();
    }, [user, isDoctor]);

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
