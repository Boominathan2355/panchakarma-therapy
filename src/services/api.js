import axios from 'axios';
import storage from '../utils/storage';
import appConfig from '../constants/appConfig';

const api = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to the header
api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., clear token and redirect)
      storage.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
