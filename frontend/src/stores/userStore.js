/**
 * userStore.js - Store Pinia para Usuários e Autenticação
 * 
 * Gerencia:
 * - Autenticação (login/logout)
 * - Dados do usuário logado
 * - Lista de usuários (se admin)
 */

import { defineStore } from "pinia";
import api from "../services/api";
import router from "../router";

export const useUserStore = defineStore("user", {
    
    // ===== ESTADO =====
    state: () => ({
        // Usuário atual logado
        currentUser: null,      // { id, nome, email, role }
        token: null,            // Token JWT
        isAuthenticated: false, // Flag de autenticação
        
        // Lista de todos os usuários (admin)
        users: [],              // Array de usuários
        
        // Estados de loading e erro
        loading: false,
        error: null
    }),

    // ===== GETTERS =====
    getters: {
        /**
         * Verifica se o usuário é administrador
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
         * @param {string} email 
         * @param {string} senha 
         */
        async login(email, senha) {
            this.loading = true;
            this.error = null;
            
            try {
                // POST /api/login
                const res = await api.post("/login", { email, senha });
                
                // Salva token e dados do usuário
                this.token = res.data.token;
                this.currentUser = res.data.usuario;
                this.isAuthenticated = true;
                
                // Salva no localStorage para persistir entre recarregamentos
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                
                // Configura o token no header do Axios para próximas requisições
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
         * Registra um novo usuário
         * @param {Object} userData - { nome, email, senha, role }
         */
        async register(userData) {
            this.loading = true;
            this.error = null;
            
            try {
                // POST /api/registro
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
         * Faz logout do usuário
         */
        logout() {
            // Limpa estado
            this.currentUser = null;
            this.token = null;
            this.isAuthenticated = false;
            this.users = [];
            
            // Remove do localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Remove token do Axios
            delete api.defaults.headers.common['Authorization'];
            
            // Redireciona para login
            router.push('/login');
        },

        /**
         * Restaura sessão do localStorage
         * Chamado quando a aplicação inicia
         */
        restoreSession() {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (token && user) {
                this.token = token;
                this.currentUser = JSON.parse(user);
                this.isAuthenticated = true;
                
                // Configura token no Axios
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        },

        /**
         * Busca todos os usuários (apenas admin)
         */
        async fetchUsers() {
            this.loading = true;
            this.error = null;
            
            try {
                // GET /api/users
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
         * @param {Object} user - Dados do usuário
         */
        async addUser(user) {
            this.loading = true;
            this.error = null;
            
            try {
                // POST /api/users
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
         * @param {string} id - ID do usuário
         */
        async deleteUser(id) {
            this.loading = true;
            this.error = null;
            
            try {
                // DELETE /api/users/:id
                await api.delete(`/users/${id}`);
                
                // Remove do estado local
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
         * Atualiza dados do usuário
         * @param {string} id - ID do usuário
         * @param {Object} updates - Campos a atualizar
         */
        async updateUser(id, updates) {
            this.loading = true;
            this.error = null;
            
            try {
                // PUT /api/users/:id
                const res = await api.put(`/users/${id}`, updates);
                
                // Se atualizou o próprio usuário, atualiza currentUser
                if (id === this.currentUser?._id) {
                    this.currentUser = res.data;
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                }
                
                // Atualiza na lista de usuários
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