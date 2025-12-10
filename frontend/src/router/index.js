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

// Guard de navegação com segurança reforçada
router.beforeEach((to, from, next) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('token');
  
  // Verifica se a rota precisa de autenticação
  const requerAutenticacao = to.meta.requiresAuth !== false;
  
  console.log('🔒 Router Guard:', {
    para: to.path,
    requerAuth: requerAutenticacao,
    temToken: !!token
  });
  
  // Se a rota precisa de autenticação E não tem token
  if (requerAutenticacao && !token) {
    console.log('❌ SEM TOKEN - Redirecionando para /login');
    // Redireciona para login
    next('/login');
    return;
  }
  
  // Se está indo para login mas já está logado
  if (to.path === '/login' && token) {
    console.log('✅ JÁ LOGADO - Redirecionando para /');
    // Redireciona para home
    next('/');
    return;
  }
  
  // Se está tudo OK, continua
  console.log('✅ AUTORIZADO - Permitindo acesso');
  next();
});

export default router;
