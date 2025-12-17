import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRedirecting = false;

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/registro')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    if (status === 401 && !isRedirecting) {
      isRedirecting = true;

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
