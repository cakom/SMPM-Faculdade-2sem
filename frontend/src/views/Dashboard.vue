<!-- views/Dashboard.vue - Página principal do sistema -->
<!-- Exibe indicadores, gráficos e informações resumidas -->

<template>
  <div class="space-y-6">
    <!-- Cabeçalho com título e ações -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">Visão geral das manutenções</p>
      </div>
      
      <button @click="showNewMaintenanceModal = true" class="btn-primary">
        + Nova Manutenção
      </button>
    </div>
    
    <!-- Grid de KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- KPI: Total de Manutenções -->
      <KpiCard
        title="Total de Manutenções"
        :value="stats.total"
        color="blue"
      >
        <template #icon>
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </template>
      </KpiCard>
      
      <!-- KPI: Concluídas -->
      <KpiCard
        title="Concluídas"
        :value="stats.concluidas"
        :change="calculatePercentage(stats.concluidas, stats.total)"
        color="green"
      >
        <template #icon>
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      
      <!-- KPI: Pendentes -->
      <KpiCard
        title="Pendentes"
        :value="stats.pendentes"
        :change="calculatePercentage(stats.pendentes, stats.total)"
        color="yellow"
      >
        <template #icon>
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      
      <!-- KPI: Em Andamento -->
      <KpiCard
        title="Em Andamento"
        :value="stats.emAndamento"
        :change="calculatePercentage(stats.emAndamento, stats.total)"
        color="blue"
      >
        <template #icon>
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </template>
      </KpiCard>
    </div>
    
    <!-- Seção: Calendário e Manutenções Recentes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Calendário -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Calendário</h2>
        <Calendar
          :maintenances="maintenances"
          @day-selected="handleDaySelected"
        />
      </div>
      
      <!-- Manutenções Recentes -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Manutenções Recentes</h2>
        <div class="card space-y-4">
          <!-- Loading state -->
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          
          <!-- Lista de manutenções recentes -->
          <div
            v-else
            v-for="maintenance in recentMaintenances"
            :key="maintenance.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="viewMaintenanceDetails(maintenance)"
          >
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ maintenance.maquina }}</h4>
              <p class="text-sm text-gray-600">{{ maintenance.tipo }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(maintenance.data) }} • {{ maintenance.tecnico }}
              </p>
            </div>
            
            <span class="status-badge" :class="getStatusBadgeClass(maintenance.status)">
              {{ getStatusLabel(maintenance.status) }}
            </span>
          </div>
          
          <!-- Empty state -->
          <div v-if="!loading && recentMaintenances.length === 0" class="text-center py-8 text-gray-500">
            Nenhuma manutenção recente
          </div>
        </div>
      </div>
    </div>
    
    <!-- Seção: Alertas e Prioridades -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Alertas e Prioridades</h2>
      
      <div class="space-y-3">
        <!-- Alerta de manutenções atrasadas -->
        <div
          v-if="overdueMaintenances.length > 0"
          class="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <svg class="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 class="font-semibold text-red-900">Manutenções Atrasadas</h4>
            <p class="text-sm text-red-700 mt-1">
              Você tem {{ overdueMaintenances.length }} manutenção(ões) atrasada(s)
            </p>
          </div>
        </div>
        
        <!-- Alerta de manutenções próximas -->
        <div
          v-if="upcomingMaintenances.length > 0"
          class="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <svg class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 class="font-semibold text-yellow-900">Manutenções Próximas</h4>
            <p class="text-sm text-yellow-700 mt-1">
              {{ upcomingMaintenances.length }} manutenção(ões) programada(s) para os próximos 7 dias
            </p>
          </div>
        </div>
        
        <!-- Estado sem alertas -->
        <div
          v-if="overdueMaintenances.length === 0 && upcomingMaintenances.length === 0"
          class="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 class="font-semibold text-green-900">Tudo em Dia</h4>
            <p class="text-sm text-green-700 mt-1">
              Não há alertas no momento. Continue o bom trabalho!
            </p>
          </div>
        </div>
      </div>
    </div>
    
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
import KpiCard from '../components/KpiCard.vue'
import Calendar from '../components/Calendar.vue'
import Modal from '../components/Modal.vue'
import MaintenanceForm from '../components/MaintenanceForm.vue'

// Router e Store
const router = useRouter()
const store = useMaintenanceStore()

// Estado reativo
const showNewMaintenanceModal = ref(false)

// Computed: Dados da store
const maintenances = computed(() => store.maintenances)
const machines = computed(() => store.machines)
const loading = computed(() => store.loading)
const stats = computed(() => store.stats)

// Computed: Manutenções recentes (últimas 5)
const recentMaintenances = computed(() => {
  return [...maintenances.value]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5)
})

// Computed: Manutenções atrasadas
const overdueMaintenances = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return maintenances.value.filter(m => {
    const maintenanceDate = new Date(m.data)
    maintenanceDate.setHours(0, 0, 0, 0)
    return maintenanceDate < today && m.status !== 'concluida'
  })
})

// Computed: Manutenções próximas (próximos 7 dias)
const upcomingMaintenances = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(23, 59, 59, 999)
  
  return maintenances.value.filter(m => {
    const maintenanceDate = new Date(m.data)
    return maintenanceDate >= today && maintenanceDate <= nextWeek && m.status === 'pendente'
  })
})

// Lifecycle: Carrega dados ao montar
onMounted(async () => {
  await store.fetchMaintenances()
  await store.fetchMachines()
})

// Função: Calcula porcentagem
function calculatePercentage(value, total) {
  if (total === 0) return '0%'
  const percentage = ((value / total) * 100).toFixed(1)
  return `${percentage}%`
}

// Função: Formata data
function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
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

// Função: Navega para detalhes da manutenção
function viewMaintenanceDetails(maintenance) {
  router.push(`/manutencoes/${maintenance.id}`)
}

// Função: Manipula seleção de dia no calendário
function handleDaySelected(day) {
  if (day.maintenances.length > 0) {
    // Navega para a lista filtrada por essa data
    router.push({
      name: 'MaintenanceList',
      query: { date: day.fullDate.toISOString().split('T')[0] }
    })
  }
}

// Função: Cria nova manutenção
async function handleCreateMaintenance(data) {
  try {
    await store.createMaintenance(data)
    showNewMaintenanceModal.value = false
    // Mostra notificação de sucesso (implementar toast notification)
    alert('Manutenção criada com sucesso!')
  } catch (error) {
    console.error('Erro ao criar manutenção:', error)
    alert('Erro ao criar manutenção. Tente novamente.')
  }
}
</script>
