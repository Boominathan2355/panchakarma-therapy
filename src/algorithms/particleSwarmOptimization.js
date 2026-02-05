/**
 * Particle Swarm Optimization for Schedule Refinement
 * Reduces conflicts and improves overall resource utilization
 */

/**
 * Default PSO parameters
 */
export const DEFAULT_PSO_PARAMS = {
    swarmSize: 30,
    iterations: 50,
    inertiaWeight: 0.7,
    inertiaDecay: 0.99,
    cognitiveCoef: 1.5,  // Personal best influence
    socialCoef: 1.5,     // Global best influence
    maxVelocity: 3,
    convergenceThreshold: 0.001,
    convergenceIterations: 5
};

/**
 * Particle class representing a schedule solution
 */
class Particle {
    constructor(position, velocity = null) {
        this.position = position; // Array of time slot indices
        this.velocity = velocity || position.map(() => 0);
        this.fitness = 0;
        this.bestPosition = [...position];
        this.bestFitness = -Infinity;
    }

    updatePersonalBest() {
        if (this.fitness > this.bestFitness) {
            this.bestFitness = this.fitness;
            this.bestPosition = [...this.position];
        }
    }
}

/**
 * Particle Swarm Optimization for schedule refinement
 */
export class ParticleSwarmOptimization {
    constructor(params = {}) {
        this.params = { ...DEFAULT_PSO_PARAMS, ...params };
        this.swarm = [];
        this.globalBest = null;
        this.globalBestFitness = -Infinity;
        this.iterationHistory = [];
        this.onProgress = null;
    }

    /**
     * Initialize the swarm with positions from GA output
     * @param {Array} sessions - Sessions to optimize (from GA)
     * @param {Object} context - Scheduling context
     */
    initializeSwarm(sessions, context) {
        this.context = context;
        this.sessions = sessions;
        this.swarm = [];

        const numDimensions = sessions.length;
        const maxSlotIndex = context.timeSlots.length - 1;

        for (let i = 0; i < this.params.swarmSize; i++) {
            // Initialize position around the GA solution with some variation
            const position = sessions.map(session => {
                const baseIndex = session.timeSlotIndex || 0;
                const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
                return Math.max(0, Math.min(baseIndex + variation, maxSlotIndex));
            });

            const velocity = position.map(() =>
                (Math.random() - 0.5) * 2 * this.params.maxVelocity
            );

            const particle = new Particle(position, velocity);
            particle.fitness = this.calculateFitness(particle.position);
            particle.updatePersonalBest();
            this.swarm.push(particle);

            if (particle.fitness > this.globalBestFitness) {
                this.globalBestFitness = particle.fitness;
                this.globalBest = [...particle.position];
            }
        }
    }

    /**
     * Calculate fitness for a position (set of time slot assignments)
     */
    calculateFitness(position) {
        const { timeSlots, therapists, rooms, existingSessions } = this.context;
        let fitness = 100;

        // Create sessions with new time slots
        const sessions = this.sessions.map((session, idx) => ({
            ...session,
            start: timeSlots[position[idx]]?.start,
            end: timeSlots[position[idx]]?.end
        }));

        // Penalty for conflicts (overlapping rooms)
        const roomConflicts = this.countRoomConflicts(sessions);
        fitness -= roomConflicts * 20;

        // Penalty for therapist double-booking
        const therapistConflicts = this.countTherapistConflicts(sessions);
        fitness -= therapistConflicts * 15;

        // Penalty for conflicts with existing sessions
        const existingConflicts = this.countExistingConflicts(sessions, existingSessions);
        fitness -= existingConflicts * 25;

        // Reward for maintaining sequence order
        const sequenceScore = this.calculateSequenceScore(position);
        fitness += sequenceScore * 10;

        // Reward for compact scheduling (minimize gaps)
        const compactness = this.calculateCompactness(position);
        fitness += compactness * 5;

        // Reward for good resource utilization
        const utilization = this.calculateUtilization(sessions, rooms);
        fitness += utilization * 3;

        return Math.max(0, Math.min(100, fitness));
    }

    /**
     * Count room conflicts within sessions
     */
    countRoomConflicts(sessions) {
        let conflicts = 0;
        for (let i = 0; i < sessions.length; i++) {
            for (let j = i + 1; j < sessions.length; j++) {
                if (sessions[i].resourceId === sessions[j].resourceId &&
                    this.doIntervalsOverlap(
                        { start: sessions[i].start, end: sessions[i].end },
                        { start: sessions[j].start, end: sessions[j].end }
                    )) {
                    conflicts++;
                }
            }
        }
        return conflicts;
    }

    /**
     * Count therapist conflicts
     */
    countTherapistConflicts(sessions) {
        let conflicts = 0;
        for (let i = 0; i < sessions.length; i++) {
            for (let j = i + 1; j < sessions.length; j++) {
                if (sessions[i].therapistId === sessions[j].therapistId &&
                    this.doIntervalsOverlap(
                        { start: sessions[i].start, end: sessions[i].end },
                        { start: sessions[j].start, end: sessions[j].end }
                    )) {
                    conflicts++;
                }
            }
        }
        return conflicts;
    }

    /**
     * Count conflicts with existing sessions
     */
    countExistingConflicts(newSessions, existingSessions) {
        let conflicts = 0;
        for (const newSession of newSessions) {
            for (const existing of existingSessions) {
                if (newSession.resourceId === existing.resourceId &&
                    this.doIntervalsOverlap(
                        { start: new Date(newSession.start), end: new Date(newSession.end) },
                        { start: new Date(existing.start), end: new Date(existing.end) }
                    )) {
                    conflicts++;
                }
            }
        }
        return conflicts;
    }

    /**
     * Calculate score for maintaining step sequence
     */
    calculateSequenceScore(position) {
        let score = 0;
        for (let i = 1; i < position.length; i++) {
            // Sessions should be in order by step number
            if (position[i] > position[i - 1]) {
                score++;
            }
        }
        return score / Math.max(1, position.length - 1);
    }

    /**
     * Calculate schedule compactness (fewer gaps = better)
     */
    calculateCompactness(position) {
        if (position.length < 2) return 1;

        const sorted = [...position].sort((a, b) => a - b);
        const totalSpan = sorted[sorted.length - 1] - sorted[0];
        const idealSpan = position.length - 1; // One slot apart ideally

        if (totalSpan === 0) return 1;
        return Math.max(0, 1 - (totalSpan - idealSpan) / totalSpan);
    }

    /**
     * Calculate resource utilization score
     */
    calculateUtilization(sessions, rooms) {
        const usedRooms = new Set(sessions.map(s => s.resourceId));
        // Prefer using fewer rooms efficiently
        return sessions.length > 0 ? sessions.length / (usedRooms.size * 2) : 0;
    }

    /**
     * Check if two intervals overlap
     */
    doIntervalsOverlap(interval1, interval2) {
        const start1 = new Date(interval1.start).getTime();
        const end1 = new Date(interval1.end).getTime();
        const start2 = new Date(interval2.start).getTime();
        const end2 = new Date(interval2.end).getTime();
        return start1 < end2 && start2 < end1;
    }

    /**
     * Update particle velocity and position
     */
    updateParticle(particle) {
        const r1 = Math.random();
        const r2 = Math.random();
        const inertia = this.params.inertiaWeight;
        const cognitive = this.params.cognitiveCoef;
        const social = this.params.socialCoef;

        for (let d = 0; d < particle.position.length; d++) {
            // Velocity update
            particle.velocity[d] =
                inertia * particle.velocity[d] +
                cognitive * r1 * (particle.bestPosition[d] - particle.position[d]) +
                social * r2 * (this.globalBest[d] - particle.position[d]);

            // Clamp velocity
            particle.velocity[d] = Math.max(
                -this.params.maxVelocity,
                Math.min(this.params.maxVelocity, particle.velocity[d])
            );

            // Position update
            particle.position[d] = Math.round(particle.position[d] + particle.velocity[d]);

            // Clamp position
            particle.position[d] = Math.max(
                0,
                Math.min(this.context.timeSlots.length - 1, particle.position[d])
            );
        }

        // Recalculate fitness
        particle.fitness = this.calculateFitness(particle.position);
        particle.updatePersonalBest();

        // Update global best
        if (particle.fitness > this.globalBestFitness) {
            this.globalBestFitness = particle.fitness;
            this.globalBest = [...particle.position];
        }
    }

    /**
     * Run one iteration of PSO
     */
    iterate() {
        for (const particle of this.swarm) {
            this.updateParticle(particle);
        }

        // Decay inertia weight
        this.params.inertiaWeight *= this.params.inertiaDecay;

        return {
            globalBestFitness: this.globalBestFitness,
            avgFitness: this.swarm.reduce((sum, p) => sum + p.fitness, 0) / this.swarm.length,
            globalBest: this.globalBest
        };
    }

    /**
     * Check for convergence
     */
    hasConverged() {
        if (this.iterationHistory.length < this.params.convergenceIterations) {
            return false;
        }

        const recent = this.iterationHistory.slice(-this.params.convergenceIterations);
        const maxDiff = Math.max(...recent.map(h => h.globalBestFitness)) -
            Math.min(...recent.map(h => h.globalBestFitness));

        return maxDiff < this.params.convergenceThreshold;
    }

    /**
     * Run PSO optimization
     * @param {Array} sessions - Initial sessions from GA
     * @param {Object} context - Scheduling context
     * @returns {Object} Optimization result
     */
    run(sessions, context) {
        this.initializeSwarm(sessions, context);
        this.iterationHistory = [];

        for (let iter = 0; iter < this.params.iterations; iter++) {
            const result = this.iterate();
            this.iterationHistory.push({
                iteration: iter,
                ...result
            });

            // Progress callback
            if (this.onProgress) {
                this.onProgress({
                    phase: 'particle_swarm',
                    iteration: iter,
                    totalIterations: this.params.iterations,
                    bestFitness: result.globalBestFitness,
                    avgFitness: result.avgFitness,
                    progress: ((iter + 1) / this.params.iterations) * 100
                });
            }

            if (this.hasConverged()) {
                break;
            }
        }

        return {
            globalBest: this.globalBest,
            globalBestFitness: this.globalBestFitness,
            iterationsRun: this.iterationHistory.length,
            converged: this.hasConverged(),
            history: this.iterationHistory
        };
    }

    /**
     * Apply best solution to sessions
     */
    applyBestSolution() {
        if (!this.globalBest || !this.sessions) {
            return this.sessions;
        }

        return this.sessions.map((session, idx) => ({
            ...session,
            timeSlotIndex: this.globalBest[idx],
            start: this.context.timeSlots[this.globalBest[idx]]?.start,
            end: this.context.timeSlots[this.globalBest[idx]]?.end
        }));
    }
}

export default ParticleSwarmOptimization;
