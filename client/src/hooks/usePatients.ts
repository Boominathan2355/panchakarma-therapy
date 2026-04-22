import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import patientService from '../services/patientService';
import { Patient } from '../types';

export const usePatients = () => {
    return useQuery({
        queryKey: ['patients'],
        queryFn: patientService.getPatients,
    });
};

export const usePatient = (id: string | undefined) => {
    return useQuery({
        queryKey: ['patients', id],
        queryFn: () => patientService.getPatientDetails(id!),
        enabled: !!id,
    });
};

export const useUpdatePatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: { id: string, updates: Partial<Patient> }) => 
            patientService.updatePatient(args.id, args.updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            queryClient.invalidateQueries({ queryKey: ['patients', variables.id] });
        }
    });
};
