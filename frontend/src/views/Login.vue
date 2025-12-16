<template>
  <div class="login-container">
    <!-- Background circles -->
    <div class="bg-circles">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Login Card -->
    <div class="login-card">
      <!-- Logo/Icon -->
      <div class="logo-container">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="logo-title">Sistema de Manutenção</h2>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          :class="['tab', { active: !isRegistro }]"
          @click="isRegistro = false"
        >
          Login
        </button>
        <button 
          :class="['tab', { active: isRegistro }]"
          @click="isRegistro = true"
        >
          Cadastro
        </button>
      </div>

      <!-- Alerts -->
      <div v-if="mensagem" :class="['alert', mensagem.tipo]">
        <svg v-if="mensagem.tipo === 'sucesso'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
          <line x1="15" y1="9" x2="9" y2="15" stroke-width="2" stroke-linecap="round"/>
          <line x1="9" y1="9" x2="15" y2="15" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>{{ mensagem.texto }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="form">
        <!-- Nome (só no registro) -->
        <div v-if="isRegistro" class="input-group">
          <label for="nome" class="label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke-width="2"/>
            </svg>
            Nome Completo
          </label>
          <input
            id="nome"
            v-model="formData.nome"
            type="text"
            placeholder="Digite seu nome"
            class="input"
            required
          />
        </div>

        <!-- Email -->
        <div class="input-group">
          <label for="email" class="label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke-width="2"/>
              <polyline points="22,6 12,13 2,6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            E-mail
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Digite seu e-mail"
            class="input"
            required
          />
        </div>

        <!-- Senha -->
        <div class="input-group">
          <label for="senha" class="label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Senha
          </label>
          <input
            id="senha"
            v-model="formData.senha"
            type="password"
            placeholder="Digite sua senha"
            class="input"
            required
          />
        </div>

        <!-- Função (só no registro) -->
        <div v-if="isRegistro" class="input-group">
          <label for="role" class="label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Função
          </label>
          <select id="role" v-model="formData.role" class="input">
            <option value="operador">Operador</option>
            <option value="tecnico">Técnico</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading">{{ isRegistro ? 'Cadastrar' : 'Entrar' }}</span>
          <span v-else class="loading-spinner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'

const router = useRouter()
const authStore = useAuthStore()

const isRegistro = ref(false)
const loading = ref(false)
const mensagem = ref(null)

const formData = ref({
  nome: '',
  email: '',
  senha: '',
  role: 'operador'
})

const handleSubmit = async () => {
  loading.value = true
  mensagem.value = null

  try {
    if (isRegistro.value) {
      await authStore.registro(formData.value)
      mensagem.value = { tipo: 'sucesso', texto: 'Cadastro realizado com sucesso!' }
      setTimeout(() => {
        isRegistro.value = false
        formData.value = { nome: '', email: '', senha: '', role: 'operador' }
      }, 2000)
    } else {
      await authStore.login(formData.value.email, formData.value.senha)
      mensagem.value = { tipo: 'sucesso', texto: 'Login realizado com sucesso!' }
      setTimeout(() => router.push('/'), 1000)
    }
  } catch (erro) {
    mensagem.value = { 
      tipo: 'erro', 
      texto: erro.message || 'Erro ao processar requisição' 
    }
  } finally {
    loading.value = false
    setTimeout(() => mensagem.value = null, 5000)
  }
}
</script>

<style scoped>
/* ============================================
   VARIÁVEIS - PALETA VERDE/TEAL
   ============================================ */
:root {
  --primary: #10b981;
  --secondary: #0d9488;
  --accent: #14b8a6;
  --dark: #065f46;
  --light: #d1fae5;
}

/* ============================================
   CONTAINER
   ============================================ */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* ============================================
   BACKGROUND CIRCLES
   ============================================ */
.bg-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  bottom: -80px;
  right: -80px;
  animation-delay: 5s;
}

.circle-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #0d9488 0%, #065f46 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(10deg); }
}

/* ============================================
   LOGIN CARD
   ============================================ */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: fadeInUp 0.6s ease-out;
}

/* ============================================
   LOGO
   ============================================ */
.logo-container {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  border-radius: 20px;
  margin-bottom: 1rem;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
  animation: bounce 2s infinite;
}

.logo-icon svg {
  width: 48px;
  height: 48px;
  color: white;
  stroke-width: 2;
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #065f46;
  margin: 0;
}

/* ============================================
   TABS
   ============================================ */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #f0fdfa;
  padding: 0.5rem;
  border-radius: 12px;
}

.tab {
  flex: 1;
  padding: 0.875rem;
  border: none;
  background: transparent;
  color: #0d9488;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab.active {
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.tab:hover:not(.active) {
  background: rgba(16, 185, 129, 0.1);
}

/* ============================================
   ALERTS
   ============================================ */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  animation: slideInDown 0.4s ease-out;
}

.alert svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  stroke-width: 2;
}

.alert.sucesso {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.alert.erro {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

/* ============================================
   FORM
   ============================================ */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #065f46;
}

.label svg {
  width: 18px;
  height: 18px;
  color: #10b981;
  stroke-width: 2;
}

.input {
  padding: 0.875rem 1.125rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  color: #065f46;
  background: white;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  transform: translateY(-2px);
}

.input::placeholder {
  color: #9ca3af;
}

/* ============================================
   SUBMIT BUTTON
   ============================================ */
.btn-submit {
  margin-top: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  color: white;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ============================================
   LOADING SPINNER
   ============================================ */
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner svg {
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  .logo-icon {
    width: 70px;
    height: 70px;
  }

  .logo-icon svg {
    width: 40px;
    height: 40px;
  }

  .logo-title {
    font-size: 1.25rem;
  }
}
</style>
