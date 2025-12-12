<template>
  <div id="app">
    <!-- Navbar - só mostra se estiver logado -->
    <nav v-if="userStore.isAuthenticated" class="navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand">
          <span class="brand-icon">🔧</span>
          <span class="brand-text">Sistema de Manutenção</span>
        </router-link>

        <!-- Menu Desktop -->
        <div class="navbar-menu" :class="{ 'mobile-open': mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            <span class="nav-icon">🏠</span>
            <span>Home</span>
          </router-link>
          
          <router-link to="/maquinas" class="nav-link" @click="closeMobileMenu">
            <span class="nav-icon">🏭</span>
            <span>Máquinas</span>
          </router-link>
          
          <router-link to="/manutencoes" class="nav-link" @click="closeMobileMenu">
            <span class="nav-icon">🔧</span>
            <span>Manutenções</span>
          </router-link>
          
          <router-link to="/relatorios" class="nav-link" @click="closeMobileMenu">
            <span class="nav-icon">📊</span>
            <span>Relatórios</span>
          </router-link>
        </div>

        <!-- Usuário e Logout -->
        <div class="navbar-user">
          <div class="user-info">
            <span class="user-icon">👤</span>
            <span class="user-name">{{ userStore.userName }}</span>
          </div>
          <button @click="handleLogout" class="btn-logout">
            <span>🚪</span>
            Sair
          </button>
        </div>

        <!-- Botão Mobile -->
        <button class="mobile-toggle" @click="toggleMobileMenu">
          <span v-if="!mobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </nav>

    <!-- Conteúdo Principal -->
    <main class="main-content" :class="{ 'with-navbar': userStore.isAuthenticated }">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer v-if="userStore.isAuthenticated" class="footer">
      <p>Sistema de Manutenção Preventiva © 2025</p>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/userStore.js';

export default {
  name: 'App',
  
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const mobileMenuOpen = ref(false);

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
    };

    const handleLogout = () => {
      if (confirm('Tem certeza que deseja sair?')) {
        userStore.logout();
      }
    };

    onMounted(() => {
      userStore.restoreSession();
    });

    return {
      userStore,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    };
  }
};
</script>

<style scoped>
/* ========================================
   NAVBAR
   ======================================== */

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  transition: transform 0.2s;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.brand-icon {
  font-size: 1.75rem;
}

.brand-text {
  display: none;
}

@media (min-width: 768px) {
  .brand-text {
    display: block;
  }
}

/* Menu */
.navbar-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
}

/* Usuário */
.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: none;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 500;
}

@media (min-width: 768px) {
  .user-info {
    display: flex;
  }
}

.user-icon {
  font-size: 1.5rem;
}

.user-name {
  font-size: 0.95rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0.5rem;
}

/* ========================================
   CONTEÚDO PRINCIPAL
   ======================================== */

.main-content {
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

.main-content.with-navbar {
  min-height: calc(100vh - 140px);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ========================================
   FOOTER
   ======================================== */

.footer {
  background: white;
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
  border-top: 1px solid #e5e7eb;
  font-size: 0.9rem;
}

/* ========================================
   RESPONSIVIDADE MOBILE
   ======================================== */

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .mobile-toggle {
    display: block;
  }

  .navbar-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .navbar-menu.mobile-open {
    transform: translateX(0);
  }

  .nav-link {
    padding: 1rem;
    font-size: 1.1rem;
  }

  .navbar-user {
    display: none;
  }

  .main-content {
    padding: 1rem 0;
  }

  .content-wrapper {
    padding: 0 1rem;
  }
}
</style>