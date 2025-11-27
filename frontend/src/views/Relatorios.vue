<!--
  Relatorios.vue - USANDO PINIA STORES (CORRIGIDO)
-->

<template>
  <div>
    
    <div class="card">
      <h2>📊 Relatórios e Estatísticas</h2>
      <p>Visualize dados sobre máquinas e manutenções</p>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="card">
      <p style="text-align: center;">⏳ Carregando dados...</p>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="alert alert-danger">{{ erro }}</div>

    <!-- Cards de Estatísticas -->
    <div v-if="!carregando" class="stats-grid">
      
      <!-- Total de Máquinas -->
      <div class="stat-card stat-blue">
        <div class="stat-icon">🏭</div>
        <div class="stat-info">
          <h3>{{ machineStore.totalMachines }}</h3>
          <p>Máquinas Cadastradas</p>
        </div>
      </div>

      <!-- Total de Manutenções -->
      <div class="stat-card stat-green">
        <div class="stat-icon">🔧</div>
        <div class="stat-info">
          <h3>{{ maintenanceStore.totalMaintenances }}</h3>
          <p>Manutenções Realizadas</p>
        </div>
      </div>

      <!-- Média por Máquina -->
      <div class="stat-card stat-purple">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <h3>{{ mediaPorMaquina }}</h3>
          <p>Média de Manutenções/Máquina</p>
        </div>
      </div>

      <!-- Máquinas Atrasadas -->
      <div class="stat-card stat-red">
        <div class="stat-icon">⚠️</div>
        <div class="stat-info">
          <h3>{{ machineStore.overdueMachines.length }}</h3>
          <p>Manutenções Atrasadas</p>
        </div>
      </div>

    </div>

    <!-- Gráfico de Manutenções por Tipo -->
    <div v-if="!carregando" class="card">
      <h3>Manutenções por Tipo</h3>
      
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

      <!-- Legenda -->
      <div class="legenda">
        <div class="legenda-item">
          <span class="legenda-cor" style="background: #51cf66;"></span>
          Preventiva
        </div>
        <div class="legenda-item">
          <span class="legenda-cor" style="background: #ff6b6b;"></span>
          Corretiva
        </div>
        <div class="legenda-item">
          <span class="legenda-cor" style="background: #3b82f6;"></span>
          Preditiva
        </div>
      </div>
    </div>

    <!-- Manutenções Recentes -->
    <div v-if="!carregando && maintenanceStore.recentMaintenances.length > 0" class="card">
      <h3>🕒 Manutenções Recentes (Últimos 30 dias)</h3>
      <p style="color: #666; margin-bottom: 15px;">
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
    <div v-if="!carregando && machineStore.overdueMachines.length > 0" class="card">
      <h3>⚠️ Atenção: Manutenções Atrasadas</h3>
      <div class="overdue-list">
        <div 
          v-for="maquina in machineStore.overdueMachines" 
          :key="maquina._id"
          class="overdue-item"
        >
          <span class="overdue-icon">🔴</span>
          <div>
            <strong>{{ maquina.nome }}</strong>
            <p>Manutenção prevista: {{ formatarData(maquina.proximaManutencao) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botão PDF -->
    <div class="card">
      <h3>📄 Gerar Relatório em PDF</h3>
      <p>Baixe um relatório completo com todas as informações</p>
      <button @click="gerarPDF" class="btn btn-primary">
        📥 Baixar Relatório
      </button>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useMachineStore } from '../stores/machineStore';
import { useMaintenanceStore } from '../stores/maintenanceStore';

export default {
  name: 'Relatorios',
  
  setup() {
    // ===== PINIA STORES =====
    const machineStore = useMachineStore();
    const maintenanceStore = useMaintenanceStore();
    
    // ===== ESTADO LOCAL =====
    const carregando = ref(false);
    const erro = ref('');

    // ===== COMPUTED =====
    
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

    // ===== MÉTODOS =====

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
        'Preventiva': '#51cf66',
        'Corretiva': '#ff6b6b',
        'Preditiva': '#3b82f6'
      };
      return cores[tipo] || '#999';
    };

    const formatarData = (data) => {
      if (!data) return '';
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    };

    const gerarPDF = () => {
      let conteudo = '=== RELATÓRIO DE MANUTENÇÃO ===\n\n';
      conteudo += `Data: ${new Date().toLocaleString('pt-BR')}\n\n`;
      
      conteudo += '--- RESUMO GERAL ---\n';
      conteudo += `Total de Máquinas: ${machineStore.totalMachines}\n`;
      conteudo += `Total de Manutenções: ${maintenanceStore.totalMaintenances}\n`;
      conteudo += `Média por Máquina: ${mediaPorMaquina.value}\n`;
      conteudo += `Manutenções Atrasadas: ${machineStore.overdueMachines.length}\n\n`;
      
      conteudo += '--- MANUTENÇÕES POR TIPO ---\n';
      Object.entries(maintenanceStore.countByType).forEach(([tipo, count]) => {
        conteudo += `${tipo}: ${count}\n`;
      });
      
      conteudo += '\n--- MÁQUINAS ATRASADAS ---\n';
      if (machineStore.overdueMachines.length === 0) {
        conteudo += 'Nenhuma.\n';
      } else {
        machineStore.overdueMachines.forEach(maquina => {
          conteudo += `${maquina.nome} - ${formatarData(maquina.proximaManutencao)}\n`;
        });
      }
      
      conteudo += '\n--- RECENTES (30 dias) ---\n';
      maintenanceStore.recentMaintenances.forEach(m => {
        conteudo += `${formatarData(m.data)} - ${m.maquina} (${m.tipo})\n`;
      });

      const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${new Date().getTime()}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert('✅ Relatório baixado!');
    };

    onMounted(() => {
      carregarDados();
    });

    return {
      machineStore,
      maintenanceStore,
      carregando,
      erro,
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
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 50px;
}

.stat-info h3 {
  font-size: 36px;
  margin-bottom: 5px;
}

.stat-info p {
  color: #666;
  font-size: 14px;
}

.stat-blue { border-left: 5px solid #3b82f6; }
.stat-green { border-left: 5px solid #51cf66; }
.stat-purple { border-left: 5px solid #667eea; }
.stat-red { border-left: 5px solid #ff6b6b; }

.chart-container { margin-top: 20px; }
.chart-bar { margin-bottom: 20px; }
.bar-label { font-weight: 600; margin-bottom: 8px; color: #333; }

.bar-container {
  background: #f0f0f0;
  border-radius: 8px;
  height: 40px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15px;
  transition: width 0.5s ease;
  border-radius: 8px;
}

.bar-value {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.legenda {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legenda-cor {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-preventiva { background: #d3f9d8; color: #2b8a3e; }
.badge-corretiva { background: #ffe3e3; color: #c92a2a; }
.badge-preditiva { background: #d0ebff; color: #1971c2; }

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.recent-date {
  font-weight: 600;
  color: #667eea;
  min-width: 100px;
}

.recent-machine {
  flex: 1;
  color: #333;
}

.overdue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.overdue-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #ffe3e3;
  border-radius: 8px;
  border-left: 4px solid #ff6b6b;
}

.overdue-icon { font-size: 24px; }

h3 {
  color: #667eea;
  margin-bottom: 15px;
}
</style>