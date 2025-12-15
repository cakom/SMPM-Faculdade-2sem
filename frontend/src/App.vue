<template>
  <div id="app">
    <!-- Navbar - só mostra se estiver logado -->
    <nav v-if="userStore.isAuthenticated" class="navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" stroke-width="2"/>
              <path d="M12 1v4m0 14v4m-7.07-15.07l2.83 2.83m8.48 8.48l2.83 2.83M1 12h4m14 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="brand-text">SMPM</span>
        </router-link>

        <!-- Menu Desktop -->
        <div class="navbar-menu" :class="{ 'mobile-open': mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Dashboard</span>
          </router-link>
          
          <router-link to="/maquinas" class="nav-link" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
              <line x1="9" y1="21" x2="9" y2="9" stroke-width="2"/>
            </svg>
            <span>Máquinas</span>
          </router-link>
          
          <router-link to="/manutencoes" class="nav-link" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" stroke-width="2"/>
              <path d="M12 1v4m0 14v4" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Manutenções</span>
          </router-link>

          <router-link to="/calendario" class="nav-link" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
            </svg>
            <span>Calendário</span>
          </router-link>
          
          <router-link to="/relatorios" class="nav-link" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="20" x2="12" y2="10" stroke-width="2" stroke-linecap="round"/>
              <line x1="18" y1="20" x2="18" y2="4" stroke-width="2" stroke-linecap="round"/>
              <line x1="6" y1="20" x2="6" y2="16" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Relatórios</span>
          </router-link>

          <router-link v-if="userStore.isAdmin" to="/usuarios" class="nav-link" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Usuários</span>
          </router-link>

          <!-- Menu mobile: logout -->
          <button class="nav-link logout-mobile" @click="handleLogout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Sair</span>
          </button>
        </div>

        <!-- Usuário e Logout Desktop -->
        <div class="navbar-user">
          <div class="user-info">
            <div class="user-avatar">
              {{ userStore.userName?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ userStore.userName }}</span>
              <span class="user-role">{{ userStore.isAdmin ? 'Administrador' : 'Usuário' }}</span>
            </div>
          </div>
          <button @click="handleLogout" class="btn-logout" title="Sair">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Botão Mobile -->
        <button class="mobile-toggle" @click="toggleMobileMenu">
          <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="3" y1="6" x2="21" y2="6" stroke-width="2" stroke-linecap="round"/>
            <line x1="3" y1="12" x2="21" y2="12" stroke-width="2" stroke-linecap="round"/>
            <line x1="3" y1="18" x2="21" y2="18" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </nav>

    <!-- Conteúdo Principal -->
    <main class="main-content" :class="{ 'with-navbar': userStore.isAuthenticated }">
      <router-view />
    </main>

    <!-- Footer -->
    <footer v-if="userStore.isAuthenticated" class="footer">
      <p>SMPM - Sistema de Manutenção Preventiva de Máquinas © 2025</p>
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
        closeMobileMenu();
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

<style>
/* Reset Global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
/* ========================================
   NAVBAR
   ======================================== */

.navbar {
  background: linear-gradient(135deg, #065f46 0%, #0d9488 100%);
  box-shadow: 0 4px 20px rgba(6, 95, 70, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
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
  font-weight: 800;
  font-size: 1.5rem;
  transition: transform 0.2s;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.brand-icon {
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.brand-icon svg {
  width: 26px;
  height: 26px;
  stroke-width: 2;
}

.brand-text {
  letter-spacing: 1px;
}

/* Menu */
.navbar-menu {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.9rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

.nav-link svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-mobile {
  display: none;
}

/* Usuário Desktop */
.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
}

.user-role {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.625rem;
  border-radius: 10px;
  transition: all 0.2s;
}

.mobile-toggle svg {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.mobile-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* ========================================
   CONTEÚDO PRINCIPAL
   ======================================== */

.main-content {
  flex: 1;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  min-height: calc(100vh - 70px);
}

.main-content.with-navbar {
  min-height: calc(100vh - 130px);
}

/* ========================================
   FOOTER
   ======================================== */

.footer {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
  text-align: center;
  color: #065f46;
  border-top: 1px solid rgba(16, 185, 129, 0.2);
  font-size: 0.875rem;
  font-weight: 500;
}

/* ========================================
   RESPONSIVIDADE MOBILE
   ======================================== */

@media (max-width: 1024px) {
  .user-details {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .brand-text {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #065f46 0%, #0d9488 100%);
    flex-direction: column;
    padding: 1.5rem;
    gap: 0.5rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
  }

  .navbar-menu.mobile-open {
    transform: translateX(0);
  }

  .nav-link {
    padding: 1rem 1.25rem;
    font-size: 1.1rem;
    border-radius: 12px;
  }

  .nav-link svg {
    width: 24px;
    height: 24px;
  }

  .logout-mobile {
    display: flex;
    margin-top: auto;
    background: rgba(239, 68, 68, 0.2);
    color: #fecaca;
  }

  .logout-mobile:hover {
    background: rgba(239, 68, 68, 0.4);
  }

  .navbar-user {
    display: none;
  }

  .main-content {
    min-height: calc(100vh - 70px);
  }
}
</style>