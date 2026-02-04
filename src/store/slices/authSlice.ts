import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type User, type UserRole } from '../../types';
import { useApiService } from '../../services/apiService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: string[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  permissions: [],
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password, role }: { email: string; password: string; role: UserRole }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role,
      avatar: undefined,
      createdAt: new Date().toISOString(),
    };
    
    const mockToken = `mock-jwt-token-${Date.now()}`;
    
    // Store in localStorage
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    
    return { user: mockUser, token: mockToken };
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async () => {
    // Mock token refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newToken = `mock-jwt-token-refreshed-${Date.now()}`;
    localStorage.setItem('authToken', newToken);
    
    return newToken;
  }
);

export const fetchUserPermissionsAsync = createAsyncThunk(
  'auth/fetchPermissions',
  async (role: UserRole) => {
    // Mock permissions based on role
    const rolePermissions = {
      admin: ['read_all', 'write_all', 'delete_all', 'manage_users', 'manage_system'],
      recruiter: ['read_jobs', 'write_jobs', 'read_candidates', 'schedule_interviews', 'view_reports'],
      candidate: ['read_jobs', 'apply_jobs', 'view_applications', 'manage_profile'],
    };
    
    return rolePermissions[role] || [];
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    initializeFromStorage: (state) => {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('authUser');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.error = null;
      })
      // Refresh Token
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        // Refresh failed - logout
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
      })
      // Fetch Permissions
      .addCase(fetchUserPermissionsAsync.fulfilled, (state, action) => {
        state.permissions = action.payload;
      });
  },
});

export const { clearError, setUser, setToken, initializeFromStorage } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserPermissions = (state: { auth: AuthState }) => state.auth.permissions;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Permission checker
export const hasPermission = (state: { auth: AuthState }, permission: string) => {
  return state.auth.permissions.includes(permission);
};

export const hasAnyPermission = (state: { auth: AuthState }, permissions: string[]) => {
  return permissions.some(permission => state.auth.permissions.includes(permission));
};

export default authSlice.reducer;
