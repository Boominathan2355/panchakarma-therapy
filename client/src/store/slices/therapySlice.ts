import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import therapyService, { TherapyDefinition } from '../../services/therapyService';

interface TherapyState {
    therapies: TherapyDefinition[];
    selectedTherapy: TherapyDefinition | null;
    isLoading: boolean;
    isListLoading: boolean;
    isDetailLoading: boolean;
    error: string | null;
}

const initialState: TherapyState = {
    therapies: [],
    selectedTherapy: null,
    isLoading: false,
    isListLoading: false,
    isDetailLoading: false,
    error: null,
};

export const fetchTherapies = createAsyncThunk<
    TherapyDefinition[],
    void,
    { rejectValue: string }
>(
    'therapy/fetchAll',
    async (_, thunkAPI) => {
        try {
            return await therapyService.getTherapies();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const fetchTherapyDetails = createAsyncThunk<
    TherapyDefinition | undefined,
    string,
    { rejectValue: string }
>(
    'therapy/fetchOne',
    async (id, thunkAPI) => {
        try {
            return await therapyService.getTherapyById(id);
        } catch (error: any) {
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
            .addCase(fetchTherapies.fulfilled, (state, action: PayloadAction<TherapyDefinition[]>) => {
                state.isLoading = false;
                state.isListLoading = false;
                state.therapies = action.payload;
            })
            .addCase(fetchTherapies.rejected, (state, action) => {
                state.isLoading = false;
                state.isListLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTherapyDetails.pending, (state) => {
                state.isLoading = true;
                state.isDetailLoading = true;
                state.selectedTherapy = null;
            })
            .addCase(fetchTherapyDetails.fulfilled, (state, action: PayloadAction<TherapyDefinition | undefined>) => {
                state.isLoading = false;
                state.isDetailLoading = false;
                state.selectedTherapy = action.payload || null;
            })
            .addCase(fetchTherapyDetails.rejected, (state) => {
                state.isLoading = false;
                state.isDetailLoading = false;
            });
    },
});

export const { clearSelectedTherapy } = therapySlice.actions;
export default therapySlice.reducer;
