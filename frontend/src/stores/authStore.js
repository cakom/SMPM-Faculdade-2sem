import { defineStore } from 'pinia'

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
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, senha })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.erro || 'Erro ao fazer login')
        }

        this.token = data.token
        this.user = data.usuario || data.user
        this.isAuthenticated = true

        // Salvar token no localStorage
        localStorage.setItem('token', data.token)
        
        return data
      } catch (error) {
        console.error('Erro no login:', error)
        throw error
      }
    },

    async registro(userData) {
      try {
        const response = await fetch('/api/auth/registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.erro || 'Erro ao registrar usuário')
        }

        return data
      } catch (error) {
        console.error('Erro no registro:', error)
        throw error
      }
    },

    async register(userData) {
      // Alias para registro (compatibilidade)
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
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Token inválido')
        }

        const data = await response.json()
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

    initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.checkAuth()
      }
    }
  }
})