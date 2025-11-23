<!--
  Maquinas.vue - USANDO PINIA STORE
-->

<template>
  <div>
    
    <div class="card">
      <h2>🏭 Minhas Máquinas</h2>
      <p>Gerencie suas máquinas e manutenções</p>
    </div>

    <div style="margin-bottom: 20px;">
      <button @click="mostrarFormulario = !mostrarFormulario" class="btn btn-primary">
        ➕ Adicionar Máquina
      </button>
    </div>

    <!-- Mensagens -->
    <div v-if="machineStore.error" class="alert alert-danger">
      {{ machineStore.error }}
    </div>
    <div v-if="sucesso" class="alert alert-success">{{ sucesso }}</div>

    <!-- Formulário -->
    <div v-if="mostrarFormulario" class="card">
      <h3>Nova Máquina</h3>
      
      <div class="form-group">
        <label>Nome da Máquina:</label>
        <input 
          v-model="novaMaquina.nome" 
          type="text" 
          placeholder="Ex: Torno Mecânico 01"
        >
      </div>

      <div class="form-group">
        <label>Tipo:</label>
        <select v-model="novaMaquina.tipo">
          <option value="">Selecione...</option>
          <option value="Torno">Torno</option>
          <option value="Fresadora">Fresadora</option>
          <option value="Furadeira">Furadeira</option>
          <option value="Prensa">Prensa</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <div class="form-group">
        <label>Local:</label>
        <input 
          v-model="novaMaquina.local" 
          type="text" 
          placeholder="Ex: Galpão A - Setor 2"
        >
      </div>

      <div class="form-group">
        <label>Próxima Manutenção:</label>
        <input 
          v-model="novaMaquina.proximaManutencao" 
          type="date"
        >
      </div>

      <button 
        @click="adicionarMaquina" 
        class="btn btn-success" 
        :disabled="machineStore.loading"
      >
        {{ machineStore.loading ? '⏳ Salvando...' : '✅ Salvar Máquina' }}
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
    <div v-if="machineStore.loading && !mostrarFormulario" class="card">
      <p style="text-align: center;">⏳ Carregando máquinas...</p>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="machineStore.machines.length === 0" class="card">
      <p style="text-align: center; color: #999;">
        📭 Nenhuma máquina cadastrada ainda. Clique em "Adicionar Máquina" para começar!
      </p>
    </div>

    <!-- Lista de máquinas (ordenadas por urgência) -->
    <div v-else>
      <div 
        v-for="maquina in machineStore.machinesByUrgency" 
        :key="maquina._id" 
        class="card maquina-card"
      >
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3>🔧 {{ maquina.nome }}</h3>
            <p style="color: #666;">{{ maquina.tipo }} - {{ maquina.local }}</p>
          </div>
          <button 
            @click="removerMaquina(maquina._id)" 
            class="btn btn-danger"
            :disabled="machineStore.loading"
          >
            🗑️ Remover
          </button>
        </div>

        <div 
          style="margin-top: 15px; padding: 15px; border-radius: 8px;" 
          :style="{ backgroundColor: getCorStatus(maquina.proximaManutencao) }"
        >
          <strong>Próxima Manutenção:</strong> 
          {{ formatarData(maquina.proximaManutencao) }}
          <br>
          <small>{{ getDiasRestantes(maquina.proximaManutencao) }}</small>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMachineStore } from '../stores/machineStore'; // Importa a store

export default {
  name: 'Maquinas',
  
  setup() {
    // ===== PINIA STORE =====
    // Acessa a store de máquinas (estado global compartilhado)
    const machineStore = useMachineStore();
    
    // ===== ESTADO LOCAL =====
    // Dados específicos deste componente
    const mostrarFormulario = ref(false);
    const sucesso = ref('');
    
    const novaMaquina = ref({
      nome: '',
      tipo: '',
      local: '',
      proximaManutencao: ''
    });

    // ===== MÉTODOS =====

    /**
     * Adiciona nova máquina usando a store
     */
    const adicionarMaquina = async () => {
      // Validação
      if (!novaMaquina.value.nome || !novaMaquina.value.tipo) {
        machineStore.error = '⚠️ Preencha pelo menos o nome e tipo da máquina!';
        return;
      }

      try {
        // Chama action da store
        await machineStore.addMachine(novaMaquina.value);
        
        // Sucesso!
        sucesso.value = '✅ Máquina adicionada com sucesso!';
        setTimeout(() => sucesso.value = '', 3000);
        
        // Limpa formulário
        novaMaquina.value = {
          nome: '',
          tipo: '',
          local: '',
          proximaManutencao: ''
        };
        
        mostrarFormulario.value = false;
        
      } catch (error) {
        // Erro já está armazenado em machineStore.error
        console.error('Erro ao adicionar:', error);
      }
    };

    /**
     * Remove máquina usando a store
     */
    const removerMaquina = async (id) => {
      if (!confirm('Tem certeza que deseja remover esta máquina?')) return;
      
      try {
        // Chama action da store
        await machineStore.deleteMachine(id);
        
        sucesso.value = '🗑️ Máquina removida!';
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
      machineStore.clearError();
      novaMaquina.value = {
        nome: '',
        tipo: '',
        local: '',
        proximaManutencao: ''
      };
    };

    /**
     * Formata data para exibição
     */
    const formatarData = (data) => {
      if (!data) return 'Não definida';
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    };

    /**
     * Calcula dias restantes até manutenção
     */
    const getDiasRestantes = (data) => {
      if (!data) return '';
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const dataManutencao = new Date(data);
      dataManutencao.setHours(0, 0, 0, 0);
      
      const diferencaMs = dataManutencao - hoje;
      const dias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

      if (dias < 0) return `⚠️ Atrasada há ${Math.abs(dias)} dias!`;
      if (dias === 0) return '🔴 Manutenção HOJE!';
      if (dias <= 7) return `⚠️ Faltam ${dias} dias (URGENTE)`;
      return `✅ Faltam ${dias} dias`;
    };

    /**
     * Define cor baseada na urgência
     */
    const getCorStatus = (data) => {
      if (!data) return '#f0f0f0';
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const dataManutencao = new Date(data);
      dataManutencao.setHours(0, 0, 0, 0);
      
      const dias = Math.ceil((dataManutencao - hoje) / (1000 * 60 * 60 * 24));

      if (dias < 0) return '#ffe3e3';  // Vermelho - atrasada
      if (dias <= 7) return '#fff3cd';  // Amarelo - urgente
      return '#d3f9d8';                 // Verde - ok
    };

    // ===== LIFECYCLE =====
    
    /**
     * Quando o componente é montado, carrega as máquinas da store
     */
    onMounted(async () => {
      // Se a store estiver vazia, busca do backend
      if (machineStore.machines.length === 0) {
        await machineStore.fetchMachines();
      }
    });

    // ===== RETORNO =====
    return {
      machineStore,        // Expõe a store para o template
      mostrarFormulario,
      novaMaquina,
      sucesso,
      adicionarMaquina,
      removerMaquina,
      cancelarFormulario,
      formatarData,
      getDiasRestantes,
      getCorStatus
    };
  }
};
</script>

<style scoped>
.maquina-card {
  border-left: 4px solid #667eea;
  transition: transform 0.2s;
}

.maquina-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

h3 {
  color: #667eea;
  margin-bottom: 5px;
}
</style>