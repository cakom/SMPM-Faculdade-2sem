<template>
  <div class="relatorios-page">
    
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📊</span>
          Relatórios e Estatísticas
        </h1>
        <p class="page-subtitle">Visualize dados sobre máquinas e manutenções</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="loading-card">
      <div class="spinner"></div>
      <p>⏳ Carregando dados...</p>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="alert alert-error">
      <span class="alert-icon">⚠️</span>
      {{ erro }}
    </div>

    <!-- Cards de Estatísticas -->
    <div v-if="!carregando" class="stats-grid">
      
      <div class="stat-card stat-blue">
        <div class="stat-icon">🏭</div>
        <div class="stat-content">
          <h3>{{ machineStore.totalMachines }}</h3>
          <p>Máquinas Cadastradas</p>
        </div>
      </div>

      <div class="stat-card stat-green">
        <div class="stat-icon">🔧</div>
        <div class="stat-content">
          <h3>{{ maintenanceStore.totalMaintenances }}</h3>
          <p>Manutenções Realizadas</p>
        </div>
      </div>

      <div class="stat-card stat-purple">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>{{ mediaPorMaquina }}</h3>
          <p>Média de Manutenções/Máquina</p>
        </div>
      </div>

      <div class="stat-card stat-red">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <h3>{{ machineStore.overdueMachines.length }}</h3>
          <p>Manutenções Atrasadas</p>
        </div>
      </div>

    </div>

    <!-- Gráfico de Manutenções por Tipo -->
    <div v-if="!carregando && Object.keys(maintenanceStore.countByType).length > 0" class="chart-card">
      <h3>📊 Manutenções por Tipo</h3>
      
      <div class="chart-container">
        <div 
          v-for="(count, tipo) in maintenanceStore.countByType" 
          :key="tipo"
          class="chart-bar"
        >
          <div class="bar-label">{{ tipo }}</div>
          <div class="bar-container">
            <div 
              class="bar-fill" 
              :style="{ 
                width: (count / maxManutencoes * 100) + '%',
                backgroundColor: getCorTipo(tipo)
              }"
            >
              <span class="bar-value">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-legend">
        <div class="legend-item">
          <span class="legend-color" style="background: #10b981;"></span>
          <span>Preventiva</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #ef4444;"></span>
          <span>Corretiva</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #3b82f6;"></span>
          <span>Preditiva</span>
        </div>
      </div>
    </div>

    <!-- Manutenções Recentes -->
    <div v-if="!carregando && maintenanceStore.recentMaintenances.length > 0" class="recent-card">
      <h3>🕒 Manutenções Recentes (Últimos 30 dias)</h3>
      <p class="recent-subtitle">
        Total: {{ maintenanceStore.recentMaintenances.length }} manutenções
      </p>
      
      <div class="recent-list">
        <div 
          v-for="manutencao in maintenanceStore.recentMaintenances.slice(0, 5)" 
          :key="manutencao._id"
          class="recent-item"
        >
          <span class="recent-date">{{ formatarData(manutencao.data) }}</span>
          <span class="recent-machine">{{ manutencao.maquina }}</span>
          <span :class="'badge badge-' + manutencao.tipo.toLowerCase()">
            {{ manutencao.tipo }}
          </span>
        </div>
      </div>
    </div>

    <!-- Máquinas Atrasadas -->
    <div v-if="!carregando && machineStore.overdueMachines.length > 0" class="overdue-card">
      <h3>⚠️ Atenção: Manutenções Atrasadas</h3>
      <div class="overdue-list">
        <div 
          v-for="maquina in machineStore.overdueMachines" 
          :key="maquina._id"
          class="overdue-item"
        >
          <span class="overdue-icon">🔴</span>
          <div class="overdue-info">
            <strong>{{ maquina.nome }}</strong>
            <p>Manutenção prevista: {{ formatarData(maquina.proximaManutencao) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botão Exportar -->
    <div class="export-card">
      <div class="export-content">
        <div class="export-icon">📄</div>
        <div class="export-info">
          <h3>Gerar Relatório em PDF</h3>
          <p>Baixe um relatório completo e profissional</p>
        </div>
      </div>
      <button @click="gerarPDF" class="btn-export" :disabled="gerandoPDF">
        <span v-if="!gerandoPDF">📥 Baixar PDF</span>
        <span v-else>⏳ Gerando...</span>
      </button>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useMachineStore } from '../stores/machineStore';
import { useMaintenanceStore } from '../stores/maintenanceStore';
import jsPDF from 'jspdf';

export default {
  name: 'Relatorios',
  
  setup() {
    const machineStore = useMachineStore();
    const maintenanceStore = useMaintenanceStore();
    const carregando = ref(false);
    const erro = ref('');
    const gerandoPDF = ref(false);

    const mediaPorMaquina = computed(() => {
      if (machineStore.totalMachines === 0) return '0';
      const media = maintenanceStore.totalMaintenances / machineStore.totalMachines;
      return media.toFixed(1);
    });

    const maxManutencoes = computed(() => {
      const valores = Object.values(maintenanceStore.countByType);
      if (valores.length === 0) return 1;
      return Math.max(...valores);
    });

    const carregarDados = async () => {
      carregando.value = true;
      erro.value = '';
      
      try {
        if (machineStore.machines.length === 0) {
          await machineStore.fetchMachines();
        }
        if (maintenanceStore.maintenances.length === 0) {
          await maintenanceStore.fetchMaintenances();
        }
      } catch (error) {
        erro.value = 'Erro ao carregar dados: ' + error.message;
      } finally {
        carregando.value = false;
      }
    };

    const getCorTipo = (tipo) => {
      const cores = {
        'Preventiva': '#10b981',
        'Corretiva': '#ef4444',
        'Preditiva': '#3b82f6'
      };
      return cores[tipo] || '#9ca3af';
    };

    const formatarData = (data) => {
      if (!data) return '';
      return new Date(data).toLocaleDateString('pt-BR');
    };

    const gerarPDF = async () => {
      if (!confirm('📥 Gerar relatório em PDF?\n\nO arquivo será baixado automaticamente.')) {
        return;
      }

      gerandoPDF.value = true;

      try {
        const doc = new jsPDF();
        let yPos = 20;

        // ========================================
        // CABEÇALHO
        // ========================================
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('RELATÓRIO DE MANUTENÇÃO', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Data: ${new Date().toLocaleString('pt-BR')}`, 105, 30, { align: 'center' });

        yPos = 55;

        // ========================================
        // RESUMO GERAL
        // ========================================
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('RESUMO GERAL', 14, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        // Box do resumo
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(14, yPos, 182, 30, 3, 3, 'F');
        
        yPos += 8;
        doc.text(`Máquinas Cadastradas: ${machineStore.totalMachines}`, 20, yPos);
        yPos += 7;
        doc.text(`Manutenções Realizadas: ${maintenanceStore.totalMaintenances}`, 20, yPos);
        yPos += 7;
        doc.text(`Média por Máquina: ${mediaPorMaquina.value}`, 20, yPos);
        yPos += 7;
        doc.setTextColor(239, 68, 68);
        doc.setFont(undefined, 'bold');
        doc.text(`Manutenções Atrasadas: ${machineStore.overdueMachines.length}`, 20, yPos);

        yPos += 15;

        // ========================================
        // MANUTENÇÕES POR TIPO
        // ========================================
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('MANUTENÇÕES POR TIPO', 14, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        Object.entries(maintenanceStore.countByType).forEach(([tipo, count]) => {
          const porcentagem = ((count / maintenanceStore.totalMaintenances) * 100).toFixed(1);
          
          // Cor de fundo conforme tipo
          if (tipo === 'Preventiva') {
            doc.setFillColor(209, 250, 229);
            doc.setTextColor(6, 95, 70);
          } else if (tipo === 'Corretiva') {
            doc.setFillColor(254, 226, 226);
            doc.setTextColor(153, 27, 27);
          } else if (tipo === 'Preditiva') {
            doc.setFillColor(219, 234, 254);
            doc.setTextColor(30, 64, 175);
          }

          doc.roundedRect(14, yPos - 5, 60, 8, 2, 2, 'F');
          doc.setFont(undefined, 'bold');
          doc.text(tipo, 16, yPos);
          
          doc.setTextColor(0, 0, 0);
          doc.setFont(undefined, 'normal');
          doc.text(`${count} (${porcentagem}%)`, 80, yPos);
          
          yPos += 10;
        });

        yPos += 5;

        // ========================================
        // MÁQUINAS ATRASADAS
        // ========================================
        if (machineStore.overdueMachines.length > 0) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setTextColor(0, 0, 0);
          doc.setFontSize(16);
          doc.setFont(undefined, 'bold');
          doc.text('ATENÇÃO: MANUTENÇÕES ATRASADAS', 14, yPos);
          
          yPos += 10;
          doc.setFontSize(10);

          machineStore.overdueMachines.forEach((maquina, index) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }

            doc.setFillColor(254, 226, 226);
            doc.roundedRect(14, yPos - 5, 182, 12, 2, 2, 'F');
            
            doc.setTextColor(153, 27, 27);
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${maquina.nome}`, 20, yPos);
            
            yPos += 5;
            doc.setFont(undefined, 'normal');
            doc.text(`Prevista: ${formatarData(maquina.proximaManutencao)}`, 25, yPos);
            
            yPos += 10;
          });

          yPos += 5;
        }

        // ========================================
        // MANUTENÇÕES RECENTES
        // ========================================
        if (maintenanceStore.recentMaintenances.length > 0) {
          if (yPos > 230) {
            doc.addPage();
            yPos = 20;
          }

          doc.setTextColor(0, 0, 0);
          doc.setFontSize(16);
          doc.setFont(undefined, 'bold');
          doc.text('MANUTENÇÕES RECENTES (30 DIAS)', 14, yPos);
          
          yPos += 10;
          doc.setFontSize(9);

          maintenanceStore.recentMaintenances.slice(0, 10).forEach((m, index) => {
            if (yPos > 275) {
              doc.addPage();
              yPos = 20;
            }

            doc.setFont(undefined, 'bold');
            doc.setTextColor(102, 126, 234);
            doc.text(`${formatarData(m.data)}`, 20, yPos);
            
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
            doc.text(`${m.maquina}`, 50, yPos);
            
            // Badge do tipo
            if (m.tipo === 'Preventiva') {
              doc.setFillColor(209, 250, 229);
              doc.setTextColor(6, 95, 70);
            } else if (m.tipo === 'Corretiva') {
              doc.setFillColor(254, 226, 226);
              doc.setTextColor(153, 27, 27);
            } else if (m.tipo === 'Preditiva') {
              doc.setFillColor(219, 234, 254);
              doc.setTextColor(30, 64, 175);
            }
            
            doc.roundedRect(140, yPos - 3, 25, 5, 1, 1, 'F');
            doc.setFont(undefined, 'bold');
            doc.text(m.tipo, 152.5, yPos, { align: 'center' });
            
            if (m.tecnico) {
              doc.setTextColor(107, 114, 128);
              doc.setFont(undefined, 'normal');
              doc.setFontSize(8);
              doc.text(`Técnico: ${m.tecnico}`, 25, yPos + 4);
              yPos += 4;
            }
            
            yPos += 8;
            doc.setFontSize(9);
          });
        }

        // ========================================
        // RODAPÉ
        // ========================================
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Página ${i} de ${pageCount}`,
            105,
            290,
            { align: 'center' }
          );
        }

        // Salvar PDF
        doc.save(`relatorio_manutencao_${new Date().getTime()}.pdf`);
        
        alert('✅ Relatório PDF gerado com sucesso!');

      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('❌ Erro ao gerar PDF: ' + error.message);
      } finally {
        gerandoPDF.value = false;
      }
    };

    onMounted(() => {
      carregarDados();
    });

    return {
      machineStore,
      maintenanceStore,
      carregando,
      erro,
      gerandoPDF,
      mediaPorMaquina,
      maxManutencoes,
      getCorTipo,
      formatarData,
      gerarPDF
    };
  }
};
</script>

<style scoped>
@import '../style.css';

.relatorios-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.title-icon {
  font-size: 2.5rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-card.stat-blue { border-left: 5px solid #3b82f6; }
.stat-card.stat-green { border-left: 5px solid #10b981; }
.stat-card.stat-purple { border-left: 5px solid #667eea; }
.stat-card.stat-red { border-left: 5px solid #ef4444; }

.stat-icon {
  font-size: 3.5rem;
  flex-shrink: 0;
}

.stat-content h3 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Chart Card */
.chart-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease-out 0.5s both;
}

.chart-card h3 {
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.chart-container {
  margin-bottom: 1.5rem;
}

.chart-bar {
  margin-bottom: 1.5rem;
}

.bar-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 1rem;
}

.bar-container {
  background: #f3f4f6;
  border-radius: 10px;
  height: 50px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  min-width: 50px;
}

.bar-value {
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 2px solid #f3f4f6;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #6b7280;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Recent Card */
.recent-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease-out 0.6s both;
}

.recent-card h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.recent-subtitle {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.2s;
}

.recent-item:hover {
  background: #f3f4f6;
  transform: translateX(5px);
}

.recent-date {
  font-weight: 600;
  color: #667eea;
  min-width: 100px;
  font-size: 0.95rem;
}

.recent-machine {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.badge {
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-preventiva { background: #d1fae5; color: #065f46; }
.badge-corretiva { background: #fee2e2; color: #991b1b; }
.badge-preditiva { background: #dbeafe; color: #1e40af; }

/* Overdue Card */
.overdue-card {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
  border-left: 5px solid #ef4444;
  animation: fadeIn 0.6s ease-out 0.7s both;
}

.overdue-card h3 {
  color: #991b1b;
  margin-bottom: 1.5rem;
}

.overdue-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.overdue-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.overdue-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.overdue-info strong {
  display: block;
  color: #991b1b;
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
}

.overdue-info p {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Export Card */
.export-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  animation: fadeIn 0.6s ease-out 0.8s both;
}

.export-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.export-icon {
  font-size: 4rem;
}

.export-info h3 {
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.export-info p {
  color: #6b7280;
  font-size: 0.95rem;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  white-space: nowrap;
}

.btn-export:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

.btn-export:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .export-card {
    flex-direction: column;
    text-align: center;
  }
  
  .export-content {
    flex-direction: column;
  }
  
  .btn-export {
    width: 100%;
    justify-content: center;
  }
  
  .recent-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .recent-date {
    min-width: auto;
  }
}
</style>
