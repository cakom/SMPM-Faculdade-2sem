<!--
  Relatorios.vue - Relatórios e Estatísticas
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
    <div v-if="!carregando && dados" class="stats-grid">
      
      <!-- Total de Máquinas -->
      <div class="stat-card stat-blue">
        <div class="stat-icon">🏭</div>
        <div class="stat-info">
          <h3>{{ dados.totalMaquinas }}</h3>
          <p>Máquinas Cadastradas</p>
        </div>
      </div>

      <!-- Total de Manutenções -->
      <div class="stat-card stat-green">
        <div class="stat-icon">🔧</div>
        <div class="stat-info">
          <h3>{{ dados.totalManutencoes }}</h3>
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

    </div>

    <!-- Gráfico de Manutenções por Tipo -->
    <div v-if="!carregando && dados" class="card">
      <h3>Manutenções por Tipo</h3>
      
      <div class="chart-container">
        <div 
          v-for="item in dados.manutencoesPorTipo" 
          :key="item._id"
          class="chart-bar"
        >
          <div class="bar-label">{{ item._id || 'Sem tipo' }}</div>
          <div class="bar-container">
            <div 
              class="bar-fill" 
              :style="{ 
                width: (item.total / maxManutencoes * 100) + '%',
                backgroundColor: getCorTipo(item._id)
              }"
            >
              <span class="bar-value">{{ item.total }}</span>
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

    <!-- Botão para gerar PDF -->
    <div class="card">
      <h3>📄 Gerar Relatório em PDF</h3>
      <p>Baixe um relatório completo em PDF com todas as informações</p>
      <button @click="gerarPDF" class="btn btn-primary">
        📥 Baixar PDF
      </button>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { buscarResumo } from '../services/api.js';

export default {
  name: 'Relatorios',
  
  setup() {
    const carregando = ref(false);
    const erro = ref('');
    const dados = ref(null);

    /**
     * Média de manutenções por máquina
     */
    const mediaPorMaquina = computed(() => {
      if (!dados.value || dados.value.totalMaquinas === 0) return '0';
      return (dados.value.totalManutencoes / dados.value.totalMaquinas).toFixed(1);
    });

    /**
     * Máximo de manutenções para calcular largura das barras
     */
    const maxManutencoes = computed(() => {
      if (!dados.value || !dados.value.manutencoesPorTipo.length) return 1;
      return Math.max(...dados.value.manutencoesPorTipo.map(m => m.total));
    });

    /**
     * Carrega dados do relatório
     */
    const carregarDados = async () => {
      carregando.value = true;
      erro.value = '';
      
      try {
        dados.value = await buscarResumo();
      } catch (error) {
        erro.value = 'Erro ao carregar dados: ' + error.message;
      } finally {
        carregando.value = false;
      }
    };

    /**
     * Define cor baseado no tipo de manutenção
     */
    const getCorTipo = (tipo) => {
      const cores = {
        'Preventiva': '#51cf66',
        'Corretiva': '#ff6b6b',
        'Preditiva': '#3b82f6'
      };
      return cores[tipo] || '#999';
    };

    /**
     * Gera relatório em PDF
     * (Versão simplificada - em produção usaria uma lib como jsPDF)
     */
    const gerarPDF = () => {
      if (!dados.value) {
        alert('⚠️ Carregue os dados primeiro!');
        return;
      }

      // Cria conteúdo do relatório
      let conteudo = '=== RELATÓRIO DE MANUTENÇÃO ===\n\n';
      conteudo += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
      conteudo += `Total de Máquinas: ${dados.value.totalMaquinas}\n`;
      conteudo += `Total de Manutenções: ${dados.value.totalManutencoes}\n`;
      conteudo += `Média por Máquina: ${mediaPorMaquina.value}\n\n`;
      conteudo += '--- Manutenções por Tipo ---\n';
      
      dados.value.manutencoesPorTipo.forEach(item => {
        conteudo += `${item._id || 'Sem tipo'}: ${item.total}\n`;
      });

      // Cria um blob e faz download
      const blob = new Blob([conteudo], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${new Date().getTime()}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert('✅ Relatório baixado com sucesso!');
    };

    onMounted(() => {
      carregarDados();
    });

    return {
      carregando,
      erro,
      dados,
      mediaPorMaquina,
      maxManutencoes,
      getCorTipo,
      gerarPDF
    };
  }
};
</script>

<style scoped>
/* Grid de estatísticas */
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

.stat-blue {
  border-left: 5px solid #3b82f6;
}

.stat-green {
  border-left: 5px solid #51cf66;
}

.stat-purple {
  border-left: 5px solid #667eea;
}

/* Gráfico de barras */
.chart-container {
  margin-top: 20px;
}

.chart-bar {
  margin-bottom: 20px;
}

.bar-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.bar-container {
  background: #f0f0f0;
  border-radius: 8px;
  height: 40px;
  position: relative;
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

/* Legenda */
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

h3 {
  color: #667eea;
  margin-bottom: 15px;
}
</style>