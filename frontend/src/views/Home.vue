<template>
  <div class="home-container">
    <!-- Background animado -->
    <div class="bg-circles">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="hero-title">Sistema de Manutenção Preventiva</h1>
        <p class="hero-subtitle">
          Gerencie máquinas, agende manutenções e acompanhe relatórios em tempo real
        </p>
      </div>
    </div>

    <!-- Cards de Navegação -->
    <div class="cards-grid">
      <!-- Card Máquinas -->
      <router-link to="/maquinas" class="nav-card card-machines">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
            <line x1="9" y1="21" x2="9" y2="9" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="card-title">Máquinas</h3>
        <p class="card-description">
          Cadastre e gerencie todas as máquinas do parque industrial
        </p>
        <div class="card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round"/>
            <polyline points="12 5 19 12 12 19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </router-link>

      <!-- Card Manutenções -->
      <router-link to="/manutencoes" class="nav-card card-maintenance">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" stroke-width="2"/>
            <path d="M12 1v6m0 6v6M23 12h-6m-6 0H5" stroke-width="2" stroke-linecap="round"/>
            <path d="M18.36 18.36l-4.24-4.24m0-4.24l4.24-4.24M5.64 18.36l4.24-4.24m0-4.24L5.64 5.64" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="card-title">Manutenções</h3>
        <p class="card-description">
          Registre manutenções preventivas, corretivas e preditivas
        </p>
        <div class="card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round"/>
            <polyline points="12 5 19 12 12 19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </router-link>

      <!-- Card Relatórios -->
      <router-link to="/relatorios" class="nav-card card-reports">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="20" x2="12" y2="10" stroke-width="2" stroke-linecap="round"/>
            <line x1="18" y1="20" x2="18" y2="4" stroke-width="2" stroke-linecap="round"/>
            <line x1="6" y1="20" x2="6" y2="16" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="card-title">Relatórios</h3>
        <p class="card-description">
          Visualize estatísticas e exporte relatórios em PDF
        </p>
        <div class="card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round"/>
            <polyline points="12 5 19 12 12 19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </router-link>
    </div>

    <!-- Tip Card -->
    <div class="tip-card">
      <div class="tip-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
          <path d="M12 16v-4m0-4h.01" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="tip-content">
        <h4 class="tip-title">Dica Rápida</h4>
        <p class="tip-text">
          Mantenha as manutenções em dia para evitar paradas não programadas e aumentar a vida útil dos equipamentos.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Página estática de navegação
</script>

<style scoped>
/* ============================================
   VARIÁVEIS - NOVA PALETA VERDE/TEAL
   ============================================ */
:root {
  --primary: #10b981;
  --secondary: #0d9488;
  --accent: #14b8a6;
  --dark: #065f46;
  --light: #d1fae5;
}

/* ============================================
   CONTAINER PRINCIPAL
   ============================================ */
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* ============================================
   CÍRCULOS DE FUNDO
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
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  bottom: -100px;
  right: -100px;
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
   HERO SECTION
   ============================================ */
.hero-section {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInDown 0.8s ease-out;
}

.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  border-radius: 24px;
  margin-bottom: 2rem;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.3);
  animation: bounce 2s infinite;
}

.hero-icon svg {
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #065f46;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #0d9488;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ============================================
   CARDS GRID
   ============================================ */
.cards-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

/* ============================================
   NAVIGATION CARDS
   ============================================ */
.nav-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 2.5rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.1);
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #10b981 0%, #14b8a6 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.nav-card:hover::before {
  transform: scaleX(1);
}

.nav-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.25);
  border-color: #10b981;
}

/* ============================================
   CARD ICONS (SVG)
   ============================================ */
.card-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  transition: all 0.4s ease;
}

.card-icon svg {
  width: 48px;
  height: 48px;
  stroke-width: 2;
}

.card-machines .card-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.card-maintenance .card-icon {
  background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
  color: #065f46;
}

.card-reports .card-icon {
  background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
  color: #065f46;
}

.nav-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

/* ============================================
   CARD CONTENT
   ============================================ */
.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.75rem;
}

.card-description {
  font-size: 1rem;
  color: #0d9488;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* ============================================
   CARD ARROW
   ============================================ */
.card-arrow {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  border-radius: 12px;
  transition: all 0.4s ease;
}

.card-arrow svg {
  width: 20px;
  height: 20px;
  color: white;
  stroke-width: 2;
}

.nav-card:hover .card-arrow {
  transform: translateX(8px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
}

/* ============================================
   TIP CARD
   ============================================ */
.tip-card {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.1);
  animation: fadeInUp 0.8s ease-out 0.4s backwards;
}

.tip-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 14px;
}

.tip-icon svg {
  width: 32px;
  height: 32px;
  color: #92400e;
  stroke-width: 2;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.5rem;
}

.tip-text {
  font-size: 1rem;
  color: #0d9488;
  line-height: 1.6;
  margin: 0;
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .home-container {
    padding: 1.5rem;
  }

  .hero-icon {
    width: 100px;
    height: 100px;
  }

  .hero-icon svg {
    width: 60px;
    height: 60px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .nav-card {
    padding: 2rem;
  }

  .card-icon {
    width: 70px;
    height: 70px;
  }

  .card-icon svg {
    width: 40px;
    height: 40px;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .tip-card {
    flex-direction: column;
    text-align: center;
  }

  .tip-icon {
    margin: 0 auto;
  }
}
</style>
