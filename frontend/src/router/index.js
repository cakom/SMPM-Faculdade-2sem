/* Configuração das Rotas o Router é como um "GPS" do sistema.
 * Ele define quais páginas existem e seus caminhos.
 * Exemplo: quando você acessa "/maquinas", 
 * ele mostra a página Maquinas.vue
 */

// Importa as funções necessárias do Vue Router
import { createRouter, createWebHistory } from 'vue-router';

// Importa as páginas que vamos usar
import Maquinas from '../views/Maquinas.vue';
import Home from '../views/Home.vue';
import Manutencoes from '../views/Manutencoes.vue';

/**
 * ROTAS - Lista de todas as páginas do sistema
 * 
 * Cada rota tem:
 * - path: o caminho na URL (ex: /maquinas)
 * - name: um nome amigável para a rota
 * - component: qual página mostrar
 */
const routes = [
  {
    path: '/',              // Página inicial (quando abre o sistema)
    name: 'Home',           // Nome da rota
    component: Home         // Mostra a página Home.vue
  },
  {
    path: '/maquinas',      // URL: localhost:8080/maquinas
    name: 'Maquinas',
    component: Maquinas     // Mostra a página Maquinas.vue
  },
  {
    path: '/manutencoes',   // URL: localhost:8080/manutencoes
    name: 'Manutencoes',
    component: Manutencoes  // Mostra a página Manutencoes.vue
  }
];

/**
 * CRIA O ROUTER
 * 
 * createRouter() cria o sistema de navegação
 * history: createWebHistory() - URLs bonitas sem "#"
 * routes: a lista de páginas que criamos acima
 */
const router = createRouter({
  history: createWebHistory(),  // URLs ficam: /maquinas ao invés de /#/maquinas
  routes                         // Usa as rotas definidas acima
});

// Exporta o router para usar no main.js
export default router;