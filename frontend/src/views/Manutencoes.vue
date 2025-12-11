<template>
  <div class="manutencoes-page">
    
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🔧</span>
          Manutenções Realizadas
        </h1>
        <p class="page-subtitle">Registre e acompanhe o histórico de manutenções</p>
      </div>
      <button @click="mostrarFormulario = !mostrarFormulario" class="btn-add">
        <span>➕</span>
        Registrar Manutenção
      </button>
    </div>

    <!-- Estatísticas -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h3>{{ maintenanceStore.totalMaintenances }}</h3>
          <p>Total de Manutenções</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <h3>{{ maintenanceStore.recentMaintenances.length }}</h3>
          <p>Últimos 30 dias</p>
        </div>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="maintenanceStore.error" class="alert alert-error">
      <span class="alert-icon">⚠️</span>
      {{ maintenanceStore.error }}
      <button @click="maintenanceStore.clearError()" class="alert-close">✕</button>
    </div>
    
    <div v-if="sucesso" class="alert alert-success">
      <span class="alert-icon">✅</span>
      {{ sucesso }}
    </div>

    <!-- Formulário -->
    <div v-if="mostrarFormulario" class="form-card">
      <div class="form-header">
        <h3>Nova Manutenção</h3>
        <button @click="cancelarFormulario" class="btn-close">✕</button>
      </div>
      
      <form @submit.prevent="adicionarManutencao" class="form">
        
        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">🏭</span>
            Máquina
          </label>
          <input 
            v-model="novaManutencao.maquina" 
            type="text" 
            class="input-field"
            placeholder="Ex: Torno Mecânico 01"
          >
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">📅</span>
            Data da Manutenção
          </label>
          <input 
            v-model="novaManutencao.data" 
            type="date"
            class="input-field"
          >
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">🔧</span>
            Tipo de Manutenção
          </label>
          <select v-model="novaManutencao.tipo" class="input-field">
            <option value="">Selecione...</option>
            <option value="Preventiva">Preventiva</option>
            <option value="Corretiva">Corretiva</option>
            <option value="Preditiva">Preditiva</option>
          </select>
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">📝</span>
            Descrição
          </label>
          <textarea 
            v-model="novaManutencao.descricao" 
            rows="4"
            class="input-field"
            placeholder="Descreva o que foi feito..."
          ></textarea>
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">👨‍🔧</span>
            Técnico Responsável
          </label>
          <input 
            v-model="novaManutencao.tecnico" 
            type="text" 
            class="input-field"
            placeholder="Nome do técnico"
          >
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="btn-submit" 
            :disabled="maintenanceStore.loading"
          >
            <span v-if="!maintenanceStore.loading">✅ Salvar</span>
            <span v-else>⏳ Salvando...</span>
          </button>
          <button 
            type="button"
            @click="cancelarFormulario" 
            class="btn-cancel"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Loading -->
    <div v-if="maintenanceStore.loading && !mostrarFormulario" class="loading-card">
      <div class="spinner"></div>
      <p>⏳ Carregando manutenções...</p>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="maintenanceStore.maintenances.length === 0" class="empty-card">
      <span class="empty-icon">📭</span>
      <p>Nenhuma manutenção registrada ainda.</p>
      <button @click="mostrarFormulario = true" class="btn-add-empty">
        ➕ Registrar Primeira Manutenção
      </button>
    </div>

    <!-- Lista de manutenções -->
    <div v-else class="maintenances-grid">
      <div 
        v-for="manutencao in maintenanceStore.maintenancesByDate" 
        :key="manutencao._id" 
        class="maintenance-card"
        :class="getTypeClass(manutencao.tipo)"
      >
        
        <div class="maintenance-header">
          <div class="maintenance-info">
            <h3 class="maintenance-machine">{{ manutencao.maquina }}</h3>
            <div class="maintenance-meta">
              <span class="meta-date">📅 {{ formatarData(manutencao.data) }}</span>
              <span :class="'badge badge-' + manutencao.tipo.toLowerCase()">
                {{ manutencao.tipo }}
              </span>
            </div>
          </div>
          <button 
            @click="confirmarRemocao(manutencao._id, manutencao.maquina)" 
            class="btn-delete"
            title="Remover manutenção"
          >
            🗑️
          </button>
        </div>

        <div class="maintenance-body">
          <strong>Descrição:</strong>
          <p>{{ manutencao.descricao || 'Sem descrição' }}</p>
          <div class="maintenance-footer">
            <span>👨‍🔧 {{ manutencao.tecnico }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Resumo por tipo -->
    <div v-if="maintenanceStore.maintenances.length > 0" class="summary-card">
      <h3>📊 Resumo por Tipo</h3>
      <div class="summary-grid">
        <div 
          v-for="(count, tipo) in maintenanceStore.countByType" 
          :key="tipo"
          class="summary-item"
        >
          <span :class="'badge badge-' + tipo.toLowerCase()">{{ tipo }}</span>
          <span class="summary-count">{{ count }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMaintenanceStore } from '../stores/maintenanceStore';

export default {
  name: 'Manutencoes',
  
  setup() {
    const maintenanceStore = useMaintenanceStore();
    const mostrarFormulario = ref(false);
    const sucesso = ref('');
    
    const novaManutencao = ref({
      maquina: '',
      data: '',
      tipo: '',
      descricao: '',
      tecnico: ''
    });

    const adicionarManutencao = async () => {
      if (!novaManutencao.value.maquina || !novaManutencao.value.data) {
        maintenanceStore.error = '⚠️ Preencha pelo menos a máquina e a data!';
        return;
      }

      try {
        await maintenanceStore.addMaintenance(novaManutencao.value);
        sucesso.value = '✅ Manutenção registrada com sucesso!';
        setTimeout(() => sucesso.value = '', 3000);
        novaManutencao.value = { maquina: '', data: '', tipo: '', descricao: '', tecnico: '' };
        mostrarFormulario.value = false;
      } catch (error) {
        console.error('Erro ao adicionar:', error);
      }
    };

    const confirmarRemocao = (id, maquina) => {
      if (confirm(`❌ Tem certeza que deseja remover a manutenção da máquina "${maquina}"?\n\nEsta ação não pode ser desfeita.`)) {
        removerManutencao(id);
      }
    };

    const removerManutencao = async (id) => {
      try {
        await maintenanceStore.deleteMaintenance(id);
        sucesso.value = '🗑️ Manutenção removida!';
        setTimeout(() => sucesso.value = '', 3000);
      } catch (error) {
        console.error('Erro ao remover:', error);
      }
    };

    const cancelarFormulario = () => {
      const temDados = novaManutencao.value.maquina || novaManutencao.value.data || 
                       novaManutencao.value.tipo || novaManutencao.value.descricao;
      
      if (temDados) {
        if (confirm('❌ Descartar alterações?\n\nTodos os dados preenchidos serão perdidos.')) {
          mostrarFormulario.value = false;
          maintenanceStore.clearError();
          novaManutencao.value = { maquina: '', data: '', tipo: '', descricao: '', tecnico: '' };
        }
      } else {
        mostrarFormulario.value = false;
        maintenanceStore.clearError();
      }
    };

    const formatarData = (data) => {
      if (!data) return '';
      return new Date(data).toLocaleDateString('pt-BR');
    };

    const getTypeClass = (tipo) => {
      const classes = {
        'Preventiva': 'card-preventiva',
        'Corretiva': 'card-corretiva',
        'Preditiva': 'card-preditiva'
      };
      return classes[tipo] || '';
    };

    onMounted(async () => {
      if (maintenanceStore.maintenances.length === 0) {
        await maintenanceStore.fetchMaintenances();
      }
    });

    return {
      maintenanceStore,
      mostrarFormulario,
      novaManutencao,
      sucesso,
      adicionarManutencao,
      confirmarRemocao,
      cancelarFormulario,
      formatarData,
      getTypeClass
    };
  }
};
</script>

<style scoped>
@import '../style.css';

.manutencoes-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
}

/* Reusa mesmos estilos de Maquinas.vue */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h1 {
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

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  font-size: 1rem;
}

.btn-add:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
}

/* Estatísticas */
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
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #10b981;
  animation: fadeInUp 0.5s ease-out;
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.25rem;
}

.stat-info p {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Cards de Manutenções */
.maintenances-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.maintenance-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #10b981;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.maintenance-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.maintenance-card.card-preventiva {
  border-left-color: #10b981;
}

.maintenance-card.card-corretiva {
  border-left-color: #ef4444;
}

.maintenance-card.card-preditiva {
  border-left-color: #3b82f6;
}

.maintenance-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.maintenance-machine {
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.maintenance-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-date {
  color: #6b7280;
  font-size: 0.9rem;
}

.badge {
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-preventiva {
  background: #d1fae5;
  color: #065f46;
}

.badge-corretiva {
  background: #fee2e2;
  color: #991b1b;
}

.badge-preditiva {
  background: #dbeafe;
  color: #1e40af;
}

.btn-delete {
  background: #fee2e2;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #ef4444;
  transform: scale(1.1);
}

.maintenance-body {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 12px;
}

.maintenance-body strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.9rem;
}

.maintenance-body p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.maintenance-footer {
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.9rem;
}

/* Resumo */
.summary-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.summary-card h3 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.summary-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 12px;
}

.summary-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

@media (max-width: 768px) {
  .maintenances-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btn-add {
    width: 100%;
    justify-content: center;
  }
}
</style>
