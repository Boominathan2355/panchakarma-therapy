// Mock data for Scheduling Module
import { addHours, startOfDay, addDays } from 'date-fns';
import { HybridScheduler, PriorityToken, PRIORITY_LEVELS } from '../algorithms';

const today = startOfDay(new Date());

// Store for scheduled sessions (simulates database)
let sessionStore = [
    {
        id: 's1',
        title: 'Vamana - Ramesh Gupta',
        therapistId: 'emp1',
        resourceId: 'room1',
        start: addHours(today, 10),
        end: addHours(today, 12),
        status: 'scheduled',
        type: 'Vamana',
        patientId: 'p1',
        therapyId: 't1',
        stepId: 'w3' // Vamana Vega
    },
    {
        id: 's2',
        title: 'Nasya - Sita Verma',
        therapistId: 'emp2',
        resourceId: 'room2',
        start: addHours(today, 14),
        end: addHours(today, 15),
        status: 'completed',
        type: 'Nasya',
        patientId: 'p2',
        therapyId: 't3',
        stepId: null
    },
    {
        id: 's3',
        title: 'Abhyanga - Arjun Das',
        therapistId: 'emp1',
        resourceId: 'room1',
        start: addHours(addDays(today, 1), 11),
        end: addHours(addDays(today, 1), 13),
        status: 'scheduled',
        type: 'Abhyanga',
        patientId: 'p3',
        therapyId: 't1',
        stepId: 'w2' // Abhyanga & Swedana step of Vamana
    }
];

// Store for schedule explanations
let explanationStore = {};

const mockResources = [
    { id: 'room1', title: 'Therapy Room A' },
    { id: 'room2', title: 'Therapy Room B' },
    { id: 'room3', title: 'Steam Room' }
];

/**
 * Get all scheduled sessions
 */
const getSessions = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...sessionStore]);
        }, 400);
    });
};

/**
 * Get available resources (rooms)
 */
const getResources = async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockResources]), 300));
};

/**
 * Generate an optimized schedule using the hybrid scheduling algorithm
 * @param {Object} therapy - Selected therapy
 * @param {Object} patient - Patient to schedule
 * @param {string|Object} priorityToken - Priority level or token
 * @param {Object} resources - Available resources (therapists, rooms, inventory)
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Scheduling result
 */
const generateSchedule = async (therapy, patient, priorityToken, resources, onProgress) => {
    return new Promise(async (resolve) => {
        const scheduler = new HybridScheduler({
            enableGA: true,
            enablePSO: true,
            enableExplainability: true
        });

        if (onProgress) {
            scheduler.setProgressCallback(onProgress);
        }

        // Get existing sessions to avoid conflicts
        const existingSessions = [...sessionStore];

        // Run the hybrid scheduling algorithm
        const result = await scheduler.generateSchedule(
            therapy,
            patient,
            priorityToken,
            resources,
            existingSessions
        );

        if (result.success) {
            // Add new sessions to the store
            for (const session of result.schedule) {
                sessionStore.push(session);
            }

            // Store explanations
            const scheduleId = `schedule_${Date.now()}`;
            explanationStore[scheduleId] = result.explanations;
            result.scheduleId = scheduleId;
        }

        resolve(result);
    });
};

/**
 * Reschedule a session with conflict resolution
 * @param {string} sessionId - Session to reschedule
 * @param {Object} newSlot - New time slot
 * @param {string} reason - Reason for rescheduling
 * @returns {Promise<Object>} Rescheduling result
 */
const rescheduleSession = async (sessionId, newSlot, reason = '') => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sessionIndex = sessionStore.findIndex(s => s.id === sessionId);

            if (sessionIndex === -1) {
                resolve({
                    success: false,
                    error: 'Session not found'
                });
                return;
            }

            const session = sessionStore[sessionIndex];
            const originalSlot = { start: session.start, end: session.end };

            // Check for conflicts with new slot
            const hasConflict = sessionStore.some(s =>
                s.id !== sessionId &&
                s.resourceId === session.resourceId &&
                new Date(s.start) < new Date(newSlot.end) &&
                new Date(s.end) > new Date(newSlot.start)
            );

            if (hasConflict) {
                resolve({
                    success: false,
                    error: 'New time slot conflicts with existing session'
                });
                return;
            }

            // Update session
            sessionStore[sessionIndex] = {
                ...session,
                start: newSlot.start,
                end: newSlot.end,
                rescheduledFrom: originalSlot,
                rescheduledReason: reason,
                rescheduledAt: new Date()
            };

            resolve({
                success: true,
                session: sessionStore[sessionIndex],
                originalSlot
            });
        }, 300);
    });
};

/**
 * Get explanation for a schedule
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<Object>} Explanation data
 */
const getScheduleExplanation = async (scheduleId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const explanation = explanationStore[scheduleId];
            if (explanation) {
                resolve({ success: true, explanation });
            } else {
                resolve({ success: false, error: 'Explanation not found' });
            }
        }, 200);
    });
};

/**
 * Get optimization metrics for a scheduling run
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<Object>} Metrics data
 */
const getOptimizationMetrics = async (scheduleId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const explanation = explanationStore[scheduleId];
            if (explanation?.metrics) {
                resolve({ success: true, metrics: explanation.metrics });
            } else {
                resolve({
                    success: false,
                    error: 'Metrics not found',
                    // Return mock metrics for demo
                    metrics: {
                        gaGenerations: 100,
                        gaFitness: 85.5,
                        psoIterations: 50,
                        psoFitness: 92.3,
                        conflictsResolved: 2,
                        totalDecisions: 15
                    }
                });
            }
        }, 200);
    });
};

/**
 * Add a new session to the store
 * @param {Object} session - Session to add
 */
const addSession = async (session) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newSession = {
                ...session,
                id: session.id || `session_${Date.now()}`,
                createdAt: new Date()
            };
            sessionStore.push(newSession);
            resolve({ success: true, session: newSession });
        }, 200);
    });
};

/**
 * Update an existing session
 * @param {string} sessionId - Session ID
 * @param {Object} updates - Updates to apply
 */
const updateSession = async (sessionId, updates) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = sessionStore.findIndex(s => s.id === sessionId);
            if (index !== -1) {
                sessionStore[index] = { ...sessionStore[index], ...updates };
                resolve({ success: true, session: sessionStore[index] });
            } else {
                resolve({ success: false, error: 'Session not found' });
            }
        }, 200);
    });
};

/**
 * Delete a session
 * @param {string} sessionId - Session ID
 */
const deleteSession = async (sessionId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = sessionStore.findIndex(s => s.id === sessionId);
            if (index !== -1) {
                const deleted = sessionStore.splice(index, 1)[0];
                resolve({ success: true, session: deleted });
            } else {
                resolve({ success: false, error: 'Session not found' });
            }
        }, 200);
    });
};

/**
 * Update session status (e.g., scheduled -> in-progress -> completed)
 * @param {string} sessionId - Session ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated session
 */
const updateSessionStatus = async (sessionId, status) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = sessionStore.findIndex(s => s.id === sessionId);
            if (index !== -1) {
                sessionStore[index] = {
                    ...sessionStore[index],
                    status,
                    statusUpdatedAt: new Date()
                };
                resolve({ success: true, session: sessionStore[index] });
            } else {
                resolve({ success: false, error: 'Session not found' });
            }
        }, 300);
    });
};

/**
 * Log a clinical note for a session
 * @param {string} sessionId - Session ID
 * @param {string} note - Clinical note content
 * @returns {Promise<Object>} Updated session
 */
const logSessionNote = async (sessionId, note) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = sessionStore.findIndex(s => s.id === sessionId);
            if (index !== -1) {
                const session = sessionStore[index];
                const notes = session.clinicalNotes || [];
                const newNote = {
                    id: `note_${Date.now()}`,
                    content: note,
                    timestamp: new Date()
                };

                sessionStore[index] = {
                    ...session,
                    clinicalNotes: [...notes, newNote]
                };
                resolve({ success: true, session: sessionStore[index] });
            } else {
                resolve({ success: false, error: 'Session not found' });
            }
        }, 300);
    });
};

const scheduleService = {
    getSessions,
    getResources,
    generateSchedule,
    rescheduleSession,
    getScheduleExplanation,
    getOptimizationMetrics,
    addSession,
    updateSession,
    deleteSession,
    updateSessionStatus,
    logSessionNote,
    PRIORITY_LEVELS
};

export default scheduleService;

