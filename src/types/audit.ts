// src/types/audit.ts

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'SCHEDULE'
  | 'UPLOAD';

export interface AuditLog {
  id: string | number;
  userId: number;
  userName: string;
  action: AuditAction;
  entity: string;
  entityId?: string | number;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AuditState {
  logs: AuditLog[];
  isLoading: boolean;
  error: string | null;
}
