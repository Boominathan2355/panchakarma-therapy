import api from './api';
import type { Patient } from '../types';

const getPatients = async (): Promise<Patient[]> => {
    try {
        const response = await api.get<Patient[]>('/patients/');
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

const getPatientById = async (id: string): Promise<Patient | undefined> => {
    try {
        const response = await api.get<Patient>(`/patients/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching patient ${id}:`, error);
        throw error;
    }
};

const patientService = {
    getPatients,
    getPatientById
};

export default patientService;
