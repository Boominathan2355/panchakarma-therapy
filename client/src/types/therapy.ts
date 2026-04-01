// src/types/therapy.ts

export type TherapyType = 'Vamana' | 'Virechana' | 'Basti' | 'Nasya' | 'Raktamokshana';

export interface TherapySession {
  id: string | number;
  therapyType: TherapyType;
  patientId: string;
  therapistId: string | number;
  date: string;
  duration: number; // in minutes
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  notes?: string;
}

export interface TherapyPlan {
  id: string;
  patientId: string;
  therapyType: TherapyType;
  startDate: string;
  endDate: string;
  sessions: TherapySession[];
  status: 'Active' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface TherapyState {
  therapies: TherapySession[];
  isLoading: boolean;
  error: string | null;
}

export interface TherapyPlanState {
  plans: TherapyPlan[];
  selectedPlan: TherapyPlan | null;
  isLoading: boolean;
  error: string | null;
}
