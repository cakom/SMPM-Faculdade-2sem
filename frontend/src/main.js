/**
 * main.js - Arquivo Principal COM PINIA (CORRIGIDO)
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Cria a aplicação Vue
const app = createApp(App);

// Cria instância do Pinia
const pinia = createPinia();

// Adiciona Pinia e Router
app.use(pinia);
app.use(router);

// Monta a aplicação
app.mount('#app');

// IMPORTANTE: Restaura sessão APÓS montar
setTimeout(() => {
  try {
    const { useUserStore } = require('./stores/userStore');
    const userStore = useUserStore();
    userStore.restoreSession();
  } catch (error) {
    console.log('Store ainda não carregada');
  }
}, 100);