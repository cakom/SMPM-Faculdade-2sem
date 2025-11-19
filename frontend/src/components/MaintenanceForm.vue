<!-- components/MaintenanceForm.vue - Formulário de manutenção -->
<!-- Usado para criar novas manutenções ou editar existentes -->

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Campo: Máquina -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Máquina *
      </label>
      <select
        v-model="formData.maquinaId"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecione uma máquina</option>
        <option
          v-for="machine in machines"
          :key="machine.id"
          :value="machine.id"
        >
          {{ machine.nome }} - {{ machine.setor }}
        </option>
      </select>
    </div>
    
    <!-- Campo: Tipo de Manutenção -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Tipo de Manutenção *
      </label>
      <select
        v-model="formData.tipo"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecione o tipo</option>
        <option value="preventiva">Preventiva</option>
        <option value="corretiva">Corretiva</option>
        <option value="preditiva">Preditiva</option>
      </select>
    </div>
    
    <!-- Campo: Data -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Data da Manutenção *
      </label>
      <input
        v-model="formData.data"
        type="date"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <!-- Campo: Técnico Responsável -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Técnico Responsável *
      </label>
      <input
        v-model="formData.tecnico"
        type="text"
        required
        placeholder="Nome do técnico"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <!-- Campo: Status -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Status *
      </label>
      <select
        v-model="formData.status"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="pendente">Pendente</option>
        <option value="em_andamento">Em Andamento</option>
        <option value="concluida">Concluída</option>
      </select>
    </div>
    
    <!-- Campo: Descrição -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Descrição
      </label>
      <textarea
        v-model="formData.descricao"
        rows="4"
        placeholder="Descreva as atividades realizadas..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
    
    <!-- Campo: Observações -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Observações
      </label>
      <textarea
        v-model="formData.observacoes"
        rows="3"
        placeholder="Observações adicionais..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
    
    <!-- Botões de ação -->
    <div class="flex justify-end space-x-4 pt-4 border-t">
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn-secondary"
      >
        Cancelar
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Salvando...</span>
        <span v-else>{{ isEditing ? 'Atualizar' : 'Criar' }} Manutenção</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props do componente
const props = defineProps({
  maintenance: {
    type: Object,
    default: null // Se fornecido, estamos editando
  },
  machines: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Determina se estamos editando ou criando
const isEditing = ref(!!props.maintenance)

// Dados do formulário
const formData = ref({
  maquinaId: '',
  tipo: '',
  data: '',
  tecnico: '',
  status: 'pendente',
  descricao: '',
  observacoes: ''
})

// Watch: Preenche formulário quando prop maintenance muda
watch(
  () => props.maintenance,
  (newVal) => {
    if (newVal) {
      formData.value = {
        maquinaId: newVal.maquinaId || '',
        tipo: newVal.tipo || '',
        data: newVal.data || '',
        tecnico: newVal.tecnico || '',
        status: newVal.status || 'pendente',
        descricao: newVal.descricao || '',
        observacoes: newVal.observacoes || ''
      }
      isEditing.value = true
    } else {
      resetForm()
      isEditing.value = false
    }
  },
  { immediate: true }
)

// Função: Submete o formulário
function handleSubmit() {
  // Validação básica
  if (!formData.value.maquinaId || !formData.value.tipo || !formData.value.data || !formData.value.tecnico) {
    alert('Por favor, preencha todos os campos obrigatórios')
    return
  }
  
  // Emite evento com dados do formulário
  emit('submit', {
    ...formData.value,
    id: props.maintenance?.id // Inclui ID se estiver editando
  })
}

// Função: Reseta o formulário
function resetForm() {
  formData.value = {
    maquinaId: '',
    tipo: '',
    data: '',
    tecnico: '',
    status: 'pendente',
    descricao: '',
    observacoes: ''
  }
}
</script>
