<!-- components/KpiCard.vue - Card reutilizável para exibir KPIs -->
<!-- Mostra título, valor e ícone com cores personalizáveis -->

<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <!-- Conteúdo textual do KPI -->
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ value }}</p>
        
        <!-- Indicador de variação (opcional) -->
        <p v-if="change" class="text-sm mt-2" :class="changeClass">
          {{ change }}
        </p>
      </div>
      
      <!-- Ícone do KPI -->
      <div class="p-4 rounded-full" :class="iconBgClass">
        <slot name="icon">
          <svg class="w-8 h-8" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props do componente
const props = defineProps({
  title: String, // Título do KPI
  value: [String, Number], // Valor principal
  change: String, // Texto de variação (ex: "+5% este mês")
  color: {
    type: String,
    default: 'blue' // Cor padrão: blue, green, yellow, red
  }
})

// Computed: Classes CSS baseadas na cor
const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100'
  }
  return colors[props.color] || colors.blue
})

const iconClass = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  }
  return colors[props.color] || colors.blue
})

const changeClass = computed(() => {
  if (!props.change) return ''
  return props.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
})
</script>
