import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from '../../services/patientService';

const initialState = {
    patients: [],
    selectedPatient: null,
    isLoading: false,
    isListLoading: false,
    isDetailLoading: false,
    error: null,
};

export const fetchPatients = createAsyncThunk(
    'patient/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await patientService.getPatients();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const fetchPatientDetails = createAsyncThunk(
    'patient/fetchOne',
    async (id, thunkAPI) => {
        try {
            const response = await patientService.getPatientById(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        clearSelectedPatient: (state) => {
            state.selectedPatient = null;
        },
        addAvailabilityWindow: (state, action) => {
            if (state.selectedPatient) {
                if (!state.selectedPatient.availability) {
                    state.selectedPatient.availability = [];
                }
                state.selectedPatient.availability.push(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatients.pending, (state) => {
                state.isLoading = true;
                state.isListLoading = true;
                // Clear state to force skeleton when navigating back
                state.patients = [];
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isListLoading = false;
                state.patients = action.payload;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.isListLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchPatientDetails.pending, (state) => {
                state.isLoading = true;
                state.isDetailLoading = true;
                // Clear specific detail to force skeleton
                state.selectedPatient = null;
            })
            .addCase(fetchPatientDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isDetailLoading = false;
                state.selectedPatient = action.payload;
            })
            .addCase(fetchPatientDetails.rejected, (state) => {
                state.isLoading = false;
                state.isDetailLoading = false;
            });
    },
});

export const { clearSelectedPatient, addAvailabilityWindow } = patientSlice.actions;
export default patientSlice.reducer;
