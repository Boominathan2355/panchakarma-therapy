// Mock data for Therapy Plans Module

const mockTherapyPlans = [
    {
        id: 'tp1',
        name: 'Panchakarma Detox Program',
        description: 'A comprehensive 21-day detoxification program combining five core Panchakarma therapies for deep cleansing and rejuvenation.',
        duration: '21 Days',
        totalSessions: 15,
        difficulty: 'Advanced',
        status: 'Active',
        therapySequence: [
            {
                id: 'seq1',
                therapyId: 't1',
                therapyName: 'Vamana',
                day: 'Day 1-5',
                sessions: 3,
                notes: 'Begin with therapeutic emesis after proper oleation preparation',
                status: 'completed'
            },
            {
                id: 'seq2',
                therapyId: 't2',
                therapyName: 'Virechana',
                day: 'Day 6-10',
                sessions: 3,
                notes: 'Therapeutic purgation following recovery from Vamana',
                status: 'in-progress'
            },
            {
                id: 'seq3',
                therapyId: 't3',
                therapyName: 'Nasya',
                day: 'Day 11-14',
                sessions: 4,
                notes: 'Nasal medication for head and sinus cleansing',
                status: 'pending'
            },
            {
                id: 'seq4',
                therapyName: 'Basti',
                day: 'Day 15-18',
                sessions: 3,
                notes: 'Medicated enema for colon cleansing',
                status: 'pending'
            },
            {
                id: 'seq5',
                therapyName: 'Raktamokshana',
                day: 'Day 19-21',
                sessions: 2,
                notes: 'Blood purification therapy (if applicable)',
                status: 'pending'
            }
        ],
        assignedPatients: 5,
        createdDate: '2025-12-01',
        tags: ['Detox', 'Full Body', 'Kapha']
    },
    {
        id: 'tp2',
        name: 'Stress Relief & Rejuvenation',
        description: 'A calming 14-day program aimed at relieving chronic stress, anxiety, and promoting mental clarity through targeted therapies.',
        duration: '14 Days',
        totalSessions: 10,
        difficulty: 'Moderate',
        status: 'Active',
        therapySequence: [
            {
                id: 'seq6',
                therapyName: 'Abhyanga',
                day: 'Day 1-5',
                sessions: 5,
                notes: 'Warm oil full-body massage for relaxation and Vata pacification',
                status: 'pending'
            },
            {
                id: 'seq7',
                therapyName: 'Shirodhara',
                day: 'Day 6-10',
                sessions: 3,
                notes: 'Continuous stream of warm oil on forehead for deep relaxation',
                status: 'pending'
            },
            {
                id: 'seq8',
                therapyId: 't3',
                therapyName: 'Nasya',
                day: 'Day 11-14',
                sessions: 2,
                notes: 'Nasal therapy with calming medicated oils',
                status: 'pending'
            }
        ],
        assignedPatients: 8,
        createdDate: '2026-01-10',
        tags: ['Stress', 'Relaxation', 'Vata']
    },
    {
        id: 'tp3',
        name: 'Joint & Musculoskeletal Care',
        description: 'A focused 10-day program for managing chronic joint pain, arthritis, and musculoskeletal conditions through targeted Ayurvedic therapies.',
        duration: '10 Days',
        totalSessions: 8,
        difficulty: 'Moderate',
        status: 'Draft',
        therapySequence: [
            {
                id: 'seq9',
                therapyName: 'Abhyanga',
                day: 'Day 1-3',
                sessions: 3,
                notes: 'Specialized oil massage with Mahanarayan oil for joint relief',
                status: 'pending'
            },
            {
                id: 'seq10',
                therapyName: 'Janu Basti',
                day: 'Day 4-7',
                sessions: 3,
                notes: 'Localized warm oil pool therapy for knee joints',
                status: 'pending'
            },
            {
                id: 'seq11',
                therapyName: 'Swedana',
                day: 'Day 8-10',
                sessions: 2,
                notes: 'Herbal steam therapy for reducing stiffness and inflammation',
                status: 'pending'
            }
        ],
        assignedPatients: 3,
        createdDate: '2026-02-05',
        tags: ['Joints', 'Pain Relief', 'Vata']
    },
    {
        id: 'tp4',
        name: 'Skin Purification Protocol',
        description: 'An 8-day skin-focused program for conditions like eczema, psoriasis, and acne using Pitta-balancing Panchakarma therapies.',
        duration: '8 Days',
        totalSessions: 6,
        difficulty: 'Beginner',
        status: 'Active',
        therapySequence: [
            {
                id: 'seq12',
                therapyId: 't2',
                therapyName: 'Virechana',
                day: 'Day 1-4',
                sessions: 3,
                notes: 'Therapeutic purgation for Pitta detox and blood purification',
                status: 'pending'
            },
            {
                id: 'seq13',
                therapyName: 'Takradhara',
                day: 'Day 5-8',
                sessions: 3,
                notes: 'Buttermilk stream therapy for cooling and soothing skin',
                status: 'pending'
            }
        ],
        assignedPatients: 2,
        createdDate: '2026-01-20',
        tags: ['Skin', 'Pitta', 'Purification']
    }
];

const getTherapyPlans = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockTherapyPlans]);
        }, 700);
    });
};

const getTherapyPlanById = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const plan = mockTherapyPlans.find(p => p.id === id);
            resolve(plan);
        }, 400);
    });
};

const therapyPlanService = {
    getTherapyPlans,
    getTherapyPlanById
};

export default therapyPlanService;
