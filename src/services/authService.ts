import api from './api';
import storage from '../utils/storage';
import type { LoginCredentials, AuthResponse } from '../types';

/**
 * Auth Service
 * Handles user authentication and session management.
 */
const authService = {
  /**
   * Login user
   * @param {LoginCredentials} credentials - Email and password
   * @returns {Promise<AuthResponse>} Auth response with token and user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   * Clears storage and session
   */
  logout: (): void => {
    storage.remove('token');
    storage.remove('user');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: (): boolean => {
    return !!storage.get('token');
  },

  /**
   * Get current user
   * @returns {object|null}
   */
  getCurrentUser: (): any => {
    const userStr = storage.get('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
};

export default authService;
