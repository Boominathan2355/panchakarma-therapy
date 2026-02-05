// Mock data for Patient Module

const mockPatients = [
    {
        id: 'p1',
        name: 'Ramesh Gupta',
        age: 45,
        gender: 'Male',
        email: 'ramesh@example.com',
        phone: '+91 9876543210',
        complaint: 'Severe Back Pain',
        conditions: ['Hypertension', 'Spondylosis'], // Used for contraindication checks
        history: [
            { date: '2025-01-10', type: 'Consultation', notes: 'Diagnosed with lumbar spondylosis.' },
            { date: '2025-01-15', type: 'Treatment', notes: 'Started Kati Basti (3 days).' }
        ],
        availability: [
            { start: '2026-03-01', end: '2026-03-15' },
            { start: '2026-04-01', end: '2026-04-10' }
        ]
    },
    {
        id: 'p2',
        name: 'Sita Verma',
        age: 32,
        gender: 'Female',
        email: 'sita@example.com',
        phone: '+91 9876543211',
        complaint: 'Migraine',
        conditions: ['Anemia'],
        history: [
            { date: '2025-02-01', type: 'Consultation', notes: 'Complained of frequent headaches.' }
        ],
        availability: [
            { start: '2026-02-20', end: '2026-03-05' }
        ]
    },
    {
        id: 'p3',
        name: 'Arjun Das',
        age: 60,
        gender: 'Male',
        email: 'arjun@example.com',
        phone: '+91 9876543212',
        complaint: 'Arthritis',
        conditions: ['Diabetes', 'Cardiac conditions'],
        history: [],
        availability: []
    }
];

const getPatients = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockPatients]);
        }, 600);
    });
};

const getPatientById = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const patient = mockPatients.find(p => p.id === id);
            resolve(patient);
        }, 300);
    });
};

const patientService = {
    getPatients,
    getPatientById
};

export default patientService;
