import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, DollarSign, Activity, LogOut } from 'lucide-react';

import Button from '../../components/atoms/Button';
import StatsCard from '../../components/molecules/StatsCard';
import TherapyTrendChart from '../../components/organisms/TherapyTrendChart';
import AvailabilityTable from '../../components/organisms/AvailabilityTable';
import AlertsPanel from '../../components/organisms/AlertsPanel';
import dashboardService from '../../services/dashboardService';
import './DashboardPage.css';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState(null);
    const [trends, setTrends] = useState(null);
    const [availability, setAvailability] = useState({ therapists: [], rooms: [] });
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kpiData, trendData, availData, alertData] = await Promise.all([
                    dashboardService.getKPIs(),
                    dashboardService.getTherapyTrends(),
                    dashboardService.getAvailability(),
                    dashboardService.getAlerts()
                ]);

                setKpis(kpiData);
                setTrends(trendData);
                setAvailability(availData);
                setAlerts(alertData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--primary-color)' }}></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                <header className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome, {user ? user.name : 'User'}!</p>
                    </div>
                    <Button variant="outline" onClick={onLogout}>
                        <LogOut size={16} className="mr-2" /> Logout
                    </Button>
                </header>

                {/* KPI Section */}
                <div className="stats-grid mb-8">
                    <StatsCard
                        title="Total Sessions"
                        value={kpis?.totalSessions}
                        description="Completed today"
                        icon={Calendar}
                        trend={12}
                    />
                    <StatsCard
                        title="Active Patients"
                        value={kpis?.activePatients}
                        description="Currently admitted"
                        icon={Users}
                        trend={5}
                    />
                    <StatsCard
                        title="Today's Revenue"
                        value={`₹${kpis?.todaysRevenue.toLocaleString()}`}
                        description="Estimated earnings"
                        icon={DollarSign}
                        trend={8}
                    />
                    <StatsCard
                        title="Occupancy Rate"
                        value={`${kpis?.occupancyRate}%`}
                        description="Room utilization"
                        icon={Activity}
                        trend={-2}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-main-grid">
                    {/* Left Column: Charts & Availability */}
                    <div className="dashboard-col-left space-y-6">
                        <div className="card-container">
                            {trends && <TherapyTrendChart dates={trends.dates} values={trends.values} />}
                        </div>

                        <div className="card-container">
                            <AvailabilityTable therapists={availability.therapists} rooms={availability.rooms} />
                        </div>
                    </div>

                    {/* Right Column: Alerts */}
                    <div className="dashboard-col-right">
                        <div className="card-container h-full">
                            <AlertsPanel alerts={alerts} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
