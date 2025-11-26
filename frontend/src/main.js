/**
 * main.js - Arquivo Principal da Aplicação
 * 
 * Este é o "coração" do sistema.
 * Ele inicia tudo e conecta:
 * - Vue (framework)
 * - App.vue (componente principal)
 * - Router (navegação entre páginas)
 */

// Importa a função para criar aplicação Vue
import { createApp } from 'vue';

// Importa o componente principal (App.vue)
import App from './App.vue';

// Importa o router (sistema de rotas/navegação)
import router from './router';

/**
 * CRIANDO A APLICAÇÃO
 * 
 * 1. createApp(App) - cria a aplicação usando o App.vue
 * 2. .use(router) - adiciona o sistema de rotas
 * 3. .mount('#app') - "cola" a aplicação na div com id="app" do index.html
 */

const app = createApp(App);  // Cria a aplicação
app.use(router);             // Adiciona o router
app.mount('#app');           // Monta na tela

// Pronto! A aplicação está funcionando! 🎉