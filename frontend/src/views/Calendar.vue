<!-- views/Calendar.vue - Página dedicada ao calendário -->
<!-- Visualização ampliada do calendário de manutenções -->

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Calendário de Manutenções</h1>
        <p class="text-gray-600 mt-1">Visualize todas as manutenções programadas</p>
      </div>
      
      <div class="flex space-x-3">
        <!-- Botão para visualização em lista -->
        <button
          @click="router.push('/manutencoes')"
          class="btn-secondary"
        >
          Ver Lista
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
    
    <!-- Filtros -->
    <div class="card">
      <div class="flex flex-wrap gap-4">
        <!-- Filtro por máquina -->
        <select
          v-model="selectedMachine"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as máquinas</option>
          <option
            v-for="machine in machines"
            :key="machine.id"
            :value="machine.id"
          >
            {{ machine.nome }}
          </option>
        </select>
        
        <!-- Filtro por status -->
        <select
          v-model="selectedStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluida">Concluída</option>
        </select>
        
        <!-- Botão limpar filtros -->
        <button
          v-if="selectedMachine || selectedStatus"
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
    
    <!-- Calendário -->
    <Calendar
      :maintenances="filteredMaintenances"
      @day-selected="handleDaySelected"
    />
    
    <!-- Modal: Detalhes do Dia -->
    <Modal
      v-model="showDayDetailsModal"
      :title="`Manutenções - ${selectedDayFormatted}`"
      size="lg"
    >
      <div class="space-y-4">
        <div
          v-for="maintenance in selectedDayMaintenances"
          :key="maintenance.id"
          class="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
          @click="viewMaintenanceDetails(maintenance)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">{{ maintenance.maquina }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ maintenance.tipo }}</p>
              <p class="text-sm text-gray-600">Técnico: {{ maintenance.tecnico }}</p>
              <p v-if="maintenance.descricao" class="text-sm text-gray-500 mt-2">
                {{ maintenance.descricao }}
              </p>
            </div>
            
            <span class="status-badge ml-4" :class="getStatusBadgeClass(maintenance.status)">
              {{ getStatusLabel(maintenance.status) }}
            </span>
          </div>
        </div>
      </div>
    </Modal>
    
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenanceStore } from '../stores/maintenanceStore'
import Calendar from '../components/Calendar.vue'
import Modal from '../components/Modal.vue'
import MaintenanceForm from '../components/MaintenanceForm.vue'

// Router e Store
const router = useRouter()
const store = useMaintenanceStore()

// Estado reativo
const showDayDetailsModal = ref(false)
const showNewMaintenanceModal = ref(false)
const selectedDay = ref(null)
const selectedMachine = ref('')
const selectedStatus = ref('')

// Computed: Dados da store
const maintenances = computed(() => store.maintenances)
const machines = computed(() => store.machines)
const loading = computed(() => store.loading)

// Computed: Manutenções filtradas
const filteredMaintenances = computed(() => {
  let result = [...maintenances.value]
  
  // Filtro por máquina
  if (selectedMachine.value) {
    result = result.filter(m => m.maquinaId === selectedMachine.value)
  }
  
  // Filtro por status
  if (selectedStatus.value) {
    result = result.filter(m => m.status === selectedStatus.value)
  }
  
  return result
})

// Computed: Manutenções do dia selecionado
const selectedDayMaintenances = computed(() => {
  if (!selectedDay.value) return []
  return selectedDay.value.maintenances
})

// Computed: Data selecionada formatada
const selectedDayFormatted = computed(() => {
  if (!selectedDay.value) return ''
  return selectedDay.value.fullDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
})

// Lifecycle: Carrega dados ao montar
onMounted(async () => {
  await store.fetchMaintenances()
  await store.fetchMachines()
})

// Função: Manipula seleção de dia
function handleDaySelected(day) {
  if (day.maintenances.length > 0) {
    selectedDay.value = day
    showDayDetailsModal.value = true
  }
}

// Função: Navega para detalhes da manutenção
function viewMaintenanceDetails(maintenance) {
  router.push(`/manutencoes/${maintenance.id}`)
}

// Função: Limpa filtros
function clearFilters() {
  selectedMachine.value = ''
  selectedStatus.value = ''
}

// Função: Retorna label do status
function getStatusLabel(status) {
  const labels = {
    'pendente': 'Pendente',
    'em_andamento': 'Em Andamento',
    'concluida': 'Concluída'
  }
  return labels[status] || status
}

// Função: Retorna classe CSS do badge de status
function getStatusBadgeClass(status) {
  const classes = {
    'pendente': 'bg-yellow-100 text-yellow-800',
    'em_andamento': 'bg-blue-100 text-blue-800',
    'concluida': 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Função: Cria nova manutenção
async function handleCreateMaintenance(data) {
  try {
    await store.createMaintenance(data)
    showNewMaintenanceModal.value = false
    alert('Manutenção criada com sucesso!')
  } catch (error) {
    console.error('Erro ao criar manutenção:', error)
    alert('Erro ao criar manutenção. Tente novamente.')
  }
}
</script>