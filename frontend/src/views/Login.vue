<!--
  Login.vue - USANDO PINIA STORE
-->

<template>
  <div class="login-container">
    
    <div class="login-card">
      
      <div class="login-header">
        <h1>🔧 Sistema de Manutenção</h1>
        <p>Faça login para continuar</p>
      </div>

      <!-- Abas -->
      <div class="tabs">
        <button 
          @click="modo = 'login'" 
          :class="{ active: modo === 'login' }"
          class="tab"
        >
          Login
        </button>
        <button 
          @click="modo = 'registro'" 
          :class="{ active: modo === 'registro' }"
          class="tab"
        >
          Registrar
        </button>
      </div>

      <!-- Mensagem de erro da store -->
      <div v-if="userStore.error" class="alert alert-danger">
        {{ userStore.error }}
      </div>

      <!-- Mensagem de sucesso -->
      <div v-if="sucesso" class="alert alert-success">
        {{ sucesso }}
      </div>

      <!-- FORMULÁRIO DE LOGIN -->
      <form v-if="modo === 'login'" @submit.prevent="fazerLogin">
        
        <div class="form-group">
          <label>📧 Email:</label>
          <input 
            v-model="loginForm.email" 
            type="email" 
            placeholder="seu@email.com"
            required
          >
        </div>

        <div class="form-group">
          <label>🔒 Senha:</label>
          <input 
            v-model="loginForm.senha" 
            type="password" 
            placeholder="Sua senha"
            required
          >
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-full" 
          :disabled="userStore.loading"
        >
          {{ userStore.loading ? 'Entrando...' : '🚀 Entrar' }}
        </button>

      </form>

      <!-- FORMULÁRIO DE REGISTRO -->
      <form v-else @submit.prevent="fazerRegistro">
        
        <div class="form-group">
          <label>👤 Nome:</label>
          <input 
            v-model="registroForm.nome" 
            type="text" 
            placeholder="Seu nome completo"
            required
          >
        </div>

        <div class="form-group">
          <label>📧 Email:</label>
          <input 
            v-model="registroForm.email" 
            type="email" 
            placeholder="seu@email.com"
            required
          >
        </div>

        <div class="form-group">
          <label>🔒 Senha:</label>
          <input 
            v-model="registroForm.senha" 
            type="password" 
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
          >
        </div>

        <div class="form-group">
          <label>👔 Função:</label>
          <select v-model="registroForm.role">
            <option value="operador">Operador</option>
            <option value="tecnico">Técnico</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button 
          type="submit" 
          class="btn btn-success btn-full" 
          :disabled="userStore.loading"
        >
          {{ userStore.loading ? 'Registrando...' : '✅ Criar Conta' }}
        </button>

      </form>

    </div>

  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore'; // Importa a store

export default {
  name: 'Login',
  
  setup() {
    const router = useRouter();
    
    // ===== PINIA STORE =====
    const userStore = useUserStore();
    
    // ===== ESTADO LOCAL =====
    const modo = ref('login'); // 'login' ou 'registro'
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

    // ===== MÉTODOS =====

    /**
     * Faz login usando a store
     */
    const fazerLogin = async () => {
      // Limpa mensagens
      sucesso.value = '';
      userStore.clearError();

      try {
        // Chama action da store
        await userStore.login(
          loginForm.value.email, 
          loginForm.value.senha
        );

        // Sucesso! Redireciona
        sucesso.value = 'Login realizado com sucesso!';
        
        setTimeout(() => {
          router.push('/');
        }, 1000);

      } catch (error) {
        // Erro já está em userStore.error
        console.error('Erro no login:', error);
      }
    };

    /**
     * Faz registro usando a store
     */
    const fazerRegistro = async () => {
      sucesso.value = '';
      userStore.clearError();

      try {
        // Chama action da store
        await userStore.register(registroForm.value);

        // Sucesso! Muda para modo login
        sucesso.value = 'Conta criada! Faça login para continuar.';
        modo.value = 'login';
        
        // Preenche email no formulário de login
        loginForm.value.email = registroForm.value.email;
        
        // Limpa formulário de registro
        registroForm.value = {
          nome: '',
          email: '',
          senha: '',
          role: 'operador'
        };

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
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #667eea;
  margin-bottom: 10px;
  font-size: 28px;
}

.login-header p {
  color: #666;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.tab {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
}

.tab:hover {
  border-color: #667eea;
  color: #667eea;
}

.tab.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.btn-full {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 500px) {
  .login-card {
    padding: 25px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
}
</style>