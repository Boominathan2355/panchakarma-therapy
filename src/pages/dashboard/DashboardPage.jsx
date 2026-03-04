import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Users, Calendar, DollarSign, Activity, AlertTriangle, AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

import StatsCard from '../../components/molecules/StatsCard';
import TherapyTrendChart from '../../components/organisms/TherapyTrendChart';
import PatientRiskChart from '../../components/organisms/PatientRiskChart';
import AvailabilityTable from '../../components/organisms/AvailabilityTable';
import UpcomingSchedule from '../../components/organisms/UpcomingSchedule';
import dashboardService from '../../services/dashboardService';
import scheduleService from '../../services/scheduleService';
import './DashboardPage.css';

const RISK_LEVELS = ['Emergency', 'High', 'Medium', 'Low'];

const getRiskForPatient = (patientId) => {
    const hash = String(patientId).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return RISK_LEVELS[hash % RISK_LEVELS.length];
};

const DashboardPage = () => {
    const { user } = useSelector((state) => state.auth);
    const isDoctor = user?.role?.toLowerCase() === 'physician';

    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState(null);
    const [trends, setTrends] = useState(null);
    const [riskTrends, setRiskTrends] = useState(null);
    const [availability, setAvailability] = useState({ therapists: [], rooms: [] });
    const [doctorSchedule, setDoctorSchedule] = useState([]);
    const [allDoctorSessions, setAllDoctorSessions] = useState([]);

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
                setAvailability(availData);

                if (isDoctor) {
                    const now = new Date();
                    const doctorSessions = sessions.filter(s => s.therapistId === user.id);
                    setAllDoctorSessions(doctorSessions);

                    const uniquePatients = new Set(doctorSessions.map(s => s.patientId)).size;

                    setKpis({
                        totalSessions: doctorSessions.length,
                        activePatients: uniquePatients
                    });

                    const upcoming = doctorSessions
                        .filter(s => new Date(s.end) > now)
                        .sort((a, b) => new Date(a.start) - new Date(b.start))
                        .slice(0, 10);
                    setDoctorSchedule(upcoming);
                } else {
                    setKpis(kpiData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchData();
    }, [user?.id, user?.role, isDoctor]);

    const riskCounts = useMemo(() => {
        if (!isDoctor || allDoctorSessions.length === 0) {
            return { Emergency: 0, High: 0, Medium: 0, Low: 0 };
        }
        const patientIds = [...new Set(allDoctorSessions.map(s => s.patientId))];
        const counts = { Emergency: 0, High: 0, Medium: 0, Low: 0 };
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
                                value={`₹${kpis?.todaysRevenue?.toLocaleString()}`}
                                description="Estimated earnings"
                                icon={DollarSign}
                                trend={8}
                                loading={loading}
                            />
                            <StatsCard
                                title="Occupancy Rate"
                                value={`${kpis?.occupancyRate}%`}
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
                        <div className="card-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'transparent', boxShadow: 'none', padding: 0 }}>
                            <div className="dashboard-card-wrapper" style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <TherapyTrendChart
                                    dates={trends?.dates}
                                    values={trends?.values}
                                    loading={loading}
                                />
                            </div>
                            <div className="dashboard-card-wrapper" style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <PatientRiskChart
                                    dates={riskTrends?.dates}
                                    high={riskTrends?.high}
                                    medium={riskTrends?.medium}
                                    low={riskTrends?.low}
                                    emergency={riskTrends?.emergency}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    )}

                    <div className="card-container">
                        {isDoctor ? (
                            <UpcomingSchedule sessions={doctorSchedule} loading={loading} />
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
