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
        description: 'Nasal administration of medication for cleansing the head region.',
        workflow: [
            { id: 'n1', step: 1, action: 'Facial Massage (Mukha Abhyanga)', duration: '15 min', notes: 'Warm oil massage on face and neck' },
            { id: 'n2', step: 2, action: 'Steam Application (Nadi Sweda)', duration: '5 min', notes: 'Steam directed to face and sinuses' },
            { id: 'n3', step: 3, action: 'Nasya Administration', duration: '10 min', notes: 'Instillation of medicated oil/powder into nostrils' },
        ],
        contraindications: [
            'Acute cold or fever',
            'Immediately after meals',
            'Children under 7'
        ],
        safetyNotes: 'Patient must lie with head tilted back. Avoid during rainy season.',
        documents: []
    },
    {
        id: 't4',
        name: 'Basti',
        description: 'Therapeutic enema considered the most important of the five Panchakarma procedures, primarily for Vata disorders.',
        workflow: [
            { id: 'b1', step: 1, action: 'Abhyanga & Swedana', duration: '45 min', notes: 'Full body oil massage followed by steam therapy' },
            { id: 'b2', step: 2, action: 'Anuvasana Basti (Oil Enema)', duration: '30 min', notes: 'Medicated oil enema for lubrication and nourishment' },
            { id: 'b3', step: 3, action: 'Niruha Basti (Decoction Enema)', duration: '45 min', notes: 'Herbal decoction enema for cleansing. Alternate with Anuvasana.' },
            { id: 'b4', step: 4, action: 'Post-Basti Care', duration: '1 day', notes: 'Light diet, rest, and monitoring of bowel movements' },
        ],
        contraindications: [
            'Diarrhea or dysentery',
            'Rectal bleeding',
            'Severe anemia',
            'Intestinal obstruction'
        ],
        safetyNotes: 'Monitor fluid retention and bowel response. Ensure proper temperature of decoction (lukewarm).',
        documents: [
            { id: 'd2', name: 'Basti_Protocol_Guidelines.pdf', size: '0.9 MB', uploadDate: '2025-11-20' }
        ]
    },
    {
        id: 't5',
        name: 'Raktamokshana',
        description: 'Blood-letting therapy for purification of blood and management of Pitta-related skin and blood disorders.',
        workflow: [
            { id: 'r1', step: 1, action: 'Patient Assessment', duration: '30 min', notes: 'Check hemoglobin, BP, and identify affected area' },
            { id: 'r2', step: 2, action: 'Leech Application / Venepuncture', duration: '20 min', notes: 'Apply medicinal leeches to affected area or perform controlled venepuncture' },
            { id: 'r3', step: 3, action: 'Post-procedure Dressing', duration: '15 min', notes: 'Apply turmeric paste and bandage. Monitor for bleeding.' },
        ],
        contraindications: [
            'Severe anemia',
            'Pregnancy',
            'Hemophilia or blood clotting disorders',
            'Children and elderly'
        ],
        safetyNotes: 'Strict aseptic technique required. Monitor hemoglobin levels before and after. Never exceed recommended blood volume.',
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
