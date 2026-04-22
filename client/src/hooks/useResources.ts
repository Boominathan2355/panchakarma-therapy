import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import resourceService from '../services/resourceService';

export const useResourcesData = () => {
    return useQuery({
        queryKey: ['resources'],
        queryFn: resourceService.getResourceData,
    });
};

export const useUpdateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (staffMember: any) => resourceService.updateStaff(staffMember),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        }
    });
};
