import api from './api';

// Mock implementation for development
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
        localStorage.removeItem('token');
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
};

export default authService;
