// src/types/index.ts — barrel re-export for all domain types

export type { User, LoginCredentials, AuthResponse } from '../features/auth/types/auth';


export type {
  Patient,
  PatientHistoryEntry,
  PatientAvailability,
  PatientState,
} from './patient';

export type {
  TherapyType,
  TherapySession,
  TherapyPlan,
  TherapyState,
  TherapyPlanState,
  TherapyDefinition,
  TherapyDocument,
} from './therapy';

export type {
  ScheduleStatus,
  ScheduleEntry,
  TimeSlot,
  ConflictInfo,
  ScheduleState,
} from './schedule';

export type {
  ResourceStatus,
  Weekday,
  Therapist,
  Room,
  Material,
  ResourceState,
} from './resource';

export type { AuditAction, AuditLog, AuditState } from './audit';

export type {
  SchedulingInput,
  SchedulingConstraint,
  Chromosome,
  Gene,
  GAConfig,
  Particle,
  PSOConfig,
  SchedulingResult,
  ConflictReport,
  ScheduleExplanation,
  ExplanationFactor,
} from './algorithms';

export type {
  ApiResponse,
  PaginatedResponse,
  UploadResponse,
  Document,
} from './api';
