// Centralized mock data for fallback API
// This is the single source of truth for therapists, schedule, and documents.

const THERAPIST_ROSTER = [
    { id: 1, name: 'Dr. Arya Sharma', status: 'Available', specialty: 'Vamana', role: 'Senior Therapist', skills: ['Vamana', 'Virechana', 'Consultation'], shifts: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: 2, name: 'Dr. Arya Sharma', status: 'Available', specialty: 'Vamana', role: 'Senior Therapist', skills: ['Vamana', 'Virechana', 'Consultation'], shifts: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: 3, name: 'Dr. Rahul Verma', status: 'Busy', specialty: 'Basti', role: 'Therapist', skills: ['Basti', 'Abhyanga', 'Shirodhara'], shifts: ['Mon', 'Wed', 'Fri'] },
    { id: 4, name: 'Dr. Priya Nair', status: 'Available', specialty: 'Nasya', role: 'Therapist', skills: ['Nasya', 'Deep Tissue', 'Abhyanga'], shifts: ['Tue', 'Thu', 'Sat'] },
    { id: 5, name: 'Dr. Amit Patel', status: 'On Leave', specialty: 'General', role: 'Junior Therapist', skills: ['Raktamokshana', 'General'], shifts: ['Mon', 'Tue', 'Wed'] },
];

// Doctor login maps to therapist ID 2 (Dr. Arya Sharma)
const DOCTOR_THERAPIST_ID = 2;

export const mockData = {
    auth: {
        login: {
            token: 'mock-jwt-token-admin',
            user: {
                id: 1,
                name: 'Admin User',
                email: 'admin@ayursoft.com',
                role: 'Admin',
            },
        },
        doctorLogin: {
            token: 'mock-jwt-token-doctor',
            user: {
                id: DOCTOR_THERAPIST_ID,
                name: 'Dr. Arya Sharma',
                email: 'doctor@ayursoft.com',
                role: 'Physician',
            },
        }
    },
    therapists: THERAPIST_ROSTER.map(t => ({
        id: String(t.id),
        name: t.name,
        status: t.status,
        specialty: t.specialty,
        role: t.role,
        skills: t.skills,
        shifts: t.shifts
    })),
    schedule: (() => {
        const therapyTypes = ['Vamana', 'Virechana', 'Basti', 'Nasya', 'Raktamokshana'];
        const statuses = ['Scheduled', 'Completed', 'Cancelled', 'In Progress'];
        const activeTherapistIds = [1, 2, 3, 4];

        return Array.from({ length: 100 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + (i % 30) - 15);
            date.setHours(8 + (i % 8), 0, 0, 0);

            const therapistId = activeTherapistIds[i % activeTherapistIds.length];

            return {
                id: i + 1,
                title: `${therapyTypes[i % therapyTypes.length]} - Patient ${(i % 100) + 1}`,
                start: date.toISOString(),
                end: new Date(date.getTime() + (60 * 60 * 1000 * (1 + (i % 2)))).toISOString(),
                resourceId: `room${(i % 4) + 1}`,
                therapistId,
                patientId: `p${(i % 100) + 1}`,
                type: therapyTypes[i % therapyTypes.length],
                status: statuses[i % statuses.length]
            };
        });
    })(),
    documents: [
        { id: 'd1', name: 'Treatment_Protocol_A.pdf', type: 'application/pdf', size: 1024 * 1024 * 2, uploadedAt: new Date().toISOString() },
        { id: 'd2', name: 'Patient_Consent_Form.pdf', type: 'application/pdf', size: 1024 * 500, uploadedAt: new Date().toISOString() },
        { id: 'd3', name: 'Panchakarma_Guidelines.pdf', type: 'application/pdf', size: 1024 * 750, uploadedAt: new Date().toISOString() }
    ]
};

// Extractor function to match URL endpoint to mock data
export const getMockResponse = (url, method, data) => {
    if (url.includes('/auth/login') && method === 'post') {
        let parsedData = {};
        if (data) {
            try {
                parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            } catch (e) { }
        }
        if (parsedData.email === 'doctor@ayursoft.com') {
            return mockData.auth.doctorLogin;
        }
        return mockData.auth.login;
    }
    if (url.includes('/therapists')) {
        return mockData.therapists;
    }
    if (url.includes('/schedule')) {
        return mockData.schedule;
    }
    if (url.includes('/documents')) {
        if (method === 'post') {
            return {
                success: true,
                id: Date.now(),
                extractedData: {
                    therapyName: 'Vamana',
                    classification: 'Panchakarma — Shodhana (Purification)',
                    indication: ['Kapha disorders', 'Skin diseases', 'Asthma', 'Obesity'],
                    contraindications: ['Pregnant women', 'Children under 12', 'Elderly over 70', 'Cardiac conditions'],
                    preparatory: {
                        snehapana: { duration: '3–7 days', material: 'Medicated Ghee 30–100ml', notes: 'Increase daily until snehana signs appear' },
                        abhyanga: { duration: '1 day', material: 'Mahanarayan Oil 200ml', notes: 'Full body warm oil massage' },
                        swedana: { duration: '15–20 min', material: 'Steam Chamber', notes: 'Head must remain cool during steam' }
                    },
                    mainProcedure: {
                        emeticAgent: 'Madanaphala (Emetic Nut)',
                        supportFluid: 'Milk or Sugarcane Juice — 2 Liters',
                        expectedVegas: '4–8 bouts',
                        duration: '1–2 hours',
                        monitoring: ['Pulse rate', 'Blood pressure', 'Number of vegas', 'Nature of vomitus']
                    },
                    postProcedure: {
                        samsarjanaKrama: {
                            duration: '3–7 days',
                            diet: ['Manda (Rice Water)', 'Peya (Thin Gruel)', 'Vilepi (Thick Gruel)', 'Odana (Normal Rice)'],
                            restrictions: ['Day sleep', 'Heavy exercise', 'Cold water', 'Suppression of urges']
                        }
                    },
                    safetyNotes: 'Monitor pulse and blood pressure continuously during Vamana Vega. Stop immediately if Pitta (bile) is observed.',
                    extractedBy: 'AyurSoft LLM v2.1',
                    confidence: 0.94
                }
            };
        }
        return mockData.documents;
    }

    if (method === 'get') {
        if (url.endsWith('/')) return [];
        return {};
    }
    return { success: true, id: Date.now() };
};
