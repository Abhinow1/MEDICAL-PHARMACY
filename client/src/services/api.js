import axios from 'axios';
import { handleFallbackRequest } from './fallbackData';

const apiBaseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medicare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized, session expiry, or static host fallback
api.interceptors.response.use(
  (response) => {
    // If the response is HTML string (Vercel SPA rewrite fallback instead of API response)
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!doctype html>') || response.data.includes('<html'))
    ) {
      const fallback = handleFallbackRequest(response.config);
      if (fallback) return fallback;
    }
    return response;
  },
  (error) => {
    // If network error, 404, or host offline, serve resilient catalog
    if (error.config) {
      const fallback = handleFallbackRequest(error.config);
      if (fallback) return fallback;
    }

    if (error.response?.status === 401) {
      const isAuthRoute =
        window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/register') ||
        window.location.pathname.includes('/admin/login');

      if (!isAuthRoute && localStorage.getItem('medicare_token')) {
        localStorage.removeItem('medicare_token');
        localStorage.removeItem('medicare_user');
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
