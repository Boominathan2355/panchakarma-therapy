import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import scheduleService from '../../services/scheduleService';
import { areIntervalsOverlapping } from 'date-fns';
import type { ScheduleEntry, ResourceStatus, Patient } from '../../types';

interface ScheduleState {
    sessions: ScheduleEntry[];
    resources: any[]; // Using any for now as Resource interface might need more detail
    isLoading: boolean;
    error: string | null;
    conflictSession: (ScheduleEntry & { conflictType: string }) | null;
    optimizationProgress: { phase: string; progress: number } | null;
    explanations: any;
    isOptimizing: boolean;
    lastScheduleResult: any;
    priorityQueue: any[];
}

const initialState: ScheduleState = {
    sessions: [],
    resources: [],
    isLoading: false,
    error: null,
    conflictSession: null,
    optimizationProgress: null,
    explanations: null,
    isOptimizing: false,
    lastScheduleResult: null,
    priorityQueue: []
};

export const fetchSessions = createAsyncThunk<
    ScheduleEntry[],
    void,
    { rejectValue: string }
>(
    'schedule/fetchSessions',
    async (_, thunkAPI) => {
        try {
            return await scheduleService.getSessions();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const fetchResources = createAsyncThunk<
    any[],
    void,
    { rejectValue: string }
>(
    'schedule/fetchResources',
    async (_, thunkAPI) => {
        try {
            return await scheduleService.getResources();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const generateOptimizedSchedule = createAsyncThunk<
    any,
    { therapy: any; patient: Patient; priorityToken: string; resources: any[] },
    { rejectValue: string }
>(
    'schedule/generateOptimizedSchedule',
    async ({ therapy, patient, priorityToken, resources }, thunkAPI) => {
        try {
            const onProgress = (progress: any) => {
                thunkAPI.dispatch(setOptimizationProgress(progress));
            };

            return await scheduleService.generateSchedule(
                therapy,
                patient,
                priorityToken,
                resources,
                onProgress
            );
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const rescheduleWithPriority = createAsyncThunk<
    any,
    { sessionId: string | number; newSlot: any; reason: string },
    { rejectValue: string }
>(
    'schedule/rescheduleWithPriority',
    async ({ sessionId, newSlot, reason }, thunkAPI) => {
        try {
            // Mapping to updateSession as rescheduleSession might not exist yet in typed service
            return await (scheduleService as any).rescheduleSession(sessionId, newSlot, reason);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const updateSessionStatus = createAsyncThunk<
    any,
    { sessionId: string | number; status: string },
    { rejectValue: string }
>(
    'schedule/updateSessionStatus',
    async ({ sessionId, status }, thunkAPI) => {
        try {
            return await scheduleService.updateSessionStatus(sessionId, status);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const logSessionNote = createAsyncThunk<
    any,
    { sessionId: string | number; note: string },
    { rejectValue: string }
>(
    'schedule/logSessionNote',
    async ({ sessionId, note }, thunkAPI) => {
        try {
            return await (scheduleService as any).logSessionNote(sessionId, note);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        addSession: (state, action: PayloadAction<ScheduleEntry>) => {
            state.sessions.push(action.payload);
        },
        addMultipleSessions: (state, action: PayloadAction<ScheduleEntry[]>) => {
            state.sessions.push(...action.payload);
        },
        updateSession: (state, action: PayloadAction<Partial<ScheduleEntry>>) => {
            const { id, start, end, resourceId } = action.payload;
            if (!id || !start || !end || !resourceId) return;

            // Conflict Check Logic
            const hasConflict = state.sessions.some(s =>
                s.id !== id &&
                s.resourceId === resourceId &&
                areIntervalsOverlapping(
                    { start: new Date(s.start), end: new Date(s.end) },
                    { start: new Date(start), end: new Date(end) }
                )
            );

            if (hasConflict) {
                state.conflictSession = { ...(action.payload as ScheduleEntry), conflictType: 'Overlap' };
                return;
            }

            const index = state.sessions.findIndex(s => s.id === id);
            if (index !== -1) {
                state.sessions[index] = { ...state.sessions[index], ...action.payload };
            }
        },
        clearConflict: (state) => {
            state.conflictSession = null;
        },
        setOptimizationProgress: (state, action: PayloadAction<{ phase: string; progress: number }>) => {
            state.optimizationProgress = action.payload;
        },
        setExplanations: (state, action: PayloadAction<any>) => {
            state.explanations = action.payload;
        },
        clearOptimizationState: (state) => {
            state.optimizationProgress = null;
            state.explanations = null;
            state.isOptimizing = false;
            state.lastScheduleResult = null;
        },
        addToPriorityQueue: (state, action: PayloadAction<any>) => {
            state.priorityQueue.push(action.payload);
            state.priorityQueue.sort((a, b) =>
                (b.priority?.value || 40) - (a.priority?.value || 40)
            );
        },
        removeFromPriorityQueue: (state, action: PayloadAction<string | number>) => {
            state.priorityQueue = state.priorityQueue.filter(
                item => item.id !== action.payload
            );
        },
        updateLocalSessionStatus: (state, action: PayloadAction<{ sessionId: string | number; status: ScheduleEntry['status'] }>) => {
            const { sessionId, status } = action.payload;
            const index = state.sessions.findIndex(s => s.id === sessionId);
            if (index !== -1) {
                state.sessions[index] = {
                    ...state.sessions[index],
                    status,
                    statusUpdatedAt: new Date().toISOString()
                };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateSessionStatus.fulfilled, (state, action) => {
                if (action.payload.success) {
                    const index = state.sessions.findIndex(s => s.id === action.payload.session.id);
                    if (index !== -1) {
                        state.sessions[index] = action.payload.session;
                    }
                }
            })
            .addCase(logSessionNote.fulfilled, (state, action) => {
                if (action.payload.success) {
                    const index = state.sessions.findIndex(s => s.id === action.payload.session.id);
                    if (index !== -1) {
                        state.sessions[index] = action.payload.session;
                    }
                }
            })
            .addCase(fetchSessions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.sessions = Array.isArray(action.payload) ? action.payload : [];
                state.isLoading = false;
            })
            .addCase(fetchSessions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.sessions = [];
            })
            .addCase(fetchResources.fulfilled, (state, action) => {
                state.resources = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(generateOptimizedSchedule.pending, (state) => {
                state.isOptimizing = true;
                state.optimizationProgress = { phase: 'starting', progress: 0 };
            })
            .addCase(generateOptimizedSchedule.fulfilled, (state, action) => {
                state.isOptimizing = false;
                state.lastScheduleResult = action.payload;

                if (action.payload.success) {
                    state.sessions.push(...action.payload.schedule);
                    state.explanations = action.payload.explanations;
                }

                state.optimizationProgress = { phase: 'complete', progress: 100 };
            })
            .addCase(generateOptimizedSchedule.rejected, (state, action) => {
                state.isOptimizing = false;
                state.error = action.payload as string;
                state.optimizationProgress = null;
            })
            .addCase(rescheduleWithPriority.fulfilled, (state, action) => {
                if (action.payload.success) {
                    const index = state.sessions.findIndex(
                        s => s.id === action.payload.session.id
                    );
                    if (index !== -1) {
                        state.sessions[index] = action.payload.session;
                    }
                }
            });
    },
});

export const {
    addSession,
    addMultipleSessions,
    updateSession,
    clearConflict,
    setOptimizationProgress,
    setExplanations,
    clearOptimizationState,
    addToPriorityQueue,
    removeFromPriorityQueue,
    updateLocalSessionStatus
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
