import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from '../../services/patientService';

const initialState = {
    patients: [],
    selectedPatient: null,
    isLoading: false,
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.patients = action.payload;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchPatientDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPatientDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedPatient = action.payload;
            });
    },
});

export const { clearSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer;
