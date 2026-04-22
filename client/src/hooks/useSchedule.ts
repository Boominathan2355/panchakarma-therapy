import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import scheduleService from '../services/scheduleService';
import { ScheduleEntry } from '../types';

export const useSessions = () => {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: scheduleService.getSessions,
    });
};

export const useUpdateSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { id: string, updates: Partial<ScheduleEntry> }) => 
            scheduleService.updateSession(args.id, args.updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
};

export const useLogSessionNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { id: string, note: string }) => 
            scheduleService.logSessionNote(args.id, args.note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
};
