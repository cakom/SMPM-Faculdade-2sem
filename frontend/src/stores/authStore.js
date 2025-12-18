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
    // 🔐 LOGIN
    async login(email, senha) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/login", { email, senha });

        this.token = res.data.token;
        this.currentUser = res.data.usuario;
        this.isAuthenticated = true;

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.currentUser));

        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.erro ||
          "Erro ao fazer login";

        throw err;
      } finally {
        this.loading = false;
      }
    },

    // 📝 REGISTRO
    async registro(userData) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/registro", userData);
        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.erro ||
          "Erro ao registrar usuário";

        throw err;
      } finally {
        this.loading = false;
      }
    },

    // 🔄 RESTAURA SESSÃO
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

    // 👥 USERS
    async fetchUsers() {
      const res = await api.get("/users");
      this.users = res.data;
    }
  }
});
