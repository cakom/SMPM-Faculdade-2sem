/**
 * router/index.js - Configuração das Rotas COM PROTEÇÃO
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Views
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Maquinas from '../views/Maquinas.vue'
import Manutencoes from '../views/Manutencoes.vue'
import Relatorios from '../views/Relatorios.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 🔐 GUARD GLOBAL
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const precisaAuth = to.meta.requiresAuth
  const estaLogado = authStore.isAuthenticated

  // 🔒 Rota protegida sem login
  if (precisaAuth && !estaLogado) {
    return next('/login')
  }

  // 🔁 Indo para login já logado
  if (to.path === '/login' && estaLogado) {
    return next('/')
  }

  // ✅ Tudo ok
  next()
})

export default router
