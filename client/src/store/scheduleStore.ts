import { create } from 'zustand';

interface ScheduleStore {
    conflictSession: any | null;
    setConflictSession: (session: any | null) => void;
    clearConflict: () => void;
    
    explanations: any[];
    setExplanations: (explanations: any[]) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
    conflictSession: null,
    setConflictSession: (session) => set({ conflictSession: session }),
    clearConflict: () => set({ conflictSession: null }),
    
    explanations: [],
    setExplanations: (explanations) => set({ explanations }),
}));
