import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import auditService from '../../services/auditService';
import type { AuditLog } from '../../types';

interface AuditState {
    logs: AuditLog[];
    explanations: any[]; // Can integrate ScheduleExplainer data here
    isLoading: boolean;
    error: string | null;
}

const initialState: AuditState = {
    logs: [],
    explanations: [],
    isLoading: false,
    error: null,
};

export const fetchAuditData = createAsyncThunk<
    AuditLog[],
    void,
    { rejectValue: string }
>(
    'audit/fetchLogs',
    async (_, thunkAPI) => {
        try {
            return await auditService.getLogs();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const logAction = createAsyncThunk<
    any,
    Partial<AuditLog>,
    { rejectValue: string }
>(
    'audit/logAction',
    async (entry, thunkAPI) => {
        try {
            return await auditService.createLog(entry);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const auditSlice = createSlice({
    name: 'audit',
    initialState,
    reducers: {
        addExplanation: (state, action: PayloadAction<any>) => {
            state.explanations.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAuditData.fulfilled, (state, action: PayloadAction<AuditLog[]>) => {
                state.isLoading = false;
                state.logs = action.payload;
            })
            .addCase(fetchAuditData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logAction.fulfilled, (state, action: PayloadAction<AuditLog>) => {
                state.logs.unshift(action.payload);
            });
    },
});

export const { addExplanation } = auditSlice.actions;
export default auditSlice.reducer;
