import api from './api';
import type { TherapyType } from '../types';

export interface TherapyWorkflowStep {
    id: string;
    step: number;
    action: string;
    duration: string;
    notes: string;
    requiredMaterials?: { name: string; quantity: string | number; unit: string }[];
    precautions?: string[];
}

export interface TherapyDocument {
    id: string;
    name: string;
    size: string;
    uploadDate: string;
}

export interface TherapyDefinition {
    id: string;
    name: TherapyType;
    description: string;
    workflow: TherapyWorkflowStep[];
    contraindications: string[];
    safetyNotes: string;
    documents: TherapyDocument[];
}

const getTherapies = async (): Promise<TherapyDefinition[]> => {
    try {
        const response = await api.get<TherapyDefinition[]>('/therapies/');
        return response.data;
    } catch (error) {
        console.error('Error fetching therapies:', error);
        throw error;
    }
};

const getTherapyById = async (id: string): Promise<TherapyDefinition | undefined> => {
    try {
        const response = await api.get<TherapyDefinition>(`/therapies/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching therapy ${id}:`, error);
        throw error;
    }
};

const therapyService = {
    getTherapies,
    getTherapyById,
    getTherapyDetails: getTherapyById
};


export default therapyService;
