/// <reference types="vite/client" />
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
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
    useMock: false,
  },
  env: import.meta.env.MODE || 'development',
  isProduction: import.meta.env.PROD,
};

export default appConfig;
