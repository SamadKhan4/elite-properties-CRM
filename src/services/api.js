import axios from 'axios';

// Cookie utility functions
const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict;Secure`;
};

// Base URL for the admin API
const API_BASE_URL = 'https://elite-properties-backend-production.up.railway.app/api/admin';

// Create axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getCookie('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      deleteCookie('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User Management APIs
export const userApi = {
  // Get all users
  getAllUsers: (params = {}) => api.get('/users', { params }),
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Delete user
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Property Management APIs
export const propertyApi = {
  // Get all properties
  getAllProperties: (params = {}) => api.get('/properties', { params }),
  
  // Delete property
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  
  // Update property status
  updatePropertyStatus: (id, status) => api.put(`/properties/${id}/status`, { propertyStatus: status }),
};

// Dashboard Stats API
export const statsApi = {
  // Get admin statistics
  getStats: () => api.get('/stats'),
};

// Authentication APIs
export const authApi = {
  // Login admin (this would be to the main backend)
  login: (credentials) => axios.post('https://elite-properties-backend-production.up.railway.app/api/auth/login', credentials),
};

// Export cookie utilities
export { setCookie, getCookie, deleteCookie };

export default api;