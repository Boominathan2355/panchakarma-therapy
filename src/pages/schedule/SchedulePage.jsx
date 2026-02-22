import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchSessions,
    fetchResources,
    updateSession,
    clearConflict,
    addMultipleSessions
} from '../../store/slices/scheduleSlice';
import TherapyCalendar from '../../components/organisms/TherapyCalendar';
import ResourceGantt from '../../components/organisms/ResourceGantt';
import ConflictModal from '../../components/molecules/ConflictModal';
import ScheduleOptimizer from '../../components/organisms/ScheduleOptimizer';
import ScheduleExplainer from '../../components/organisms/ScheduleExplainer';
import { Calendar, AlignLeft, Zap } from 'lucide-react';
import './SchedulePage.css';

// Import mock data services for the optimizer
import therapyService from '../../services/therapyService';
import patientService from '../../services/patientService';
import resourceService from '../../services/resourceService';

const SchedulePage = () => {
    const dispatch = useDispatch();
    const { sessions, resources, conflictSession, explanations, isOptimizing } = useSelector(state => state.schedule);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'gantt', or 'optimize'

    // State for optimizer data
    const [therapies, setTherapies] = useState([]);
    const [patients, setPatients] = useState([]);
    const [resourceData, setResourceData] = useState({});
    const [lastScheduleResult, setLastScheduleResult] = useState(null);

    useEffect(() => {
        dispatch(fetchSessions());
        dispatch(fetchResources());

        // Load data for optimizer
        loadOptimizerData();
    }, [dispatch]);

    const loadOptimizerData = async () => {
        try {
            const [therapyData, patientData, resData] = await Promise.all([
                therapyService.getTherapies(),
                patientService.getPatients(),
                resourceService.getResourceData()
            ]);

            setTherapies(therapyData);
            setPatients(patientData);
            setResourceData({
                therapists: resData.staff,
                rooms: resources.length > 0 ? resources : [
                    { id: 'room1', title: 'Therapy Room A' },
                    { id: 'room2', title: 'Therapy Room B' },
                    { id: 'room3', title: 'Steam Room' }
                ],
                inventory: resData.inventory
            });
        } catch (error) {
            console.error('Error loading optimizer data:', error);
        }
    };

    // Update resource data when resources change
    useEffect(() => {
        if (resources.length > 0) {
            setResourceData(prev => ({
                ...prev,
                rooms: resources
            }));
        }
    }, [resources]);

    const handleEventDrop = ({ event, start, end, resourceId }) => {
        dispatch(updateSession({
            id: event.id,
            start: start,
            end: end,
            resourceId: resourceId || event.resourceId
        }));
    };

    const handleConflictClose = () => {
        dispatch(clearConflict());
    };

    const handleForceSchedule = (conflict) => {
        alert("Force schedule logic would go here (e.g., override db).");
        dispatch(clearConflict());
    };

    const handleScheduleGenerated = (result) => {
        setLastScheduleResult(result);

        if (result.success && result.schedule) {
            // Sessions are already added via Redux thunk, just refresh the view
            dispatch(fetchSessions());
        }
    };

    // Parse dates for calendar/gantt
    const parsedSessions = sessions.map(s => ({
        ...s,
        start: new Date(s.start),
        end: new Date(s.end)
    }));

    return (
        <div className="schedule-page">
            <div className="schedule-header">
                <h2>Scheduling & Resources</h2>
                <div className="view-toggles">
                    <button
                        className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                        onClick={() => setViewMode('calendar')}
                    >
                        <Calendar size={18} /> Calendar
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'gantt' ? 'active' : ''}`}
                        onClick={() => setViewMode('gantt')}
                    >
                        <AlignLeft size={18} /> Resource View
                    </button>
                    <button
                        className={`toggle-btn optimize ${viewMode === 'optimize' ? 'active' : ''}`}
                        onClick={() => setViewMode('optimize')}
                    >
                        <Zap size={18} /> <span>Optimize</span>
                    </button>
                </div>
            </div>

            <div className="schedule-content">
                {viewMode === 'calendar' && (
                    <TherapyCalendar
                        events={parsedSessions}
                        onEventDrop={handleEventDrop}
                    />
                )}

                {viewMode === 'gantt' && (
                    <ResourceGantt
                        events={parsedSessions}
                        resources={resources}
                    />
                )}

                {viewMode === 'optimize' && (
                    <div className="optimize-layout">
                        <div className="optimize-main">
                            <ScheduleOptimizer
                                onScheduleGenerated={handleScheduleGenerated}
                                therapies={therapies}
                                patients={patients}
                                resources={resourceData}
                                existingSessions={parsedSessions}
                            />
                        </div>
                        <div className="optimize-sidebar">
                            <ScheduleExplainer
                                explanations={lastScheduleResult?.explanations || explanations}
                            />
                        </div>
                    </div>
                )}
            </div>

            <ConflictModal
                conflict={conflictSession}
                onClose={handleConflictClose}
                onForce={handleForceSchedule}
            />
        </div>
    );
};

export default SchedulePage;

