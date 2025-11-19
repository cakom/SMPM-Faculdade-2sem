// ...existing code...
<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- Conteúdo principal -->
    <template v-else-if="maintenance">
      <!-- Breadcrumb e ações -->
      <div class="flex items-center justify-between">
        <nav class="flex items-center space-x-2 text-sm">
          <router-link to="/" class="text-gray-500 hover:text-gray-900">
            Dashboard
          </router-link>
          <span class="text-gray-400">/</span>
          <router-link to="/manutencoes" class="text-gray-500 hover:text-gray-900">
            Manutenções
          </router-link>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-medium">{{ maintenance.maquina }}</span>
        </nav>
        
        <div class="flex space-x-3">
          <!-- Botão voltar -->
          <button
            @click="router.back()"
            class="btn-secondary"
          >
            Voltar
          </button>
          
          <!-- Botão editar -->
          <button
            @click="showEditModal = true"
            class="btn-primary"
          >
            Editar Manutenção
          </button>
        </div>
      </div>
      
      <!-- Cabeçalho com informações principais -->
      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ maintenance.maquina }}
            </h1>
            <p class="text-gray-600 mt-2">
              Manutenção {{ maintenance.tipo }}
            </p>
          </div>
          
          <!-- Badge de status -->
          <span
            class="status-badge text-lg"
            :class="getStatusBadgeClass(maintenance.status)"
          >
            {{ getStatusLabel(maintenance.status) }}
          </span>
        </div>
        
        <!-- Grid de informações -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p class="text-sm text-gray-600">Data da Manutenção</p>
            <p class="text-lg font-semibold text-gray-900 mt-1">
              {{ formatDate(maintenance.data) }}
            </p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600">Técnico Responsável</p>
            <p class="text-lg font-semibold text-gray-900 mt-1">
              {{ maintenance.tecnico }}
            </p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600">Tipo de Manutenção</p>
            <p class="text-lg font-semibold text-gray-900 mt-1">
              {{ capitalizeFirst(maintenance.tipo) }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Grid de conteúdo -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna principal (2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Descrição -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Descrição da Manutenção
            </h2>
            <div class="prose prose-sm max-w-none">
              <p class="text-gray-700 whitespace-pre-line">
                {{ maintenance.descricao || 'Nenhuma descrição fornecida.' }}
              </p>
            </div>
          </div>
          
          <!-- Observações -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Observações
            </h2>
            <div class="prose prose-sm max-w-none">
              <p class="text-gray-700 whitespace-pre-line">
                {{ maintenance.observacoes || 'Nenhuma observação registrada.' }}
              </p>
            </div>
          </div>
          
          <!-- Timeline de histórico -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Histórico de Alterações
            </h2>
            
            <div class="space-y-4">
              <!-- Item de histórico -->
              <div
                v-for="(item, index) in timeline"
                :key="index"
                class="flex"
              >
                <!-- Linha vertical -->
                <div class="flex flex-col items-center mr-4">
                  <div
                    class="w-3 h-3 rounded-full"
                    :class="item.color"
                  ></div>
                  <div
                    v-if="index < timeline.length - 1"
                    class="w-0.5 h-full bg-gray-200 mt-1"
                  ></div>
                </div>
                
                <!-- Conteúdo -->
                <div class="flex-1 pb-8">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                    <span class="text-xs text-gray-500">{{ item.time }}</span>
                  </div>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </div>
              
              <!-- Empty state -->
              <div v-if="timeline.length === 0" class="text-center py-8 text-gray-500">
                Nenhum histórico disponível
              </div>
            </div>
          </div>
        </div>
        
        <!-- Coluna lateral (1/3) -->
        <div class="space-y-6">
          <!-- Informações da Máquina -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Informações da Máquina
            </h3>
            
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-600">Nome</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ machineDetails.nome }}
                </p>
              </div>
              
              <div>
                <p class="text-xs text-gray-600">Setor</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ machineDetails.setor }}
                </p>
              </div>
              
              <div>
                <p class="text-xs text-gray-600">Modelo</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ machineDetails.modelo }}
                </p>
              </div>
              
              <div>
                <p class="text-xs text-gray-600">Número de Série</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ machineDetails.numeroSerie }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Estatísticas -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Estatísticas
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Total de Manutenções</span>
                <span class="text-lg font-bold text-blue-600">
                  {{ machineStats.total }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Última Manutenção</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ machineStats.ultimaManutencao }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Próxima Programada</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ machineStats.proximaManutencao }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Ações rápidas -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            
            <div class="space-y-2">
              <button
                @click="handlePrintReport"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              >
                <svg class="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir Relatório
              </button>
              
              <button
                @click="handleDuplicateMaintenance"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              >
                <svg class="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicar Manutenção
              </button>
              
              <button
                @click="handleDeleteMaintenance"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
              >
                <svg class="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir Manutenção
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal: Editar Manutenção -->
      <Modal
        v-model="showEditModal"
        title="Editar Manutenção"
        size="lg"
      >
        <MaintenanceForm
          :maintenance="maintenance"
          :machines="machines"
          :loading="store.loading"
          @submit="handleUpdateMaintenance"
          @cancel="showEditModal = false"
        />
      </Modal>
      
      <!-- Modal: Confirmação de Exclusão -->
      <Modal
        v-model="showDeleteModal"
        title="Confirmar Exclusão"
        size="sm"
      >
        <div class="space-y-4">
          <p class="text-gray-700">
            Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita.
          </p>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </template>
    
    <!-- Estado: Não encontrado -->
    <div v-else class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        Manutenção não encontrada
      </h3>
      <p class="mt-2 text-sm text-gray-500">
        A manutenção solicitada não existe ou foi removida.
      </p>
      <button
        @click="router.push('/manutencoes')"
        class="mt-6 btn-primary"
      >
        Voltar para Lista
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMaintenanceStore } from '../stores/maintenanceStore'
import Modal from '../components/Modal.vue'
import MaintenanceForm from '../components/MaintenanceForm.vue'

// Router, Route e Store
const router = useRouter()
const route = useRoute()
const store = useMaintenanceStore()

// Estado reativo
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Computed: Manutenção atual
const maintenance = computed(() => {
  const id = route.params.id
  return store.maintenances.find(m => String(m.id) === String(id))
})

// Computed: Dados da store
const machines = computed(() => store.machines)
const loading = computed(() => store.loading)

// Computed: Detalhes da máquina
const machineDetails = computed(() => {
  if (!maintenance.value) return {}
  
  const machine = machines.value.find(m => m.id === maintenance.value.maquinaId)
  return machine || {
    nome: maintenance.value.maquina,
    setor: 'N/A',
    modelo: 'N/A',
    numeroSerie: 'N/A'
  }
})

// Computed: Estatísticas da máquina
const machineStats = computed(() => {
  if (!maintenance.value) return { total: 0, ultimaManutencao: 'N/A', proximaManutencao: 'Não programada' }
  
  const machineMaintenances = store.maintenances.filter(
    m => m.maquinaId === maintenance.value.maquinaId
  )
  
  const sorted = [...machineMaintenances].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  )
  
  const ultimaManutencao = sorted[0]
    ? new Date(sorted[0].data).toLocaleDateString('pt-BR')
    : 'N/A'
  
  const today = new Date()
  const proximas = machineMaintenances.filter(
    m => new Date(m.data) > today && m.status === 'pendente'
  ).sort((a, b) => new Date(a.data) - new Date(b.data))
  
  const proximaManutencao = proximas[0]
    ? new Date(proximas[0].data).toLocaleDateString('pt-BR')
    : 'Não programada'
  
  return {
    total: machineMaintenances.length,
    ultimaManutencao,
    proximaManutencao
  }
})

// Helpers (declarações de função para serem hoisted e usadas abaixo)
function getStatusBadgeClass(status) {
  switch (status) {
    case 'concluido': return 'bg-green-100 text-green-800'
    case 'pendente': return 'bg-yellow-100 text-yellow-800'
    case 'atrasado': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusLabel(status) {
  if (!status) return 'Desconhecido'
  const map = { concluido: 'Concluído', pendente: 'Pendente', atrasado: 'Atrasado' }
  return map[status] || status
}

function formatDate(d) {
  if (!d) return ''
  try { return new Date(d).toLocaleString('pt-BR') } catch { return String(d) }
}

function capitalizeFirst(s) {
  if (!s) return ''
  return String(s).charAt(0).toUpperCase() + String(s).slice(1)
}

// Computed: Timeline de histórico
const timeline = computed(() => {
  if (!maintenance.value) return []
  
  return [
    {
      title: 'Manutenção criada',
      description: `Criada por ${maintenance.value.tecnico}`,
      time: formatDate(maintenance.value.data),
      color: 'bg-blue-500'
    },
    {
      title: 'Status atualizado',
      description: `Status atual: ${getStatusLabel(maintenance.value.status)}`,
      time: formatDate(maintenance.value.data),
      color: 'bg-gray-400'
    }
  ]
})

// Lifecycle: fechar warning de import não usado e carregar dados se disponível
onMounted(() => {
  if (store.fetchMaintenances) store.fetchMaintenances()
  if (store.fetchMachines) store.fetchMachines()
})

// Handlers usados no template
function handlePrintReport() {
  window.print()
}

function handleDuplicateMaintenance() {
  router.push({ name: 'CreateMaintenance', query: { duplicateFrom: route.params.id } })
}

function handleDeleteMaintenance() {
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!maintenance.value) return
  if (store.deleteMaintenance) {
    await store.deleteMaintenance(maintenance.value.id)
  }
  router.push('/manutencoes')
}

async function handleUpdateMaintenance(updated) {
  if (store.updateMaintenance) {
    await store.updateMaintenance(updated)
  }
  showEditModal.value = false
}
</script>