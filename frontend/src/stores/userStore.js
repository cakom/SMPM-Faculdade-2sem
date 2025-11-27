/**
 * stores/userStore.js - Store Pinia para Usuários e Autenticação
 */

// IMPORTAÇÕES (só uma vez!)
import { defineStore } from "pinia";
import api from "../services/api";

export const useUserStore = defineStore("user", {
    
    // ===== ESTADO =====
    state: () => ({
        // Usuário atual logado
        currentUser: null,
        token: null,
        isAuthenticated: false,
        
        // Lista de usuários (admin)
        users: [],
        
        // Estados de loading e erro
        loading: false,
        error: null
    }),

    // ===== GETTERS =====
    getters: {
        /**
         * Verifica se é administrador
         */
        isAdmin: (state) => {
            return state.currentUser?.role === 'admin';
        },

        /**
         * Verifica se é técnico
         */
        isTecnico: (state) => {
            return state.currentUser?.role === 'tecnico';
        },

        /**
         * Verifica se é operador
         */
        isOperador: (state) => {
            return state.currentUser?.role === 'operador';
        },

        /**
         * Nome do usuário logado
         */
        userName: (state) => {
            return state.currentUser?.nome || 'Usuário';
        },

        /**
         * Email do usuário logado
         */
        userEmail: (state) => {
            return state.currentUser?.email || '';
        }
    },

    // ===== ACTIONS =====
    actions: {
        /**
         * Faz login do usuário
         */
        async login(email, senha) {
            this.loading = true;
            this.error = null;
            
            try {
                const res = await api.post("/login", { email, senha });
                
                this.token = res.data.token;
                this.currentUser = res.data.usuario;
                this.isAuthenticated = true;
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                
                return res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao fazer login";
                console.error("Erro no login:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Registra novo usuário
         */
        async register(userData) {
            this.loading = true;
            this.error = null;
            
            try {
                const res = await api.post("/registro", userData);
                return res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao registrar";
                console.error("Erro no registro:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Faz logout
         */
        logout() {
            this.currentUser = null;
            this.token = null;
            this.isAuthenticated = false;
            this.users = [];
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            delete api.defaults.headers.common['Authorization'];
            
            // Redireciona para login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        },

        /**
         * Restaura sessão do localStorage
         */
        restoreSession() {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (token && user) {
                this.token = token;
                this.currentUser = JSON.parse(user);
                this.isAuthenticated = true;
                
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        },

        /**
         * Busca todos os usuários (admin)
         */
        async fetchUsers() {
            this.loading = true;
            this.error = null;
            
            try {
                const res = await api.get("/users");
                this.users = res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao buscar usuários";
                console.error("Erro ao buscar usuários:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Adiciona novo usuário (admin)
         */
        async addUser(user) {
            this.loading = true;
            this.error = null;
            
            try {
                const res = await api.post("/users", user);
                this.users.push(res.data);
                return res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao adicionar usuário";
                console.error("Erro ao adicionar usuário:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Remove usuário (admin)
         */
        async deleteUser(id) {
            this.loading = true;
            this.error = null;
            
            try {
                await api.delete(`/users/${id}`);
                this.users = this.users.filter(u => u._id !== id);
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao remover usuário";
                console.error("Erro ao remover usuário:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Atualiza usuário
         */
        async updateUser(id, updates) {
            this.loading = true;
            this.error = null;
            
            try {
                const res = await api.put(`/users/${id}`, updates);
                
                if (id === this.currentUser?._id) {
                    this.currentUser = res.data;
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                }
                
                const index = this.users.findIndex(u => u._id === id);
                if (index !== -1) {
                    this.users[index] = res.data;
                }
                
                return res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao atualizar usuário";
                console.error("Erro ao atualizar usuário:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Limpa mensagens de erro
         */
        clearError() {
            this.error = null;
        }
    }
});