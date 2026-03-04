import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Users, Calendar, DollarSign, Activity } from 'lucide-react';

import StatsCard from '../../components/molecules/StatsCard';
import TherapyTrendChart from '../../components/organisms/TherapyTrendChart';
import PatientRiskChart from '../../components/organisms/PatientRiskChart';
import AvailabilityTable from '../../components/organisms/AvailabilityTable';
import dashboardService from '../../services/dashboardService';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState(null);
    const [trends, setTrends] = useState(null);
    const [riskTrends, setRiskTrends] = useState(null);
    const [availability, setAvailability] = useState({ therapists: [], rooms: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kpiData, trendData, riskData, availData] = await Promise.all([
                    dashboardService.getKPIs(),
                    dashboardService.getTherapyTrends(),
                    dashboardService.getPatientRiskTrends(),
                    dashboardService.getAvailability()
                ]);

                setKpis(kpiData);
                setTrends(trendData);
                setRiskTrends(riskData);
                setAvailability(availData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                // Keep loading for a tiny bit longer to show the beauty of the skeleton
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                {/* KPI Section */}
                <div className="stats-grid mb-8">
                    <StatsCard
                        title="Total Sessions"
                        value={kpis?.totalSessions}
                        description="Completed today"
                        icon={Calendar}
                        trend={12}
                        loading={loading}
                    />
                    <StatsCard
                        title="Active Patients"
                        value={kpis?.activePatients}
                        description="Currently admitted"
                        icon={Users}
                        trend={5}
                        loading={loading}
                    />
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
                </div>

                {/* Main Content Grid - Now a stack since Alerts are gone */}
                <div className="dashboard-content-stack">
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

                    <div className="card-container">
                        <AvailabilityTable
                            therapists={availability.therapists}
                            rooms={availability.rooms}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
