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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
