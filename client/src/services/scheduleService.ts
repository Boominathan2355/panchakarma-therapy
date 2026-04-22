import api from './api';
import { HybridScheduler } from '../algorithms';
import type { ScheduleEntry, Patient, ResourceStatus } from '../types';

/**
 * Schedule Service
 * Handles all API interactions related to scheduling.
 */

// PRIORITY_LEVELS is imported from algorithms/index.js (re-exported)
export const PRIORITY_LEVELS: Record<string, string> = {
    CRITICAL: 'CRITICAL',
    HIGH: 'HIGH',
    NORMAL: 'NORMAL',
    LOW: 'LOW'
};

/**
 * Get all scheduled sessions
 * @returns {Promise<ScheduleEntry[]>} List of sessions
 */
const getSessions = async (): Promise<ScheduleEntry[]> => {
    try {
        const response = await api.get<ScheduleEntry[]>('/schedule/');
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
    }
};

/**
 * Get available resources (rooms)
 */
const getResources = async (): Promise<{ id: string; title: string }[]> => {
    try {
        return [
            { id: 'room1', title: 'Therapy Room A' },
            { id: 'room2', title: 'Therapy Room B' },
            { id: 'room3', title: 'Steam Room' }
        ];
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw error;
    }
};

/**
 * Generate an optimized schedule using the hybrid scheduling algorithm
 */
const generateSchedule = async (
    therapy: any, 
    patient: Patient, 
    priorityToken: string, 
    resources: any[], 
    onProgress?: (progress: number) => void
): Promise<any> => {
    const scheduler = new (HybridScheduler as any)({
        enableGA: true,
        enablePSO: true,
        enableExplainability: true
    });

    if (onProgress) {
        scheduler.setProgressCallback(onProgress);
    }

    // Get existing sessions to avoid conflicts
    const existingSessions = await getSessions();

    // Run the hybrid scheduling algorithm
    const result = await scheduler.generateSchedule(
        therapy,
        patient,
        priorityToken,
        resources,
        existingSessions
    );

    if (result.success) {
        // Save new sessions to the API
        for (const session of result.schedule) {
            await addSession(session);
        }
    }

    return result;
};

/**
 * Add a new session
 */
const addSession = async (session: Partial<ScheduleEntry>): Promise<ScheduleEntry> => {
    try {
        const response = await api.post<ScheduleEntry>('/schedule/', session);
        return response.data;
    } catch (error) {
        console.error('Error adding session:', error);
        throw error;
    }
};

/**
 * Get a single schedule by ID
 */
const getSchedule = async (id: string | number): Promise<ScheduleEntry> => {
    try {
        const response = await api.get<ScheduleEntry>(`/schedule/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching schedule with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Update a session
 */
const updateSession = async (id: string | number, updates: Partial<ScheduleEntry>): Promise<ScheduleEntry> => {
    try {
        const response = await api.put<ScheduleEntry>(`/schedule/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error(`Error updating session with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a session
 */
const deleteSession = async (id: string | number): Promise<any> => {
    try {
        const response = await api.delete(`/schedule/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting session with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Update session status
 */
const updateSessionStatus = async (sessionId: string | number, status: string): Promise<ScheduleEntry> => {
    return updateSession(sessionId, {
        status: status as any,
    });
};

const logSessionNote = async (sessionId: string | number, note: string): Promise<ScheduleEntry> => {
    try {
        // Mock implementation: send note as a partial update
        const response = await api.put<ScheduleEntry>(`/schedule/${sessionId}`, { clinicalNote: note });
        return response.data;
    } catch (error) {
        console.error(`Error logging note for session ${sessionId}:`, error);
        throw error;
    }
};

const scheduleService = {
    getSessions,
    getResources,
    generateSchedule,
    addSession,
    getSchedule,
    updateSession,
    deleteSession,
    updateSessionStatus,
    logSessionNote,
    PRIORITY_LEVELS
};


export default scheduleService;
