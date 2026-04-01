/**
 * Application Configuration
 * Centralized settings for the application, primarily sourced from environment variables.
 */

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    useMock: boolean;
  };
  env: string;
  isProduction: boolean;
}

const appConfig: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
    useMock: import.meta.env.VITE_USE_MOCK === 'true', // Disabled by default now that backend is ready
  },
  env: import.meta.env.MODE || 'development',
  isProduction: import.meta.env.PROD,
};

export default appConfig;
