import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchSessions,
    fetchResources,
    updateSession,
    clearConflict
} from '../../store/slices/scheduleSlice';
// Organisms
import TherapyCalendar from '../../components/organisms/TherapyCalendar';
import ResourceGantt from '../../components/organisms/ResourceGantt';
import ConflictModal from '../../components/molecules/ConflictModal';
import ScheduleOptimizer from '../../components/organisms/ScheduleOptimizer';
import ScheduleExplainer from '../../components/organisms/ScheduleExplainer';
import { Calendar, AlignLeft, Zap, ChevronRight } from 'lucide-react';
import './SchedulePage.css';

// Services
import resourceService from '../../services/resourceService';
import therapyService from '../../services/therapyService';
import patientService from '../../services/patientService';
import { ScheduleEntry } from '../../types';

interface OptimizerResourceData {
    therapists: any[];
    rooms: any[];
    inventory: any;
}

const SchedulePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { view } = useParams<{ view: string }>();
    const viewMode = (view as 'calendar' | 'gantt' | 'optimize') || 'calendar';

    const { sessions, resources, conflictSession, explanations } = useAppSelector(state => state.schedule);
    const { user } = useAppSelector(state => state.auth);

    // State for optimizer data
    const [therapies, setTherapies] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [resourceData, setResourceData] = useState<OptimizerResourceData>({
        therapists: [],
        rooms: [],
        inventory: {}
    });
    const [lastScheduleResult, setLastScheduleResult] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchSessions());
        dispatch(fetchResources());
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
                rooms: resources.length > 0 ? resources : resData.rooms,
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

    const handleEventDrop = (args: { event: any; start: string | Date; end: string | Date; isAllDay?: boolean }) => {
        const { event, start, end } = args;
        const startDate = typeof start === 'string' ? new Date(start) : start;
        const endDate = typeof end === 'string' ? new Date(end) : end;

        dispatch(updateSession({
            id: event.id,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            resourceId: event.resourceId
        }));
    };

    const handleConflictClose = () => {
        dispatch(clearConflict());
    };

    const handleForceSchedule = () => {
        alert("Force schedule logic would go here (e.g., override db).");
        dispatch(clearConflict());
    };

    const handleScheduleGenerated = (result: any) => {
        setLastScheduleResult(result);
        if (result.success && result.schedule) {
            dispatch(fetchSessions());
        }
    };

    // Parse dates for calendar/gantt
    const parsedSessions = Array.isArray(sessions) 
        ? (sessions as ScheduleEntry[])
            .filter(s => {
                if (user?.role?.toLowerCase() === 'physician') {
                    return String(s.therapistId) === String(user.id);
                }
                return true;
            })
            .map(s => ({
                ...s,
                start: new Date(s.start),
                end: new Date(s.end)
            }))
        : [];

    const viewNames = {
        calendar: 'Calendar',
        gantt: 'Resource View',
        optimize: 'Optimizer'
    };

    return (
        <div className="schedule-page">
            <div className="schedule-header">
                <div className="breadcrumb">
                    <span className="breadcrumb-item clickable" onClick={() => navigate('/scheduler/calendar')}>
                        Scheduling & Resources
                    </span>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-item active">
                        {viewNames[viewMode]}
                    </span>
                </div>
                <div className="view-toggles">
                    <button
                        className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                        onClick={() => navigate('/scheduler/calendar')}
                    >
                        <Calendar size={18} /> Calendar
                    </button>
                    {user?.role?.toLowerCase() !== 'physician' && (
                        <>
                            <button
                                className={`toggle-btn ${viewMode === 'gantt' ? 'active' : ''}`}
                                onClick={() => navigate('/scheduler/gantt')}
                            >
                                <AlignLeft size={18} /> Resource View
                            </button>
                            <button
                                className={`toggle-btn optimize ${viewMode === 'optimize' ? 'active' : ''}`}
                                onClick={() => navigate('/scheduler/optimize')}
                            >
                                <Zap size={18} /> <span>Optimize</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="schedule-content">
                {viewMode === 'calendar' && (
                    <TherapyCalendar
                        events={parsedSessions as any}
                        onEventDrop={handleEventDrop}
                    />
                )}

                {viewMode === 'gantt' && (
                    <ResourceGantt
                        events={parsedSessions as any}
                        resources={resources as any}
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
                                existingSessions={parsedSessions as any}
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
                conflict={conflictSession ? {
                    type: conflictSession.conflictType,
                    message: `Schedule conflict detected for session ${conflictSession.id}. Please resolve to continue.`,
                    preemptionTarget: conflictSession
                } : null}
                onClose={handleConflictClose}
                onForce={handleForceSchedule}
            />
        </div>
    );
};

export default SchedulePage;
