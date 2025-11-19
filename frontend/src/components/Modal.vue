<!-- components/Modal.vue - Modal reutilizável -->
<!-- Usado para exibir formulários, detalhes ou confirmações -->

<template>
  <!-- Overlay de fundo (backdrop) -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeModal"
      >
        <!-- Fundo escuro semitransparente -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Container centralizado -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Conteúdo do modal -->
          <div
            class="relative bg-white rounded-lg shadow-xl transform transition-all w-full"
            :class="sizeClasses"
            @click.stop
          >
            <!-- Cabeçalho do modal -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900">
                <slot name="header">{{ title }}</slot>
              </h3>
              
              <!-- Botão de fechar -->
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Corpo do modal -->
            <div class="p-6">
              <slot></slot>
            </div>
            
            <!-- Rodapé do modal (opcional) -->
            <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

// Props do componente
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl, full
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'close'])

// Computed: Classes de tamanho do modal
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  }
  return sizes[props.size]
})

// Função: Fecha o modal
function closeModal() {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>

<style scoped>
/* Animações de entrada e saída do modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
