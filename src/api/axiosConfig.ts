import axios from 'axios';
import { authService } from '../services/auth';

// Configure axios instance with interceptors
const axiosInstance = axios.create();

// Request interceptor - attach access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = authService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors (token refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = authService.getRefreshToken();
      
      // If we have a refresh token, attempt to refresh
      if (refreshToken) {
        try {
          // TODO: Implement token refresh endpoint if needed
          // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
          // authService.updateAccessToken(response.data.access_token);
          // originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          // return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          authService.clearAuth();
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear auth and redirect to login
        authService.clearAuth();
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

// Export configured axios instance
export default axiosInstance;

