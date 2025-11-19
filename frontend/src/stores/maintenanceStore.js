// stores/maintenanceStore.js - Gerenciamento de estado global com Pinia
// Centraliza dados de manutenções, máquinas e estatísticas

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useMaintenanceStore = defineStore('maintenance', () => {
  // Estado reativo da aplicação
  const maintenances = ref([]) // Lista de manutenções
  const machines = ref([]) // Lista de máquinas
  const loading = ref(false) // Indicador de carregamento
  const error = ref(null) // Armazena erros

  // Computed: Calcula estatísticas automaticamente
  const stats = computed(() => {
    const total = maintenances.value.length
    const concluidas = maintenances.value.filter(m => m.status === 'concluida').length
    const pendentes = maintenances.value.filter(m => m.status === 'pendente').length
    const emAndamento = maintenances.value.filter(m => m.status === 'em_andamento').length
    
    return { total, concluidas, pendentes, emAndamento }
  })

  // Ação: Busca manutenções do backend
  async function fetchMaintenances() {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/manutencoes')
      maintenances.value = response.data
    } catch (err) {
      error.value = 'Erro ao carregar manutenções'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Ação: Busca máquinas do backend
  async function fetchMachines() {
    loading.value = true
    
    try {
      const response = await axios.get('/api/maquinas')
      machines.value = response.data
    } catch (err) {
      error.value = 'Erro ao carregar máquinas'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Ação: Cria nova manutenção
  async function createMaintenance(data) {
    loading.value = true
    
    try {
      const response = await axios.post('/api/manutencoes', data)
      maintenances.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Erro ao criar manutenção'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Ação: Atualiza manutenção existente
  async function updateMaintenance(id, data) {
    loading.value = true
    
    try {
      const response = await axios.put(`/api/manutencoes/${id}`, data)
      const index = maintenances.value.findIndex(m => m.id === id)
      if (index !== -1) {
        maintenances.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Erro ao atualizar manutenção'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Retorna estado e ações para uso nos componentes
  return {
    maintenances,
    machines,
    loading,
    error,
    stats,
    fetchMaintenances,
    fetchMachines,
    createMaintenance,
    updateMaintenance
  }
})
