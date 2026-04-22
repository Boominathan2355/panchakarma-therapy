import { createContext, useContext } from 'react';
import type { User, LoginCredentials } from '../types/auth';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isError: boolean;
    message: string;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    reset: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
