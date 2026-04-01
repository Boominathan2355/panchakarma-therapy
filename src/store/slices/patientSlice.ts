import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import patientService from '../../services/patientService';
import type { Patient } from '../../types';

interface PatientState {
    patients: Patient[];
    selectedPatient: Patient | null;
    isLoading: boolean;
    isListLoading: boolean;
    isDetailLoading: boolean;
    error: string | null;
}

const initialState: PatientState = {
    patients: [],
    selectedPatient: null,
    isLoading: false,
    isListLoading: false,
    isDetailLoading: false,
    error: null,
};

export const fetchPatients = createAsyncThunk<
    Patient[],
    void,
    { rejectValue: string }
>(
    'patient/fetchAll',
    async (_, thunkAPI) => {
        try {
            return await patientService.getPatients();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const fetchPatientDetails = createAsyncThunk<
    Patient | undefined,
    string,
    { rejectValue: string }
>(
    'patient/fetchOne',
    async (id, thunkAPI) => {
        try {
            return await patientService.getPatientById(id);
        } catch (error: any) {
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
        addAvailabilityWindow: (state, action: PayloadAction<{ start: string; end: string }>) => {
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
            .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<Patient[]>) => {
                state.isLoading = false;
                state.isListLoading = false;
                state.patients = action.payload;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.isListLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchPatientDetails.pending, (state) => {
                state.isLoading = true;
                state.isDetailLoading = true;
                // Clear specific detail to force skeleton
                state.selectedPatient = null;
            })
            .addCase(fetchPatientDetails.fulfilled, (state, action: PayloadAction<Patient | undefined>) => {
                state.isLoading = false;
                state.isDetailLoading = false;
                state.selectedPatient = action.payload || null;
            })
            .addCase(fetchPatientDetails.rejected, (state) => {
                state.isLoading = false;
                state.isDetailLoading = false;
            });
    },
});

export const { clearSelectedPatient, addAvailabilityWindow } = patientSlice.actions;
export default patientSlice.reducer;
