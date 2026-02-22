import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import therapyReducer from './slices/therapySlice';
import therapyPlanReducer from './slices/therapyPlanSlice';
import patientReducer from './slices/patientSlice';
import scheduleReducer from './slices/scheduleSlice';

import resourceReducer from './slices/resourceSlice';
import auditReducer from './slices/auditSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        therapy: therapyReducer,
        therapyPlan: therapyPlanReducer,
        patient: patientReducer,
        schedule: scheduleReducer,
        resource: resourceReducer,
        audit: auditReducer,
    },
});
