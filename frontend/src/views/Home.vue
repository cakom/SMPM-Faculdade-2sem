<template>
  <div class="home-page">
    
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="wave">👋</span>
          Bem-vindo, {{ userStore.userName }}!
        </h1>
        <p class="hero-subtitle">Gerencie suas máquinas e manutenções de forma eficiente</p>
      </div>
    </div>

    <!-- Cards de Atalho com Glassmorphism -->
    <div class="cards-grid">
      
      <!-- Card Máquinas -->
      <div class="glass-card" @click="irPara('/maquinas')">
        <div class="card-icon machines">🏭</div>
        <h3 class="card-title">Máquinas</h3>
        <p class="card-description">Cadastre e gerencie suas máquinas industriais</p>
        <div class="card-footer">
          <span class="card-link">Acessar →</span>
        </div>
      </div>

      <!-- Card Manutenções -->
      <div class="glass-card" @click="irPara('/manutencoes')">
        <div class="card-icon maintenance">🔧</div>
        <h3 class="card-title">Manutenções</h3>
        <p class="card-description">Registre e acompanhe todas as manutenções</p>
        <div class="card-footer">
          <span class="card-link">Acessar →</span>
        </div>
      </div>

      <!-- Card Relatórios -->
      <div class="glass-card" @click="irPara('/relatorios')">
        <div class="card-icon reports">📊</div>
        <h3 class="card-title">Relatórios</h3>
        <p class="card-description">Visualize estatísticas e gere relatórios</p>
        <div class="card-footer">
          <span class="card-link">Acessar →</span>
        </div>
      </div>

    </div>

    <!-- Dica -->
    <div class="tip-card">
      <div class="tip-icon">💡</div>
      <div class="tip-content">
        <h4>Dica do Sistema</h4>
        <p>Cadastre suas máquinas primeiro, depois registre as manutenções realizadas para manter o histórico completo!</p>
      </div>
    </div>

  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'Home',
  
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const irPara = (caminho) => {
      router.push(caminho);
    };

    return {
      userStore,
      irPara
    };
  }
};
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* ========================================
   HERO SECTION
   ======================================== */

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease-out;
}

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

.hero-content {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.wave {
  display: inline-block;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-20deg); }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  font-weight: 500;
}

/* ========================================
   CARDS GRID COM GLASSMORPHISM
   ======================================== */

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px) saturate(180%);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.glass-card:nth-child(1) { animation-delay: 0.1s; }
.glass-card:nth-child(2) { animation-delay: 0.2s; }
.glass-card:nth-child(3) { animation-delay: 0.3s; }

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

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.glass-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
  background: rgba(255, 255, 255, 0.35);
  border-color: rgba(255, 255, 255, 0.6);
}

.glass-card:hover::before {
  transform: scaleX(1);
}

/* Card Icon */
.card-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  border-radius: 20px;
  transition: transform 0.4s ease;
}

.glass-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-icon.machines {
  background: linear-gradient(135deg, #667eea33, #764ba233);
}

.card-icon.maintenance {
  background: linear-gradient(135deg, #10b98133, #05966933);
}

.card-icon.reports {
  background: linear-gradient(135deg, #3b82f633, #1d4ed833);
}

/* Card Content */
.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.card-description {
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.card-link {
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.glass-card:hover .card-link {
  transform: translateX(5px);
  display: inline-block;
}

/* ========================================
   TIP CARD
   ======================================== */

.tip-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(16px) saturate(180%);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out 0.4s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tip-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.tip-content h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.tip-content p {
  color: #4b5563;
  line-height: 1.6;
}

/* ========================================
   RESPONSIVIDADE
   ======================================== */

@media (max-width: 768px) {
  .home-page {
    padding: 1rem;
  }

  .hero-content {
    padding: 2rem 1.5rem;
  }

  .hero-title {
    font-size: 1.75rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .glass-card {
    padding: 1.5rem;
  }

  .card-icon {
    width: 80px;
    height: 80px;
    font-size: 3rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .tip-card {
    flex-direction: column;
    padding: 1.5rem;
  }

  .tip-icon {
    font-size: 2.5rem;
  }
}
</style>
