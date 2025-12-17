/**
 * services/api.js - Instância do Axios
 */

import axios from "axios";

// =======================
// BASE URL
// =======================
// Em produção → Railway
// Em dev → localhost
const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000/api";

// =======================
// AXIOS INSTANCE
// =======================
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

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
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
