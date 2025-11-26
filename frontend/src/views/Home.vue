<!--
  Home.vue - Página Inicial do Sistema
  
  Esta é a primeira página que aparece quando abre o sistema.
  Mostra um resumo geral e atalhos para outras páginas.
-->

<template>
  <div>
    
    <!-- Card de boas-vindas -->
    <div class="card">
      <h2>👋 Bem-vindo ao Sistema de Manutenção!</h2>
      <p>Gerencie suas máquinas e manutenções de forma simples e eficiente.</p>
    </div>

    <!-- Cards com atalhos -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
      
      <!-- Card de Máquinas -->
      <div class="card card-atalho" @click="irPara('/maquinas')">
        <div class="icone">🏭</div>
        <h3>Máquinas</h3>
        <p>Cadastre e gerencie suas máquinas</p>
        <button class="btn btn-primary">Acessar →</button>
      </div>

      <!-- Card de Manutenções -->
      <div class="card card-atalho" @click="irPara('/manutencoes')">
        <div class="icone">🔧</div>
        <h3>Manutenções</h3>
        <p>Registre e acompanhe manutenções</p>
        <button class="btn btn-success">Acessar →</button>
      </div>

    </div>

    <!-- Card informativo -->
    <div class="card" style="margin-top: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <h3>💡 Dica</h3>
      <p>Cadastre suas máquinas primeiro, depois registre as manutenções realizadas!</p>
    </div>

  </div>
</template>

<script>
// Importa o useRouter para navegação
import { useRouter } from 'vue-router';

export default {
  name: 'Home',
  
  setup() {
    // useRouter permite navegar entre páginas
    const router = useRouter();

    /**
     * Função para navegar para outra página
     * @param {string} caminho - Caminho da página (ex: '/maquinas')
     */
    const irPara = (caminho) => {
      router.push(caminho);
    };

    // Retorna as funções que o template vai usar
    return {
      irPara
    };
  }
};
</script>

<style scoped>
/* Estilos específicos da Home */

.card-atalho {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.card-atalho:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-color: #667eea;
}

.icone {
  font-size: 60px;
  margin-bottom: 15px;
}

.card-atalho h3 {
  color: #667eea;
  margin-bottom: 10px;
}

.card-atalho p {
  color: #666;
  margin-bottom: 20px;
}
</style>