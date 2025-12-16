/**
 * services/api.js - Instância do Axios
 */

import axios from 'axios';

const API_URL =
  import.meta.env.MODE === 'production'
    ? 'https://smpm-faculdade-2sem-production.up.railway.app/api'
    : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // ↑ um pouco maior para Railway
  headers: {
    'Content-Type': 'application/json'
  }
});

// =======================
// REQUEST INTERCEPTOR
// =======================
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

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
