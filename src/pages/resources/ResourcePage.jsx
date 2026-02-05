import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResourceData } from '../../store/slices/resourceSlice';
import { fetchSessions } from '../../store/slices/scheduleSlice';
import StaffDirectory from '../../components/organisms/StaffDirectory';
import MaterialInventory from '../../components/organisms/MaterialInventory';
import UtilizationChart from '../../components/organisms/UtilizationChart';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import './ResourcePage.css';

const ResourcePage = () => {
    const dispatch = useDispatch();
    const { staff, inventory, isLoading } = useSelector(state => state.resource);
    const { sessions } = useSelector(state => state.schedule);
    const [activeTab, setActiveTab] = useState('staff');

    useEffect(() => {
        dispatch(fetchResourceData());
        dispatch(fetchSessions());
    }, [dispatch]);

    // Calculate utilization based on actual sessions
    const utilizationData = useMemo(() => {
        if (!sessions || sessions.length === 0) return null;

        const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start Monday
        const dates = [];
        const roomUtil = [];
        const staffUtil = [];

        // Generate next 7 days
        for (let i = 0; i < 7; i++) {
            const date = addDays(start, i);
            dates.push(format(date, 'EEE')); // Mon, Tue...

            // Filter sessions for this day
            const daySessions = sessions.filter(s => isSameDay(new Date(s.start), date));

            // Calculate Room Occupancy (Assuming 8 hour day * 3 rooms = 24 slot-hours capacity)
            // Start simple: Count total hours booked
            const totalHoursBoxed = daySessions.reduce((acc, s) => {
                const duration = (new Date(s.end) - new Date(s.start)) / (1000 * 60 * 60);
                return acc + duration;
            }, 0);

            const roomCapacity = 3 * 10; // 3 rooms * 10 hours/day
            const roomPercent = Math.min(100, Math.round((totalHoursBoxed / roomCapacity) * 100));

            // Staff Utilization (Assuming 3 staff * 8 hours = 24 slot-hours)
            // Just using simplified metric: unique therapists active / total staff
            const activeTherapists = new Set(daySessions.map(s => s.therapistId)).size;
            const totalStaff = staff.length || 3;
            const staffPercent = Math.min(100, Math.round((activeTherapists / totalStaff) * 100));

            roomUtil.push(roomPercent);
            staffUtil.push(staffPercent);
        }

        return {
            dates,
            rooms: roomUtil,
            staff: staffUtil
        };
    }, [sessions, staff]);

    if (isLoading) return <div className="p-8 text-center text-muted">Loading Resources...</div>;

    return (
        <div className="resource-page">
            <div className="resource-header">
                <h2>Resources & Inventory</h2>
                <div className="resource-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
                        onClick={() => setActiveTab('staff')}
                    >Staff & Skills</button>
                    <button
                        className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inventory')}
                    >Inventory</button>
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >Analytics</button>
                </div>
            </div>

            <div className="resource-content">
                {activeTab === 'staff' && <StaffDirectory staff={staff} />}

                {activeTab === 'inventory' && (
                    <div className="limit-width">
                        <MaterialInventory items={inventory} />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="limit-width">
                        {utilizationData ? (
                            <UtilizationChart data={utilizationData} />
                        ) : (
                            <div className="text-center p-8 text-muted">No session data available for analytics.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcePage;
