import { defineStore } from "pinia";
import api from "../services/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
    token: null,
    isAuthenticated: false,
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.currentUser?.role === "admin",
    isTecnico: (state) => state.currentUser?.role === "tecnico",
    isOperador: (state) => state.currentUser?.role === "operador",
    userName: (state) => state.currentUser?.nome || "Usuário",
    userEmail: (state) => state.currentUser?.email || ""
  },

  actions: {
    async login(email, senha) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post("/auth/login", { email, senha });

        this.token = data.token;
        this.currentUser = data.usuario;
        this.isAuthenticated = true;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.usuario));

        return data;
      } catch (err) {
        this.error = err.response?.data?.erro || "Erro ao fazer login";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async registro(userData) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post("/auth/registro", userData);
        return data;
      } catch (err) {
        this.error = err.response?.data?.erro || "Erro ao registrar usuário";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    restoreSession() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        this.token = token;
        this.currentUser = JSON.parse(user);
        this.isAuthenticated = true;
      }
    },

    logout() {
      localStorage.clear();
      window.location.href = "/login";
    },

    async fetchUsers() {
      const { data } = await api.get("/users");
      this.users = data;
    }
  }
});
