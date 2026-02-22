import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import therapyPlanService from '../../services/therapyPlanService';

const initialState = {
    plans: [],
    selectedPlan: null,
    isListLoading: false,
    isDetailLoading: false,
    error: null,
};

export const fetchTherapyPlans = createAsyncThunk(
    'therapyPlan/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await therapyPlanService.getTherapyPlans();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const fetchTherapyPlanDetails = createAsyncThunk(
    'therapyPlan/fetchOne',
    async (id, thunkAPI) => {
        try {
            const response = await therapyPlanService.getTherapyPlanById(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const therapyPlanSlice = createSlice({
    name: 'therapyPlan',
    initialState,
    reducers: {
        clearSelectedPlan: (state) => {
            state.selectedPlan = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTherapyPlans.pending, (state) => {
                state.isListLoading = true;
                state.plans = [];
            })
            .addCase(fetchTherapyPlans.fulfilled, (state, action) => {
                state.isListLoading = false;
                state.plans = action.payload;
            })
            .addCase(fetchTherapyPlans.rejected, (state, action) => {
                state.isListLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchTherapyPlanDetails.pending, (state) => {
                state.isDetailLoading = true;
                state.selectedPlan = null;
            })
            .addCase(fetchTherapyPlanDetails.fulfilled, (state, action) => {
                state.isDetailLoading = false;
                state.selectedPlan = action.payload;
            })
            .addCase(fetchTherapyPlanDetails.rejected, (state) => {
                state.isDetailLoading = false;
            });
    },
});

export const { clearSelectedPlan } = therapyPlanSlice.actions;
export default therapyPlanSlice.reducer;
