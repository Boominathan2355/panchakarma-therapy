// src/services/mockData.ts

/**
 * Mock Data Service
 * Provides centralized mock responses for development.
 */

export const getMockResponse = (url: string, method: string, data?: any): any => {
    const cleanUrl = url.replace(/\/$/, ''); // Remove trailing slash

    if (cleanUrl.includes('/auth/login')) {
        return {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
                id: 'u1',
                name: 'Admin User',
                email: 'admin@panchakarma.com',
                role: 'admin'
            }
        };
    }

    if (cleanUrl.includes('/patients')) {
        // Return dummy patient data or specific patient if ID is provided
        const idMatch = cleanUrl.match(/\/patients\/([^/]+)$/);
        if (idMatch) {
            return {
                id: idMatch[1],
                name: 'Mock Patient ' + idMatch[1],
                age: 45,
                gender: 'Male',
                complaint: 'Chronic Back Pain'
            };
        }
        return []; // Usually handled by patientService directly
    }

    if (cleanUrl.includes('/schedule')) {
        return []; // Usually handled by scheduleService directly
    }

    // Default empty response
    return { success: true, message: 'Mock response success', timestamp: new Date().toISOString() };
};
