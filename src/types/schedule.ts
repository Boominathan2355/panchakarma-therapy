// src/types/schedule.ts

export type ScheduleStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';

export interface ScheduleEntry {
  id: number | string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  therapistId: number | string;
  patientId: string;
  type: string;
  status: ScheduleStatus;
  statusUpdatedAt?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface ConflictInfo {
  entryA: ScheduleEntry;
  entryB: ScheduleEntry;
  reason: string;
}

export interface ScheduleState {
  entries: ScheduleEntry[];
  conflicts: ConflictInfo[];
  isLoading: boolean;
  error: string | null;
}
