import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    // 🔐 LOGIN
    async login(email, senha) {
      try {
        const { data } = await api.post('/auth/login', { email, senha })

        this.token = data.token
        this.user = data.usuario || data.user
        this.isAuthenticated = true

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        return data
      } catch (error) {
        console.error('Erro no login:', error)
        throw new Error(
          error.response?.data?.erro ||
          error.response?.data?.message ||
          'Erro ao fazer login'
        )
      }
    },

    // 📝 REGISTRO
    async registro(userData) {
      try {
        const { data } = await api.post('/auth/registro', userData)
        return data
      } catch (error) {
        console.error('Erro no registro:', error)
        throw new Error(
          error.response?.data?.erro ||
          error.response?.data?.message ||
          'Erro ao registrar usuário'
        )
      }
    },

    // Alias (caso use registro em algum lugar)
    async registro(userData) {
      return await this.registro(userData)
    },

    // 🚪 LOGOUT
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // 🔍 VERIFICAR TOKEN
    async checkAuth() {
      const token = localStorage.getItem('token')

      if (!token) {
        this.logout()
        return false
      }

      try {
        const { data } = await api.get('/auth/me')
        this.user = data.user
        this.token = token
        this.isAuthenticated = true
        return true
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        this.logout()
        return false
      }
    },

    // ⚙️ INICIALIZAÇÃO
    initializeAuth() {
      if (this.token) {
        this.checkAuth()
      }
    }
  }
})
