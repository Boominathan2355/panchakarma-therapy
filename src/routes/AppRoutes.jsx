import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import TherapyPage from '../pages/therapy/TherapyPage';
import PatientPage from '../pages/patients/PatientPage';
import SchedulePage from '../pages/schedule/SchedulePage';
import ResourcePage from '../pages/resources/ResourcePage';
import AuditPage from '../pages/audit/AuditPage';
import SettingsPage from '../pages/settings/SettingsPage';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../components/templates/MainLayout';

const ROLES = {
    ADMIN: 'Admin',
    PHYSICIAN: 'Physician',
    SCHEDULER: 'Scheduler'
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<MainLayout />}>

                {/* Dashboard: Admin, Physician, Scheduler */}
                <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.PHYSICIAN, ROLES.SCHEDULER]} />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                {/* Patients: Admin, Physician */}
                <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.PHYSICIAN]} />}>
                    <Route path="/patients" element={<PatientPage />} />
                </Route>

                {/* Therapies: Physician */}
                <Route element={<PrivateRoute allowedRoles={[ROLES.PHYSICIAN, ROLES.ADMIN]} />}>
                    <Route path="/therapies" element={<TherapyPage />} />
                    <Route path="/therapy-plans" element={<TherapyPage />} /> {/* Mapping to same page for now */}
                </Route>

                {/* Scheduler: Scheduler, Admin */}
                <Route element={<PrivateRoute allowedRoles={[ROLES.SCHEDULER, ROLES.ADMIN]} />}>
                    <Route path="/scheduler" element={<SchedulePage />} />
                </Route>

                {/* Resources: Admin */}
                <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN]} />}>
                    <Route path="/resources" element={<ResourcePage />} />
                </Route>

                {/* Audit: Admin */}
                <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN]} />}>
                    <Route path="/audit" element={<AuditPage />} />
                </Route>

                {/* Settings: All Roles */}
                <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.PHYSICIAN, ROLES.SCHEDULER]} />}>
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

            </Route>

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;
