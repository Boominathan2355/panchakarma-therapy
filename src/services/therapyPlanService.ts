import api from './api';

export interface TherapySequenceItem {
  id: string;
  therapyId?: string;
  therapyName: string;
  day: string;
  sessions: number;
  notes: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface TherapyPlanDefinition {
  id: string;
  name: string;
  description: string;
  duration: string;
  totalSessions: number;
  difficulty: 'Beginner' | 'Moderate' | 'Advanced';
  status: 'Active' | 'Draft' | 'Archived';
  therapySequence: TherapySequenceItem[];
  assignedPatients: number;
  createdDate: string;
  tags: string[];
}

const getTherapyPlans = async (): Promise<TherapyPlanDefinition[]> => {
    try {
        const response = await api.get<TherapyPlanDefinition[]>('/therapy-plans/');
        return response.data;
    } catch (error) {
        console.error('Error fetching therapy plans:', error);
        throw error;
    }
};

const getTherapyPlanById = async (id: string): Promise<TherapyPlanDefinition | undefined> => {
    try {
        const response = await api.get<TherapyPlanDefinition>(`/therapy-plans/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching therapy plan ${id}:`, error);
        throw error;
    }
};

const therapyPlanService = {
    getTherapyPlans,
    getTherapyPlanById
};

export default therapyPlanService;
