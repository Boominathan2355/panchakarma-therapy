import therapistService from './therapistService';

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

const mockUtilization = (() => {
    const dates = [];
    const rooms = [];
    const staff = [];
    const today = new Date();

    // Generate 30 days of data (last 30 days)
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        rooms.push(Math.floor(Math.random() * 40) + 40); // 40-80%
        staff.push(Math.floor(Math.random() * 50) + 40); // 40-90%
    }
    return { dates, rooms, staff };
})();

const getResourceData = async () => {
    try {
        const staff = await therapistService.getAllTherapists();
        return {
            staff: staff.length > 0 ? staff : mockStaff, // Fallback to mock if API returns empty during transition
            inventory: mockInventory,
            utilization: mockUtilization
        };
    } catch (error) {
        console.error('Error fetching resource data:', error);
        return {
            staff: mockStaff,
            inventory: mockInventory,
            utilization: mockUtilization
        };
    }
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
    try {
        const response = await therapistService.updateTherapist(updatedStaff.id, updatedStaff);
        return { success: true, staff: response };
    } catch (error) {
        console.error('Error updating staff member:', error);
        // Fallback for mock data if ID is mock format
        const index = mockStaff.findIndex(s => s.id === updatedStaff.id);
        if (index !== -1) {
            mockStaff[index] = updatedStaff;
            return { success: true, staff: updatedStaff };
        }
        return { success: false, error: error.message };
    }
};

const resourceService = {
    getResourceData,
    checkFeasibility,
    updateStaffMember
};

export default resourceService;
