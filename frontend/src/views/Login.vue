<template>
  <div class="login-page">
    
    <!-- Card de Login com Glassmorphism -->
    <div class="login-card">
      
      <!-- Header -->
      <div class="login-header">
        <div class="logo">🔧</div>
        <h1 class="title">Sistema de Manutenção</h1>
        <p class="subtitle">Faça login para continuar</p>
      </div>

      <!-- Abas -->
      <div class="tabs">
        <button 
          @click="modo = 'login'" 
          :class="['tab', { active: modo === 'login' }]"
        >
          Login
        </button>
        <button 
          @click="modo = 'registro'" 
          :class="['tab', { active: modo === 'registro' }]"
        >
          Registrar
        </button>
      </div>

      <!-- Alertas -->
      <div v-if="userStore.error" class="alert alert-error">
        <span class="alert-icon">⚠️</span>
        {{ userStore.error }}
      </div>

      <div v-if="sucesso" class="alert alert-success">
        <span class="alert-icon">✅</span>
        {{ sucesso }}
      </div>

      <!-- FORMULÁRIO DE LOGIN -->
      <form v-if="modo === 'login'" @submit.prevent="fazerLogin" class="form">
        
        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">📧</span>
            Email
          </label>
          <input 
            v-model="loginForm.email" 
            type="email" 
            class="input-field"
            placeholder="seu@email.com"
            required
          >
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">🔒</span>
            Senha
          </label>
          <input 
            v-model="loginForm.senha" 
            type="password" 
            class="input-field"
            placeholder="Sua senha"
            required
          >
        </div>

        <button 
          type="submit" 
          class="btn-submit" 
          :disabled="userStore.loading"
        >
          <span v-if="!userStore.loading">🚀 Entrar</span>
          <span v-else class="loading-spinner">⏳ Entrando...</span>
        </button>

      </form>

      <!-- FORMULÁRIO DE REGISTRO -->
      <form v-else @submit.prevent="fazerRegistro" class="form">
        
        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">👤</span>
            Nome
          </label>
          <input 
            v-model="registroForm.nome" 
            type="text" 
            class="input-field"
            placeholder="Seu nome completo"
            required
          >
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">📧</span>
            Email
          </label>
          <input 
            v-model="registroForm.email" 
            type="email" 
            class="input-field"
            placeholder="seu@email.com"
            required
          >
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">🔒</span>
            Senha
          </label>
          <input 
            v-model="registroForm.senha" 
            type="password" 
            class="input-field"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
          >
        </div>

        <div class="input-group">
          <label class="input-label">
            <span class="label-icon">👔</span>
            Função
          </label>
          <select v-model="registroForm.role" class="input-field">
            <option value="operador">Operador</option>
            <option value="tecnico">Técnico</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button 
          type="submit" 
          class="btn-submit" 
          :disabled="userStore.loading"
        >
          <span v-if="!userStore.loading">✅ Criar Conta</span>
          <span v-else class="loading-spinner">⏳ Registrando...</span>
        </button>

      </form>

    </div>

    <!-- Backdrop decorativo -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'Login',
  
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    const modo = ref('login');
    const sucesso = ref('');
    
    const loginForm = ref({
      email: '',
      senha: ''
    });
    
    const registroForm = ref({
      nome: '',
      email: '',
      senha: '',
      role: 'operador'
    });

    const fazerLogin = async () => {
      sucesso.value = '';
      userStore.clearError();

      try {
        await userStore.login(loginForm.value.email, loginForm.value.senha);
        sucesso.value = 'Login realizado com sucesso!';
        setTimeout(() => router.push('/'), 1000);
      } catch (error) {
        console.error('Erro no login:', error);
      }
    };

    const fazerRegistro = async () => {
      sucesso.value = '';
      userStore.clearError();

      try {
        await userStore.register(registroForm.value);
        sucesso.value = 'Conta criada! Faça login para continuar.';
        modo.value = 'login';
        loginForm.value.email = registroForm.value.email;
        registroForm.value = { nome: '', email: '', senha: '', role: 'operador' };
      } catch (error) {
        console.error('Erro no registro:', error);
      }
    };

    return {
      userStore,
      modo,
      sucesso,
      loginForm,
      registroForm,
      fazerLogin,
      fazerRegistro
    };
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* ========================================
   CARD DE LOGIN COM GLASSMORPHISM
   ======================================== */

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: slideInUp 0.6s ease-out;
  position: relative;
  z-index: 10;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
}

/* ========================================
   ABAS
   ======================================== */

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.tab {
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.05rem;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.3s ease;
}

.tab:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* ========================================
   ALERTAS
   ======================================== */

.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
  border: 2px solid #10b981;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 2px solid #ef4444;
}

.alert-icon {
  font-size: 1.5rem;
}

/* ========================================
   FORMULÁRIO
   ======================================== */

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.25rem;
}

.input-field {
  width: 100%;
  padding: 0.875rem 1.125rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
  color: #1f2937;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.input-field::placeholder {
  color: #9ca3af;
}

/* ========================================
   BOTÃO SUBMIT
   ======================================== */

.btn-submit {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ========================================
   DECORAÇÃO DE FUNDO
   ======================================== */

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -80px;
  left: -80px;
  animation: float 15s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 10%;
  animation: float 25s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

/* ========================================
   RESPONSIVIDADE
   ======================================== */

@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  .logo {
    font-size: 3rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .input-field {
    padding: 0.75rem 1rem;
  }

  .btn-submit {
    padding: 0.875rem;
    font-size: 1rem;
  }
}
</style>
