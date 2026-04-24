import React, { useEffect, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../features/auth';
import { useScheduleStore } from '../../store/scheduleStore';
import { useSessions } from '../../hooks/useSchedule';
import { useResourcesData } from '../../hooks/useResources';
import { useTherapies } from '../../hooks/useTherapy';
import { usePatients } from '../../hooks/usePatients';
import { useParams, useNavigate } from 'react-router-dom';


// Organisms
import TherapyCalendar from '../../components/organisms/TherapyCalendar';
import ResourceGantt from '../../components/organisms/ResourceGantt';
import ConflictModal from '../../components/molecules/ConflictModal';
import ScheduleOptimizer from '../../components/organisms/ScheduleOptimizer';
import ScheduleExplainer from '../../components/organisms/ScheduleExplainer';
import PendingQueue from '../../components/organisms/PendingQueue';
import { Calendar, AlignLeft, Zap, ChevronRight } from 'lucide-react';
import { ScheduleEntry } from '../../types';
import './SchedulePage.scss';

const SchedulePage: React.FC = () => {
    const navigate = useNavigate();
    const { view } = useParams<{ view: string }>();
    const viewMode = (view as 'calendar' | 'gantt' | 'optimize') || 'calendar';

    const { user } = useAuth();
    const { conflictSession, clearConflict, explanations } = useScheduleStore();
    
    const { data: sessions = [] } = useSessions();
    const { data: resourceDataRaw } = useResourcesData();
    const { data: therapies = [] } = useTherapies();
    const { data: patients = [] } = usePatients();

    const resources = resourceDataRaw?.rooms || [];
    const resourceData = useMemo(() => ({
        therapists: resourceDataRaw?.staff || [],
        rooms: resources,
        inventory: resourceDataRaw?.inventory || {}
    }), [resourceDataRaw, resources]);

    const [lastScheduleResult, setLastScheduleResult] = useState<any>(null);
    const [selectedTask, setSelectedTask] = useState<any>(null);


    const handleEventDrop = (args: { event: any; start: string | Date; end: string | Date; isAllDay?: boolean }) => {
        // In a real app, we'd use a mutation here
        console.log("Event drop", args);
    };

    const handleConflictClose = () => {
        clearConflict();
    };

    const handleForceSchedule = () => {
        alert("Force schedule logic would go here (e.g., override db).");
        clearConflict();
    };

    const queryClient = useQueryClient();

    const handleScheduleGenerated = (result: any) => {
        setLastScheduleResult(result);
        if (result.success && result.schedule) {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
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

    const pendingTasks = useMemo(() => {
        if (patients.length === 0 || therapies.length === 0) return [];
        // Map first 3 patients to some therapies for the demo queue
        return [
            { 
                id: 'task-1', 
                patientId: patients[0]?.id, 
                patientName: patients[0]?.name, 
                therapyId: therapies[0]?.id, 
                therapyName: therapies[0]?.name, 
                planStartDate: new Date().toISOString(), 
                priority: 'EMERGENCY' 
            },
            { 
                id: 'task-2', 
                patientId: patients[1]?.id, 
                patientName: patients[1]?.name, 
                therapyId: (therapies[1] || therapies[0])?.id, 
                therapyName: (therapies[1] || therapies[0])?.name, 
                planStartDate: new Date().toISOString(), 
                priority: 'URGENT' 
            },
            { 
                id: 'task-3', 
                patientId: (patients[2] || patients[0])?.id, 
                patientName: (patients[2] || patients[0])?.name, 
                therapyId: (therapies[2] || therapies[0])?.id, 
                therapyName: (therapies[2] || therapies[0])?.name, 
                planStartDate: new Date().toISOString(), 
                priority: 'NORMAL' 
            }
        ];
    }, [patients, therapies]);

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
                <div className="schedule-view-switcher">
                    <button
                        className={`switcher-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                        onClick={() => navigate('/scheduler/calendar')}
                    >
                        <Calendar size={18} /> Calendar
                    </button>
                    {user?.role?.toLowerCase() !== 'physician' && (
                        <>
                            <button
                                className={`switcher-btn ${viewMode === 'gantt' ? 'active' : ''}`}
                                onClick={() => navigate('/scheduler/gantt')}
                            >
                                <AlignLeft size={18} /> Resource View
                            </button>
                            <button
                                className={`switcher-btn optimize ${viewMode === 'optimize' ? 'active' : ''}`}
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
                        <div className="optimize-queue">
                            <PendingQueue
                                tasks={pendingTasks as any}
                                onSelectTask={(task) => {
                                    setSelectedTask(task);
                                    setLastScheduleResult(null);
                                }}
                            />
                        </div>
                        <div className="optimize-main">
                            <ScheduleOptimizer
                                onScheduleGenerated={handleScheduleGenerated}
                                therapies={therapies}
                                patients={patients}
                                resources={resourceData}
                                existingSessions={parsedSessions as any}
                                initialTask={selectedTask}
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
