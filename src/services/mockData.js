// Mock data for fallback API

export const mockData = {
    auth: {
        login: {
            token: 'mock-jwt-token-123456',
            user: {
                id: 1,
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'Admin',
            },
        }
    },
    therapists: [
        { id: '1', name: 'Dr. Arya', status: 'Available', specialty: 'Vamana', role: 'Senior Therapist', skills: ['Vamana', 'Virechana', 'Consultation'], shifts: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        { id: '2', name: 'Dr. Rahul', status: 'Busy', specialty: 'Basti', role: 'Junior Therapist', skills: ['Abhyanga', 'Shirodhara'], shifts: ['Mon', 'Wed', 'Fri'] },
        { id: '3', name: 'Dr. Priya', status: 'Available', specialty: 'Nasya', role: 'Masseur', skills: ['Deep Tissue', 'Abhyanga'], shifts: ['Tue', 'Thu', 'Sat'] },
    ],
    // Generating 1 month of data dynamically
    schedule: (() => {
        const therapyTypes = ['Vamana', 'Virechana', 'Basti', 'Nasya', 'Shirodhara', 'Abhyanga'];
        const statuses = ['Scheduled', 'Completed', 'Cancelled', 'In Progress'];

        return Array.from({ length: 60 }).map((_, i) => {
            const date = new Date();
            // Spread appointments over the last 15 days and next 15 days
            date.setDate(date.getDate() + (i % 30) - 15);
            date.setHours(9 + (i % 6), 0, 0, 0); // Appointments between 9 AM and 3 PM


            return {
                id: i + 1,
                title: `${therapyTypes[i % therapyTypes.length]} - Patient ${i + 1}`,
                start: date.toISOString(),
                end: new Date(date.getTime() + (60 * 60 * 1000 * (1 + (i % 2)))).toISOString(), // 1 or 2 hours
                resourceId: `room${(i % 3) + 1}`,
                therapistId: (i % 3) + 1,
                patientId: `p${i + 1}`,
                status: statuses[i % statuses.length]
            };
        });
    })(),
    documents: [
        { id: 'd1', name: 'Treatment_Protocol_A.pdf', type: 'application/pdf', size: 1024 * 1024 * 2, uploadedAt: new Date().toISOString() },
        { id: 'd2', name: 'Patient_Consent_Form.pdf', type: 'application/pdf', size: 1024 * 500, uploadedAt: new Date().toISOString() }
    ]
};

// Extractor function to match URL endpoint to mock data
export const getMockResponse = (url, method) => {
    if (url.includes('/auth/login') && method === 'post') {
        return mockData.auth.login;
    }
    if (url.includes('/therapists')) {
        return mockData.therapists;
    }
    if (url.includes('/schedule')) {
        return mockData.schedule;
    }
    if (url.includes('/documents')) {
        return mockData.documents;
    }

    // Default empty array or object based on typical REST patterns
    if (method === 'get') {
        if (url.endsWith('/')) return [];
        return {};
    }
    return { success: true, id: Date.now() }; // Mock post/put success
};
