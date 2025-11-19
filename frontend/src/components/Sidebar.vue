<!-- components/Sidebar.vue - Barra lateral de navegação -->
<!-- Fixa à esquerda com links para todas as páginas -->

<template>
  <aside class="w-64 bg-gray-900 text-white flex flex-col">
    <!-- Logo e título do sistema -->
    <div class="p-6 border-b border-gray-700">
      <h1 class="text-2xl font-bold">SMPM</h1>
      <p class="text-sm text-gray-400 mt-1">Sistema de Manutenção</p>
    </div>
    
    <!-- Menu de navegação -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <!-- Link para Dashboard -->
        <li>
          <router-link
            to="/"
            class="nav-link"
            active-class="bg-blue-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </router-link>
        </li>
        
        <!-- Link para Calendário -->
        <li>
          <router-link
            to="/calendario"
            class="nav-link"
            active-class="bg-blue-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Calendário</span>
          </router-link>
        </li>
        
        <!-- Link para Lista de Manutenções -->
        <li>
          <router-link
            to="/manutencoes"
            class="nav-link"
            active-class="bg-blue-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Manutenções</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <!-- Rodapé da sidebar -->
    <div class="p-4 border-t border-gray-700">
      <p class="text-xs text-gray-400">© 2024 SMPM v1.0</p>
    </div>
  </aside>
</template>

<style scoped>
/* Estilo dos links de navegação */
.nav-link {
  @apply flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-800;
}
</style>