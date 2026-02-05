/**
 * Genetic Algorithm for Therapy Schedule Optimization
 * Optimizes therapist, room, and material allocation across sessions
 */

import { validateAllConstraints, SEVERITY } from './ruleBasedConstraints.js';

/**
 * Default GA parameters
 */
export const DEFAULT_GA_PARAMS = {
    populationSize: 50,
    generations: 100,
    mutationRate: 0.1,
    crossoverRate: 0.8,
    elitismCount: 2,
    tournamentSize: 3,
    convergenceThreshold: 0.001,
    convergenceGenerations: 10
};

/**
 * Chromosome representation of a schedule
 * Each gene represents a session with: therapistId, resourceId, timeSlot
 */
class Chromosome {
    constructor(genes = [], fitness = 0) {
        this.genes = genes;
        this.fitness = fitness;
    }

    clone() {
        return new Chromosome(
            this.genes.map(g => ({ ...g })),
            this.fitness
        );
    }
}

/**
 * Genetic Algorithm class for schedule optimization
 */
export class GeneticAlgorithm {
    constructor(params = {}) {
        this.params = { ...DEFAULT_GA_PARAMS, ...params };
        this.population = [];
        this.bestChromosome = null;
        this.generationHistory = [];
        this.onProgress = null;
    }

    /**
     * Initialize population with random valid schedules
     * @param {Object} context - Scheduling context (therapy, patient, resources, etc.)
     */
    initializePopulation(context) {
        this.context = context;
        this.population = [];

        for (let i = 0; i < this.params.populationSize; i++) {
            const chromosome = this.createRandomChromosome(context);
            chromosome.fitness = this.calculateFitness(chromosome, context);
            this.population.push(chromosome);
        }

        // Sort by fitness (descending)
        this.population.sort((a, b) => b.fitness - a.fitness);
        this.bestChromosome = this.population[0].clone();
    }

    /**
     * Create a random valid chromosome
     */
    createRandomChromosome(context) {
        const { therapy, therapists, rooms, timeSlots, patient } = context;
        const genes = [];

        // Create a gene for each workflow step
        const workflowSteps = therapy.workflow || [];

        for (let i = 0; i < workflowSteps.length; i++) {
            const step = workflowSteps[i];

            // Select random therapist with relevant skills
            const eligibleTherapists = therapists.filter(t =>
                !t.skills || t.skills.some(s =>
                    s.toLowerCase().includes(therapy.name.toLowerCase()) ||
                    therapy.name.toLowerCase().includes(s.toLowerCase())
                )
            );
            const therapist = eligibleTherapists.length > 0
                ? eligibleTherapists[Math.floor(Math.random() * eligibleTherapists.length)]
                : therapists[Math.floor(Math.random() * therapists.length)];

            // Select random room
            const room = rooms[Math.floor(Math.random() * rooms.length)];

            // Select time slot (sequential based on step order)
            const baseSlotIndex = i * 2; // 2-hour gaps between steps
            const slotVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const slotIndex = Math.max(0, Math.min(baseSlotIndex + slotVariation, timeSlots.length - 1));

            genes.push({
                stepId: step.id,
                stepNumber: step.step,
                action: step.action,
                duration: step.duration,
                therapistId: therapist.id,
                resourceId: room.id,
                timeSlotIndex: slotIndex,
                patientId: patient.id
            });
        }

        return new Chromosome(genes);
    }

    /**
     * Calculate fitness score for a chromosome
     * Higher is better (0-100 scale)
     */
    calculateFitness(chromosome, context) {
        const { therapy, patient, therapists, existingSessions, inventory, timeSlots } = context;

        // Convert genes to session format for constraint validation
        const sessions = chromosome.genes.map(gene => ({
            id: `temp_${gene.stepId}`,
            type: therapy.name,
            action: gene.action,
            therapistId: gene.therapistId,
            resourceId: gene.resourceId,
            start: timeSlots[gene.timeSlotIndex]?.start || new Date(),
            end: timeSlots[gene.timeSlotIndex]?.end || new Date(),
            patientId: gene.patientId
        }));

        // Run constraint validation
        const validation = validateAllConstraints({
            sessions,
            therapy,
            patient,
            therapists,
            existingSessions,
            inventory
        });

        // Base score
        let fitness = 100;

        // Penalty for constraint violations
        fitness -= validation.summary.critical * 25;
        fitness -= validation.summary.warnings * 5;

        // Bonus for good therapist-skill matching
        let skillMatchBonus = 0;
        for (const gene of chromosome.genes) {
            const therapist = therapists.find(t => t.id === gene.therapistId);
            if (therapist?.skills?.some(s =>
                s.toLowerCase().includes(therapy.name.toLowerCase())
            )) {
                skillMatchBonus += 5;
            }
        }
        fitness += Math.min(skillMatchBonus, 15);

        // Bonus for efficient room utilization (same room when possible)
        const uniqueRooms = new Set(chromosome.genes.map(g => g.resourceId)).size;
        if (uniqueRooms === 1) {
            fitness += 10;
        }

        // Penalty for scheduling gaps
        const sortedGenes = [...chromosome.genes].sort((a, b) => a.timeSlotIndex - b.timeSlotIndex);
        for (let i = 1; i < sortedGenes.length; i++) {
            const gap = sortedGenes[i].timeSlotIndex - sortedGenes[i - 1].timeSlotIndex;
            if (gap > 4) {
                fitness -= 3; // Large gaps are undesirable
            }
        }

        return Math.max(0, Math.min(100, fitness));
    }

    /**
     * Tournament selection
     */
    tournamentSelect() {
        const tournament = [];
        for (let i = 0; i < this.params.tournamentSize; i++) {
            const randomIndex = Math.floor(Math.random() * this.population.length);
            tournament.push(this.population[randomIndex]);
        }
        tournament.sort((a, b) => b.fitness - a.fitness);
        return tournament[0];
    }

    /**
     * Single-point crossover
     */
    crossover(parent1, parent2) {
        if (Math.random() > this.params.crossoverRate) {
            return [parent1.clone(), parent2.clone()];
        }

        const crossoverPoint = Math.floor(Math.random() * parent1.genes.length);

        const child1Genes = [
            ...parent1.genes.slice(0, crossoverPoint).map(g => ({ ...g })),
            ...parent2.genes.slice(crossoverPoint).map(g => ({ ...g }))
        ];

        const child2Genes = [
            ...parent2.genes.slice(0, crossoverPoint).map(g => ({ ...g })),
            ...parent1.genes.slice(crossoverPoint).map(g => ({ ...g }))
        ];

        return [new Chromosome(child1Genes), new Chromosome(child2Genes)];
    }

    /**
     * Mutation: randomly swap therapist or room assignment
     */
    mutate(chromosome) {
        const mutatedGenes = chromosome.genes.map(gene => {
            if (Math.random() < this.params.mutationRate) {
                const mutatedGene = { ...gene };
                const mutationType = Math.floor(Math.random() * 3);

                switch (mutationType) {
                    case 0: // Mutate therapist
                        const therapists = this.context.therapists;
                        mutatedGene.therapistId = therapists[Math.floor(Math.random() * therapists.length)].id;
                        break;
                    case 1: // Mutate room
                        const rooms = this.context.rooms;
                        mutatedGene.resourceId = rooms[Math.floor(Math.random() * rooms.length)].id;
                        break;
                    case 2: // Mutate time slot
                        const shift = Math.floor(Math.random() * 3) - 1;
                        mutatedGene.timeSlotIndex = Math.max(0, Math.min(
                            mutatedGene.timeSlotIndex + shift,
                            this.context.timeSlots.length - 1
                        ));
                        break;
                }
                return mutatedGene;
            }
            return { ...gene };
        });

        return new Chromosome(mutatedGenes);
    }

    /**
     * Evolve one generation
     */
    evolveGeneration() {
        const newPopulation = [];

        // Elitism: keep best chromosomes
        for (let i = 0; i < this.params.elitismCount; i++) {
            newPopulation.push(this.population[i].clone());
        }

        // Fill rest with offspring
        while (newPopulation.length < this.params.populationSize) {
            const parent1 = this.tournamentSelect();
            const parent2 = this.tournamentSelect();

            const [child1, child2] = this.crossover(parent1, parent2);

            const mutatedChild1 = this.mutate(child1);
            const mutatedChild2 = this.mutate(child2);

            mutatedChild1.fitness = this.calculateFitness(mutatedChild1, this.context);
            mutatedChild2.fitness = this.calculateFitness(mutatedChild2, this.context);

            newPopulation.push(mutatedChild1);
            if (newPopulation.length < this.params.populationSize) {
                newPopulation.push(mutatedChild2);
            }
        }

        this.population = newPopulation;
        this.population.sort((a, b) => b.fitness - a.fitness);

        if (this.population[0].fitness > this.bestChromosome.fitness) {
            this.bestChromosome = this.population[0].clone();
        }

        return {
            bestFitness: this.population[0].fitness,
            avgFitness: this.population.reduce((sum, c) => sum + c.fitness, 0) / this.population.length,
            bestChromosome: this.bestChromosome
        };
    }

    /**
     * Check for convergence
     */
    hasConverged() {
        if (this.generationHistory.length < this.params.convergenceGenerations) {
            return false;
        }

        const recent = this.generationHistory.slice(-this.params.convergenceGenerations);
        const maxDiff = Math.max(...recent.map(h => h.bestFitness)) -
            Math.min(...recent.map(h => h.bestFitness));

        return maxDiff < this.params.convergenceThreshold;
    }

    /**
     * Run the genetic algorithm
     * @param {Object} context - Scheduling context
     * @returns {Object} Optimization result
     */
    run(context) {
        this.initializePopulation(context);
        this.generationHistory = [];

        for (let gen = 0; gen < this.params.generations; gen++) {
            const result = this.evolveGeneration();
            this.generationHistory.push({
                generation: gen,
                ...result
            });

            // Progress callback
            if (this.onProgress) {
                this.onProgress({
                    phase: 'genetic_algorithm',
                    generation: gen,
                    totalGenerations: this.params.generations,
                    bestFitness: result.bestFitness,
                    avgFitness: result.avgFitness,
                    progress: ((gen + 1) / this.params.generations) * 100
                });
            }

            // Check convergence
            if (this.hasConverged()) {
                break;
            }
        }

        return {
            bestChromosome: this.bestChromosome,
            bestFitness: this.bestChromosome.fitness,
            generationsRun: this.generationHistory.length,
            converged: this.hasConverged(),
            history: this.generationHistory
        };
    }

    /**
     * Convert best chromosome to schedule format
     */
    toSchedule() {
        if (!this.bestChromosome || !this.context) {
            return [];
        }

        return this.bestChromosome.genes.map(gene => ({
            id: `session_${gene.stepId}_${Date.now()}`,
            title: `${this.context.therapy.name} - ${gene.action}`,
            type: this.context.therapy.name,
            action: gene.action,
            therapistId: gene.therapistId,
            resourceId: gene.resourceId,
            start: this.context.timeSlots[gene.timeSlotIndex]?.start,
            end: this.context.timeSlots[gene.timeSlotIndex]?.end,
            patientId: gene.patientId,
            status: 'scheduled',
            stepNumber: gene.stepNumber
        }));
    }
}

export default GeneticAlgorithm;
