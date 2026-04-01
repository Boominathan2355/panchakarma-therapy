import api from './api';
import type { Therapist } from '../types';

/**
 * Therapist Service
 * Handles all API interactions related to therapists and staff.
 */

const getAllTherapists = async (): Promise<Therapist[]> => {
    try {
        const response = await api.get<Therapist[]>('/therapists/');
        return response.data;
    } catch (error) {
        console.error('Error fetching therapists:', error);
        throw error;
    }
};

const getTherapist = async (id: string | number): Promise<Therapist> => {
    try {
        const response = await api.get<Therapist>(`/therapists/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching therapist with ID ${id}:`, error);
        throw error;
    }
};

const updateTherapist = async (id: string | number, therapistData: Partial<Therapist>): Promise<Therapist> => {
    try {
        const response = await api.put<Therapist>(`/therapists/${id}`, therapistData);
        return response.data;
    } catch (error) {
        console.error(`Error updating therapist with ID ${id}:`, error);
        throw error;
    }
};

const therapistService = {
    getAllTherapists,
    getTherapist,
    updateTherapist
};

export default therapistService;
