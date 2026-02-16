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

// Base URL for the API
const API_BASE_URL = 'https://elite-properties-backend-production.up.railway.app/api';

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
  getAllUsers: (params = {}) => api.get('/admin/users', { params }),
  
  // Get user by ID
  getUserById: (id) => api.get(`/admin/users/${id}`),
  
  // Delete user
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Contact Form Management APIs
export const contactApi = {
  // Get all contact inquiries
  getAllContacts: (params = {}) => api.get('/admin/contacts', { params }),
  
  // Get contact by ID
  getContactById: (id) => api.get(`/admin/contacts/${id}`),
  
  // Delete contact
  deleteContact: (id) => api.delete(`/admin/contacts/${id}`),
};

// Schedule Meeting Management APIs
export const meetingApi = {
  // Get all scheduled meetings
  getAllMeetings: (params = {}) => api.get('/admin/schedule-meetings', { params }),
  
  // Get meeting by ID
  getMeetingById: (id) => api.get(`/admin/schedule-meetings/${id}`),
  
  // Update meeting status
  updateMeetingStatus: (id, status) => api.put(`/admin/schedule-meetings/${id}/status`, { status }),
  
  // Delete meeting
  deleteMeeting: (id) => api.delete(`/admin/schedule-meetings/${id}`),
};

// Property Management APIs
export const propertyApi = {
  // Get all properties
  getAllProperties: (params = {}) => api.get('/admin/properties', { params }),
  
  // Get property by ID
  getPropertyById: (id) => api.get(`/admin/properties/${id}`),
  
  // Delete property
  deleteProperty: (id) => api.delete(`/admin/properties/${id}`),
  
  // Update property status
  updatePropertyStatus: (id, status) => api.put(`/admin/properties/${id}/status`, { propertyStatus: status }),
  
  // Create new property
  createProperty: (propertyData) => api.post('/admin/properties', propertyData),
  
  // Update property
  updateProperty: (id, propertyData) => api.put(`/admin/properties/${id}`, propertyData),
  
  // Upload property pictures
  uploadPropertyPictures: async (propertyId, pictures = []) => {
    try {
      const formData = new FormData();
      pictures.forEach((p) => formData.append('pictures', p));
      const response = await api.post(`/admin/properties/upload/pictures/${propertyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Upload property pictures error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to upload pictures', error };
    }
  },
  
  // Upload property videos
  uploadPropertyVideos: async (propertyId, videos = []) => {
    try {
      const formData = new FormData();
      videos.forEach((v) => formData.append('videos', v));
      const response = await api.post(`/admin/properties/upload/videos/${propertyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Upload property videos error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to upload videos', error };
    }
  },
  
  // Delete property picture
  deletePropertyPicture: async (propertyId, pictureUrl) => {
    try {
      const response = await api.delete(`/admin/properties/pictures/${propertyId}`, {
        data: { pictureUrl }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Delete property picture error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete picture', error };
    }
  },
  
  // Delete property video
  deletePropertyVideo: async (propertyId, videoUrl) => {
    try {
      const response = await api.delete(`/admin/properties/videos/${propertyId}`, {
        data: { videoUrl }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Delete property video error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete video', error };
    }
  }
};

// Dashboard Stats API
export const statsApi = {
  // Get admin statistics
  getStats: () => api.get('/admin/stats'),
};

// Authentication APIs
export const authApi = {
  // Login admin (this would be to the main backend)
  login: (credentials) => api.post('/auth/login', credentials),
};

// Export cookie utilities
export { setCookie, getCookie, deleteCookie };

export default api;