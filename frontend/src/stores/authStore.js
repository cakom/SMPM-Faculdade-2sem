import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
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
        const { data } = await api.post('/api/auth/login', { email, senha })

        this.token = data.token
        this.user = data.usuario
        this.isAuthenticated = true

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.usuario))

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

    async registro(userData) {
      try {
        const { data } = await api.post('/api/auth/registro', userData)
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

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    }
  }
})
