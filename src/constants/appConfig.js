/**
 * Application Configuration
 * Centralized settings for the application, primarily sourced from environment variables.
 */

const appConfig = {
    api: {
        baseUrl: 'https://a-web-based-therapy-automation-system.onrender.com/api',
        timeout: 10000,
        useMock: import.meta.env.VITE_USE_MOCK !== 'false', // Enable mock by default unless explicitly disabled
    },
    env: import.meta.env.MODE || 'development',
    isProduction: import.meta.env.PROD,
};

export default appConfig;
