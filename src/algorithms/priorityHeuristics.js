/**
 * Priority Heuristics for Urgent/Emergency Session Handling
 * Manages priority tokens, preemption rules, and rescheduling logic
 */

/**
 * Priority levels with numeric values for comparison
 */
export const PRIORITY_LEVELS = {
    EMERGENCY: { name: 'EMERGENCY', value: 100, color: '#ef4444' },
    URGENT: { name: 'URGENT', value: 80, color: '#f97316' },
    HIGH: { name: 'HIGH', value: 60, color: '#eab308' },
    NORMAL: { name: 'NORMAL', value: 40, color: '#22c55e' },
    LOW: { name: 'LOW', value: 20, color: '#94a3b8' }
};

/**
 * Priority Token class
 */
export class PriorityToken {
    constructor(level = 'NORMAL', reason = '', expiresAt = null) {
        const priorityDef = PRIORITY_LEVELS[level] || PRIORITY_LEVELS.NORMAL;
        this.level = priorityDef.name;
        this.value = priorityDef.value;
        this.color = priorityDef.color;
        this.reason = reason;
        this.createdAt = new Date();
        this.expiresAt = expiresAt;
    }

    isExpired() {
        if (!this.expiresAt) return false;
        return new Date() > new Date(this.expiresAt);
    }

    canPreempt(otherToken) {
        if (this.isExpired()) return false;
        const otherValue = otherToken?.value || PRIORITY_LEVELS.NORMAL.value;
        return this.value > otherValue;
    }

    toJSON() {
        return {
            level: this.level,
            value: this.value,
            color: this.color,
            reason: this.reason,
            createdAt: this.createdAt,
            expiresAt: this.expiresAt
        };
    }
}

/**
 * Priority Queue Manager for scheduling
 */
export class PriorityQueueManager {
    constructor() {
        this.queue = [];
    }

    /**
     * Add a session request with priority
     */
    enqueue(sessionRequest, priorityToken) {
        const entry = {
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            request: sessionRequest,
            priority: priorityToken || new PriorityToken('NORMAL'),
            addedAt: new Date(),
            status: 'pending'
        };

        this.queue.push(entry);
        this.sortQueue();
        return entry.id;
    }

    /**
     * Sort queue by priority (highest first)
     */
    sortQueue() {
        this.queue.sort((a, b) => {
            // First by priority value
            if (b.priority.value !== a.priority.value) {
                return b.priority.value - a.priority.value;
            }
            // Then by time added (earlier first)
            return new Date(a.addedAt) - new Date(b.addedAt);
        });
    }

    /**
     * Get next request to process
     */
    dequeue() {
        if (this.queue.length === 0) return null;
        return this.queue.shift();
    }

    /**
     * Peek at highest priority request without removing
     */
    peek() {
        return this.queue.length > 0 ? this.queue[0] : null;
    }

    /**
     * Get all pending requests
     */
    getPendingRequests() {
        return this.queue.filter(e => e.status === 'pending');
    }

    /**
     * Update request status
     */
    updateStatus(requestId, status) {
        const entry = this.queue.find(e => e.id === requestId);
        if (entry) {
            entry.status = status;
        }
    }

    /**
     * Remove expired priority requests
     */
    removeExpired() {
        this.queue = this.queue.filter(e => !e.priority.isExpired());
    }
}

/**
 * Preemption Manager for handling priority-based rescheduling
 */
export class PreemptionManager {
    constructor() {
        this.preemptionLog = [];
    }

    /**
     * Check if a new session can preempt an existing one
     */
    canPreempt(newSession, existingSession) {
        const newPriority = newSession.priorityToken || new PriorityToken('NORMAL');
        const existingPriority = existingSession.priorityToken || new PriorityToken('NORMAL');

        // Emergency can always preempt non-emergency
        if (newPriority.level === 'EMERGENCY' && existingPriority.level !== 'EMERGENCY') {
            return {
                canPreempt: true,
                reason: 'Emergency session takes precedence'
            };
        }

        // Higher priority can preempt lower priority
        if (newPriority.value > existingPriority.value + 10) { // 10 point buffer
            return {
                canPreempt: true,
                reason: `${newPriority.level} priority (${newPriority.value}) exceeds ${existingPriority.level} (${existingPriority.value})`
            };
        }

        return {
            canPreempt: false,
            reason: `Cannot preempt: insufficient priority difference`
        };
    }

    /**
     * Find sessions that can be preempted for a higher priority session
     */
    findPreemptableSessions(newSession, existingSessions, requiredSlots = 1) {
        const preemptable = [];
        const newPriority = newSession.priorityToken || new PriorityToken('NORMAL');

        for (const existing of existingSessions) {
            const result = this.canPreempt(newSession, existing);
            if (result.canPreempt) {
                preemptable.push({
                    session: existing,
                    reason: result.reason,
                    priorityDiff: newPriority.value - (existing.priorityToken?.value || 40)
                });
            }
        }

        // Sort by priority difference (prefer preempting lowest priority)
        preemptable.sort((a, b) => b.priorityDiff - a.priorityDiff);

        return preemptable.slice(0, requiredSlots);
    }

    /**
     * Execute preemption and reschedule affected sessions
     */
    executePreemption(preemptingSessions, preemptedSessions, alternativeSlots) {
        const result = {
            preempted: [],
            rescheduled: [],
            failed: []
        };

        for (const preempted of preemptedSessions) {
            const alternativeSlot = this.findAlternativeSlot(
                preempted.session,
                alternativeSlots,
                preemptingSessions
            );

            if (alternativeSlot) {
                result.rescheduled.push({
                    session: preempted.session,
                    originalSlot: {
                        start: preempted.session.start,
                        end: preempted.session.end
                    },
                    newSlot: alternativeSlot,
                    reason: preempted.reason
                });

                this.logPreemption({
                    preemptedSession: preempted.session,
                    preemptingSession: preemptingSessions[0],
                    reason: preempted.reason,
                    newSlot: alternativeSlot
                });
            } else {
                result.failed.push({
                    session: preempted.session,
                    reason: 'No alternative slot available'
                });
            }

            result.preempted.push(preempted.session);
        }

        return result;
    }

    /**
     * Find an alternative time slot for a preempted session
     */
    findAlternativeSlot(session, availableSlots, excludeSlots = []) {
        const excludeTimes = excludeSlots.map(s => ({
            start: new Date(s.start).getTime(),
            end: new Date(s.end).getTime()
        }));

        const sessionDuration =
            new Date(session.end).getTime() - new Date(session.start).getTime();

        for (const slot of availableSlots) {
            const slotStart = new Date(slot.start).getTime();
            const slotEnd = new Date(slot.end).getTime();

            // Check slot duration is sufficient
            if (slotEnd - slotStart < sessionDuration) continue;

            // Check no overlap with excluded slots
            const hasOverlap = excludeTimes.some(excluded =>
                slotStart < excluded.end && excluded.start < slotEnd
            );

            if (!hasOverlap) {
                return {
                    start: slot.start,
                    end: new Date(new Date(slot.start).getTime() + sessionDuration)
                };
            }
        }

        return null;
    }

    /**
     * Log preemption for audit trail
     */
    logPreemption(details) {
        this.preemptionLog.push({
            id: `preempt_${Date.now()}`,
            timestamp: new Date(),
            ...details
        });
    }

    /**
     * Get preemption history
     */
    getPreemptionHistory() {
        return [...this.preemptionLog];
    }
}

/**
 * Apply priority heuristics to a schedule
 * @param {Array} sessions - Existing scheduled sessions
 * @param {Object} newRequest - New session request with priority
 * @param {Array} availableSlots - Available time slots
 * @returns {Object} Result with updated schedule and explanations
 */
export const applyPriorityHeuristics = (sessions, newRequest, availableSlots) => {
    const preemptionManager = new PreemptionManager();
    const explanations = [];

    const newPriority = newRequest.priorityToken || new PriorityToken('NORMAL');
    explanations.push({
        step: 'Priority Assessment',
        detail: `New request has ${newPriority.level} priority (value: ${newPriority.value})`,
        color: newPriority.color
    });

    // Check for overlapping sessions
    const overlappingSessions = sessions.filter(s =>
        doIntervalsOverlap(
            { start: new Date(s.start), end: new Date(s.end) },
            { start: new Date(newRequest.start), end: new Date(newRequest.end) }
        )
    );

    if (overlappingSessions.length === 0) {
        explanations.push({
            step: 'Slot Availability',
            detail: 'Requested time slot is available, no preemption needed',
            color: '#22c55e'
        });

        return {
            success: true,
            schedule: [...sessions, { ...newRequest, id: `session_${Date.now()}` }],
            preempted: [],
            rescheduled: [],
            explanations
        };
    }

    // Check if we can preempt
    const preemptable = preemptionManager.findPreemptableSessions(
        newRequest,
        overlappingSessions
    );

    if (preemptable.length === 0) {
        explanations.push({
            step: 'Preemption Check',
            detail: 'Cannot preempt existing sessions - insufficient priority',
            color: '#ef4444'
        });

        return {
            success: false,
            schedule: sessions,
            preempted: [],
            rescheduled: [],
            explanations,
            error: 'Cannot schedule: existing sessions have equal or higher priority'
        };
    }

    // Execute preemption
    explanations.push({
        step: 'Preemption Execution',
        detail: `Preempting ${preemptable.length} session(s) with lower priority`,
        color: '#f97316'
    });

    const preemptionResult = preemptionManager.executePreemption(
        [newRequest],
        preemptable,
        availableSlots
    );

    // Build updated schedule
    let updatedSchedule = sessions.filter(s =>
        !preemptable.some(p => p.session.id === s.id)
    );

    // Add new high-priority session
    updatedSchedule.push({
        ...newRequest,
        id: `session_${Date.now()}`
    });

    // Add rescheduled sessions
    for (const rescheduled of preemptionResult.rescheduled) {
        updatedSchedule.push({
            ...rescheduled.session,
            start: rescheduled.newSlot.start,
            end: rescheduled.newSlot.end,
            rescheduledFrom: rescheduled.originalSlot
        });

        explanations.push({
            step: 'Rescheduling',
            detail: `Session "${rescheduled.session.title}" moved to ${formatDateTime(rescheduled.newSlot.start)}`,
            color: '#eab308'
        });
    }

    // Note any failed rescheduling
    for (const failed of preemptionResult.failed) {
        explanations.push({
            step: 'Rescheduling Failed',
            detail: `Could not reschedule "${failed.session.title}": ${failed.reason}`,
            color: '#ef4444'
        });
    }

    return {
        success: true,
        schedule: updatedSchedule,
        preempted: preemptionResult.preempted,
        rescheduled: preemptionResult.rescheduled,
        failed: preemptionResult.failed,
        explanations
    };
};

/**
 * Helper: Check if two intervals overlap
 */
function doIntervalsOverlap(interval1, interval2) {
    return interval1.start < interval2.end && interval2.start < interval1.end;
}

/**
 * Helper: Format date time for display
 */
function formatDateTime(date) {
    return new Date(date).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

export default {
    PRIORITY_LEVELS,
    PriorityToken,
    PriorityQueueManager,
    PreemptionManager,
    applyPriorityHeuristics
};
