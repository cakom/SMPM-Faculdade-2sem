<template>
  <div class="relatorios-container">
    <!-- Verificação de Permissão -->
    <div v-if="!isAdmin" class="access-denied">
      <div class="denied-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h2 class="denied-title">Acesso Negado</h2>
      <p class="denied-text">Apenas administradores podem visualizar relatórios</p>
      <button @click="voltarHome" class="btn-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Voltar para Home
      </button>
    </div>

    <!-- Conteúdo para Admin -->
    <template v-else>
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="20" x2="12" y2="10" stroke-width="2" stroke-linecap="round"/>
              <line x1="18" y1="20" x2="18" y2="4" stroke-width="2" stroke-linecap="round"/>
              <line x1="6" y1="20" x2="6" y2="16" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Relatórios</h1>
            <p class="page-subtitle">Análises e indicadores</p>
          </div>
        </div>
        <button @click="gerarRelatorioPDF" class="btn-generate" :disabled="carregando">
          <svg v-if="!carregando" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7 10 12 15 17 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="32">
              <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
          {{ carregando ? 'Gerando...' : 'Gerar PDF' }}
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

      <!-- Cards de Estatísticas -->
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
            <h3 class="stat-value">{{ estatisticas.totalMaquinas }}</h3>
            <p class="stat-label">Total de Máquinas</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon maintenances">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" stroke-width="2"/>
              <path d="M12 1v6m0 6v6m5.196-14.196l-4.242 4.242M12 12l-4.242 4.242M23 12h-6m-6 0H1m14.196 5.196l-4.242-4.242M12 12l-4.242-4.242" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ estatisticas.totalManutencoes }}</h3>
            <p class="stat-label">Total de Manutenções</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon preventive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ estatisticas.preventivas }}</h3>
            <p class="stat-label">Manutenções Preventivas</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon corrective">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ estatisticas.corretivas }}</h3>
            <p class="stat-label">Manutenções Corretivas</p>
          </div>
        </div>
      </div>

      <!-- Seções de Relatórios -->
      <div class="reports-sections">
        <!-- Máquinas Próximas da Manutenção -->
        <div class="report-card">
          <div class="report-header">
            <div class="report-title-group">
              <div class="report-icon urgent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="report-title">Manutenções Urgentes</h2>
            </div>
            <span class="report-badge">{{ maquinasUrgentes.length }} máquinas</span>
          </div>
          
          <div v-if="maquinasUrgentes.length" class="report-content">
            <div v-for="maquina in maquinasUrgentes" :key="maquina._id" class="report-item urgent">
              <div class="item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                  <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
                </svg>
              </div>
              <div class="item-content">
                <h4 class="item-title">{{ maquina.nome }}</h4>
                <div class="item-details">
                  <span class="item-detail">{{ maquina.tipo }}</span>
                  <span class="item-detail">{{ maquina.local }}</span>
                </div>
              </div>
              <div class="item-date urgent">
                {{ formatarData(maquina.proximaManutencao) }}
              </div>
            </div>
          </div>
          <div v-else class="report-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Nenhuma manutenção urgente</p>
          </div>
        </div>

        <!-- Últimas Manutenções -->
        <div class="report-card">
          <div class="report-header">
            <div class="report-title-group">
              <div class="report-icon history">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                  <polyline points="12 6 12 12 16 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h2 class="report-title">Últimas Manutenções</h2>
            </div>
            <span class="report-badge">{{ ultimasManutencoes.length }} registros</span>
          </div>
          
          <div v-if="ultimasManutencoes.length" class="report-content">
            <div v-for="manutencao in ultimasManutencoes" :key="manutencao._id" :class="['report-item', getTipoClass(manutencao.tipo)]">
              <div class="item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" stroke-width="2"/>
                  <path d="M12 1v6m0 6v6" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="item-content">
                <h4 class="item-title">{{ getNomeMaquina(manutencao.maquina) }}</h4>
                <div class="item-details">
                  <span class="item-detail">{{ manutencao.tipo }}</span>
                  <span class="item-detail">{{ manutencao.tecnico }}</span>
                </div>
              </div>
              <div :class="['item-date', getTipoClass(manutencao.tipo)]">
                {{ formatarData(manutencao.data) }}
              </div>
            </div>
          </div>
          <div v-else class="report-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" stroke-width="2"/>
              <path d="M12 1v6m0 6v6" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>Nenhuma manutenção registrada</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenanceStore } from '../stores/maintenanceStore.js'
import { useMachineStore } from '../stores/machineStore.js'
import { useUserStore } from '../stores/userStore.js'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const router = useRouter()
const maintenanceStore = useMaintenanceStore()
const machineStore = useMachineStore()
const userStore = useUserStore()

const carregando = ref(false)
const alerta = ref(null)

const isAdmin = computed(() => {
  return userStore.isAdmin
})

onMounted(async () => {
  if (!isAdmin.value) {
    return
  }
  
  try {
    await maintenanceStore.fetchMaintenances()
    await machineStore.fetchMachines()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})

const maquinas = computed(() => machineStore.machines)
const manutencoes = computed(() => maintenanceStore.maintenances)

const estatisticas = computed(() => ({
  totalMaquinas: maquinas.value.length,
  totalManutencoes: manutencoes.value.length,
  preventivas: manutencoes.value.filter(m => m.tipo === 'Preventiva').length,
  corretivas: manutencoes.value.filter(m => m.tipo === 'Corretiva').length
}))

const maquinasUrgentes = computed(() => {
  const hoje = new Date()
  return maquinas.value
    .filter(m => {
      const dias = Math.ceil((new Date(m.proximaManutencao) - hoje) / (1000 * 60 * 60 * 24))
      return dias <= 7 && dias >= 0
    })
    .sort((a, b) => new Date(a.proximaManutencao) - new Date(b.proximaManutencao))
})

const ultimasManutencoes = computed(() => {
  return [...manutencoes.value]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 10)
})

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const getNomeMaquina = (idMaquina) => {
  const maquina = maquinas.value.find(m => m._id === idMaquina)
  return maquina ? maquina.nome : 'Máquina não encontrada'
}

const getTipoClass = (tipo) => {
  const classes = {
    'Preventiva': 'preventiva',
    'Corretiva': 'corretiva',
    'Preditiva': 'preditiva'
  }
  return classes[tipo] || 'preventiva'
}

const voltarHome = () => {
  router.push('/')
}

const mostrarAlerta = (texto, tipo) => {
  alerta.value = { texto, tipo }
  setTimeout(() => alerta.value = null, 5000)
}

const gerarRelatorioPDF = () => {
  carregando.value = true
  
  try {
    const doc = new jsPDF()
    
    const primaryColor = [16, 185, 129]
    const secondaryColor = [13, 148, 136]
    const darkColor = [6, 95, 70]
    const lightGray = [243, 244, 246]
    
    let yPos = 20
    
    // Cabeçalho
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('SMPM - Relatório Gerencial', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 105, 30, { align: 'center' })
    
    yPos = 50
    
    // Estatísticas
    doc.setTextColor(...darkColor)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Estatísticas Gerais', 14, yPos)
    yPos += 10
    
    const stats = [
      { label: 'Total de Máquinas', value: estatisticas.value.totalMaquinas, color: primaryColor },
      { label: 'Total de Manutenções', value: estatisticas.value.totalManutencoes, color: secondaryColor },
      { label: 'Preventivas', value: estatisticas.value.preventivas, color: [34, 197, 94] },
      { label: 'Corretivas', value: estatisticas.value.corretivas, color: [245, 158, 11] }
    ]
    
    stats.forEach((stat, index) => {
      const xPos = 14 + (index * 47)
      doc.setFillColor(...lightGray)
      doc.roundedRect(xPos, yPos, 42, 25, 3, 3, 'F')
      doc.setTextColor(...stat.color)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text(String(stat.value), xPos + 21, yPos + 12, { align: 'center' })
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(stat.label, xPos + 21, yPos + 20, { align: 'center' })
    })
    
    yPos += 35
    
    // Manutenções Urgentes
    doc.setTextColor(...darkColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Manutenções Urgentes (Próximos 7 dias)', 14, yPos)
    yPos += 7
    
    if (maquinasUrgentes.value.length) {
      const urgentesData = maquinasUrgentes.value.map(m => [
        m.nome,
        m.tipo,
        m.local,
        formatarData(m.proximaManutencao)
      ])
      
      doc.autoTable({
        startY: yPos,
        head: [['Máquina', 'Tipo', 'Localização', 'Data']],
        body: urgentesData,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: darkColor
        },
        alternateRowStyles: {
          fillColor: [240, 253, 250]
        },
        margin: { left: 14, right: 14 }
      })
      
      yPos = doc.lastAutoTable.finalY + 10
    } else {
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.text('Nenhuma manutenção urgente no momento', 14, yPos + 5)
      yPos += 15
    }
    
    // Últimas Manutenções
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setTextColor(...darkColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Últimas 10 Manutenções Realizadas', 14, yPos)
    yPos += 7
    
    if (ultimasManutencoes.value.length) {
      const manutencoesData = ultimasManutencoes.value.map(m => [
        getNomeMaquina(m.maquina),
        m.tipo,
        m.tecnico,
        formatarData(m.data),
        m.descricao ? m.descricao.substring(0, 50) + (m.descricao.length > 50 ? '...' : '') : '-'
      ])
      
      doc.autoTable({
        startY: yPos,
        head: [['Máquina', 'Tipo', 'Técnico', 'Data', 'Descrição']],
        body: manutencoesData,
        theme: 'striped',
        headStyles: {
          fillColor: secondaryColor,
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: darkColor
        },
        alternateRowStyles: {
          fillColor: [204, 251, 241]
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 22 },
          4: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      })
    }
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFillColor(...primaryColor)
      doc.rect(0, 287, 210, 10, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `SMPM © ${new Date().getFullYear()} | Página ${i} de ${pageCount}`,
        105,
        293,
        { align: 'center' }
      )
    }
    
    doc.save(`relatorio-smpm-${new Date().toISOString().split('T')[0]}.pdf`)
    mostrarAlerta('PDF gerado com sucesso!', 'sucesso')
  } catch (erro) {
    console.error('Erro ao gerar PDF:', erro)
    mostrarAlerta('Erro ao gerar PDF', 'erro')
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.relatorios-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  padding: 2rem;
}

/* Access Denied */
.access-denied {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.denied-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 24px;
  margin-bottom: 2rem;
}

.denied-icon svg {
  width: 64px;
  height: 64px;
  color: #991b1b;
  stroke-width: 2;
}

.denied-title {
  font-size: 2rem;
  font-weight: 800;
  color: #991b1b;
  margin-bottom: 0.5rem;
}

.denied-text {
  font-size: 1.125rem;
  color: #dc2626;
  margin-bottom: 2rem;
}

.btn-back {
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

.btn-back svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.btn-back:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
}

/* Header */
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

.btn-generate {
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

.btn-generate svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
}

.btn-generate:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alert */
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

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
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

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
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

.stat-icon.preventive {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.stat-icon.corrective {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #065f46;
  margin: 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #0d9488;
  margin: 0.25rem 0 0 0;
}

/* Reports Sections */
.reports-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

.report-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.report-title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.report-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.report-icon svg {
  width: 22px;
  height: 22px;
  stroke-width: 2;
}

.report-icon.urgent {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.report-icon.history {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.report-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
  margin: 0;
}

.report-badge {
  padding: 0.375rem 0.75rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.report-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 3px solid;
  transition: all 0.3s ease;
}

.report-item:hover {
  transform: translateX(4px);
}

.report-item.urgent {
  border-color: #f59e0b;
}

.report-item.preventiva {
  border-color: #10b981;
}

.report-item.corretiva {
  border-color: #f59e0b;
}

.report-item.preditiva {
  border-color: #3b82f6;
}

.item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  flex-shrink: 0;
}

.item-icon svg {
  width: 22px;
  height: 22px;
  color: #065f46;
  stroke-width: 2;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #065f46;
  margin: 0 0 0.25rem 0;
}

.item-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.item-detail {
  font-size: 0.8125rem;
  color: #0d9488;
}

.item-date {
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  flex-shrink: 0;
}

.item-date.urgent {
  background: #fef3c7;
  color: #92400e;
}

.item-date.preventiva {
  background: #d1fae5;
  color: #065f46;
}

.item-date.corretiva {
  background: #fef3c7;
  color: #92400e;
}

.item-date.preditiva {
  background: #dbeafe;
  color: #1e40af;
}

.report-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: #9ca3af;
}

.report-empty svg {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  stroke-width: 1.5;
}

.report-empty p {
  margin: 0;
  font-size: 0.9375rem;
}

/* Animations */
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

/* Responsive */
@media (max-width: 768px) {
  .relatorios-container {
    padding: 1.5rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-generate {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .reports-sections {
    grid-template-columns: 1fr;
  }

  .report-item {
    flex-wrap: wrap;
  }

  .item-date {
    width: 100%;
    text-align: center;
    margin-top: 0.5rem;
  }
}
</style>