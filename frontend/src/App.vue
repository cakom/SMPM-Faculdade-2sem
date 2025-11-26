<!--
  App.vue - Componente Principal COM MENU
-->

<template>
  <div id="app">
    
    <!-- Menu só aparece se estiver logado -->
    <header v-if="estaLogado">
      <div class="menu-container">
        <h1>🔧 Sistema de Manutenção</h1>
        
        <nav class="menu">
          <router-link to="/" class="menu-item">🏠 Home</router-link>
          <router-link to="/maquinas" class="menu-item">🏭 Máquinas</router-link>
          <router-link to="/manutencoes" class="menu-item">🔧 Manutenções</router-link>
          <router-link to="/relatorios" class="menu-item">📊 Relatórios</router-link>
        </nav>
        
        <div class="user-info">
          <span>👤 {{ nomeUsuario }}</span>
          <button @click="fazerLogout" class="btn-logout">🚪 Sair</button>
        </div>
      </div>
    </header>

    <!-- Conteúdo das páginas -->
    <main :class="{ 'with-header': estaLogado }">
      <router-view></router-view>
    </main>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { logout } from './services/api.js';

export default {
  name: 'App',
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const nomeUsuario = ref('');

    // Verifica se está logado baseado no token
    const estaLogado = computed(() => {
      return !!localStorage.getItem('token') && route.path !== '/login';
    });

    /**
     * Atualiza informações do usuário
     */
    const atualizarUsuario = () => {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        nomeUsuario.value = userData.nome;
      }
    };

    /**
     * Faz logout
     */
    const fazerLogout = () => {
      if (confirm('Deseja realmente sair?')) {
        logout(); // Limpa localStorage
        router.push('/login');
      }
    };

    // Atualiza usuário quando monta o componente
    onMounted(() => {
      atualizarUsuario();
    });

    // Atualiza usuário quando a rota muda
    watch(route, () => {
      atualizarUsuario();
    });

    return {
      estaLogado,
      nomeUsuario,
      fazerLogout
    };
  }
};
</script>

<style>
/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  min-height: 100vh;
}

/* Header/Menu */
header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.menu-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

header h1 {
  font-size: 24px;
  white-space: nowrap;
}

/* Menu de navegação */
.menu {
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: center;
}

.menu-item {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: 500;
}

.menu-item:hover {
  background: rgba(255,255,255,0.2);
}

.menu-item.router-link-active {
  background: rgba(255,255,255,0.3);
  font-weight: 600;
}

/* Info do usuário */
.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-logout {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: white;
  color: #667eea;
}

/* Conteúdo principal */
main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

main.with-header {
  min-height: calc(100vh - 70px);
}

/* Estilos globais reutilizáveis */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5568d3;
  transform: translateY(-2px);
}

.btn-success {
  background-color: #51cf66;
  color: white;
}

.btn-success:hover {
  background-color: #40c057;
}

.btn-danger {
  background-color: #ff6b6b;
  color: white;
}

.btn-danger:hover {
  background-color: #ee5a52;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.alert {
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.alert-success {
  background-color: #d3f9d8;
  color: #2b8a3e;
  border-left: 4px solid #51cf66;
}

.alert-danger {
  background-color: #ffe3e3;
  color: #c92a2a;
  border-left: 4px solid #ff6b6b;
}

/* Responsivo */
@media (max-width: 768px) {
  .menu-container {
    flex-direction: column;
    gap: 15px;
  }
  
  header h1 {
    font-size: 20px;
  }
  
  .menu {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .menu-item {
    padding: 8px 15px;
    font-size: 14px;
  }
  
  .user-info {
    width: 100%;
    justify-content: center;
  }
  
  main {
    padding: 15px 10px;
  }
}
</style>