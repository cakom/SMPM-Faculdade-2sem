<template>
  <div class="home-container">
    <!-- Background animado -->
    <div class="bg-circles">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" stroke-width="2"/>
            <path d="M12 1v4m0 14v4m-7.07-15.07l2.83 2.83m8.48 8.48l2.83 2.83M1 12h4m14 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="hero-title">Sistema de Manutenção Preventiva</h1>
        <p class="hero-subtitle">
          Bem-vindo, <strong>{{ userStore.userName }}</strong>! Gerencie máquinas e manutenções.
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon machines">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
            <line x1="9" y1="21" x2="9" y2="9" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ totalMaquinas }}</h3>
          <p class="stat-label">Máquinas</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon maintenances">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" stroke-width="2"/>
            <path d="M12 1v4m0 14v4" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ totalManutencoes }}</h3>
          <p class="stat-label">Manutenções</p>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon urgent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ maquinasUrgentes }}</h3>
          <p class="stat-label">Urgentes (7 dias)</p>
        </div>
      </div>

      <div class="stat-card danger">
        <div class="stat-icon overdue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke-width="2" stroke-linecap="round"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ maquinasAtrasadas }}</h3>
          <p class="stat-label">Atrasadas</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="main-grid">
      <!-- Calendário -->
      <div class="calendar-section">
        <div class="section-header">
          <div class="section-title-group">
            <div class="section-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
              </svg>
            </div>
            <h2 class="section-title">Calendário de Manutenções</h2>
          </div>
        </div>

        <!-- Navegação do Mês -->
        <div class="calendar-nav">
          <button @click="mesAnterior" class="nav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15 18 9 12 15 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h3 class="current-month">{{ mesAnoAtual }}</h3>
          <button @click="proximoMes" class="nav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button @click="irParaHoje" class="btn-hoje">Hoje</button>
        </div>

        <!-- Legenda -->
        <div class="legenda">
          <div class="legenda-item">
            <span class="legenda-cor atrasada"></span>
            <span>Atrasada</span>
          </div>
          <div class="legenda-item">
            <span class="legenda-cor urgente"></span>
            <span>Urgente</span>
          </div>
          <div class="legenda-item">
            <span class="legenda-cor agendada"></span>
            <span>Agendada</span>
          </div>
          <div class="legenda-item">
            <span class="legenda-cor hoje"></span>
            <span>Hoje</span>
          </div>
        </div>

        <!-- Calendário Grid -->
        <div class="calendar-grid">
          <!-- Header dias da semana -->
          <div class="calendar-header">
            <div class="weekday">Dom</div>
            <div class="weekday">Seg</div>
            <div class="weekday">Ter</div>
            <div class="weekday">Qua</div>
            <div class="weekday">Qui</div>
            <div class="weekday">Sex</div>
            <div class="weekday">Sáb</div>
          </div>

          <!-- Dias do mês -->
          <div class="calendar-days">
            <div
              v-for="(dia, index) in diasDoMes"
              :key="index"
              :class="[
                'calendar-day',
                { 'other-month': !dia.mesAtual },
                { 'today': dia.isHoje },
                { 'has-maintenance': dia.manutencoes.length > 0 },
                dia.status
              ]"
              @click="dia.manutencoes.length && selecionarDia(dia)"
            >
              <span class="day-number">{{ dia.numero }}</span>
              <div v-if="dia.manutencoes.length > 0" class="day-indicator">
                <span class="indicator-dot" :class="dia.status"></span>
                <span class="indicator-count">{{ dia.manutencoes.length }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalhes do dia selecionado -->
        <div v-if="diaSelecionado && diaSelecionado.manutencoes.length > 0" class="day-details">
          <div class="details-header">
            <h4>{{ formatarDataCompleta(diaSelecionado.data) }}</h4>
            <button @click="diaSelecionado = null" class="btn-close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="details-list">
            <div v-for="m in diaSelecionado.manutencoes" :key="m._id" class="detail-item">
              <div class="detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                </svg>
              </div>
              <div class="detail-content">
                <strong>{{ m.nome }}</strong>
                <span>{{ m.tipo }} - {{ m.local }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards de Navegação -->
      <div class="nav-cards">
        <router-link to="/maquinas" class="nav-card">
          <div class="card-icon machines">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
              <line x1="9" y1="21" x2="9" y2="9" stroke-width="2"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>Máquinas</h3>
            <p>Gerenciar cadastro</p>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/manutencoes" class="nav-card">
          <div class="card-icon maintenance">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" stroke-width="2"/>
              <path d="M12 1v4m0 14v4" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>Manutenções</h3>
            <p>Registrar serviços</p>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/relatorios" class="nav-card">
          <div class="card-icon reports">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="20" x2="12" y2="10" stroke-width="2" stroke-linecap="round"/>
              <line x1="18" y1="20" x2="18" y2="4" stroke-width="2" stroke-linecap="round"/>
              <line x1="6" y1="20" x2="6" y2="16" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>Relatórios</h3>
            <p>Análises e PDF</p>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </router-link>

        <router-link v-if="userStore.isAdmin" to="/usuarios" class="nav-card">
          <div class="card-icon users">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>Usuários</h3>
            <p>Gerenciar acessos</p>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Próximas Manutenções -->
    <div class="upcoming-section">
      <div class="section-header">
        <div class="section-title-group">
          <div class="section-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h2 class="section-title">Próximas Manutenções</h2>
        </div>
        <router-link to="/maquinas" class="btn-ver-todas">Ver todas</router-link>
      </div>

      <div v-if="proximasManutencoes.length > 0" class="upcoming-list">
        <div v-for="maquina in proximasManutencoes" :key="maquina._id" :class="['upcoming-item', getStatusClass(maquina)]">
          <div class="upcoming-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
            </svg>
          </div>
          <div class="upcoming-content">
            <h4>{{ maquina.nome }}</h4>
            <p>{{ maquina.tipo }} - {{ maquina.local }}</p>
          </div>
          <div class="upcoming-date">
            <span class="date-label">{{ getStatusLabel(maquina) }}</span>
            <span class="date-value">{{ formatarData(maquina.proximaManutencao) }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>Nenhuma manutenção pendente!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMachineStore } from '../stores/machineStore.js'
import { useMaintenanceStore } from '../stores/maintenanceStore.js'
import { useUserStore } from '../stores/userStore.js'

const machineStore = useMachineStore()
const maintenanceStore = useMaintenanceStore()
const userStore = useUserStore()

// Estado do calendário
const mesAtual = ref(new Date().getMonth())
const anoAtual = ref(new Date().getFullYear())
const diaSelecionado = ref(null)

// Carregar dados
onMounted(async () => {
  try {
    await machineStore.fetchMachines()
    await maintenanceStore.fetchMaintenances()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})

// Computed - Estatísticas
const totalMaquinas = computed(() => machineStore.machines.length)
const totalManutencoes = computed(() => maintenanceStore.maintenances.length)

const maquinasUrgentes = computed(() => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return machineStore.machines.filter(m => {
    const data = new Date(m.proximaManutencao)
    const dias = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24))
    return dias >= 0 && dias <= 7
  }).length
})

const maquinasAtrasadas = computed(() => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return machineStore.machines.filter(m => {
    const data = new Date(m.proximaManutencao)
    return data < hoje
  }).length
})

// Computed - Calendário
const mesAnoAtual = computed(() => {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return `${meses[mesAtual.value]} ${anoAtual.value}`
})

const diasDoMes = computed(() => {
  const dias = []
  const primeiroDia = new Date(anoAtual.value, mesAtual.value, 1)
  const ultimoDia = new Date(anoAtual.value, mesAtual.value + 1, 0)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  // Dias do mês anterior para preencher a primeira semana
  const diaSemanaInicio = primeiroDia.getDay()
  for (let i = diaSemanaInicio - 1; i >= 0; i--) {
    const data = new Date(anoAtual.value, mesAtual.value, -i)
    dias.push({
      numero: data.getDate(),
      data: data,
      mesAtual: false,
      isHoje: false,
      manutencoes: [],
      status: ''
    })
  }

  // Dias do mês atual
  for (let i = 1; i <= ultimoDia.getDate(); i++) {
    const data = new Date(anoAtual.value, mesAtual.value, i)
    data.setHours(0, 0, 0, 0)
    
    const manutencoesDoDia = machineStore.machines.filter(m => {
      const dataManut = new Date(m.proximaManutencao)
      dataManut.setHours(0, 0, 0, 0)
      return dataManut.getTime() === data.getTime()
    })

    let status = ''
    if (manutencoesDoDia.length > 0) {
      if (data < hoje) {
        status = 'atrasada'
      } else if (data.getTime() === hoje.getTime()) {
        status = 'hoje'
      } else {
        const dias = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24))
        status = dias <= 7 ? 'urgente' : 'agendada'
      }
    }

    dias.push({
      numero: i,
      data: data,
      mesAtual: true,
      isHoje: data.getTime() === hoje.getTime(),
      manutencoes: manutencoesDoDia,
      status: status
    })
  }

  // Dias do próximo mês para completar a última semana
  const diasRestantes = 42 - dias.length
  for (let i = 1; i <= diasRestantes; i++) {
    const data = new Date(anoAtual.value, mesAtual.value + 1, i)
    dias.push({
      numero: i,
      data: data,
      mesAtual: false,
      isHoje: false,
      manutencoes: [],
      status: ''
    })
  }

  return dias
})

const proximasManutencoes = computed(() => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  return [...machineStore.machines]
    .filter(m => m.proximaManutencao)
    .sort((a, b) => new Date(a.proximaManutencao) - new Date(b.proximaManutencao))
    .slice(0, 5)
})

// Métodos
const mesAnterior = () => {
  if (mesAtual.value === 0) {
    mesAtual.value = 11
    anoAtual.value--
  } else {
    mesAtual.value--
  }
  diaSelecionado.value = null
}

const proximoMes = () => {
  if (mesAtual.value === 11) {
    mesAtual.value = 0
    anoAtual.value++
  } else {
    mesAtual.value++
  }
  diaSelecionado.value = null
}

const irParaHoje = () => {
  const hoje = new Date()
  mesAtual.value = hoje.getMonth()
  anoAtual.value = hoje.getFullYear()
  diaSelecionado.value = null
}

const selecionarDia = (dia) => {
  diaSelecionado.value = dia
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const formatarDataCompleta = (data) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getStatusClass = (maquina) => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const data = new Date(maquina.proximaManutencao)
  data.setHours(0, 0, 0, 0)
  
  if (data < hoje) return 'atrasada'
  const dias = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24))
  if (dias <= 7) return 'urgente'
  return 'normal'
}

const getStatusLabel = (maquina) => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const data = new Date(maquina.proximaManutencao)
  data.setHours(0, 0, 0, 0)
  
  if (data < hoje) return 'Atrasada'
  const dias = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24))
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Amanhã'
  if (dias <= 7) return `Em ${dias} dias`
  return 'Agendada'
}
</script>

<style scoped>
/* ============================================
   CONTAINER
   ============================================ */
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* ============================================
   BACKGROUND
   ============================================ */
.bg-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  top: -150px;
  left: -150px;
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  bottom: -100px;
  right: -100px;
  animation-delay: 5s;
}

.circle-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #0d9488 0%, #065f46 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
}

/* ============================================
   HERO
   ============================================ */
.hero-section {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInDown 0.6s ease-out;
}

.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  border-radius: 24px;
  margin-bottom: 1.5rem;
  box-shadow: 0 16px 48px rgba(16, 185, 129, 0.3);
}

.hero-icon svg {
  color: white;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #065f46;
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #0d9488;
}

/* ============================================
   STATS GRID
   ============================================ */
.stats-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out 0.1s backwards;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
}

.stat-card.warning {
  border-left: 4px solid #f59e0b;
}

.stat-card.danger {
  border-left: 4px solid #ef4444;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-icon svg {
  width: 26px;
  height: 26px;
  stroke-width: 2;
}

.stat-icon.machines {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.stat-icon.maintenances {
  background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
  color: #0d9488;
}

.stat-icon.urgent {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.stat-icon.overdue {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #065f46;
  margin: 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.8125rem;
  color: #0d9488;
  margin: 0.25rem 0 0 0;
}

/* ============================================
   MAIN GRID
   ============================================ */
.main-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

/* ============================================
   CALENDAR SECTION
   ============================================ */
.calendar-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 10px;
  color: #065f46;
}

.section-icon.warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.section-icon svg {
  width: 22px;
  height: 22px;
  stroke-width: 2;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
  margin: 0;
}

.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.nav-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0fdfa;
  border: none;
  border-radius: 10px;
  color: #065f46;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #10b981;
  color: white;
}

.nav-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.current-month {
  font-size: 1.125rem;
  font-weight: 700;
  color: #065f46;
  min-width: 180px;
  text-align: center;
  margin: 0;
}

.btn-hoje {
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-hoje:hover {
  background: #059669;
}

.legenda {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #065f46;
}

.legenda-cor {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.legenda-cor.atrasada { background: #ef4444; }
.legenda-cor.urgente { background: #f59e0b; }
.legenda-cor.agendada { background: #10b981; }
.legenda-cor.hoje { background: #3b82f6; }

.calendar-grid {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f0fdfa;
}

.weekday {
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.8125rem;
  color: #065f46;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid #f3f4f6;
  cursor: default;
  transition: all 0.2s;
  position: relative;
}

.calendar-day.other-month {
  color: #d1d5db;
  background: #fafafa;
}

.calendar-day.today {
  background: #dbeafe;
}

.calendar-day.today .day-number {
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-day.has-maintenance {
  cursor: pointer;
}

.calendar-day.has-maintenance:hover {
  background: #f0fdfa;
}

.calendar-day.atrasada {
  background: #fef2f2;
}

.calendar-day.urgente {
  background: #fffbeb;
}

.calendar-day.agendada {
  background: #f0fdf4;
}

.day-number {
  font-weight: 600;
  font-size: 0.875rem;
  color: #065f46;
}

.day-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.indicator-dot.atrasada { background: #ef4444; }
.indicator-dot.urgente { background: #f59e0b; }
.indicator-dot.agendada { background: #10b981; }
.indicator-dot.hoje { background: #3b82f6; }

.indicator-count {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #6b7280;
}

.day-details {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0fdfa;
  border-radius: 12px;
  animation: fadeInUp 0.3s ease-out;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.details-header h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #065f46;
  margin: 0;
  text-transform: capitalize;
}

.btn-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #fee2e2;
  color: #ef4444;
}

.btn-close svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 10px;
}

.detail-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d1fae5;
  border-radius: 8px;
  color: #065f46;
}

.detail-icon svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.detail-content {
  display: flex;
  flex-direction: column;
}

.detail-content strong {
  font-size: 0.875rem;
  color: #065f46;
}

.detail-content span {
  font-size: 0.75rem;
  color: #0d9488;
}

/* ============================================
   NAV CARDS
   ============================================ */
.nav-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
  transition: all 0.3s ease;
}

.nav-card:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
}

.nav-card .card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.nav-card .card-icon svg {
  width: 26px;
  height: 26px;
  stroke-width: 2;
}

.nav-card .card-icon.machines {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.nav-card .card-icon.maintenance {
  background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
  color: #0d9488;
}

.nav-card .card-icon.reports {
  background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
  color: #065f46;
}

.nav-card .card-icon.users {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.nav-card .card-content {
  flex: 1;
}

.nav-card .card-content h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #065f46;
  margin: 0 0 0.25rem 0;
}

.nav-card .card-content p {
  font-size: 0.8125rem;
  color: #0d9488;
  margin: 0;
}

.nav-card .card-arrow {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0fdfa;
  border-radius: 8px;
  color: #10b981;
  transition: all 0.3s;
}

.nav-card .card-arrow svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.nav-card:hover .card-arrow {
  background: #10b981;
  color: white;
}

/* ============================================
   UPCOMING SECTION
   ============================================ */
.upcoming-section {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
  animation: fadeInUp 0.6s ease-out 0.3s backwards;
}

.btn-ver-todas {
  padding: 0.5rem 1rem;
  background: #f0fdfa;
  color: #065f46;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-ver-todas:hover {
  background: #10b981;
  color: white;
}

.upcoming-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid;
  transition: all 0.3s;
}

.upcoming-item:hover {
  transform: translateX(4px);
}

.upcoming-item.normal {
  border-color: #10b981;
}

.upcoming-item.urgente {
  border-color: #f59e0b;
  background: #fffbeb;
}

.upcoming-item.atrasada {
  border-color: #ef4444;
  background: #fef2f2;
}

.upcoming-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  color: #065f46;
}

.upcoming-icon svg {
  width: 22px;
  height: 22px;
  stroke-width: 2;
}

.upcoming-content {
  flex: 1;
  min-width: 0;
}

.upcoming-content h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #065f46;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming-content p {
  font-size: 0.8125rem;
  color: #0d9488;
  margin: 0;
}

.upcoming-date {
  text-align: right;
}

.date-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.date-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #065f46;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  stroke-width: 1.5;
}

.empty-state p {
  font-size: 0.9375rem;
  margin: 0;
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .nav-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .nav-cards {
    grid-template-columns: 1fr;
  }

  .legenda {
    gap: 0.75rem;
  }

  .legenda-item {
    font-size: 0.75rem;
  }

  .upcoming-list {
    grid-template-columns: 1fr;
  }
}
</style>