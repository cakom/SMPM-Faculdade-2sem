import { defineStore } from "pinia";
import api from "../services/api";

export const useUserStore = defineStore("user", {
  // ======================
  // STATE
  // ======================
  state: () => ({
    currentUser: null,
    token: null,
    isAuthenticated: false,
    users: [],
    loading: false,
    error: null
  }),

  // ======================
  // GETTERS
  // ======================
  getters: {
    isAdmin: (state) => state.currentUser?.role === "admin",
    isTecnico: (state) => state.currentUser?.role === "tecnico",
    isOperador: (state) => state.currentUser?.role === "operador",

    userName: (state) => state.currentUser?.nome || "Usuário",
    userEmail: (state) => state.currentUser?.email || ""
  },

  // ======================
  // ACTIONS
  // ======================
  actions: {
    // 🔐 LOGIN
    async login(email, senha) {
      this.loading = true;
      this.error = null;

      try {
        // ✅ REMOVIDO /api
        const res = await api.post("/auth/login", { email, senha });

        this.token = res.data.token;
        this.currentUser = res.data.usuario;
        this.isAuthenticated = true;

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.currentUser));

        // ✅ garante token nos próximos requests
        api.defaults.headers.common.Authorization = `Bearer ${this.token}`;

        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.erro ||
          err.response?.data?.message ||
          "Erro ao fazer login";

        console.error("❌ Erro no login:", err);
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
        // ✅ REMOVIDO /api
        const res = await api.post("/auth/registro", userData);
        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.erro ||
          err.response?.data?.message ||
          "Erro ao registrar usuário";

        console.error("❌ Erro no registro:", err);
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

        // ✅ garante token após reload
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
    },

    // 🚪 LOGOUT
    logout() {
      this.currentUser = null;
      this.token = null;
      this.isAuthenticated = false;
      this.users = [];

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete api.defaults.headers.common.Authorization;

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    },

    // ======================
    // 👥 CRUD DE USUÁRIOS
    // ======================
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        // ✅ REMOVIDO /api
        const res = await api.get("/users");
        this.users = res.data;
      } catch (err) {
        this.error = err.response?.data?.erro || "Erro ao buscar usuários";
        console.error("❌ Erro ao buscar usuários:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addUser(user) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/users", user);
        this.users.push(res.data);
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.erro || "Erro ao adicionar usuário";
        console.error("❌ Erro ao adicionar usuário:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id, updates) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.put(`/users/${id}`, updates);

        if (id === this.currentUser?._id) {
          this.currentUser = res.data;
          localStorage.setItem("user", JSON.stringify(this.currentUser));
        }

        const index = this.users.findIndex((u) => u._id === id);
        if (index !== -1) {
          this.users[index] = res.data;
        }

        return res.data;
      } catch (err) {
        this.error = err.response?.data?.erro || "Erro ao atualizar usuário";
        console.error("❌ Erro ao atualizar usuário:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`/users/${id}`);
        this.users = this.users.filter((u) => u._id !== id);
      } catch (err) {
        this.error = err.response?.data?.erro || "Erro ao remover usuário";
        console.error("❌ Erro ao remover usuário:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    }
  }
});
