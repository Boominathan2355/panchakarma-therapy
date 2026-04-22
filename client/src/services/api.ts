import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import appConfig from '../constants/appConfig';

const TOKEN_KEY = 'ptas_token';

let inMemoryToken: string | null = null;

export const setApiToken = (token: string | null) => {
  inMemoryToken = token;
};


const api: AxiosInstance = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to the header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      let token = inMemoryToken;
      if (!token) {
        token = Cookies.get(TOKEN_KEY) || null;
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not access cookies for auth header:', e);
      if (inMemoryToken) {
        config.headers.Authorization = `Bearer ${inMemoryToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is 401 and not from the login endpoint
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      // Handle unauthorized access
      try {
        Cookies.remove(TOKEN_KEY, { path: '/' });
        Cookies.remove('ptas_user', { path: '/' });
      } catch (e) {
        console.warn('Could not remove cookies:', e);
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;
