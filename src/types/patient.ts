// src/types/patient.ts

export interface PatientHistoryEntry {
  date: string;
  type: 'Consultation' | 'Treatment' | 'Follow-up' | 'Lab Test' | 'Therapy Session';
  notes: string;
}

export interface PatientAvailability {
  start: string;
  end: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  complaint: string;
  conditions: string[];
  history: PatientHistoryEntry[];
  availability: PatientAvailability[];
}

export interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
}
