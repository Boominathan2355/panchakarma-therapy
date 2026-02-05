export const AUDIT_ACTIONS = {
    SCHEDULE_GENERATED: 'SCHEDULE_GENERATED',
    SESSION_RESCHEDULED: 'SESSION_RESCHEDULED',
    SESSION_STATUS_UPDATE: 'SESSION_STATUS_UPDATE',
    STAFF_UPDATE: 'STAFF_UPDATE',
    MANUAL_OVERRIDE: 'MANUAL_OVERRIDE',
    SYSTEM_ALERT: 'SYSTEM_ALERT'
};

// Mock Audit Log Store
let auditStore = [
    {
        id: 'log_1',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        action: 'SCHEDULE_GENERATED',
        user: 'System',
        details: 'Automated schedule generation for Vamana therapy (Patient: P1). 15 sessions created.',
        type: 'INFO',
        metadata: { strategies: ['GA', 'PSO'], fitness: 92.5 }
    },
    {
        id: 'log_2',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        action: 'SESSION_RESCHEDULED',
        user: 'Dr. Arya',
        details: 'Moved session S_102 due to Patient Request.',
        type: 'INFO',
        justification: 'Patient not available in morning slot',
        metadata: { previousSlot: '10:00 AM', newSlot: '2:00 PM' }
    },
    {
        id: 'log_3',
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_ALERT',
        user: 'System Monitor',
        details: 'Resource Conflict Detected: Room 1 (Steam) double booked.',
        type: 'WARN',
        metadata: { conflictId: 'c1' }
    }
];

const getLogs = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...auditStore].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))), 400);
    });
};

const createLog = async (entry) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newLog = {
                id: `log_${Date.now()}`,
                timestamp: new Date().toISOString(),
                ...entry
            };
            auditStore = [newLog, ...auditStore];
            resolve(newLog);
        }, 200);
    });
};

const auditService = {
    getLogs,
    createLog,
    AUDIT_ACTIONS
};

export default auditService;
