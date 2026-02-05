/**
 * Hybrid Therapy Scheduler
 * Main orchestrator implementing Algorithm 2 from the specification
 * 
 * Combines:
 * - Rule-based constraint validation
 * - Genetic Algorithm optimization
 * - Particle Swarm Optimization refinement
 * - Priority heuristics for urgent cases
 * - Explainability for decision transparency
 */

import { GeneticAlgorithm, DEFAULT_GA_PARAMS } from './geneticAlgorithm.js';
import { ParticleSwarmOptimization, DEFAULT_PSO_PARAMS } from './particleSwarmOptimization.js';
import {
    validateAllConstraints,
    checkPatientContraindications,
    SEVERITY
} from './ruleBasedConstraints.js';
import {
    PriorityToken,
    applyPriorityHeuristics,
    PRIORITY_LEVELS
} from './priorityHeuristics.js';
import { ExplainabilityEngine, DECISION_TYPES } from './explainability.js';
import { addHours, addDays, startOfDay } from 'date-fns';

/**
 * Default scheduler configuration
 */
export const DEFAULT_SCHEDULER_CONFIG = {
    ga: DEFAULT_GA_PARAMS,
    pso: DEFAULT_PSO_PARAMS,
    timeSlotDurationHours: 2,
    schedulingHorizonDays: 14,
    workingHoursStart: 9,
    workingHoursEnd: 18,
    enableGA: true,
    enablePSO: true,
    enableExplainability: true
};

/**
 * Generate time slots for scheduling horizon
 */
export const generateTimeSlots = (config = {}) => {
    const {
        startDate = new Date(),
        horizonDays = 14,
        workingHoursStart = 9,
        workingHoursEnd = 18,
        slotDurationHours = 2
    } = config;

    const slots = [];
    const baseDate = startOfDay(new Date(startDate));

    for (let day = 0; day < horizonDays; day++) {
        const dayStart = addDays(baseDate, day);

        // Skip weekends (optional)
        const dayOfWeek = dayStart.getDay();
        if (dayOfWeek === 0) continue; // Skip Sunday

        for (let hour = workingHoursStart; hour < workingHoursEnd; hour += slotDurationHours) {
            const slotStart = addHours(dayStart, hour);
            const slotEnd = addHours(slotStart, slotDurationHours);

            slots.push({
                id: `slot_${day}_${hour}`,
                start: slotStart,
                end: slotEnd,
                dayIndex: day,
                hourIndex: hour
            });
        }
    }

    return slots;
};

/**
 * Hybrid Scheduler class implementing Algorithm 2
 */
export class HybridScheduler {
    constructor(config = {}) {
        this.config = { ...DEFAULT_SCHEDULER_CONFIG, ...config };
        this.explainer = new ExplainabilityEngine();
        this.ga = new GeneticAlgorithm(this.config.ga);
        this.pso = new ParticleSwarmOptimization(this.config.pso);
        this.onProgress = null;
    }

    /**
     * Set progress callback
     */
    setProgressCallback(callback) {
        this.onProgress = callback;
        this.ga.onProgress = callback;
        this.pso.onProgress = callback;
    }

    /**
     * Main scheduling method - implements Algorithm 2
     * 
     * @param {Object} therapy - Selected therapy T
     * @param {Object} patient - Patient P
     * @param {Object} priorityToken - Priority token PT
     * @param {Object} resources - Available resources (therapists, rooms, materials)
     * @param {Array} existingSessions - Already scheduled sessions
     * @returns {Object} Optimized, conflict-free schedule S
     */
    async generateSchedule(therapy, patient, priorityToken, resources, existingSessions = []) {
        this.explainer.clear();
        const results = {
            success: false,
            schedule: [],
            explanations: [],
            metrics: {},
            errors: []
        };

        try {
            // Step 1: Retrieve structured protocol
            const phaseId1 = this.explainer.startPhase(
                'Protocol Retrieval',
                'Loading therapy protocol and validating structure'
            );

            const protocol = await this.retrieveProtocol(therapy);
            if (!protocol.workflow || protocol.workflow.length === 0) {
                throw new Error(`Therapy "${therapy.name}" has no defined workflow`);
            }

            this.explainer.endPhase(phaseId1, `Loaded ${protocol.workflow.length} workflow steps`);
            this.reportProgress('protocol', 10, 'Protocol loaded');

            // Step 2: Check patient eligibility (contraindications)
            const phaseId2 = this.explainer.startPhase(
                'Eligibility Check',
                'Validating patient eligibility against contraindications'
            );

            const eligibility = checkPatientContraindications(patient, therapy);
            if (!eligibility.eligible) {
                const criticalViolations = eligibility.violations
                    .filter(v => v.severity === SEVERITY.CRITICAL)
                    .map(v => v.message);

                this.explainer.logConstraint(
                    { type: 'Contraindication', severity: 'CRITICAL' },
                    'Blocked scheduling',
                    `Patient has contraindications: ${criticalViolations.join(', ')}`
                );

                results.errors.push({
                    phase: 'eligibility',
                    message: `Patient not eligible: ${criticalViolations.join(', ')}`,
                    violations: eligibility.violations
                });

                this.explainer.endPhase(phaseId2, 'Patient not eligible');
                results.explanations = this.explainer.generateReport();
                return results;
            }

            this.explainer.endPhase(phaseId2, 'Patient eligible for therapy');
            this.reportProgress('eligibility', 15, 'Eligibility confirmed');

            // Step 3: Initialize schedule using rule-based placement
            const phaseId3 = this.explainer.startPhase(
                'Initial Placement',
                'Creating initial schedule using rule-based logic'
            );

            const timeSlots = generateTimeSlots({
                horizonDays: this.config.schedulingHorizonDays,
                slotDurationHours: this.config.timeSlotDurationHours,
                workingHoursStart: this.config.workingHoursStart,
                workingHoursEnd: this.config.workingHoursEnd
            });

            const initialSchedule = this.createInitialSchedule(
                therapy,
                patient,
                resources,
                timeSlots,
                existingSessions
            );

            for (const session of initialSchedule) {
                this.explainer.logPlacement(
                    session,
                    { start: session.start, end: session.end },
                    'Initial rule-based placement'
                );
            }

            this.explainer.endPhase(phaseId3, `Created ${initialSchedule.length} initial sessions`);
            this.reportProgress('initial', 25, 'Initial schedule created');

            // Step 4: Apply Genetic Algorithm optimization
            let optimizedSchedule = initialSchedule;
            let gaResult = null;

            if (this.config.enableGA) {
                const phaseId4 = this.explainer.startPhase(
                    'Genetic Algorithm',
                    'Optimizing therapist, room, and material allocation'
                );

                const gaContext = {
                    therapy,
                    patient,
                    therapists: resources.therapists || resources.staff || [],
                    rooms: resources.rooms || [],
                    timeSlots,
                    existingSessions,
                    inventory: resources.inventory || []
                };

                gaResult = this.ga.run(gaContext);
                optimizedSchedule = this.ga.toSchedule();

                this.explainer.logOptimization(
                    'Genetic Algorithm',
                    this.ga.generationHistory[0]?.bestFitness || 0,
                    gaResult.bestFitness,
                    gaResult.bestFitness - (this.ga.generationHistory[0]?.bestFitness || 0)
                );

                this.explainer.endPhase(
                    phaseId4,
                    `GA converged in ${gaResult.generationsRun} generations, fitness: ${gaResult.bestFitness.toFixed(1)}`
                );
                this.reportProgress('ga', 50, 'GA optimization complete');
            }

            // Step 5: Apply PSO refinement
            let psoResult = null;

            if (this.config.enablePSO && optimizedSchedule.length > 0) {
                const phaseId5 = this.explainer.startPhase(
                    'Particle Swarm Optimization',
                    'Refining session ordering and reducing conflicts'
                );

                // Convert schedule to PSO input format
                const sessionsWithSlotIndex = optimizedSchedule.map(session => ({
                    ...session,
                    timeSlotIndex: timeSlots.findIndex(s =>
                        new Date(s.start).getTime() === new Date(session.start).getTime()
                    ) || 0
                }));

                const psoContext = {
                    timeSlots,
                    therapists: resources.therapists || resources.staff || [],
                    rooms: resources.rooms || [],
                    existingSessions
                };

                psoResult = this.pso.run(sessionsWithSlotIndex, psoContext);
                optimizedSchedule = this.pso.applyBestSolution();

                this.explainer.logOptimization(
                    'Particle Swarm Optimization',
                    this.pso.iterationHistory[0]?.globalBestFitness || 0,
                    psoResult.globalBestFitness,
                    psoResult.globalBestFitness - (this.pso.iterationHistory[0]?.globalBestFitness || 0)
                );

                this.explainer.endPhase(
                    phaseId5,
                    `PSO converged in ${psoResult.iterationsRun} iterations, fitness: ${psoResult.globalBestFitness.toFixed(1)}`
                );
                this.reportProgress('pso', 70, 'PSO refinement complete');
            }

            // Step 6: Handle priority token
            const phaseId6 = this.explainer.startPhase(
                'Priority Handling',
                'Applying priority token for scheduling precedence'
            );

            const priority = priorityToken instanceof PriorityToken
                ? priorityToken
                : new PriorityToken(priorityToken?.level || 'NORMAL', priorityToken?.reason);

            // Add priority token to all sessions
            optimizedSchedule = optimizedSchedule.map(session => ({
                ...session,
                priorityToken: priority.toJSON()
            }));

            this.explainer.endPhase(
                phaseId6,
                `Applied ${priority.level} priority to ${optimizedSchedule.length} sessions`
            );
            this.reportProgress('priority', 80, 'Priority applied');

            // Step 7: Detect and resolve conflicts
            const phaseId7 = this.explainer.startPhase(
                'Conflict Resolution',
                'Detecting and resolving scheduling conflicts'
            );

            const conflictResult = this.resolveConflicts(
                optimizedSchedule,
                existingSessions,
                timeSlots,
                priority
            );

            for (const resolution of conflictResult.resolutions) {
                this.explainer.logConflictResolution(
                    resolution.conflict,
                    resolution.action,
                    resolution.alternatives
                );
            }

            optimizedSchedule = conflictResult.schedule;

            this.explainer.endPhase(
                phaseId7,
                `Resolved ${conflictResult.resolutions.length} conflicts`
            );
            this.reportProgress('conflicts', 90, 'Conflicts resolved');

            // Step 8: Finalize and return
            const phaseId8 = this.explainer.startPhase(
                'Finalization',
                'Preparing final schedule output'
            );

            results.success = true;
            results.schedule = optimizedSchedule.map(session => ({
                ...session,
                id: session.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'scheduled',
                createdAt: new Date().toISOString()
            }));

            results.metrics = {
                totalSessions: results.schedule.length,
                gaGenerations: gaResult?.generationsRun || 0,
                gaFitness: gaResult?.bestFitness || 0,
                psoIterations: psoResult?.iterationsRun || 0,
                psoFitness: psoResult?.globalBestFitness || 0,
                conflictsResolved: conflictResult.resolutions.length,
                priority: priority.level
            };

            this.explainer.endPhase(
                phaseId8,
                `Schedule finalized with ${results.schedule.length} sessions`
            );
            this.reportProgress('complete', 100, 'Schedule generation complete');

        } catch (error) {
            results.errors.push({
                phase: 'general',
                message: error.message,
                stack: error.stack
            });
        }

        // Generate explanations report
        if (this.config.enableExplainability) {
            results.explanations = this.explainer.generateReport();
            results.explanationSummary = this.explainer.generateNLSummary();
        }

        return results;
    }

    /**
     * Retrieve and validate therapy protocol
     */
    async retrieveProtocol(therapy) {
        // In a real implementation, this would fetch from database
        return {
            id: therapy.id,
            name: therapy.name,
            workflow: therapy.workflow || [],
            contraindications: therapy.contraindications || [],
            safetyNotes: therapy.safetyNotes || ''
        };
    }

    /**
     * Create initial schedule using rule-based placement
     */
    createInitialSchedule(therapy, patient, resources, timeSlots, existingSessions) {
        const sessions = [];
        const workflow = therapy.workflow || [];
        const therapists = resources.therapists || resources.staff || [];
        const rooms = resources.rooms || [];

        let currentSlotIndex = 0;

        for (const step of workflow) {
            // Find available slot without conflicts
            let slotFound = false;
            while (currentSlotIndex < timeSlots.length && !slotFound) {
                const slot = timeSlots[currentSlotIndex];

                // Check for conflicts with existing sessions
                const hasConflict = existingSessions.some(existing =>
                    this.slotsOverlap(slot, existing)
                );

                if (!hasConflict) {
                    slotFound = true;

                    // Select therapist (prefer those with matching skills)
                    const eligibleTherapists = therapists.filter(t =>
                        !t.skills || t.skills.some(s =>
                            s.toLowerCase().includes(therapy.name.toLowerCase())
                        )
                    );
                    const therapist = eligibleTherapists.length > 0
                        ? eligibleTherapists[0]
                        : therapists[0];

                    // Select room (first available)
                    const room = rooms[0];

                    sessions.push({
                        id: `init_${step.id}_${Date.now()}`,
                        title: `${therapy.name} - ${step.action}`,
                        type: therapy.name,
                        action: step.action,
                        stepNumber: step.step,
                        duration: step.duration,
                        notes: step.notes,
                        therapistId: therapist?.id,
                        resourceId: room?.id,
                        patientId: patient.id,
                        start: slot.start,
                        end: slot.end,
                        timeSlotIndex: currentSlotIndex
                    });
                }
                currentSlotIndex++;
            }
        }

        return sessions;
    }

    /**
     * Resolve conflicts between new and existing sessions
     */
    resolveConflicts(newSessions, existingSessions, timeSlots, priority) {
        const resolutions = [];
        let resolvedSchedule = [...newSessions];

        for (let i = 0; i < resolvedSchedule.length; i++) {
            const session = resolvedSchedule[i];

            // Check for conflicts with existing sessions
            const conflicts = existingSessions.filter(existing =>
                (session.resourceId === existing.resourceId ||
                    session.therapistId === existing.therapistId) &&
                this.slotsOverlap(session, existing)
            );

            for (const conflict of conflicts) {
                const conflictInfo = {
                    type: session.resourceId === conflict.resourceId ? 'Room' : 'Therapist',
                    message: `Conflict with existing session at ${new Date(conflict.start).toLocaleString()}`
                };

                // Try to find alternative slot
                const alternative = this.findAlternativeSlot(
                    session,
                    timeSlots,
                    existingSessions,
                    resolvedSchedule.filter((_, idx) => idx !== i)
                );

                if (alternative) {
                    resolvedSchedule[i] = {
                        ...session,
                        start: alternative.start,
                        end: alternative.end,
                        timeSlotIndex: alternative.slotIndex
                    };

                    resolutions.push({
                        conflict: conflictInfo,
                        action: 'Moved to alternative slot',
                        alternatives: [alternative],
                        originalSlot: { start: session.start, end: session.end },
                        newSlot: { start: alternative.start, end: alternative.end }
                    });
                } else if (priority.value >= PRIORITY_LEVELS.URGENT.value) {
                    // High priority: attempt preemption
                    resolutions.push({
                        conflict: conflictInfo,
                        action: 'Preemption requested (requires confirmation)',
                        alternatives: [],
                        preemptionTarget: conflict
                    });
                }
            }
        }

        return {
            schedule: resolvedSchedule,
            resolutions
        };
    }

    /**
     * Find alternative time slot
     */
    findAlternativeSlot(session, timeSlots, existingSessions, otherNewSessions) {
        for (let i = 0; i < timeSlots.length; i++) {
            const slot = timeSlots[i];

            // Check no overlap with existing
            const existingConflict = existingSessions.some(s =>
                (s.resourceId === session.resourceId || s.therapistId === session.therapistId) &&
                this.slotsOverlap(slot, s)
            );

            // Check no overlap with other new sessions
            const newConflict = otherNewSessions.some(s =>
                (s.resourceId === session.resourceId || s.therapistId === session.therapistId) &&
                this.slotsOverlap(slot, s)
            );

            if (!existingConflict && !newConflict) {
                return {
                    slotIndex: i,
                    start: slot.start,
                    end: slot.end
                };
            }
        }
        return null;
    }

    /**
     * Check if two slots overlap
     */
    slotsOverlap(slot1, slot2) {
        const start1 = new Date(slot1.start).getTime();
        const end1 = new Date(slot1.end).getTime();
        const start2 = new Date(slot2.start).getTime();
        const end2 = new Date(slot2.end).getTime();
        return start1 < end2 && start2 < end1;
    }

    /**
     * Report progress via callback
     */
    reportProgress(phase, percent, message) {
        if (this.onProgress) {
            this.onProgress({
                phase,
                progress: percent,
                message
            });
        }
    }

    /**
     * Get the explainer instance for external queries
     */
    getExplainer() {
        return this.explainer;
    }
}

/**
 * Factory function for creating a scheduler instance
 */
export const createScheduler = (config = {}) => {
    return new HybridScheduler(config);
};

export default {
    HybridScheduler,
    createScheduler,
    generateTimeSlots,
    DEFAULT_SCHEDULER_CONFIG
};
