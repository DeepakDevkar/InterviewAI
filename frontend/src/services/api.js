import axios from 'axios';
import { store } from '../store/store.js';
import { logOut, setCredentials } from '../features/auth/authSlice.js';

const getBaseURL = () => {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  return raw.endsWith('/api/v1') ? raw : `${raw.replace(/\/$/, '')}/api/v1`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is due to unauthorized token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call auth refresh endpoint (HttpOnly cookie will be sent automatically)
        const response = await axios.post(
          `${getBaseURL()}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, data } = response.data;
        
        // Update credentials in store
        store.dispatch(setCredentials({ user: data.user, token: accessToken }));
        
        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        store.dispatch(logOut());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
