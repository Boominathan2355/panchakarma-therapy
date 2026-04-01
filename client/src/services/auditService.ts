import api from './api';
import type { AuditAction, AuditLog } from '../types';

export const AUDIT_ACTIONS: Record<string, AuditAction> = {
    SCHEDULE_GENERATED: 'SCHEDULE' as AuditAction,
    SESSION_RESCHEDULED: 'UPDATE' as AuditAction,
    SESSION_STATUS_UPDATE: 'UPDATE' as AuditAction,
    STAFF_UPDATE: 'UPDATE' as AuditAction,
    MANUAL_OVERRIDE: 'UPDATE' as AuditAction,
    SYSTEM_ALERT: 'VIEW' as AuditAction
};

const getLogs = async (): Promise<any[]> => {
    try {
        const response = await api.get<any[]>('/audit/');
        return response.data;
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
    }
};

const createLog = async (entry: Partial<AuditLog>): Promise<any> => {
    try {
        const response = await api.post('/audit/', entry);
        return response.data;
    } catch (error) {
        console.error('Error creating audit log:', error);
        throw error;
    }
};

const auditService = {
    getLogs,
    createLog,
    AUDIT_ACTIONS
};

export default auditService;
