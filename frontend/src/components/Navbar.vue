<!-- components/Navbar.vue - Barra superior com título e ações -->

<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Título da página atual -->
      <h2 class="text-2xl font-semibold text-gray-800">
        {{ pageTitle }}
      </h2>
      
      <!-- Ações do usuário -->
      <div class="flex items-center space-x-4">
        <!-- Botão de notificações -->
        <button class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <!-- Badge de notificações -->
          <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <!-- Informações do usuário -->
        <div class="flex items-center space-x-3">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">Admin</p>
            <p class="text-xs text-gray-500">Gestor</p>
          </div>
          <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white font-semibold">A</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Computed: Define título baseado na rota atual
const pageTitle = computed(() => {
  const titles = {
    'Dashboard': 'Dashboard',
    'Calendar': 'Calendário de Manutenções',
    'MaintenanceList': 'Lista de Manutenções',
    'MaintenanceDetails': 'Detalhes da Manutenção'
  }
  return titles[route.name] || 'SMPM'
})
</script>