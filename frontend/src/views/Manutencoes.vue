<!--
  Manutencoes.vue - USANDO PINIA STORE
-->

<template>
  <div>
    
    <!-- Título -->
    <div class="card">
      <h2>🔧 Manutenções Realizadas</h2>
      <p>Registre e acompanhe o histórico de manutenções</p>
    </div>

    <!-- Estatísticas rápidas -->
    <div class="stats-container">
      <div class="stat-box">
        <span class="stat-number">{{ maintenanceStore.totalMaintenances }}</span>
        <span class="stat-label">Total de Manutenções</span>
      </div>
      <div class="stat-box">
        <span class="stat-number">{{ maintenanceStore.recentMaintenances.length }}</span>
        <span class="stat-label">Últimos 30 dias</span>
      </div>
    </div>

    <!-- Botão para adicionar -->
    <div style="margin-bottom: 20px;">
      <button @click="mostrarFormulario = !mostrarFormulario" class="btn btn-success">
        ➕ Registrar Manutenção
      </button>
    </div>

    <!-- Mensagens -->
    <div v-if="maintenanceStore.error" class="alert alert-danger">
      {{ maintenanceStore.error }}
    </div>
    <div v-if="sucesso" class="alert alert-success">{{ sucesso }}</div>

    <!-- Formulário -->
    <div v-if="mostrarFormulario" class="card">
      <h3>Nova Manutenção</h3>
      
      <div class="form-group">
        <label>Máquina:</label>
        <input 
          v-model="novaManutencao.maquina" 
          type="text" 
          placeholder="Ex: Torno Mecânico 01"
        >
      </div>

      <div class="form-group">
        <label>Data da Manutenção:</label>
        <input 
          v-model="novaManutencao.data" 
          type="date"
        >
      </div>

      <div class="form-group">
        <label>Tipo de Manutenção:</label>
        <select v-model="novaManutencao.tipo">
          <option value="">Selecione...</option>
          <option value="Preventiva">Preventiva</option>
          <option value="Corretiva">Corretiva</option>
          <option value="Preditiva">Preditiva</option>
        </select>
      </div>

      <div class="form-group">
        <label>Descrição:</label>
        <textarea 
          v-model="novaManutencao.descricao" 
          rows="4"
          placeholder="Descreva o que foi feito..."
        ></textarea>
      </div>

      <div class="form-group">
        <label>Técnico Responsável:</label>
        <input 
          v-model="novaManutencao.tecnico" 
          type="text" 
          placeholder="Nome do técnico"
        >
      </div>

      <button 
        @click="adicionarManutencao" 
        class="btn btn-success"
        :disabled="maintenanceStore.loading"
      >
        {{ maintenanceStore.loading ? '⏳ Salvando...' : '✅ Salvar' }}
      </button>
      <button 
        @click="cancelarFormulario" 
        class="btn btn-danger" 
        style="margin-left: 10px;"
      >
        ❌ Cancelar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="maintenanceStore.loading && !mostrarFormulario" class="card">
      <p style="text-align: center;">⏳ Carregando manutenções...</p>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="maintenanceStore.maintenances.length === 0" class="card">
      <p style="text-align: center; color: #999;">
        📭 Nenhuma manutenção registrada ainda.
      </p>
    </div>

    <!-- Lista de manutenções (ordenadas por data) -->
    <div v-else>
      <div 
        v-for="manutencao in maintenanceStore.maintenancesByDate" 
        :key="manutencao._id" 
        class="card manutencao-card"
      >
        
        <!-- Cabeçalho -->
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h3>{{ manutencao.maquina }}</h3>
            <p style="color: #666;">
              📅 {{ formatarData(manutencao.data) }} | 
              <span :class="'badge badge-' + manutencao.tipo.toLowerCase()">
                {{ manutencao.tipo }}
              </span>
            </p>
          </div>
          <button 
            @click="removerManutencao(manutencao._id)" 
            class="btn btn-danger"
            :disabled="maintenanceStore.loading"
          >
            🗑️
          </button>
        </div>

        <!-- Descrição -->
        <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <strong>Descrição:</strong>
          <p style="margin-top: 5px;">{{ manutencao.descricao || 'Sem descrição' }}</p>
          <small style="color: #666;">👨‍🔧 Técnico: {{ manutencao.tecnico }}</small>
        </div>

      </div>
    </div>

    <!-- Resumo por tipo -->
    <div v-if="maintenanceStore.maintenances.length > 0" class="card">
      <h3>📊 Resumo por Tipo</h3>
      <div class="tipo-resumo">
        <div 
          v-for="(count, tipo) in maintenanceStore.countByType" 
          :key="tipo"
          class="tipo-item"
        >
          <span :class="'badge badge-' + tipo.toLowerCase()">{{ tipo }}</span>
          <span class="tipo-count">{{ count }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMaintenanceStore } from '../stores/maintenanceStore'; // Importa a store

export default {
  name: 'Manutencoes',
  
  setup() {
    // ===== PINIA STORE =====
    // Acessa a store de manutenções (estado global)
    const maintenanceStore = useMaintenanceStore();
    
    // ===== ESTADO LOCAL =====
    const mostrarFormulario = ref(false);
    const sucesso = ref('');
    
    const novaManutencao = ref({
      maquina: '',
      data: '',
      tipo: '',
      descricao: '',
      tecnico: ''
    });

    // ===== MÉTODOS =====

    /**
     * Adiciona nova manutenção usando a store
     */
    const adicionarManutencao = async () => {
      // Validação básica
      if (!novaManutencao.value.maquina || !novaManutencao.value.data) {
        maintenanceStore.error = '⚠️ Preencha pelo menos a máquina e a data!';
        return;
      }

      try {
        // Chama action da store
        await maintenanceStore.addMaintenance(novaManutencao.value);
        
        // Sucesso!
        sucesso.value = '✅ Manutenção registrada com sucesso!';
        setTimeout(() => sucesso.value = '', 3000);
        
        // Limpa formulário
        novaManutencao.value = {
          maquina: '',
          data: '',
          tipo: '',
          descricao: '',
          tecnico: ''
        };
        
        mostrarFormulario.value = false;
        
      } catch (error) {
        // Erro já está em maintenanceStore.error
        console.error('Erro ao adicionar:', error);
      }
    };

    /**
     * Remove manutenção usando a store
     */
    const removerManutencao = async (id) => {
      if (!confirm('Remover esta manutenção?')) return;
      
      try {
        // Chama action da store
        await maintenanceStore.deleteMaintenance(id);
        
        sucesso.value = '🗑️ Manutenção removida!';
        setTimeout(() => sucesso.value = '', 3000);
        
      } catch (error) {
        console.error('Erro ao remover:', error);
      }
    };

    /**
     * Cancela formulário e limpa erros
     */
    const cancelarFormulario = () => {
      mostrarFormulario.value = false;
      maintenanceStore.clearError();
      novaManutencao.value = {
        maquina: '',
        data: '',
        tipo: '',
        descricao: '',
        tecnico: ''
      };
    };

    /**
     * Formata data para exibição
     */
    const formatarData = (data) => {
      if (!data) return '';
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    };

    // ===== LIFECYCLE =====
    
    /**
     * Quando monta, carrega as manutenções se a store estiver vazia
     */
    onMounted(async () => {
      if (maintenanceStore.maintenances.length === 0) {
        await maintenanceStore.fetchMaintenances();
      }
    });

    // ===== RETORNO =====
    return {
      maintenanceStore,    // Expõe a store para o template
      mostrarFormulario,
      novaManutencao,
      sucesso,
      adicionarManutencao,
      removerManutencao,
      cancelarFormulario,
      formatarData
    };
  }
};
</script>

<style scoped>
/* Estatísticas rápidas */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  border-left: 4px solid #51cf66;
}

.stat-number {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #51cf66;
  margin-bottom: 5px;
}

.stat-label {
  display: block;
  color: #666;
  font-size: 14px;
}

/* Card de manutenção */
.manutencao-card {
  border-left: 4px solid #51cf66;
  transition: transform 0.2s;
}

.manutencao-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Badges coloridos para tipo de manutenção */
.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-preventiva {
  background: #d3f9d8;
  color: #2b8a3e;
}

.badge-corretiva {
  background: #ffe3e3;
  color: #c92a2a;
}

.badge-preditiva {
  background: #d0ebff;
  color: #1971c2;
}

/* Resumo por tipo */
.tipo-resumo {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.tipo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.tipo-count {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

h3 {
  color: #51cf66;
  margin-bottom: 5px;
}
</style>