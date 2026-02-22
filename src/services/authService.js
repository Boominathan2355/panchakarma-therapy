import api from './api';
import storage from '../utils/storage';

// Mock implementation for development
// ... (mockLogin code remains the same)
const mockLogin = async (credentials) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
                resolve({
                    data: {
                        token: 'mock-jwt-token-123456',
                        user: {
                            id: 1,
                            name: 'Admin User',
                            email: 'admin@example.com',
                            role: 'Admin',
                        },
                    },
                });
            } else {
                reject({ response: { data: { message: 'Invalid credentials' } } });
            }
        }, 1000);
    });
};

const authService = {
    login: async (credentials) => {
        // UNCOMMENT for real API
        // return api.post('/auth/login', credentials);

        // USING MOCK FOR NOW
        return mockLogin(credentials);
    },
    logout: () => {
        storage.remove('token');
    },
    getCurrentUser: () => {
        const userStr = storage.get('user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            console.error("Failed to parse user from storage", e);
            return null;
        }
    },
};

export default authService;
