<!--
  Manutencoes.vue - Página de Manutenções Realizadas
  
  Aqui você registra as manutenções que foram feitas nas máquinas.
-->

<template>
  <div>
    
    <!-- Título -->
    <div class="card">
      <h2>🔧 Manutenções Realizadas</h2>
      <p>Registre e acompanhe o histórico de manutenções</p>
    </div>

    <!-- Botão para adicionar manutenção -->
    <div style="margin-bottom: 20px;">
      <button @click="mostrarFormulario = !mostrarFormulario" class="btn btn-success">
        ➕ Registrar Manutenção
      </button>
    </div>

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

      <button @click="adicionarManutencao" class="btn btn-success">
        ✅ Salvar
      </button>
      <button @click="mostrarFormulario = false" class="btn btn-danger" style="margin-left: 10px;">
        ❌ Cancelar
      </button>
    </div>

    <!-- Mensagem se não tiver manutenções -->
    <div v-if="manutencoes.length === 0" class="card">
      <p style="text-align: center; color: #999;">
        📭 Nenhuma manutenção registrada ainda.
      </p>
    </div>

    <!-- Lista de manutenções -->
    <div v-else>
      <div v-for="manutencao in manutencoes" :key="manutencao.id" class="card manutencao-card">
        
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
          <button @click="removerManutencao(manutencao.id)" class="btn btn-danger">
            🗑️
          </button>
        </div>

        <!-- Descrição -->
        <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <strong>Descrição:</strong>
          <p style="margin-top: 5px;">{{ manutencao.descricao }}</p>
          <small style="color: #666;">👨‍🔧 Técnico: {{ manutencao.tecnico }}</small>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Manutencoes',
  
  setup() {
    // Controla visibilidade do formulário
    const mostrarFormulario = ref(false);
    
    // Lista de manutenções
    const manutencoes = ref([]);
    
    // Dados da nova manutenção
    const novaManutencao = ref({
      maquina: '',
      data: '',
      tipo: '',
      descricao: '',
      tecnico: ''
    });

    /**
     * Adiciona uma nova manutenção
     */
    const adicionarManutencao = () => {
      // Valida campos obrigatórios
      if (!novaManutencao.value.maquina || !novaManutencao.value.data) {
        alert('⚠️ Preencha pelo menos a máquina e a data!');
        return;
      }

      // Cria objeto da manutenção
      const manutencao = {
        id: Date.now(),
        maquina: novaManutencao.value.maquina,
        data: novaManutencao.value.data,
        tipo: novaManutencao.value.tipo,
        descricao: novaManutencao.value.descricao,
        tecnico: novaManutencao.value.tecnico
      };

      // Adiciona na lista (mais recente primeiro)
      manutencoes.value.unshift(manutencao);

      // Limpa formulário
      novaManutencao.value = {
        maquina: '',
        data: '',
        tipo: '',
        descricao: '',
        tecnico: ''
      };

      // Fecha formulário
      mostrarFormulario.value = false;

      alert('✅ Manutenção registrada com sucesso!');
    };

    /**
     * Remove uma manutenção
     */
    const removerManutencao = (id) => {
      if (confirm('Remover esta manutenção?')) {
        manutencoes.value = manutencoes.value.filter(m => m.id !== id);
        alert('🗑️ Manutenção removida!');
      }
    };

    /**
     * Formata data para exibição
     */
    const formatarData = (data) => {
      if (!data) return '';
      const dataObj = new Date(data + 'T00:00:00');
      return dataObj.toLocaleDateString('pt-BR');
    };

    return {
      mostrarFormulario,
      manutencoes,
      novaManutencao,
      adicionarManutencao,
      removerManutencao,
      formatarData
    };
  }
};
</script>

<style scoped>
.manutencao-card {
  border-left: 4px solid #51cf66;
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
</style>