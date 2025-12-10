import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Maquinas from '../views/Maquinas.vue';
import Manutencoes from '../views/Manutencoes.vue';
import Relatorios from '../views/Relatorios.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requerAutenticacao = to.meta.requiresAuth;
  
  // Se a rota precisa de autenticação E não tem token
  if (requerAutenticacao && !token) {
    next('/login');
  } 
  // Se está indo para login mas já está logado
  else if (to.path === '/login' && token) {
    next('/');
  } 
  // Se está tudo OK, continua
  else {
    next();
  }
});

export default router;
