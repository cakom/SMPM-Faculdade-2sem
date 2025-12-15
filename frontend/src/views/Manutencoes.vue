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

    <!-- Botão -->
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
        <input v-model="novaManutencao.maquina" type="text" />
      </div>

      <div class="form-group">
        <label>Data:</label>
        <input v-model="novaManutencao.data" type="date" />
      </div>

      <div class="form-group">
        <label>Tipo:</label>
        <select v-model="novaManutencao.tipo">
          <option value="">Selecione...</option>
          <option value="Preventiva">Preventiva</option>
          <option value="Corretiva">Corretiva</option>
          <option value="Preditiva">Preditiva</option>
        </select>
      </div>

      <div class="form-group">
        <label>Descrição:</label>
        <textarea v-model="novaManutencao.descricao"></textarea>
      </div>

      <div class="form-group">
        <label>Técnico:</label>
        <input v-model="novaManutencao.tecnico" type="text" />
      </div>

      <button @click="adicionarManutencao" class="btn btn-success" :disabled="maintenanceStore.loading">
        {{ maintenanceStore.loading ? '⏳ Salvando...' : '✅ Salvar' }}
      </button>

      <button @click="cancelarFormulario" class="btn btn-danger" style="margin-left:10px">
        ❌ Cancelar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="maintenanceStore.loading && !mostrarFormulario" class="card">
      ⏳ Carregando manutenções...
    </div>

    <!-- Lista -->
    <div v-else-if="maintenanceStore.maintenances.length === 0" class="card">
      📭 Nenhuma manutenção registrada.
    </div>

    <div v-else>
      <div
        v-for="manutencao in maintenanceStore.maintenancesByDate"
        :key="manutencao._id"
        class="card manutencao-card"
      >
        <h3>{{ manutencao.maquina }}</h3>
        <p>
          📅 {{ formatarData(manutencao.data) }}
          |
          <span :class="'badge badge-' + manutencao.tipo.toLowerCase()">
            {{ manutencao.tipo }}
          </span>
        </p>

        <p>{{ manutencao.descricao || 'Sem descrição' }}</p>
        <small>👨‍🔧 {{ manutencao.tecnico }}</small>

        <button
          @click="removerManutencao(manutencao._id)"
          class="btn btn-danger"
          :disabled="maintenanceStore.loading"
        >
          🗑️
        </button>
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
        maintenanceStore.error = '⚠️ Preencha máquina e data';
        return;
      }

      await maintenanceStore.addMaintenance(novaManutencao.value);
      sucesso.value = '✅ Manutenção registrada!';
      setTimeout(() => (sucesso.value = ''), 3000);
      mostrarFormulario.value = false;
    };

    const removerManutencao = async (id) => {
      if (confirm('Remover manutenção?')) {
        await maintenanceStore.deleteMaintenance(id);
      }
    };

    const cancelarFormulario = () => {
      mostrarFormulario.value = false;
      maintenanceStore.clearError();
    };

    const formatarData = (data) =>
      new Date(data).toLocaleDateString('pt-BR');

    onMounted(() => {
      if (!maintenanceStore.maintenances.length) {
        maintenanceStore.fetchMaintenances();
      }
    });

    return {
      maintenanceStore,
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
