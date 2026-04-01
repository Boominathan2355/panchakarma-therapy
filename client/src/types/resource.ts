// src/types/resource.ts

export type ResourceStatus = 'Available' | 'Busy' | 'On Leave';

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Therapist {
  id: string | number;
  name: string;
  status: ResourceStatus;
  specialty: string;
  role: 'Senior Therapist' | 'Therapist' | 'Junior Therapist';
  skills: string[];
  shifts: Weekday[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  status: ResourceStatus;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export interface ResourceState {
  therapists: Therapist[];
  rooms: Room[];
  materials: Material[];
  isLoading: boolean;
  error: string | null;
}
