import { User, LoginResponse, AuthState } from '../types/index';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Token storage (using localStorage for persistence)
export const authService = {
  // Store authentication data after login
  setAuth: (loginResponse: LoginResponse): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, loginResponse.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, loginResponse.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(loginResponse.user));
  },

  // Get access token
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Get user data
  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  // Get complete auth state
  getAuthState: (): AuthState => {
    const accessToken = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();
    const user = authService.getUser();
    
    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!(accessToken && user),
    };
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authService.getAuthState().isAuthenticated;
  },

  // Clear authentication data (logout)
  clearAuth: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Update access token (for token refresh)
  updateAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
};

