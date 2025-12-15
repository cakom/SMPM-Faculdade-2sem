<template>
  <div class="maquinas-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
            <line x1="9" y1="21" x2="9" y2="9" stroke-width="2"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Máquinas</h1>
          <p class="page-subtitle">Gerencie o parque industrial</p>
        </div>
      </div>
      <button @click="mostrarFormulario = !mostrarFormulario" class="btn-add">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="5" x2="12" y2="19" stroke-width="2" stroke-linecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ mostrarFormulario ? 'Cancelar' : 'Nova Máquina' }}
      </button>
    </div>

    <!-- Alert -->
    <div v-if="alerta" :class="['alert', alerta.tipo]">
      <svg v-if="alerta.tipo === 'sucesso'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke-width="2" stroke-linecap="round"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>{{ alerta.texto }}</span>
    </div>

    <!-- Formulário -->
    <div v-if="mostrarFormulario" class="form-card">
      <div class="form-header">
        <h3 class="form-title">{{ editando ? 'Editar Máquina' : 'Nova Máquina' }}</h3>
      </div>
      
      <form @submit.prevent="salvarMaquina" class="form">
        <div class="form-row">
          <div class="input-group">
            <label class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
              </svg>
              Nome da Máquina
            </label>
            <input
              v-model="formulario.nome"
              type="text"
              placeholder="Ex: Torno CNC 01"
              class="input"
              required
            />
          </div>

          <div class="input-group">
            <label class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 7h-9M14 17H5M17 17l3-3-3-3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 7L4 4l3-3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Tipo
            </label>
            <input
              v-model="formulario.tipo"
              type="text"
              placeholder="Ex: Torno, Fresadora"
              class="input"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" stroke-width="2"/>
              </svg>
              Localização
            </label>
            <input
              v-model="formulario.local"
              type="text"
              placeholder="Ex: Galpão A - Setor 2"
              class="input"
              required
            />
          </div>

          <div class="input-group">
            <label class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
              </svg>
              Próxima Manutenção
            </label>
            <input
              v-model="formulario.proximaManutencao"
              type="date"
              class="input"
              required
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="cancelarEdicao" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-submit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="17 21 17 13 7 13 7 21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="7 3 7 8 15 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ editando ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Empty State -->
    <div v-if="!maquinas.length && !mostrarFormulario" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
          <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
          <line x1="9" y1="21" x2="9" y2="9" stroke-width="2"/>
        </svg>
      </div>
      <h3 class="empty-title">Nenhuma máquina cadastrada</h3>
      <p class="empty-text">Comece adicionando a primeira máquina do parque industrial</p>
      <button @click="mostrarFormulario = true" class="btn-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="5" x2="12" y2="19" stroke-width="2" stroke-linecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Adicionar Primeira Máquina
      </button>
    </div>

    <!-- Lista de Máquinas -->
    <div v-else class="maquinas-grid">
      <div
        v-for="maquina in maquinas"
        :key="maquina._id"
        :class="['maquina-card', getStatusClass(maquina)]"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
              <line x1="9" y1="21" x2="9" y2="9" stroke-width="2"/>
            </svg>
          </div>
          <div class="card-status">
            <span :class="['status-badge', getStatusClass(maquina)]">
              <svg viewBox="0 0 8 8" fill="currentColor">
                <circle cx="4" cy="4" r="4"/>
              </svg>
              {{ getStatusTexto(maquina) }}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <h3 class="card-title">{{ maquina.nome }}</h3>
          
          <div class="card-info">
            <div class="info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 7h-9M14 17H5M17 17l3-3-3-3M7 7L4 4l3-3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ maquina.tipo }}</span>
            </div>
            
            <div class="info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" stroke-width="2"/>
              </svg>
              <span>{{ maquina.local }}</span>
            </div>
            
            <div class="info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
              </svg>
              <span>{{ formatarData(maquina.proximaManutencao) }}</span>
            </div>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <button @click="editarMaquina(maquina)" class="btn-action btn-edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Editar
          </button>
          <button @click="deletarMaquina(maquina._id, maquina.nome)" class="btn-action btn-delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Deletar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMachineStore } from '../stores/machineStore.js'

const machineStore = useMachineStore()

const mostrarFormulario = ref(false)
const editando = ref(false)
const alerta = ref(null)

const formulario = ref({
  nome: '',
  tipo: '',
  local: '',
  proximaManutencao: ''
})

onMounted(async () => {
  try {
    await machineStore.fetchMachines()
  } catch (error) {
    console.error('Erro ao carregar máquinas:', error)
  }
})

const maquinas = computed(() => machineStore.machines)

const salvarMaquina = async () => {
  try {
    if (editando.value) {
      await machineStore.updateMachine(formulario.value._id, formulario.value)
      mostrarAlerta('Máquina atualizada com sucesso!', 'sucesso')
    } else {
      await machineStore.addMachine(formulario.value)
      mostrarAlerta('Máquina cadastrada com sucesso!', 'sucesso')
    }
    cancelarEdicao()
  } catch (erro) {
    mostrarAlerta('Erro ao salvar máquina', 'erro')
  }
}

const editarMaquina = (maquina) => {
  formulario.value = {
    _id: maquina._id,
    nome: maquina.nome,
    tipo: maquina.tipo,
    local: maquina.local,
    proximaManutencao: maquina.proximaManutencao.split('T')[0]
  }
  editando.value = true
  mostrarFormulario.value = true
}

const deletarMaquina = async (id, nome) => {
  if (confirm(`Tem certeza que deseja remover a máquina "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
    try {
      await machineStore.deleteMachine(id)
      mostrarAlerta('Máquina removida com sucesso!', 'sucesso')
    } catch (erro) {
      mostrarAlerta('Erro ao remover máquina', 'erro')
    }
  }
}

const cancelarEdicao = () => {
  formulario.value = { nome: '', tipo: '', local: '', proximaManutencao: '' }
  editando.value = false
  mostrarFormulario.value = false
}

const mostrarAlerta = (texto, tipo) => {
  alerta.value = { texto, tipo }
  setTimeout(() => alerta.value = null, 5000)
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const getStatusClass = (maquina) => {
  const dias = Math.ceil((new Date(maquina.proximaManutencao) - new Date()) / (1000 * 60 * 60 * 24))
  if (dias < 0) return 'overdue'
  if (dias <= 7) return 'urgent'
  return 'ok'
}

const getStatusTexto = (maquina) => {
  const dias = Math.ceil((new Date(maquina.proximaManutencao) - new Date()) / (1000 * 60 * 60 * 24))
  if (dias < 0) return 'Atrasada'
  if (dias <= 7) return 'Urgente'
  return 'Em dia'
}
</script>

<style scoped>
/* ============================================
   VARIÁVEIS
   ============================================ */
:root {
  --primary: #10b981;
  --secondary: #0d9488;
  --accent: #14b8a6;
  --dark: #065f46;
  --light: #d1fae5;
}

/* ============================================
   CONTAINER
   ============================================ */
.maquinas-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  padding: 2rem;
}

/* ============================================
   HEADER
   ============================================ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  animation: fadeInDown 0.6s ease-out;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.header-icon svg {
  width: 32px;
  height: 32px;
  color: white;
  stroke-width: 2;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #065f46;
  margin: 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #0d9488;
  margin: 0;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-add svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.btn-add:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
}

/* ============================================
   ALERT
   ============================================ */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  animation: slideInDown 0.4s ease-out;
}

.alert svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  stroke-width: 2;
}

.alert.sucesso {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.alert.erro {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

/* ============================================
   FORM CARD
   ============================================ */
.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.1);
  animation: slideInDown 0.4s ease-out;
}

.form-header {
  margin-bottom: 1.5rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #065f46;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #065f46;
}

.label svg {
  width: 18px;
  height: 18px;
  color: #10b981;
  stroke-width: 2;
}

.input {
  padding: 0.875rem 1.125rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  color: #065f46;
  background: white;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn-cancel {
  padding: 0.875rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  border-color: #10b981;
  color: #10b981;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-submit svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

.empty-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 24px;
  margin-bottom: 2rem;
}

.empty-icon svg {
  width: 64px;
  height: 64px;
  color: #065f46;
  stroke-width: 2;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.5rem;
}

.empty-text {
  font-size: 1.125rem;
  color: #0d9488;
  margin-bottom: 2rem;
}

.btn-empty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  color: white;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-empty svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.btn-empty:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
}

/* ============================================
   MÁQUINAS GRID
   ============================================ */
.maquinas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  animation: fadeInUp 0.6s ease-out;
}

/* ============================================
   MÁQUINA CARD
   ============================================ */
.maquina-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  border-left: 4px solid;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
}

.maquina-card.ok {
  border-color: #10b981;
}

.maquina-card.urgent {
  border-color: #f59e0b;
}

.maquina-card.overdue {
  border-color: #ef4444;
}

.maquina-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 12px;
}

.card-icon svg {
  width: 28px;
  height: 28px;
  color: #065f46;
  stroke-width: 2;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.status-badge svg {
  width: 8px;
  height: 8px;
}

.status-badge.ok {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.urgent {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.overdue {
  background: #fee2e2;
  color: #991b1b;
}

.card-body {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 1rem;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: #0d9488;
}

.info-item svg {
  width: 18px;
  height: 18px;
  color: #10b981;
  stroke-width: 2;
  flex-shrink: 0;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.btn-edit {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  transform: translateY(-2px);
}

.btn-delete {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  transform: translateY(-2px);
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .maquinas-container {
    padding: 1.5rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .maquinas-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}
</style>