import { useQuery } from '@tanstack/react-query';
import therapyService from '../services/therapyService';

export const useTherapies = () => {
    return useQuery({
        queryKey: ['therapies'],
        queryFn: therapyService.getTherapies,
    });
};

export const useTherapy = (id: string | undefined) => {
    return useQuery({
        queryKey: ['therapies', id],
        queryFn: () => therapyService.getTherapyDetails(id!),
        enabled: !!id,
    });
};
