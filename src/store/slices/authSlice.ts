import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import storage from '../../utils/storage';
import type { LoginCredentials, AuthResponse, User } from '../../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const getInitialAuth = (): { token: string | null; user: User | null } => {
    const token = storage.get('token');
    const userStr = storage.get('user');
    let user: User | null = null;
    try {
        user = userStr ? JSON.parse(userStr) as User : null;
    } catch (e) {
        console.error("Failed to parse user from storage", e);
    }
    return { token, user };
};

const { token, user } = getInitialAuth();

const initialState: AuthState = {
    user: user || null,
    token: token || null,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
};

// Async thunk for login
export const login = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>(
    'auth/login',
    async (credentials, thunkAPI) => {
        try {
            return await authService.login(credentials);
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    authService.logout();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                storage.set('token', action.payload.token);
                storage.set('user', JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload || 'Login failed';
                state.user = null;
                state.token = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                storage.remove('token');
                storage.remove('user');
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
