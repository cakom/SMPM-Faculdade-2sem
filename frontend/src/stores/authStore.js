import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(email, senha) {
      try {
        const response = await api.post('/api/login', { email, senha })
        const data = response.data

        this.token = data.token
        this.user = data.usuario || data.user
        this.isAuthenticated = true

        localStorage.setItem('token', data.token)
        
        return data
      } catch (error) {
        console.error('Erro no login:', error)
        throw new Error(error.response?.data?.erro || 'Erro ao fazer login')
      }
    },

    async registro(userData) {
      try {
        const response = await api.post('/api/registro', userData)
        return response.data
      } catch (error) {
        console.error('Erro no registro:', error)
        throw new Error(error.response?.data?.erro || 'Erro ao registrar usuário')
      }
    },

    async register(userData) {
      return this.registro(userData)
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },

    async checkAuth() {
      const token = localStorage.getItem('token')
      
      if (!token) {
        this.logout()
        return false
      }

      try {
        const response = await api.get('/api/me')
        this.user = response.data.user
        this.token = token
        this.isAuthenticated = true
        return true
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        this.logout()
        return false
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.checkAuth()
      }
    }
  }
})