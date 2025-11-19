<!-- components/MaintenanceTable.vue - Tabela filtrável de manutenções -->
<!-- Exibe lista completa com paginação e ordenação -->

<template>
  <div class="card">
    <!-- Barra de filtros e busca -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <!-- Campo de busca -->
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por máquina ou descrição..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <!-- Filtro por status -->
      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos os status</option>
        <option value="pendente">Pendente</option>
        <option value="em_andamento">Em Andamento</option>
        <option value="concluida">Concluída</option>
      </select>
      
      <!-- Botão para nova manutenção -->
      <button @click="$emit('new-maintenance')" class="btn-primary whitespace-nowrap">
        + Nova Manutenção
      </button>
    </div>
    
    <!-- Tabela responsiva -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Cabeçalho da tabela -->
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              @click="sortBy(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <!-- Ícone de ordenação -->
                <svg v-if="sortColumn === column.key" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"
                  />
                </svg>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        
        <!-- Corpo da tabela -->
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading state -->
          <tr v-if="loading">
            <td :colspan="columns.length + 1" class="px-6 py-12 text-center text-gray-500">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3">Carregando...</span>
              </div>
            </td>
          </tr>
          
          <!-- Empty state -->
          <tr v-else-if="filteredMaintenances.length === 0">
            <td :colspan="columns.length + 1" class="px-6 py-12 text-center text-gray-500">
              Nenhuma manutenção encontrada
            </td>
          </tr>
          
          <!-- Linhas de dados -->
          <tr
            v-else
            v-for="maintenance in paginatedMaintenances"
            :key="maintenance.id"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            @click="$emit('view-details', maintenance)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ maintenance.maquina }}
              </div>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ maintenance.tipo }}</div>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ formatDate(maintenance.data) }}
              </div>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="status-badge" :class="getStatusBadgeClass(maintenance.status)">
                {{ getStatusLabel(maintenance.status) }}
              </span>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ maintenance.tecnico }}</div>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click.stop="$emit('edit', maintenance)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                Editar
              </button>
              <button
                @click.stop="$emit('view-details', maintenance)"
                class="text-gray-600 hover:text-gray-900"
              >
                Ver Detalhes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Paginação -->
    <div class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ filteredMaintenances.length }} registros
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Anterior
        </button>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          class="px-4 py-2 border rounded-lg"
          :class="currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'"
        >
          {{ page }}
        </button>
        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Próximo
        </button>
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
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['new-maintenance', 'edit', 'view-details'])

// Estado reativo
const searchQuery = ref('')
const statusFilter = ref('')
const sortColumn = ref('data')
const sortDirection = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 10

// Definição das colunas
const columns = [
  { key: 'maquina', label: 'Máquina' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'data', label: 'Data' },
  { key: 'status', label: 'Status' },
  { key: 'tecnico', label: 'Técnico' }
]

// Computed: Manutenções filtradas
const filteredMaintenances = computed(() => {
  let result = [...props.maintenances]
  
  // Filtro por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.maquina.toLowerCase().includes(query) ||
      m.descricao?.toLowerCase().includes(query)
    )
  }
  
  // Filtro por status
  if (statusFilter.value) {
    result = result.filter(m => m.status === statusFilter.value)
  }
  
  // Ordenação
  result.sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]
    
    // Tratamento especial para datas
    if (sortColumn.value === 'data') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  
  return result
})

// Computed: Total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredMaintenances.value.length / itemsPerPage)
})

// Computed: Índices de início e fim
const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, filteredMaintenances.value.length)
})

// Computed: Manutenções da página atual
const paginatedMaintenances = computed(() => {
  return filteredMaintenances.value.slice(startIndex.value, endIndex.value)
})

// Computed: Páginas visíveis na paginação
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Função: Ordena por coluna
function sortBy(column) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

// Função: Navega para página anterior
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Função: Navega para próxima página
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Função: Formata data
function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR')
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
</script>