import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import scheduleService from '../../services/scheduleService';
import { areIntervalsOverlapping } from 'date-fns';

const initialState = {
    sessions: [],
    resources: [],
    isLoading: false,
    error: null,
    conflictSession: null,
    // New state for hybrid scheduling
    optimizationProgress: null,
    explanations: null,
    isOptimizing: false,
    lastScheduleResult: null,
    priorityQueue: []
};

export const fetchSessions = createAsyncThunk(
    'schedule/fetchSessions',
    async (_, thunkAPI) => {
        try {
            const response = await scheduleService.getSessions();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const fetchResources = createAsyncThunk(
    'schedule/fetchResources',
    async (_, thunkAPI) => {
        try {
            const response = await scheduleService.getResources();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

/**
 * Generate optimized schedule using hybrid algorithm
 */
export const generateOptimizedSchedule = createAsyncThunk(
    'schedule/generateOptimizedSchedule',
    async ({ therapy, patient, priorityToken, resources }, thunkAPI) => {
        try {
            const onProgress = (progress) => {
                thunkAPI.dispatch(setOptimizationProgress(progress));
            };

            const result = await scheduleService.generateSchedule(
                therapy,
                patient,
                priorityToken,
                resources,
                onProgress
            );

            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

/**
 * Reschedule a session with priority handling
 */
export const rescheduleWithPriority = createAsyncThunk(
    'schedule/rescheduleWithPriority',
    async ({ sessionId, newSlot, reason }, thunkAPI) => {
        try {
            const result = await scheduleService.rescheduleSession(sessionId, newSlot, reason);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const updateSessionStatus = createAsyncThunk(
    'schedule/updateSessionStatus',
    async ({ sessionId, status }, thunkAPI) => {
        try {
            const result = await scheduleService.updateSessionStatus(sessionId, status);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const logSessionNote = createAsyncThunk(
    'schedule/logSessionNote',
    async ({ sessionId, note }, thunkAPI) => {
        try {
            const result = await scheduleService.logSessionNote(sessionId, note);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        addSession: (state, action) => {
            state.sessions.push(action.payload);
        },
        addMultipleSessions: (state, action) => {
            state.sessions.push(...action.payload);
        },
        updateSession: (state, action) => {
            const { id, start, end, resourceId } = action.payload;

            // Conflict Check Logic (Simple version: checks overlap in same room)
            const hasConflict = state.sessions.some(s =>
                s.id !== id &&
                s.resourceId === resourceId &&
                areIntervalsOverlapping(
                    { start: new Date(s.start), end: new Date(s.end) },
                    { start: new Date(start), end: new Date(end) }
                )
            );

            if (hasConflict) {
                state.conflictSession = { ...action.payload, conflictType: 'Overlap' };
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
        setOptimizationProgress: (state, action) => {
            state.optimizationProgress = action.payload;
        },
        setExplanations: (state, action) => {
            state.explanations = action.payload;
        },
        clearOptimizationState: (state) => {
            state.optimizationProgress = null;
            state.explanations = null;
            state.isOptimizing = false;
            state.lastScheduleResult = null;
        },
        addToPriorityQueue: (state, action) => {
            state.priorityQueue.push(action.payload);
            // Sort by priority value (highest first)
            state.priorityQueue.sort((a, b) =>
                (b.priority?.value || 40) - (a.priority?.value || 40)
            );
        },
        removeFromPriorityQueue: (state, action) => {
            state.priorityQueue = state.priorityQueue.filter(
                item => item.id !== action.payload
            );
        },
        updateLocalSessionStatus: (state, action) => {
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
            // Update session status
            .addCase(updateSessionStatus.fulfilled, (state, action) => {
                if (action.payload.success) {
                    const index = state.sessions.findIndex(s => s.id === action.payload.session.id);
                    if (index !== -1) {
                        state.sessions[index] = action.payload.session;
                    }
                }
            })
            // Log clinical note
            .addCase(logSessionNote.fulfilled, (state, action) => {
                if (action.payload.success) {
                    const index = state.sessions.findIndex(s => s.id === action.payload.session.id);
                    if (index !== -1) {
                        state.sessions[index] = action.payload.session;
                    }
                }
            })
        builder
            // Fetch sessions
            .addCase(fetchSessions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.sessions = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchSessions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch resources
            .addCase(fetchResources.fulfilled, (state, action) => {
                state.resources = action.payload;
            })
            // Generate optimized schedule
            .addCase(generateOptimizedSchedule.pending, (state) => {
                state.isOptimizing = true;
                state.optimizationProgress = { phase: 'starting', progress: 0 };
            })
            .addCase(generateOptimizedSchedule.fulfilled, (state, action) => {
                state.isOptimizing = false;
                state.lastScheduleResult = action.payload;

                if (action.payload.success) {
                    // Add new sessions to the store
                    state.sessions.push(...action.payload.schedule);
                    state.explanations = action.payload.explanations;
                }

                state.optimizationProgress = { phase: 'complete', progress: 100 };
            })
            .addCase(generateOptimizedSchedule.rejected, (state, action) => {
                state.isOptimizing = false;
                state.error = action.payload;
                state.optimizationProgress = null;
            })
            // Reschedule with priority
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

