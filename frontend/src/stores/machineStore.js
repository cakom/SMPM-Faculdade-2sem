import { defineStore } from 'pinia'
import api from '../services/api'

export const useMachineStore = defineStore('machine', {
  state: () => ({
    machines: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMachines() {
      this.loading = true
      this.error = null

      try {
        const res = await api.get('/api/maquinas')
        this.machines = res.data
      } catch (err) {
        this.error = 'Erro ao buscar máquinas'
        console.error('❌ Erro ao buscar máquinas:', err)
      } finally {
        this.loading = false
      }
    },

    async addMachine(machine) {
      try {
        const res = await api.post('/api/maquinas', machine)
        this.machines.push(res.data)
      } catch (err) {
        console.error('❌ Erro ao adicionar máquina:', err)
        throw err
      }
    },
  },
})
