import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  createAdmin: async (username, password) => {
    try {
      const response = await api.post('/auth/create/admin', { username, password });
      return response.data;
    } catch (error) {
      console.error('Create admin error:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Components API calls
export const componentsAPI = {
  getAll: () => api.get('/components'),
  getByCategory: (category) => api.get(`/components/category/${category}`),
  getById: (id) => api.get(`/components/${id}`),
  create: (componentData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    return api.post('/components', componentData);
  },
  update: (id, componentData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    return api.put(`/components/${id}`, componentData);
  },
  softDelete: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    return api.patch(`/components/${id}/soft-delete`);
  },
  hardDelete: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    return api.delete(`/components/${id}`);
  },
  restore: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    return api.patch(`/components/${id}/restore`);
  }
};

export default api; 