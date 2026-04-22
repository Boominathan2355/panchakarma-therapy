import api from '../../../services/api';
import Cookies from 'js-cookie';
import type { LoginCredentials, AuthResponse } from '../types/auth';

const TOKEN_KEY = 'ptas_token';
const USER_KEY = 'ptas_user';

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
   * Clears session cookies
   */
  logout: (): void => {
    try {
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(USER_KEY);
    } catch (e) {
      console.warn('Could not remove cookies on logout:', e);
    }
  },

  isAuthenticated: (): boolean => {
    try {
      return !!Cookies.get(TOKEN_KEY);
    } catch (e) {
      return false;
    }
  },

  /**
   * Get current user
   * @returns {object|null}
   */
  getCurrentUser: (): any => {
    try {
      const userStr = Cookies.get(USER_KEY);
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
};

export default authService;
