import api from './api';
import { HybridScheduler, PRIORITY_LEVELS } from '../algorithms';

/**
 * Schedule Service
 * Handles all API interactions related to scheduling.
 */

/**
 * Get all scheduled sessions
 * @returns {Promise<Array>} List of sessions
 */
const getSessions = async () => {
    try {
        const response = await api.get('/schedule/');
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
    }
};

/**
 * Get available resources (rooms)
 * Note: This might still be mock if not yet implemented on backend, 
 * but usually resources are handled by a resource service.
 */
const getResources = async () => {
    // Current backend image shows /schedule/ but not /resources/ explicitly
    // Keeping this as is for now or pointing to a potential /resources/ endpoint if exists
    try {
        // If there's no resource endpoint, we might need to continue mocking or use a different service
        // For now, let's assume it's part of the API or will be handled by resourceService.js
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
 * This still uses the local algorithm but should save the results to the API.
 */
const generateSchedule = async (therapy, patient, priorityToken, resources, onProgress) => {
    const scheduler = new HybridScheduler({
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
 * @param {Object} session - Session data
 * @returns {Promise<Object>} Created session
 */
const addSession = async (session) => {
    try {
        const response = await api.post('/schedule/', session);
        return response.data;
    } catch (error) {
        console.error('Error adding session:', error);
        throw error;
    }
};

/**
 * Get a single schedule by ID
 * @param {string} id - Schedule ID
 * @returns {Promise<Object>} Schedule data
 */
const getSchedule = async (id) => {
    try {
        const response = await api.get(`/schedule/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching schedule with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Update a session
 * @param {string} id - Session ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated session
 */
const updateSession = async (id, updates) => {
    try {
        const response = await api.put(`/schedule/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error(`Error updating session with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a session
 * @param {string} id - Session ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteSession = async (id) => {
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
const updateSessionStatus = async (sessionId, status) => {
    return updateSession(sessionId, {
        status,
        statusUpdatedAt: new Date().toISOString()
    });
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
    PRIORITY_LEVELS
};

export default scheduleService;
