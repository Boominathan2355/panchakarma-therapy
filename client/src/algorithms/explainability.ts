/**
 * TRACE-CS Inspired Explainability Module
 * Provides clear explanations for constraint handling and scheduling adjustments
 */

/**
 * Decision types for categorization
 */
export const DECISION_TYPES = {
    PLACEMENT: 'PLACEMENT',         // Initial session placement
    OPTIMIZATION: 'OPTIMIZATION',   // GA/PSO improvements
    CONSTRAINT: 'CONSTRAINT',       // Constraint enforcement
    PREEMPTION: 'PREEMPTION',       // Priority-based rescheduling
    CONFLICT: 'CONFLICT',           // Conflict resolution
    MANUAL: 'MANUAL'                // Manual override
} as const;

export type DecisionType = keyof typeof DECISION_TYPES;

export interface ExplanationDetails {
    session?: any;
    slot?: string;
    reason?: string;
    factors?: any[];
    phase?: string;
    beforeFitness?: number;
    afterFitness?: number;
    improvement?: string;
    improvementPercent?: string;
    constraintType?: string;
    severity?: string;
    originalIssue?: string;
    actionTaken?: string;
    outcome?: string;
    preemptingSession?: any;
    preemptedSession?: any;
    result?: string;
    newSlot?: string;
    conflictType?: string;
    conflictDetails?: string;
    resolution?: string;
    alternativesConsidered?: number;
    chosenAlternative?: any;
}

/**
 * Explanation entry structure
 */
export class ExplanationEntry {
    id: string;
    type: DecisionType;
    summary: string;
    details: ExplanationDetails;
    timestamp: Date;

    constructor(type: DecisionType, summary: string, details: ExplanationDetails = {}) {
        this.id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.type = type;
        this.summary = summary;
        this.details = details;
        this.timestamp = new Date();
    }

    toReadable() {
        return {
            id: this.id,
            type: this.type,
            summary: this.summary,
            timestamp: this.timestamp.toLocaleString(),
            ...this.details
        };
    }
}

export interface Phase {
    id: string;
    name: string;
    description: string;
    startTime: Date;
    endTime: Date | null;
    duration?: number;
    summary?: string;
    explanations: string[];
}

export interface Metrics {
    totalDecisions: number;
    constraintViolationsResolved: number;
    conflictsHandled: number;
    preemptions: number;
    optimizationImprovements: number;
}

/**
 * Explainability Engine for scheduling decisions
 */
export class ExplainabilityEngine {
    explanations: ExplanationEntry[];
    phases: Phase[];
    metrics: Metrics;

    constructor() {
        this.explanations = [];
        this.phases = [];
        this.metrics = {
            totalDecisions: 0,
            constraintViolationsResolved: 0,
            conflictsHandled: 0,
            preemptions: 0,
            optimizationImprovements: 0
        };
    }

    /**
     * Start a new scheduling phase
     */
    startPhase(phaseName: string, description: string): string {
        const phase: Phase = {
            id: `phase_${Date.now()}`,
            name: phaseName,
            description,
            startTime: new Date(),
            endTime: null,
            explanations: []
        };
        this.phases.push(phase);
        return phase.id;
    }

    /**
     * End current phase
     */
    endPhase(phaseId: string, summary: string | null = null) {
        const phase = this.phases.find(p => p.id === phaseId);
        if (phase) {
            phase.endTime = new Date();
            phase.duration = phase.endTime.getTime() - phase.startTime.getTime();
            if (summary) {
                phase.summary = summary;
            }
        }
    }

    /**
     * Log a placement decision
     */
    logPlacement(session: any, slot: any, reason: string): ExplanationEntry {
        const entry = new ExplanationEntry(
            DECISION_TYPES.PLACEMENT,
            `Placed "${session.action || session.title}" at ${this.formatSlot(slot)}`,
            {
                session: this.summarizeSession(session),
                slot: this.formatSlot(slot),
                reason,
                factors: this.getPlacementFactors(session, slot)
            }
        );

        this.addExplanation(entry);
        this.metrics.totalDecisions++;
        return entry;
    }

    /**
     * Log an optimization improvement
     */
    logOptimization(phase: string, before: number, after: number, improvement: number): ExplanationEntry {
        const entry = new ExplanationEntry(
            DECISION_TYPES.OPTIMIZATION,
            `${phase} improved fitness from ${before.toFixed(1)} to ${after.toFixed(1)}`,
            {
                phase,
                beforeFitness: before,
                afterFitness: after,
                improvement: improvement.toFixed(2),
                improvementPercent: ((after - before) / Math.max(before, 1) * 100).toFixed(1) + '%'
            }
        );

        this.addExplanation(entry);
        this.metrics.totalDecisions++;
        this.metrics.optimizationImprovements++;
        return entry;
    }

    /**
     * Log a constraint handling decision
     */
    logConstraint(constraint: any, action: string, outcome: string): ExplanationEntry {
        const entry = new ExplanationEntry(
            DECISION_TYPES.CONSTRAINT,
            `${action} for ${constraint.type}: ${outcome}`,
            {
                constraintType: constraint.type,
                severity: constraint.severity,
                originalIssue: constraint.message,
                actionTaken: action,
                outcome
            }
        );

        this.addExplanation(entry);
        this.metrics.totalDecisions++;
        this.metrics.constraintViolationsResolved++;
        return entry;
    }

    /**
     * Log a preemption decision
     */
    logPreemption(preemptingSession: any, preemptedSession: any, reason: string, result: any): ExplanationEntry {
        const entry = new ExplanationEntry(
            DECISION_TYPES.PREEMPTION,
            `"${preemptingSession.title}" preempted "${preemptedSession.title}"`,
            {
                preemptingSession: this.summarizeSession(preemptingSession),
                preemptedSession: this.summarizeSession(preemptedSession),
                reason,
                result: result.success ? 'Rescheduled successfully' : result.error,
                newSlot: result.newSlot ? this.formatSlot(result.newSlot) : 'N/A'
            }
        );

        this.addExplanation(entry);
        this.metrics.totalDecisions++;
        this.metrics.preemptions++;
        return entry;
    }

    /**
     * Log a conflict resolution
     */
    logConflictResolution(conflict: any, resolution: string, alternatives: any[]): ExplanationEntry {
        const entry = new ExplanationEntry(
            DECISION_TYPES.CONFLICT,
            `Resolved conflict: ${conflict.type}`,
            {
                conflictType: conflict.type,
                conflictDetails: conflict.message,
                resolution,
                alternativesConsidered: alternatives?.length || 0,
                chosenAlternative: alternatives?.[0] || null
            }
        );

        this.addExplanation(entry);
        this.metrics.totalDecisions++;
        this.metrics.conflictsHandled++;
        return entry;
    }

    /**
     * Add explanation to current phase
     */
    addExplanation(entry: ExplanationEntry) {
        this.explanations.push(entry);

        const currentPhase = this.phases[this.phases.length - 1];
        if (currentPhase && !currentPhase.endTime) {
            currentPhase.explanations.push(entry.id);
        }
    }

    /**
     * Get placement factors for explanation
     */
    getPlacementFactors(session: any, slot: any): any[] {
        return [
            { factor: 'Therapist Match', value: session.therapistId ? 'Assigned' : 'TBD' },
            { factor: 'Room Availability', value: session.resourceId ? 'Reserved' : 'TBD' },
            { factor: 'Time Slot', value: this.formatSlot(slot) },
            { factor: 'Priority', value: session.priorityToken?.level || 'NORMAL' }
        ];
    }

    /**
     * Generate human-readable explanation report
     */
    generateReport(): any {
        return {
            summary: {
                totalPhases: this.phases.length,
                totalDecisions: this.metrics.totalDecisions,
                constraintsResolved: this.metrics.constraintViolationsResolved,
                conflictsHandled: this.metrics.conflictsHandled,
                preemptions: this.metrics.preemptions,
                optimizations: this.metrics.optimizationImprovements
            },
            phases: this.phases.map(phase => ({
                name: phase.name,
                description: phase.description,
                duration: phase.duration ? `${phase.duration}ms` : 'In progress',
                summary: phase.summary,
                decisionCount: phase.explanations.length
            })),
            timeline: this.explanations.map(e => e.toReadable()),
            metrics: { ...this.metrics }
        };
    }

    /**
     * Get explanations by type
     */
    getByType(type: DecisionType): ExplanationEntry[] {
        return this.explanations.filter(e => e.type === type);
    }

    /**
     * Get recent explanations
     */
    getRecent(count = 10): any[] {
        return this.explanations.slice(-count).map(e => e.toReadable());
    }

    /**
     * Generate natural language summary
     */
    generateNLSummary(): string {
        const report = this.generateReport();
        const lines: string[] = [];

        lines.push(`## Scheduling Decision Summary\n`);
        lines.push(`The scheduling process completed in **${report.phases.length} phases** with **${report.summary.totalDecisions} decisions**.\n`);

        if (report.summary.constraintsResolved > 0) {
            lines.push(`- ✅ Resolved **${report.summary.constraintsResolved}** constraint violations`);
        }
        if (report.summary.conflictsHandled > 0) {
            lines.push(`- 🔄 Handled **${report.summary.conflictsHandled}** scheduling conflicts`);
        }
        if (report.summary.preemptions > 0) {
            lines.push(`- ⚡ Performed **${report.summary.preemptions}** priority preemptions`);
        }
        if (report.summary.optimizations > 0) {
            lines.push(`- 📈 Made **${report.summary.optimizations}** optimization improvements`);
        }

        lines.push(`\n### Phase Breakdown\n`);
        for (const phase of report.phases) {
            lines.push(`#### ${phase.name}`);
            lines.push(`${phase.description}`);
            if (phase.summary) {
                lines.push(`> ${phase.summary}`);
            }
            lines.push(`Duration: ${phase.duration} | Decisions: ${phase.decisionCount}\n`);
        }

        return lines.join('\n');
    }

    /**
     * Clear all explanations (for new scheduling run)
     */
    clear() {
        this.explanations = [];
        this.phases = [];
        this.metrics = {
            totalDecisions: 0,
            constraintViolationsResolved: 0,
            conflictsHandled: 0,
            preemptions: 0,
            optimizationImprovements: 0
        };
    }

    /**
     * Helper: Format a time slot for display
     */
    formatSlot(slot: any): string {
        if (!slot) return 'Unknown';
        if (slot.start && slot.end) {
            const start = new Date(slot.start);
            const end = new Date(slot.end);
            return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return String(slot);
    }

    /**
     * Helper: Summarize a session for explanation
     */
    summarizeSession(session: any): any {
        return {
            id: session.id,
            title: session.title || session.action,
            type: session.type,
            therapist: session.therapistId,
            room: session.resourceId,
            priority: session.priorityToken?.level || 'NORMAL'
        };
    }
}

/**
 * Create a global explainability engine instance
 */
export const globalExplainer = new ExplainabilityEngine();

export default {
    DECISION_TYPES,
    ExplanationEntry,
    ExplainabilityEngine,
    globalExplainer
};
