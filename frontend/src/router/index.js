/**
 * router/index.js - Configuração das Rotas COM PROTEÇÃO
 * 
 * Agora com sistema de autenticação!
 * Rotas protegidas só podem ser acessadas se estiver logado.
 */

import { createRouter, createWebHistory } from 'vue-router';

// Importa as páginas
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Maquinas from '../views/Maquinas.vue';
import Manutencoes from '../views/Manutencoes.vue';
import Relatorios from '../views/Relatorios.vue';

/**
 * ROTAS DO SISTEMA
 */
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }  // Rota pública
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }   // Rota protegida
  },
  {
    path: '/maquinas',
    name: 'Maquinas',
    component: Maquinas,
    meta: { requiresAuth: true }
  },
  {
    path: '/manutencoes',
    name: 'Manutencoes',
    component: Manutencoes,
    meta: { requiresAuth: true }
  },
  {
    path: '/relatorios',
    name: 'Relatorios',
    component: Relatorios,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

/**
 * GUARD DE NAVEGAÇÃO
 * 
 * Verifica antes de cada mudança de página:
 * - Se a rota precisa de autenticação
 * - Se o usuário está logado
 * - Redireciona para login se necessário
 */
router.beforeEach((to, from, next) => {
  // Verifica se a rota precisa de autenticação
  const requerAutenticacao = to.meta.requiresAuth;
  
  // Verifica se tem token no localStorage
  const token = localStorage.getItem('token');
  
  // Se a rota precisa de autenticação E não tem token
  if (requerAutenticacao && !token) {
    // Redireciona para login
    next('/login');
  } 
  // Se está indo para login mas já está logado
  else if (to.path === '/login' && token) {
    // Redireciona para home
    next('/');
  } 
  // Se está tudo OK, continua normalmente
  else {
    next();
  }
});

export default router;