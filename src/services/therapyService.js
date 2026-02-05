// Mock data for Therapy Module

const mockTherapies = [
    {
        id: 't1',
        name: 'Vamana',
        description: 'Therapeutic Emesis used to expel excess Kapha.',
        workflow: [
            {
                id: 'w1',
                step: 1,
                action: 'Snehapana (Internal Oleation)',
                duration: '3-7 days',
                notes: 'Ghee intake increasing daily',
                requiredMaterials: [
                    { name: 'Medicated Ghee', quantity: '30-100ml', unit: 'ml' },
                    { name: 'Hot Water', quantity: '1', unit: 'Jug' }
                ],
                precautions: [
                    'Observe digestion capacity (Agni)',
                    'Monitor loose stools'
                ]
            },
            {
                id: 'w2',
                step: 2,
                action: 'Abhyanga & Swedana',
                duration: '1 day',
                notes: 'Warm oil massage and steam',
                requiredMaterials: [
                    { name: 'Mahanarayan Oil', quantity: '200', unit: 'ml' },
                    { name: 'Steam Chamber', quantity: '1', unit: 'Unit' }
                ],
                precautions: [
                    'Ensure patient head is covered/cool during steam',
                    'Check blood pressure before steam'
                ]
            },
            {
                id: 'w3',
                step: 3,
                action: 'Vamana Vega',
                duration: '2 hours',
                notes: 'Induction of vomiting',
                requiredMaterials: [
                    { name: 'Emetic Nut (Madanaphala)', quantity: '1', unit: 'dose' },
                    { name: 'Milk/Sugarcane Juice', quantity: '2', unit: 'Liters' },
                    { name: 'Vomit Receptacle', quantity: '1', unit: 'bin' }
                ],
                precautions: [
                    'Monitor pulse and BP continuously',
                    'Watch for signs of dehydration',
                    'Stop if Pitta (bile) is seen'
                ]
            },
            {
                id: 'w4',
                step: 4,
                action: 'Samsarjana Krama',
                duration: '3-7 days',
                notes: 'Dietary restoration',
                requiredMaterials: [
                    { name: 'Manda (Rice Water)', quantity: '500', unit: 'ml' },
                    { name: 'Peya (Thick Rice Grouel)', quantity: '500', unit: 'ml' }
                ],
                precautions: [
                    'Strict dietary compliance required',
                    'Avoid day sleep'
                ]
            },
        ],
        contraindications: [
            'Pregnant women',
            'Children under 12',
            'Elderly over 70',
            'Cardiac conditions',
        ],
        safetyNotes: 'Monitor pulse and blood pressure continuously during Vamana Vega.',
        documents: [
            { id: 'd1', name: 'Vamana_Standard_Protocol_v2.pdf', size: '1.2 MB', uploadDate: '2025-10-15' },
        ]
    },
    {
        id: 't2',
        name: 'Virechana',
        description: 'Therapeutic Purgation for Pitta disorders.',
        workflow: [
            { id: 'v1', step: 1, action: 'Deepana Pachana', duration: '3 days', notes: 'Improve digestion' },
            { id: 'v2', step: 2, action: 'Snehapana', duration: '5 days', notes: '' },
            { id: 'v3', step: 3, action: 'Virechana Yoga', duration: '1 day', notes: 'Administration of purgative' },
        ],
        contraindications: [
            'Rectal bleeding',
            'Weak digestion',
        ],
        safetyNotes: 'Ensure proper hydration post-procedure.',
        documents: []
    },
    {
        id: 't3',
        name: 'Nasya',
        description: 'Nasal administration of medication.',
        workflow: [],
        contraindications: [],
        safetyNotes: '',
        documents: []
    }
];

const getTherapies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockTherapies]);
        }, 800);
    });
};

const getTherapyById = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const therapy = mockTherapies.find(t => t.id === id);
            resolve(therapy);
        }, 400);
    });
};

const therapyService = {
    getTherapies,
    getTherapyById
};

export default therapyService;
