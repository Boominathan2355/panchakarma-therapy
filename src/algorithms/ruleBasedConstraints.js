/**
 * Rule-Based Constraint Engine for Therapy Scheduling
 * Enforces therapy sequence requirements, session-level constraints,
 * patient eligibility, and resource availability
 */

/**
 * Constraint types and their priority levels
 */
export const CONSTRAINT_TYPES = {
    SEQUENCE: 'SEQUENCE',           // Therapy workflow step order
    GAP: 'GAP',                     // Time between sessions
    CONTRAINDICATION: 'CONTRAINDICATION', // Patient medical restrictions
    THERAPIST_AVAILABILITY: 'THERAPIST_AVAILABILITY',
    ROOM_AVAILABILITY: 'ROOM_AVAILABILITY',
    MATERIAL_SUFFICIENCY: 'MATERIAL_SUFFICIENCY',
    PATIENT_AVAILABILITY: 'PATIENT_AVAILABILITY'
};

/**
 * Constraint violation severity levels
 */
export const SEVERITY = {
    CRITICAL: 'CRITICAL',   // Cannot proceed
    WARNING: 'WARNING',     // Proceed with caution
    INFO: 'INFO'           // Informational only
};

/**
 * Validates that therapy workflow steps are in correct order
 * @param {Array} sessions - Scheduled sessions
 * @param {Object} therapy - Therapy protocol with workflow
 * @returns {Object} Validation result with violations
 */
export const validateTherapySequence = (sessions, therapy) => {
    const violations = [];

    if (!therapy.workflow || therapy.workflow.length === 0) {
        return { valid: true, violations: [] };
    }

    // Sort sessions by start time
    const sortedSessions = [...sessions].sort((a, b) =>
        new Date(a.start) - new Date(b.start)
    );

    // Check step order
    let lastStepNumber = 0;
    for (const session of sortedSessions) {
        const workflowStep = therapy.workflow.find(w => w.action === session.action);
        if (workflowStep) {
            if (workflowStep.step < lastStepNumber) {
                violations.push({
                    type: CONSTRAINT_TYPES.SEQUENCE,
                    severity: SEVERITY.CRITICAL,
                    message: `Step "${session.action}" (Step ${workflowStep.step}) cannot come after Step ${lastStepNumber}`,
                    session: session,
                    relatedStep: workflowStep
                });
            }
            lastStepNumber = workflowStep.step;
        }
    }

    return {
        valid: violations.length === 0,
        violations
    };
};

/**
 * Validates time gaps between sessions
 * @param {Array} sessions - Scheduled sessions
 * @param {Object} gapConstraints - Min/max gap requirements
 * @returns {Object} Validation result
 */
export const validateSessionGaps = (sessions, gapConstraints = { minHours: 1, maxHours: 48 }) => {
    const violations = [];
    const sortedSessions = [...sessions].sort((a, b) =>
        new Date(a.start) - new Date(b.start)
    );

    for (let i = 1; i < sortedSessions.length; i++) {
        const prevEnd = new Date(sortedSessions[i - 1].end);
        const currStart = new Date(sortedSessions[i].start);
        const gapHours = (currStart - prevEnd) / (1000 * 60 * 60);

        if (gapHours < gapConstraints.minHours) {
            violations.push({
                type: CONSTRAINT_TYPES.GAP,
                severity: SEVERITY.CRITICAL,
                message: `Minimum ${gapConstraints.minHours}h gap required between sessions. Found: ${gapHours.toFixed(1)}h`,
                sessions: [sortedSessions[i - 1], sortedSessions[i]]
            });
        }

        if (gapHours > gapConstraints.maxHours) {
            violations.push({
                type: CONSTRAINT_TYPES.GAP,
                severity: SEVERITY.WARNING,
                message: `Sessions are ${gapHours.toFixed(1)}h apart, exceeding recommended ${gapConstraints.maxHours}h`,
                sessions: [sortedSessions[i - 1], sortedSessions[i]]
            });
        }
    }

    return {
        valid: violations.filter(v => v.severity === SEVERITY.CRITICAL).length === 0,
        violations
    };
};

/**
 * Checks patient contraindications against therapy requirements
 * @param {Object} patient - Patient with conditions
 * @param {Object} therapy - Therapy with contraindications
 * @returns {Object} Eligibility result
 */
export const checkPatientContraindications = (patient, therapy) => {
    const violations = [];

    if (!therapy.contraindications || !patient.conditions) {
        return { eligible: true, violations: [] };
    }

    for (const condition of patient.conditions) {
        for (const contraindication of therapy.contraindications) {
            // Case-insensitive partial match
            if (condition.toLowerCase().includes(contraindication.toLowerCase()) ||
                contraindication.toLowerCase().includes(condition.toLowerCase())) {
                violations.push({
                    type: CONSTRAINT_TYPES.CONTRAINDICATION,
                    severity: SEVERITY.CRITICAL,
                    message: `Patient condition "${condition}" conflicts with contraindication "${contraindication}"`,
                    condition,
                    contraindication
                });
            }
        }
    }

    // Age-based contraindications
    if (patient.age) {
        const ageContraindications = therapy.contraindications.filter(c =>
            c.toLowerCase().includes('children') ||
            c.toLowerCase().includes('elderly') ||
            c.toLowerCase().includes('under') ||
            c.toLowerCase().includes('over')
        );

        for (const ageContra of ageContraindications) {
            if (ageContra.toLowerCase().includes('under 12') && patient.age < 12) {
                violations.push({
                    type: CONSTRAINT_TYPES.CONTRAINDICATION,
                    severity: SEVERITY.CRITICAL,
                    message: `Patient age ${patient.age} is below minimum age requirement`,
                    condition: `Age: ${patient.age}`,
                    contraindication: ageContra
                });
            }
            if (ageContra.toLowerCase().includes('over 70') && patient.age > 70) {
                violations.push({
                    type: CONSTRAINT_TYPES.CONTRAINDICATION,
                    severity: SEVERITY.CRITICAL,
                    message: `Patient age ${patient.age} exceeds maximum age limit`,
                    condition: `Age: ${patient.age}`,
                    contraindication: ageContra
                });
            }
        }
    }

    return {
        eligible: violations.filter(v => v.severity === SEVERITY.CRITICAL).length === 0,
        violations
    };
};

/**
 * Validates therapist availability for sessions
 * @param {Array} sessions - Sessions to validate
 * @param {Array} therapists - Available therapists with shifts
 * @returns {Object} Validation result
 */
export const validateTherapistAvailability = (sessions, therapists) => {
    const violations = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (const session of sessions) {
        const therapist = therapists.find(t => t.id === session.therapistId);
        if (!therapist) {
            violations.push({
                type: CONSTRAINT_TYPES.THERAPIST_AVAILABILITY,
                severity: SEVERITY.CRITICAL,
                message: `Therapist ${session.therapistId} not found`,
                session
            });
            continue;
        }

        const sessionDay = dayNames[new Date(session.start).getDay()];
        if (!therapist.shifts.includes(sessionDay)) {
            violations.push({
                type: CONSTRAINT_TYPES.THERAPIST_AVAILABILITY,
                severity: SEVERITY.CRITICAL,
                message: `${therapist.name} not available on ${sessionDay}`,
                session,
                therapist
            });
        }

        // Check skill match
        if (therapist.skills && session.type) {
            const hasSkill = therapist.skills.some(skill =>
                skill.toLowerCase().includes(session.type.toLowerCase())
            );
            if (!hasSkill) {
                violations.push({
                    type: CONSTRAINT_TYPES.THERAPIST_AVAILABILITY,
                    severity: SEVERITY.WARNING,
                    message: `${therapist.name} may not be trained for ${session.type}`,
                    session,
                    therapist
                });
            }
        }
    }

    return {
        valid: violations.filter(v => v.severity === SEVERITY.CRITICAL).length === 0,
        violations
    };
};

/**
 * Validates room availability for sessions (no overlaps)
 * @param {Array} sessions - Sessions to validate
 * @param {Array} existingSessions - Already scheduled sessions
 * @returns {Object} Validation result
 */
export const validateRoomAvailability = (sessions, existingSessions = []) => {
    const violations = [];
    const allSessions = [...existingSessions, ...sessions];

    for (const session of sessions) {
        const conflicts = allSessions.filter(s =>
            s.id !== session.id &&
            s.resourceId === session.resourceId &&
            doIntervalsOverlap(
                { start: new Date(s.start), end: new Date(s.end) },
                { start: new Date(session.start), end: new Date(session.end) }
            )
        );

        for (const conflict of conflicts) {
            violations.push({
                type: CONSTRAINT_TYPES.ROOM_AVAILABILITY,
                severity: SEVERITY.CRITICAL,
                message: `Room ${session.resourceId} has overlapping booking`,
                session,
                conflictingSession: conflict
            });
        }
    }

    return {
        valid: violations.length === 0,
        violations
    };
};

/**
 * Validates material/inventory sufficiency
 * @param {Array} sessions - Sessions requiring materials
 * @param {Array} inventory - Available inventory items
 * @param {Object} requirements - Material requirements per session type
 * @returns {Object} Validation result
 */
export const validateMaterialSufficiency = (sessions, inventory, requirements = {}) => {
    const violations = [];

    // Default material requirements
    const defaultRequirements = {
        'Abhyanga': [{ name: 'Sesame Oil', quantity: 0.5 }],
        'Vamana': [{ name: 'Sesame Oil', quantity: 0.3 }, { name: 'Steam Towels', quantity: 2 }],
        'Shirodhara': [{ name: 'Sesame Oil', quantity: 1 }],
        'Virechana': [{ name: 'Dashamoola Herbs', quantity: 1 }],
        ...requirements
    };

    // Calculate total material needs
    const materialNeeds = {};
    for (const session of sessions) {
        const reqs = defaultRequirements[session.type] || [];
        for (const req of reqs) {
            materialNeeds[req.name] = (materialNeeds[req.name] || 0) + req.quantity;
        }
    }

    // Check against inventory
    for (const [material, needed] of Object.entries(materialNeeds)) {
        const item = inventory.find(i =>
            i.name.toLowerCase().includes(material.toLowerCase())
        );

        if (!item) {
            violations.push({
                type: CONSTRAINT_TYPES.MATERIAL_SUFFICIENCY,
                severity: SEVERITY.WARNING,
                message: `Material "${material}" not found in inventory`,
                material,
                needed
            });
        } else if (item.stock < needed) {
            violations.push({
                type: CONSTRAINT_TYPES.MATERIAL_SUFFICIENCY,
                severity: item.status === 'low' ? SEVERITY.CRITICAL : SEVERITY.WARNING,
                message: `Insufficient ${material}: have ${item.stock}, need ${needed}`,
                material,
                available: item.stock,
                needed
            });
        }
    }

    return {
        valid: violations.filter(v => v.severity === SEVERITY.CRITICAL).length === 0,
        violations
    };
};

/**
 * Validates patient availability windows
 * @param {Array} sessions - Sessions to schedule
 * @param {Object} patient - Patient with availability windows
 * @returns {Object} Validation result
 */
export const validatePatientAvailability = (sessions, patient) => {
    const violations = [];

    if (!patient.availability || patient.availability.length === 0) {
        return { valid: true, violations: [] };
    }

    for (const session of sessions) {
        const sessionDate = new Date(session.start);
        const isAvailable = patient.availability.some(window => {
            const windowStart = new Date(window.start);
            const windowEnd = new Date(window.end);
            return sessionDate >= windowStart && sessionDate <= windowEnd;
        });

        if (!isAvailable) {
            violations.push({
                type: CONSTRAINT_TYPES.PATIENT_AVAILABILITY,
                severity: SEVERITY.CRITICAL,
                message: `Patient not available on ${sessionDate.toDateString()}`,
                session,
                availableWindows: patient.availability
            });
        }
    }

    return {
        valid: violations.length === 0,
        violations
    };
};

/**
 * Run all constraint validations
 * @param {Object} params - Validation parameters
 * @returns {Object} Combined validation result
 */
export const validateAllConstraints = ({
    sessions,
    therapy,
    patient,
    therapists,
    existingSessions,
    inventory
}) => {
    const results = {
        sequence: validateTherapySequence(sessions, therapy),
        gaps: validateSessionGaps(sessions),
        contraindications: checkPatientContraindications(patient, therapy),
        therapistAvailability: validateTherapistAvailability(sessions, therapists),
        roomAvailability: validateRoomAvailability(sessions, existingSessions),
        materialSufficiency: validateMaterialSufficiency(sessions, inventory),
        patientAvailability: validatePatientAvailability(sessions, patient)
    };

    const allViolations = Object.values(results).flatMap(r => r.violations);
    const criticalViolations = allViolations.filter(v => v.severity === SEVERITY.CRITICAL);

    return {
        valid: criticalViolations.length === 0,
        results,
        allViolations,
        criticalViolations,
        summary: {
            total: allViolations.length,
            critical: criticalViolations.length,
            warnings: allViolations.filter(v => v.severity === SEVERITY.WARNING).length,
            info: allViolations.filter(v => v.severity === SEVERITY.INFO).length
        }
    };
};

/**
 * Helper: Check if two time intervals overlap
 */
function doIntervalsOverlap(interval1, interval2) {
    return interval1.start < interval2.end && interval2.start < interval1.end;
}

export default {
    CONSTRAINT_TYPES,
    SEVERITY,
    validateTherapySequence,
    validateSessionGaps,
    checkPatientContraindications,
    validateTherapistAvailability,
    validateRoomAvailability,
    validateMaterialSufficiency,
    validatePatientAvailability,
    validateAllConstraints
};
