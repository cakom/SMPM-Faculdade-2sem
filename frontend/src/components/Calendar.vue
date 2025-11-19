<!-- components/Calendar.vue - Calendário interativo de manutenções -->
<!-- Exibe manutenções por dia com cores de status -->

<template>
  <div class="card">
    <!-- Cabeçalho do calendário com navegação -->
    <div class="flex items-center justify-between mb-6">
      <!-- Botão mês anterior -->
      <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Título do mês e ano -->
      <h3 class="text-xl font-semibold text-gray-900">
        {{ currentMonthYear }}
      </h3>
      
      <!-- Botão próximo mês -->
      <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    
    <!-- Grid do calendário -->
    <div class="grid grid-cols-7 gap-2">
      <!-- Cabeçalho dos dias da semana -->
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-sm font-semibold text-gray-600 py-2"
      >
        {{ day }}
      </div>
      
      <!-- Células dos dias do mês -->
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="calendar-day"
        :class="{
          'text-gray-400': !day.isCurrentMonth,
          'bg-blue-50 border-blue-500': day.isToday
        }"
        @click="selectDay(day)"
      >
        <!-- Número do dia -->
        <span class="text-sm font-medium">{{ day.date }}</span>
        
        <!-- Indicadores de manutenções -->
        <div v-if="day.maintenances.length > 0" class="mt-1 space-y-1">
          <div
            v-for="maintenance in day.maintenances.slice(0, 3)"
            :key="maintenance.id"
            class="status-indicator"
            :class="getStatusClass(maintenance.status)"
            :title="maintenance.maquina"
          >
            <span class="text-xs truncate">{{ maintenance.maquina }}</span>
          </div>
          
          <!-- Indicador de mais manutenções -->
          <div v-if="day.maintenances.length > 3" class="text-xs text-gray-500 text-center">
            +{{ day.maintenances.length - 3 }} mais
          </div>
        </div>
      </div>
    </div>
    
    <!-- Legenda de status -->
    <div class="mt-6 flex items-center justify-center space-x-6">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span class="text-sm text-gray-600">Concluída</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span class="text-sm text-gray-600">Pendente</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span class="text-sm text-gray-600">Em Andamento</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props do componente
const props = defineProps({
  maintenances: {
    type: Array,
    default: () => []
  }
})

// Emits para comunicar com componente pai
const emit = defineEmits(['day-selected'])

// Estado reativo
const currentDate = ref(new Date())

// Dias da semana
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Computed: Título do mês e ano
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  })
})

// Computed: Gera array com todos os dias visíveis no calendário
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Primeiro e último dia do mês
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Dias do mês anterior para preencher início
  const startPadding = firstDay.getDay()
  const prevMonthDays = new Date(year, month, 0).getDate()
  
  // Dias do próximo mês para preencher fim
  const endPadding = 6 - lastDay.getDay()
  
  const days = []
  
  // Adiciona dias do mês anterior
  for (let i = startPadding - 1; i >= 0; i--) {
    days.push({
      date: prevMonthDays - i,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(year, month - 1, prevMonthDays - i),
      maintenances: []
    })
  }
  
  // Adiciona dias do mês atual
  const today = new Date()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const fullDate = new Date(year, month, i)
    const isToday = 
      fullDate.getDate() === today.getDate() &&
      fullDate.getMonth() === today.getMonth() &&
      fullDate.getFullYear() === today.getFullYear()
    
    // Filtra manutenções deste dia
    const dayMaintenances = props.maintenances.filter(m => {
      const maintenanceDate = new Date(m.data)
      return maintenanceDate.getDate() === i &&
             maintenanceDate.getMonth() === month &&
             maintenanceDate.getFullYear() === year
    })
    
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday,
      fullDate,
      maintenances: dayMaintenances
    })
  }
  
  // Adiciona dias do próximo mês
  for (let i = 1; i <= endPadding; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      fullDate: new Date(year, month + 1, i),
      maintenances: []
    })
  }
  
  return days
})

// Função: Retorna classe CSS baseada no status
function getStatusClass(status) {
  const classes = {
    'concluida': 'bg-green-100 text-green-800 border-green-500',
    'pendente': 'bg-yellow-100 text-yellow-800 border-yellow-500',
    'em_andamento': 'bg-blue-100 text-blue-800 border-blue-500'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Função: Navega para mês anterior
function previousMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

// Função: Navega para próximo mês
function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

// Função: Emite evento quando dia é selecionado
function selectDay(day) {
  if (day.isCurrentMonth) {
    emit('day-selected', day)
  }
}
</script>

<style scoped>
/* Estilo das células do calendário */
.calendar-day {
  @apply min-h-24 p-2 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300;
}

/* Indicadores de status de manutenção */
.status-indicator {
  @apply px-2 py-1 rounded text-xs border-l-2 truncate;
}
</style>