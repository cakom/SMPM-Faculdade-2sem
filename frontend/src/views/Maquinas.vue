<template>
  <div class="maquinas-page">
    
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🏭</span>
          Minhas Máquinas
        </h1>
        <p class="page-subtitle">Gerencie suas máquinas e manutenções</p>
      </div>
      <button @click="mostrarFormulario = !mostrarFormulario" class="btn-add">
        <span>➕</span>
        Adicionar Máquina
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="machineStore.error" class="alert alert-error">
      <span class="alert-icon">⚠️</span>
      {{ machineStore.error }}
      <button @click="machineStore.clearError()" class="alert-close">✕</button>
    </div>
    
    <div v-if="sucesso" class="alert alert-success">
      <span class="alert-icon">✅</span>
      {{ sucesso }}
    </div>

    <!-- Formulário -->
    <div v-if="mostrarFormulario" class="form-card">
      <div class="form-header">
        <h3>Nova Máquina</h3>
        <button @click="cancelarFormulario" class="btn-close">✕</button>
      </div>
      
      <form @submit.prevent="adicionarMaquina" class="form">
        
        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">🏭</span>
            Nome da Máquina
          </label>
          <input 
            v-model="novaMaquina.nome" 
            type="text" 
            class="input-field"
            placeholder="Ex: Torno Mecânico 01"
          >
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">📦</span>
            Tipo
          </label>
          <select v-model="novaMaquina.tipo" class="input-field">
            <option value="">Selecione...</option>
            <option value="Torno">Torno</option>
            <option value="Fresadora">Fresadora</option>
            <option value="Furadeira">Furadeira</option>
            <option value="Prensa">Prensa</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">📍</span>
            Local
          </label>
          <input 
            v-model="novaMaquina.local" 
            type="text" 
            class="input-field"
            placeholder="Ex: Galpão A - Setor 2"
          >
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">📅</span>
            Próxima Manutenção
          </label>
          <input 
            v-model="novaMaquina.proximaManutencao" 
            type="date"
            class="input-field"
          >
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="btn-submit" 
            :disabled="machineStore.loading"
          >
            <span v-if="!machineStore.loading">✅ Salvar Máquina</span>
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
    <div v-if="machineStore.loading && !mostrarFormulario" class="loading-card">
      <div class="spinner"></div>
      <p>⏳ Carregando máquinas...</p>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="machineStore.machines.length === 0" class="empty-card">
      <span class="empty-icon">📭</span>
      <p>Nenhuma máquina cadastrada ainda.</p>
      <button @click="mostrarFormulario = true" class="btn-add-empty">
        ➕ Adicionar Primeira Máquina
      </button>
    </div>

    <!-- Lista de máquinas -->
    <div v-else class="machines-grid">
      <div 
        v-for="maquina in machineStore.machinesByUrgency" 
        :key="maquina._id" 
        class="machine-card"
        :class="getCardClass(maquina.proximaManutencao)"
      >
        
        <div class="machine-header">
          <div class="machine-info">
            <h3 class="machine-name">🔧 {{ maquina.nome }}</h3>
            <p class="machine-details">{{ maquina.tipo }} - {{ maquina.local }}</p>
          </div>
          <button 
            @click="confirmarRemocao(maquina._id, maquina.nome)" 
            class="btn-delete"
            title="Remover máquina"
          >
            🗑️
          </button>
        </div>

        <div class="machine-status" :class="getStatusClass(maquina.proximaManutencao)">
          <span class="status-icon">📅</span>
          <div class="status-info">
            <strong>Próxima Manutenção:</strong>
            <p>{{ formatarData(maquina.proximaManutencao) }}</p>
            <small>{{ getDiasRestantes(maquina.proximaManutencao) }}</small>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMachineStore } from '../stores/machineStore';

export default {
  name: 'Maquinas',
  
  setup() {
    const machineStore = useMachineStore();
    const mostrarFormulario = ref(false);
    const sucesso = ref('');
    
    const novaMaquina = ref({
      nome: '',
      tipo: '',
      local: '',
      proximaManutencao: ''
    });

    const adicionarMaquina = async () => {
      if (!novaMaquina.value.nome || !novaMaquina.value.tipo) {
        machineStore.error = '⚠️ Preencha pelo menos o nome e tipo da máquina!';
        return;
      }

      try {
        await machineStore.addMachine(novaMaquina.value);
        sucesso.value = '✅ Máquina adicionada com sucesso!';
        setTimeout(() => sucesso.value = '', 5000);
        novaMaquina.value = { nome: '', tipo: '', local: '', proximaManutencao: '' };
        mostrarFormulario.value = false;
      } catch (error) {
        console.error('Erro ao adicionar:', error);
      }
    };

    const confirmarRemocao = (id, nome) => {
      if (confirm(`❌ Tem certeza que deseja remover a máquina "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
        removerMaquina(id);
      }
    };

    const removerMaquina = async (id) => {
      try {
        await machineStore.deleteMachine(id);
        sucesso.value = '🗑️ Máquina removida!';
        setTimeout(() => sucesso.value = '', 5000);
      } catch (error) {
        console.error('Erro ao remover:', error);
      }
    };

    const cancelarFormulario = () => {
      if (novaMaquina.value.nome || novaMaquina.value.tipo || novaMaquina.value.local) {
        if (confirm('❌ Descartar alterações?\n\nTodos os dados preenchidos serão perdidos.')) {
          mostrarFormulario.value = false;
          machineStore.clearError();
          novaMaquina.value = { nome: '', tipo: '', local: '', proximaManutencao: '' };
        }
      } else {
        mostrarFormulario.value = false;
        machineStore.clearError();
      }
    };

    const formatarData = (data) => {
      if (!data) return 'Não definida';
      return new Date(data).toLocaleDateString('pt-BR');
    };

    const getDiasRestantes = (data) => {
      if (!data) return '';
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataManutencao = new Date(data);
      dataManutencao.setHours(0, 0, 0, 0);
      const dias = Math.ceil((dataManutencao - hoje) / (1000 * 60 * 60 * 24));

      if (dias < 0) return `⚠️ Atrasada há ${Math.abs(dias)} dias!`;
      if (dias === 0) return '🔴 Manutenção HOJE!';
      if (dias <= 7) return `⚠️ Faltam ${dias} dias (URGENTE)`;
      return `✅ Faltam ${dias} dias`;
    };

    const getStatusClass = (data) => {
      if (!data) return 'status-normal';
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataManutencao = new Date(data);
      const dias = Math.ceil((dataManutencao - hoje) / (1000 * 60 * 60 * 24));

      if (dias < 0) return 'status-overdue';
      if (dias <= 7) return 'status-urgent';
      return 'status-ok';
    };

    const getCardClass = (data) => {
      if (!data) return '';
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataManutencao = new Date(data);
      const dias = Math.ceil((dataManutencao - hoje) / (1000 * 60 * 60 * 24));

      if (dias < 0) return 'card-overdue';
      if (dias <= 7) return 'card-urgent';
      return 'card-ok';
    };

    onMounted(async () => {
      if (machineStore.machines.length === 0) {
        await machineStore.fetchMachines();
      }
    });

    return {
      machineStore,
      mostrarFormulario,
      novaMaquina,
      sucesso,
      adicionarMaquina,
      confirmarRemocao,
      cancelarFormulario,
      formatarData,
      getDiasRestantes,
      getStatusClass,
      getCardClass
    };
  }
};
</script>

<style scoped>
@import '../style.css';

.maquinas-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
}

/* Page Header */
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  font-size: 1rem;
}

.btn-add:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

/* Formulário */
.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: slideInDown 0.3s ease-out;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-header h3 {
  font-size: 1.5rem;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  padding: 0.25rem;
  line-height: 1;
}

.btn-close:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.875rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-cancel:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

/* Cards de Máquinas */
.machines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.machine-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.machine-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.machine-card.card-overdue {
  border-left-color: #ef4444;
}

.machine-card.card-urgent {
  border-left-color: #f59e0b;
}

.machine-card.card-ok {
  border-left-color: #10b981;
}

.machine-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.machine-name {
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.machine-details {
  color: #6b7280;
  font-size: 0.95rem;
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

.machine-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1rem;
}

.machine-status.status-overdue {
  background: #fee2e2;
  color: #991b1b;
}

.machine-status.status-urgent {
  background: #fef3c7;
  color: #92400e;
}

.machine-status.status-ok {
  background: #d1fae5;
  color: #065f46;
}

.status-icon {
  font-size: 2rem;
}

.status-info strong {
  font-size: 0.85rem;
  display: block;
  margin-bottom: 0.25rem;
}

.status-info p {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0.25rem 0;
}

.status-info small {
  font-size: 0.9rem;
  font-weight: 600;
}

/* Empty State */
.empty-card {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  display: block;
  margin-bottom: 1rem;
}

.btn-add-empty {
  margin-top: 1.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-add-empty:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

@media (max-width: 768px) {
  .machines-grid {
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
