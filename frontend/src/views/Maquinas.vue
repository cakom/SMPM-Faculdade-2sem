<!--
  Maquinas.vue - CONECTADO COM API
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
    <div v-if="erro" class="alert alert-danger">{{ erro }}</div>
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

      <button @click="adicionarMaquina" class="btn btn-success" :disabled="carregando">
        {{ carregando ? '⏳ Salvando...' : '✅ Salvar Máquina' }}
      </button>
      <button @click="mostrarFormulario = false" class="btn btn-danger" style="margin-left: 10px;">
        ❌ Cancelar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="carregando && !mostrarFormulario" class="card">
      <p style="text-align: center;">⏳ Carregando máquinas...</p>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="maquinas.length === 0" class="card">
      <p style="text-align: center; color: #999;">
        📭 Nenhuma máquina cadastrada ainda. Clique em "Adicionar Máquina" para começar!
      </p>
    </div>

    <!-- Lista de máquinas -->
    <div v-else>
      <div v-for="maquina in maquinas" :key="maquina._id" class="card maquina-card">
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3>🔧 {{ maquina.nome }}</h3>
            <p style="color: #666;">{{ maquina.tipo }} - {{ maquina.local }}</p>
          </div>
          <button @click="removerMaquina(maquina._id)" class="btn btn-danger">
            🗑️ Remover
          </button>
        </div>

        <div style="margin-top: 15px; padding: 15px; border-radius: 8px;" 
             :style="{ backgroundColor: getCorStatus(maquina.proximaManutencao) }">
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
import { listarMaquinas, criarMaquina, removerMaquina as removerMaquinaAPI } from '../services/api.js';

export default {
  name: 'Maquinas',
  
  setup() {
    const mostrarFormulario = ref(false);
    const maquinas = ref([]);
    const carregando = ref(false);
    const erro = ref('');
    const sucesso = ref('');
    
    const novaMaquina = ref({
      nome: '',
      tipo: '',
      local: '',
      proximaManutencao: ''
    });

    /**
     * Carrega máquinas do banco de dados
     */
    const carregarMaquinas = async () => {
      carregando.value = true;
      erro.value = '';
      
      try {
        maquinas.value = await listarMaquinas();
      } catch (error) {
        erro.value = 'Erro ao carregar máquinas: ' + error.message;
      } finally {
        carregando.value = false;
      }
    };

    /**
     * Adiciona nova máquina
     */
    const adicionarMaquina = async () => {
      if (!novaMaquina.value.nome || !novaMaquina.value.tipo) {
        erro.value = '⚠️ Preencha pelo menos o nome e tipo da máquina!';
        return;
      }

      carregando.value = true;
      erro.value = '';
      
      try {
        await criarMaquina(novaMaquina.value);
        
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
        
        // Recarrega lista
        await carregarMaquinas();
        
      } catch (error) {
        erro.value = 'Erro ao adicionar máquina: ' + error.message;
      } finally {
        carregando.value = false;
      }
    };

    /**
     * Remove máquina
     */
    const removerMaquina = async (id) => {
      if (!confirm('Tem certeza que deseja remover esta máquina?')) return;
      
      carregando.value = true;
      
      try {
        await removerMaquinaAPI(id);
        sucesso.value = '🗑️ Máquina removida!';
        setTimeout(() => sucesso.value = '', 3000);
        
        // Recarrega lista
        await carregarMaquinas();
        
      } catch (error) {
        erro.value = 'Erro ao remover máquina: ' + error.message;
      } finally {
        carregando.value = false;
      }
    };

    const formatarData = (data) => {
      if (!data) return 'Não definida';
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    };

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

    const getCorStatus = (data) => {
      if (!data) return '#f0f0f0';
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const dataManutencao = new Date(data);
      dataManutencao.setHours(0, 0, 0, 0);
      
      const dias = Math.ceil((dataManutencao - hoje) / (1000 * 60 * 60 * 24));

      if (dias < 0) return '#ffe3e3';
      if (dias <= 7) return '#fff3cd';
      return '#d3f9d8';
    };

    // Carrega máquinas quando monta o componente
    onMounted(() => {
      carregarMaquinas();
    });

    return {
      mostrarFormulario,
      maquinas,
      novaMaquina,
      carregando,
      erro,
      sucesso,
      adicionarMaquina,
      removerMaquina,
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