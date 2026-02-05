import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resourceService from '../../services/resourceService';

const initialState = {
    staff: [],
    inventory: [],
    utilization: null,
    isLoading: false,
    error: null,
};

export const fetchResourceData = createAsyncThunk(
    'resource/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await resourceService.getResourceData();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const updateStaff = createAsyncThunk(
    'resource/updateStaff',
    async (staffMember, thunkAPI) => {
        try {
            const response = await resourceService.updateStaffMember(staffMember);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const resourceSlice = createSlice({
    name: 'resource',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchResourceData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchResourceData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.staff = action.payload.staff;
                state.inventory = action.payload.inventory;
                state.utilization = action.payload.utilization;
            })
            .addCase(fetchResourceData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateStaff.fulfilled, (state, action) => {
                if (action.payload.success) {
                    const index = state.staff.findIndex(s => s.id === action.payload.staff.id);
                    if (index !== -1) {
                        state.staff[index] = action.payload.staff;
                    }
                }
            });
    },
});

export default resourceSlice.reducer;
