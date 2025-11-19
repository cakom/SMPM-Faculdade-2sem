// router/index.js - Configuração das rotas do Vue Router
// Define todas as páginas e seus caminhos de acesso

import { createRouter, createWebHistory } from 'vue-router'

// Importa as páginas (views) da aplicação
import Dashboard from '../views/Dashboard.vue'
import Calendar from '../views/Calendar.vue'
import MaintenanceList from '../views/MaintenanceList.vue'
import MaintenanceDetails from '../views/MaintenanceDetails.vue'

// Define as rotas da aplicação
const routes = [
  {
    path: '/', // Rota raiz
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard - SMPM' }
  },
  {
    path: '/calendario', // Rota do calendário
    name: 'Calendar',
    component: Calendar,
    meta: { title: 'Calendário - SMPM' }
  },
  {
    path: '/manutencoes', // Lista de manutenções
    name: 'MaintenanceList',
    component: MaintenanceList,
    meta: { title: 'Manutenções - SMPM' }
  },
  {
    path: '/manutencoes/:id', // Detalhes de uma manutenção específica
    name: 'MaintenanceDetails',
    component: MaintenanceDetails,
    meta: { title: 'Detalhes da Manutenção - SMPM' }
  },
  {
    // Rota 404 - página não encontrada
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// Cria o router com histórico de navegação
const router = createRouter({
  history: createWebHistory(), // Usa histórico HTML5 (sem #)
  routes
})

// Middleware para atualizar título da página
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'SMPM'
  next()
})

export default router