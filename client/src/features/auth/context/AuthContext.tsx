import React, { useState, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';
import type { User, LoginCredentials, AuthResponse } from '../types/auth';
import authService from '../services/authService';
import api, { setApiToken } from '../../../services/api';
import { AuthContext } from './useAuth';

const TOKEN_KEY = 'ptas_token';
const USER_KEY = 'ptas_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const savedUser = Cookies.get(USER_KEY);
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            console.warn('Storage access denied or cookie corrupted:', e);
            return null;
        }
    });
    const [token, setToken] = useState<string | null>(() => {
        try {
            const initialToken = Cookies.get(TOKEN_KEY) || null;
            if (initialToken) setApiToken(initialToken);
            return initialToken;
        } catch (e) {
            console.warn('Storage access denied:', e);
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setIsError(false);
        setMessage('');
        try {
            const data: AuthResponse = await authService.login(credentials);
            setUser(data.user);
            setToken(data.token);
            setApiToken(data.token);
            
            // Store in secure cookies
            const isSecure = window.location.protocol === 'https:';
            try {
                Cookies.set(TOKEN_KEY, data.token, { expires: 7, secure: isSecure, sameSite: 'lax', path: '/' });
                Cookies.set(USER_KEY, JSON.stringify(data.user), { expires: 7, secure: isSecure, sameSite: 'lax', path: '/' });
            } catch (e) {
                console.warn('Could not set cookies on login:', e);
            }

        } catch (error: any) {
            setIsError(true);
            setMessage(
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                'Login failed'
            );
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setApiToken(null);
        try {
            Cookies.remove(TOKEN_KEY, { path: '/' });
            Cookies.remove(USER_KEY, { path: '/' });
        } catch (e) {
            console.warn('Could not remove cookies on context logout:', e);
        }
        authService.logout();
    }, []);


    const reset = useCallback(() => {
        setIsLoading(false);
        setIsError(false);
        setMessage('');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                isError,
                message,
                login,
                logout,
                reset,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
