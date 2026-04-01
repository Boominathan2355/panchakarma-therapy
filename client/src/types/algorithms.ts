// src/types/algorithms.ts
// Complex types for AI scheduling algorithms

import type { ScheduleEntry, TimeSlot } from './schedule';
import type { Therapist } from './resource';
import type { Patient } from './patient';
import type { TherapyType } from './therapy';

// ── Input / Config ──────────────────────────────────────────────────────────

export interface SchedulingInput {
  patients: Patient[];
  therapists: Therapist[];
  existingSchedule: ScheduleEntry[];
  timeHorizon: TimeSlot;
  constraints?: SchedulingConstraint[];
}

export interface SchedulingConstraint {
  type: 'SKILL_REQUIRED' | 'ROOM_CAPACITY' | 'MAX_DAILY_SESSIONS' | 'REST_BETWEEN_SESSIONS';
  params: Record<string, unknown>;
}

// ── Genetic Algorithm ───────────────────────────────────────────────────────

export interface Chromosome {
  genes: Gene[];
  fitness: number;
}

export interface Gene {
  patientId: string;
  therapistId: string | number;
  therapyType: TherapyType;
  timeSlot: TimeSlot;
  roomId: string;
}

export interface GAConfig {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  elitism: number;
}

// ── Particle Swarm Optimisation ─────────────────────────────────────────────

export interface Particle {
  position: number[];
  velocity: number[];
  bestPosition: number[];
  bestFitness: number;
}

export interface PSOConfig {
  swarmSize: number;
  maxIterations: number;
  inertia: number;
  cognitiveWeight: number;
  socialWeight: number;
}

// ── Hybrid Scheduler ────────────────────────────────────────────────────────

export interface SchedulingResult {
  schedule: ScheduleEntry[];
  fitness: number;
  conflicts: ConflictReport[];
  explanation: ScheduleExplanation;
}

export interface ConflictReport {
  type: string;
  affectedEntries: (string | number)[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
}

export interface ScheduleExplanation {
  algorithm: 'GENETIC' | 'PSO' | 'HYBRID' | 'HEURISTIC';
  score: number;
  factors: ExplanationFactor[];
}

export interface ExplanationFactor {
  name: string;
  weight: number;
  value: number;
  description: string;
}
