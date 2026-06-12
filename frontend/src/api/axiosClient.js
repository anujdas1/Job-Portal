import axios from 'axios';

// Create an Axios instance – Vite proxy will forward /api to backend
const api = axios.create({
  baseURL: '',  // empty = same origin, so /api goes through Vite proxy
});

// Request interceptor – attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – auto-unwrap { success, data } envelope
api.interceptors.response.use(
  (response) => {
    // If the backend wraps the response in { success, data }, unwrap it
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // If 401, clear token and optionally redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/sign-in') &&
          !window.location.pathname.startsWith('/register')) {
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
