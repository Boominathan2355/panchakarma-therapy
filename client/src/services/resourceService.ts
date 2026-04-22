import api from './api';
import type { Therapist, Room, Material } from '../types';

const getTherapists = async (): Promise<Therapist[]> => {
    try {
        const response = await api.get<Therapist[]>('/therapists');
        return response.data;
    } catch (error) {
        console.error('Error fetching therapists:', error);
        throw error;
    }
};

const getRooms = async (): Promise<Room[]> => {
    try {
        const response = await api.get<Room[]>('/rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

const getMaterials = async (): Promise<Material[]> => {
    try {
        const response = await api.get<Material[]>('/materials');
        return response.data;
    } catch (error) {
        console.error('Error fetching materials:', error);
        throw error;
    }
};

const updateMaterialStock = async (id: string, quantity: number): Promise<Material> => {
    try {
        const response = await api.put<Material>(`/materials/${id}`, { quantity });
        return response.data;
    } catch (error) {
        console.error(`Error updating material ${id}:`, error);
        throw error;
    }
};

const getResourceData = async (): Promise<{ staff: Therapist[]; rooms: Room[]; inventory: Material[] }> => {
    const [staff, rooms, inventory] = await Promise.all([
        getTherapists(),
        getRooms(),
        getMaterials()
    ]);
    return { staff, rooms, inventory };
};

const checkFeasibility = async (therapyId: string, patientId: string): Promise<any> => {
    try {
        const response = await api.get(`/feasibility?therapy_id=${therapyId}&patient_id=${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error checking feasibility:', error);
        throw error;
    }
};


const updateStaffMember = async (staffMember: Therapist): Promise<{ success: boolean; staff: Therapist }> => {
    try {
        const response = await api.put<Therapist>(`/therapists/${staffMember.id}`, staffMember);
        return { success: true, staff: response.data };
    } catch (error) {
        console.error(`Error updating staff member ${staffMember.id}:`, error);
        throw error;
    }
};

const resourceService = {
    getTherapists,
    getRooms,
    getMaterials,
    updateMaterialStock,
    getResourceData,
    checkFeasibility,
    updateStaffMember,
    updateStaff: updateStaffMember
};


export default resourceService;
