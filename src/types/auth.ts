// src/types/auth.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Physician' | 'Therapist' | 'Staff';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
