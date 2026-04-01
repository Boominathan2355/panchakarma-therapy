import api from './api';
import type { ResourceState, ResourceStatus, Therapist, Room, Material } from '../types';

/**
 * Resource Service
 * Handles therapist, room, and material resources.
 */

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
    // Mocking rooms since endpoint might not exist yet
    return [
        { id: 'room1', name: 'Therapy Room A', capacity: 1, facilities: ['Table', 'Oil Basin'], status: 'Available' },
        { id: 'room2', name: 'Therapy Room B', capacity: 1, facilities: ['Table', 'Oil Basin'], status: 'Available' },
        { id: 'room3', name: 'Steam Room', capacity: 2, facilities: ['Steam Box'], status: 'Available' },
        { id: 'room4', name: 'Consultation Room', capacity: 4, facilities: ['Desk', 'Examination Table'], status: 'Available' }
    ];
};

const getMaterials = async (): Promise<Material[]> => {
    // Mocking materials
    return [
        { id: 'm1', name: 'Sesame Oil (Liter)', quantity: 45, unit: 'Liters', lowStockThreshold: 10 },
        { id: 'm2', name: 'Mahanarayan Oil', quantity: 5, unit: 'Bottles', lowStockThreshold: 10 },
        { id: 'm3', name: 'Dashamoola Herbs', quantity: 12, unit: 'Packets', lowStockThreshold: 5 },
        { id: 'm4', name: 'Steam Towels', quantity: 50, unit: 'Count', lowStockThreshold: 20 },
        { id: 'm5', name: 'Madanaphala Powder', quantity: 8, unit: 'Doses', lowStockThreshold: 15 }
    ];
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

const checkFeasibility = async (therapyId: string, patientId: string): Promise<{ feasible: boolean; reasons: string[] }> => {
    // Mock feasibility logic
    return {
        feasible: true,
        reasons: [`Patient ${patientId} and Therapy ${therapyId} are compatible with available resources.`]
    };
};

const updateStaffMember = async (staffMember: Therapist): Promise<{ success: boolean; staff: Therapist }> => {
    try {
        // Mocking successful update
        return { success: true, staff: staffMember };
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
    updateStaffMember
};

export default resourceService;
