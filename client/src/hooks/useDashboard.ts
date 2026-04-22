import { useQuery } from '@tanstack/react-query';
import dashboardService from '../services/dashboardService';
import scheduleService from '../services/scheduleService';

export const useDashboardKPIs = () => {
    return useQuery({
        queryKey: ['dashboard', 'kpis'],
        queryFn: dashboardService.getKPIs,
    });
};

export const useTherapyTrends = () => {
    return useQuery({
        queryKey: ['dashboard', 'therapy-trends'],
        queryFn: dashboardService.getTherapyTrends,
    });
};

export const usePatientRiskTrends = () => {
    return useQuery({
        queryKey: ['dashboard', 'risk-trends'],
        queryFn: dashboardService.getPatientRiskTrends,
    });
};

export const useAvailability = () => {
    return useQuery({
        queryKey: ['dashboard', 'availability'],
        queryFn: dashboardService.getAvailability,
    });
};

export const useSessions = () => {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: scheduleService.getSessions,
    });
};
