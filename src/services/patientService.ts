import type { Patient } from '../types';

// Mock data for Patient Module — 100 dynamically generated patients

const firstNames = [
    'Ramesh', 'Sita', 'Arjun', 'Priya', 'Vikram', 'Ananya', 'Ravi', 'Meera',
    'Suresh', 'Kavita', 'Deepak', 'Lakshmi', 'Arun', 'Pooja', 'Kartik', 'Radha',
    'Mohan', 'Divya', 'Harsh', 'Nandini', 'Sandeep', 'Aarti', 'Rajesh', 'Swati',
    'Manoj', 'Geeta', 'Ashok', 'Neha', 'Prakash', 'Sunita', 'Gaurav', 'Bhavna',
    'Rohit', 'Kiran', 'Vivek', 'Anjali', 'Sanjay', 'Rekha', 'Amit', 'Padma',
    'Nikhil', 'Seema', 'Tarun', 'Usha', 'Ajay', 'Malini', 'Dinesh', 'Shobha',
    'Vinod', 'Pushpa'
];

const lastNames = [
    'Gupta', 'Verma', 'Das', 'Sharma', 'Patel', 'Iyer', 'Nair', 'Reddy',
    'Mehta', 'Singh', 'Kumar', 'Joshi', 'Rao', 'Bhat', 'Pillai', 'Mishra',
    'Chauhan', 'Agarwal', 'Tiwari', 'Saxena', 'Dubey', 'Pandey', 'Kulkarni',
    'Desai', 'Mukherjee'
];

const complaints = [
    'Severe Back Pain', 'Migraine', 'Arthritis', 'Chronic Fatigue', 'Skin Disorder',
    'Respiratory Issues', 'Digestive Problems', 'Joint Stiffness', 'Anxiety & Stress',
    'Insomnia', 'Sciatica', 'Cervical Spondylosis', 'Obesity', 'Allergic Rhinitis',
    'Frozen Shoulder', 'Psoriasis', 'Sinus Congestion', 'Lower Back Pain',
    'Knee Pain', 'Muscle Weakness'
];

const allConditions = [
    'Hypertension', 'Spondylosis', 'Anemia', 'Diabetes', 'Cardiac conditions',
    'Asthma', 'Thyroid', 'PCOD', 'Obesity', 'Anxiety', 'Depression',
    'Gastritis', 'Liver disorder', 'Kidney stones', 'Varicose veins'
];

const historyTypes = ['Consultation', 'Treatment', 'Follow-up', 'Lab Test', 'Therapy Session'] as const;

const generatePatient = (index: number): Patient => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const age = 20 + (index % 55);
    const gender = (index % 3 === 0 ? 'Female' : 'Male') as 'Male' | 'Female';

    const conditionCount = (index % 3) + 1;
    const conditions: string[] = [];
    for (let c = 0; c < conditionCount; c++) {
        conditions.push(allConditions[(index + c * 7) % allConditions.length]);
    }

    const historyCount = (index % 4) + 1;
    const history: any[] = [];
    for (let h = 0; h < historyCount; h++) {
        const date = new Date();
        date.setDate(date.getDate() - (h * 10 + index % 20));
        history.push({
            date: date.toISOString().split('T')[0],
            type: historyTypes[(index + h) % historyTypes.length],
            notes: `${historyTypes[(index + h) % historyTypes.length]} notes for ${name} — visit ${h + 1}.`
        });
    }

    const availStart = new Date();
    availStart.setDate(availStart.getDate() + (index % 10));
    const availEnd = new Date(availStart);
    availEnd.setDate(availEnd.getDate() + 14);

    return {
        id: `p${index + 1}`,
        name,
        age,
        gender,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@example.com`,
        phone: `+91 98765${String(43210 + index).padStart(5, '0')}`,
        complaint: complaints[index % complaints.length],
        conditions,
        history,
        availability: [
            { start: availStart.toISOString().split('T')[0], end: availEnd.toISOString().split('T')[0] }
        ]
    };
};

const mockPatients = Array.from({ length: 100 }, (_, i) => generatePatient(i));

const getPatients = async (): Promise<Patient[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockPatients]);
        }, 600);
    });
};

const getPatientById = async (id: string): Promise<Patient | undefined> => {
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
