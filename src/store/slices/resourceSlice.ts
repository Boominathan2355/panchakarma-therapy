import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import resourceService from '../../services/resourceService';
import type { Therapist, Material } from '../../types';

interface ResourceState {
    staff: Therapist[];
    inventory: Material[];
    utilization: any;
    isLoading: boolean;
    error: string | null;
}

const initialState: ResourceState = {
    staff: [],
    inventory: [],
    utilization: null,
    isLoading: false,
    error: null,
};

export const fetchResourceData = createAsyncThunk<
    any,
    void,
    { rejectValue: string }
>(
    'resource/fetchAll',
    async (_, thunkAPI) => {
        try {
            return await resourceService.getResourceData();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const updateStaff = createAsyncThunk<
    any,
    any,
    { rejectValue: string }
>(
    'resource/updateStaff',
    async (staffMember, thunkAPI) => {
        try {
            return await resourceService.updateStaffMember(staffMember);
        } catch (error: any) {
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
            .addCase(fetchResourceData.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.staff = action.payload.staff;
                state.inventory = action.payload.inventory;
                state.utilization = action.payload.utilization;
            })
            .addCase(fetchResourceData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateStaff.fulfilled, (state, action: PayloadAction<any>) => {
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
