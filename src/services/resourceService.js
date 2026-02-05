// Mock data for Resource Module

const mockStaff = [
    { id: 's1', name: 'Dr. Arya', role: 'Senior Therapist', skills: ['Vamana', 'Virechana', 'Consultation'], shifts: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: 's2', name: 'Nurse Joy', role: 'Junior Therapist', skills: ['Abhyanga', 'Shirodhara'], shifts: ['Mon', 'Wed', 'Fri'] },
    { id: 's3', name: 'Rahul K.', role: 'Masseur', skills: ['Deep Tissue', 'Abhyanga'], shifts: ['Tue', 'Thu', 'Sat'] },
];

const mockInventory = [
    { id: 'i1', name: 'Sesame Oil (Liter)', stock: 45, unit: 'Liters', status: 'optimal' },
    { id: 'i2', name: 'Mahanarayan Oil', stock: 5, unit: 'Bottles', status: 'low' },
    { id: 'i3', name: 'Dashamoola Herbs', stock: 12, unit: 'Packets', status: 'optimal' },
    { id: 'i4', name: 'Steam Towels', stock: 50, unit: 'Count', status: 'optimal' },
];

const mockUtilization = {
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rooms: [80, 65, 90, 85, 70, 95, 40], // Room Occupancy %
    staff: [90, 75, 85, 80, 85, 60, 30] // Staff Utilization %
};

const getResourceData = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                staff: mockStaff,
                inventory: mockInventory,
                utilization: mockUtilization
            });
        }, 600);
    });
};

const checkFeasibility = async (therapyId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock feasibility assessment
            resolve({
                therapists: {
                    status: 'ok',
                    available: [
                        { name: 'Dr. Arya', slots: 'Mon, Wed, Fri: 9AM-1PM' },
                        { name: 'Nurse Joy', slots: 'Tue, Thu: 2PM-6PM' }
                    ]
                },
                materials: {
                    status: 'ok',
                    items: [
                        { name: 'Sesame Oil', quantity: 12, level: 'ok' },
                        { name: 'Warm Towels', quantity: 50, level: 'ok' },
                        { name: 'Mahanarayan Oil', quantity: 3, level: 'low' }
                    ]
                },
                booking: {
                    status: 'warning',
                    nextSlot: 'Feb 10, 2026',
                    note: 'Patient has 2 pending appointments this week.'
                }
            });
        }, 500);
    });
};

const updateStaffMember = async (updatedStaff) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockStaff.findIndex(s => s.id === updatedStaff.id);
            if (index !== -1) {
                mockStaff[index] = updatedStaff;
                resolve({ success: true, staff: updatedStaff });
            } else {
                resolve({ success: false, error: 'Staff member not found' });
            }
        }, 300);
    });
};

const resourceService = {
    getResourceData,
    checkFeasibility,
    updateStaffMember
};

export default resourceService;
