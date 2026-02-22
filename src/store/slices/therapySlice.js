import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import therapyService from '../../services/therapyService';

const initialState = {
    therapies: [],
    selectedTherapy: null,
    isLoading: false,
    isListLoading: false,
    isDetailLoading: false,
    error: null,
};

export const fetchTherapies = createAsyncThunk(
    'therapy/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await therapyService.getTherapies();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const fetchTherapyDetails = createAsyncThunk(
    'therapy/fetchOne',
    async (id, thunkAPI) => {
        try {
            const response = await therapyService.getTherapyById(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const therapySlice = createSlice({
    name: 'therapy',
    initialState,
    reducers: {
        clearSelectedTherapy: (state) => {
            state.selectedTherapy = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTherapies.pending, (state) => {
                state.isLoading = true;
                state.isListLoading = true;
                state.therapies = [];
            })
            .addCase(fetchTherapies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isListLoading = false;
                state.therapies = action.payload;
            })
            .addCase(fetchTherapies.rejected, (state, action) => {
                state.isLoading = false;
                state.isListLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchTherapyDetails.pending, (state) => {
                state.isLoading = true;
                state.isDetailLoading = true;
                state.selectedTherapy = null;
            })
            .addCase(fetchTherapyDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isDetailLoading = false;
                state.selectedTherapy = action.payload;
            })
            .addCase(fetchTherapyDetails.rejected, (state) => {
                state.isLoading = false;
                state.isDetailLoading = false;
            });
    },
});

export const { clearSelectedTherapy } = therapySlice.actions;
export default therapySlice.reducer;
