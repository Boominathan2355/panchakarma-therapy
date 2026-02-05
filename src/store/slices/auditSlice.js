import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auditService from '../../services/auditService';

const initialState = {
    logs: [],
    explanations: [], // Can integrate ScheduleExplainer data here
    isLoading: false,
    error: null,
};

export const fetchAuditData = createAsyncThunk(
    'audit/fetchLogs',
    async (_, thunkAPI) => {
        try {
            const response = await auditService.getLogs();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const logAction = createAsyncThunk(
    'audit/logAction',
    async (entry, thunkAPI) => {
        try {
            const response = await auditService.createLog(entry);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const auditSlice = createSlice({
    name: 'audit',
    initialState,
    reducers: {
        addExplanation: (state, action) => {
            state.explanations.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAuditData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = action.payload;
            })
            .addCase(fetchAuditData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logAction.fulfilled, (state, action) => {
                state.logs.unshift(action.payload);
            });
    },
});

export const { addExplanation } = auditSlice.actions;
export default auditSlice.reducer;
