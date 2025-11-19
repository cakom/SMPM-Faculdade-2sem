<!-- views/MaintenanceList.vue - Lista completa de manutenções -->
<!-- Tabela com filtros, busca, ordenação e paginação -->

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Lista de Manutenções</h1>
        <p class="text-gray-600 mt-1">
          Gerencie todas as atividades de manutenção
        </p>
      </div>
      
      <div class="flex space-x-3">
        <!-- Botão para visualização em calendário -->
        <button
          @click="router.push('/calendario')"
          class="btn-secondary"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Ver Calendário
        </button>
        
        <!-- Botão para exportar -->
        <button
          @click="exportToCSV"
          class="btn-secondary"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar
        </button>
        
        <!-- Botão para nova manutenção -->
        <button
          @click="showNewMaintenanceModal = true"
          class="btn-primary"
        >
          + Nova Manutenção
        </button>
      </div>
    </div>
    
    <!-- Cards de resumo -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Concluídas</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.concluidas }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pendentes</p>
            <p class="text-2xl font-bold text-yellow-600 mt-1">{{ stats.pendentes }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Em Andamento</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ stats.emAndamento }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabela de Manutenções -->
    <MaintenanceTable
      :maintenances="maintenances"
      :loading="loading"
      @new-maintenance="showNewMaintenanceModal = true"
      @edit="handleEditMaintenance"
      @view-details="handleViewDetails"
    />
    
    <!-- Modal: Nova Manutenção -->
    <Modal
      v-model="showNewMaintenanceModal"
      title="Nova Manutenção"
      size="lg"
    >
      <MaintenanceForm
        :machines="machines"
        :loading="loading"
        @submit="handleCreateMaintenance"
        @cancel="showNewMaintenanceModal = false"
      />
    </Modal>
    
    <!-- Modal: Editar Manutenção -->
    <Modal
      v-model="showEditMaintenanceModal"
      title="Editar Manutenção"
      size="lg"
    >
      <MaintenanceForm
        :maintenance="selectedMaintenance"
        :machines="machines"
        :loading="loading"
        @submit="handleUpdateMaintenance"
        @cancel="showEditMaintenanceModal = false"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMaintenanceStore } from '../stores/maintenanceStore'
import MaintenanceTable from '../components/MaintenanceTable.vue'
import Modal from '../components/Modal.vue'
import MaintenanceForm from '../components/MaintenanceForm.vue'

// Router, Route e Store
const router = useRouter()
const route = useRoute()
const store = useMaintenanceStore()

// Estado reativo
const showNewMaintenanceModal = ref(false)
const showEditMaintenanceModal = ref(false)
const selectedMaintenance = ref(null)

// Computed: Dados da store
const maintenances = computed(() => store.maintenances)
const machines = computed(() => store.machines)
const loading = computed(() => store.loading)
const stats = computed(() => store.stats)

// Lifecycle: Carrega dados ao montar
onMounted(async () => {
  await store.fetchMaintenances()
  await store.fetchMachines()
  
  // Se há query param de data (vindo do calendário), rolar para a data
  if (route.query.date) {
    // Implementar scroll ou filtro automático
    console.log('Filtrar por data:', route.query.date)
  }
})

// Watch: Monitora mudanças na rota
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.date) {
      // Aplicar filtro de data
      console.log('Aplicar filtro:', newQuery.date)
    }
  }
)

// Função: Cria nova manutenção
async function handleCreateMaintenance(data) {
  try {
    await store.createMaintenance(data)
    showNewMaintenanceModal.value = false
    
    // Notificação de sucesso
    showNotification('Manutenção criada com sucesso!', 'success')
  } catch (error) {
    console.error('Erro ao criar manutenção:', error)
    showNotification('Erro ao criar manutenção. Tente novamente.', 'error')
  }
}

// Função: Abre modal de edição
function handleEditMaintenance(maintenance) {
  selectedMaintenance.value = maintenance
  showEditMaintenanceModal.value = true
}

// Função: Atualiza manutenção
async function handleUpdateMaintenance(data) {
  try {
    await store.updateMaintenance(data.id, data)
    showEditMaintenanceModal.value = false
    selectedMaintenance.value = null
    
    // Notificação de sucesso
    showNotification('Manutenção atualizada com sucesso!', 'success')
  } catch (error) {
    console.error('Erro ao atualizar manutenção:', error)
    showNotification('Erro ao atualizar manutenção. Tente novamente.', 'error')
  }
}

// Função: Navega para detalhes
function handleViewDetails(maintenance) {
  router.push(`/manutencoes/${maintenance.id}`)
}

// Função: Exporta para CSV
function exportToCSV() {
  try {
    // Cabeçalhos do CSV
    const headers = ['Máquina', 'Tipo', 'Data', 'Status', 'Técnico', 'Descrição']
    
    // Dados das manutenções
    const rows = maintenances.value.map(m => [
      m.maquina,
      m.tipo,
      new Date(m.data).toLocaleDateString('pt-BR'),
      m.status,
      m.tecnico,
      m.descricao || ''
    ])
    
    // Cria conteúdo CSV
    let csvContent = headers.join(',') + '\n'
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
    })
    
    // Cria blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `manutencoes_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showNotification('Relatório exportado com sucesso!', 'success')
  } catch (error) {
    console.error('Erro ao exportar:', error)
    showNotification('Erro ao exportar relatório.', 'error')
  }
}

// Função: Mostra notificação (implementação simples com alert)
// Em produção, usar biblioteca de toast como vue-toastification
function showNotification(message, type) {
  alert(message)
}
</script>