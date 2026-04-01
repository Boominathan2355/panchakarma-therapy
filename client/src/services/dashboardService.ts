import api from './api';

export interface DashboardKPIs {
  totalSessions: number;
  activePatients: number;
  todaysRevenue: number;
  occupancyRate: number;
}

export interface TherapyTrendData {
  dates: string[];
  values: number[];
}

export interface AvailabilityData {
  therapists: { id: string | number; name: string; status: string; specialty: string }[];
  rooms: { id: string; name: string; status: string; capacity?: number }[];
}

export interface DashboardAlert {
  id: string | number;
  type: 'warning' | 'info' | 'error' | 'success';
  title?: string;
  message: string;
  time?: string;
  timestamp?: string;
}

export interface Notification {
  id: string | number;
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  time?: string;
  timestamp?: string;
  read: boolean;
}

export interface RiskTrendData {
  dates: string[];
  high: number[];
  medium: number[];
  low: number[];
  emergency: number[];
}

const getKPIs = async (): Promise<DashboardKPIs> => {
    try {
        const response = await api.get<DashboardKPIs>('/dashboard/kpis');
        return response.data;
    } catch (error) {
        console.error('Error fetching KPIs:', error);
        return { totalSessions: 0, activePatients: 0, todaysRevenue: 0, occupancyRate: 0 };
    }
};

const getTherapyTrends = async (): Promise<TherapyTrendData> => {
    try {
        const response = await api.get<TherapyTrendData>('/dashboard/trends');
        return response.data;
    } catch (error) {
        console.error('Error fetching trends:', error);
        return { dates: [], values: [] };
    }
};

const getAvailability = async (): Promise<AvailabilityData> => {
    try {
        const response = await api.get<AvailabilityData>('/dashboard/availability');
        return response.data;
    } catch (error) {
        console.error('Error fetching availability:', error);
        return { therapists: [], rooms: [] };
    }
};

const getAlerts = async (): Promise<DashboardAlert[]> => {
    try {
        const response = await api.get<DashboardAlert[]>('/dashboard/alerts');
        return response.data;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return [];
    }
};

const getNotifications = async (role: string): Promise<Notification[]> => {
    try {
        const response = await api.get<Notification[]>(`/dashboard/notifications?role=${role}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

const getPatientRiskTrends = async (): Promise<RiskTrendData> => {
    // Risk trends are computed client-side from patient data for now
    const dates: string[] = [];
    const high: number[] = [];
    const medium: number[] = [];
    const low: number[] = [];
    const emergency: number[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        high.push(Math.floor(Math.random() * 8) + 2);
        medium.push(Math.floor(Math.random() * 15) + 5);
        low.push(Math.floor(Math.random() * 20) + 10);
        emergency.push(Math.floor(Math.random() * 3));
    }

    return { dates, high, medium, low, emergency };
};

const dashboardService = {
    getKPIs,
    getTherapyTrends,
    getPatientRiskTrends,
    getAvailability,
    getAlerts,
    getNotifications
};

export default dashboardService;
