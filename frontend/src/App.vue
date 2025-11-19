<!-- App.vue - Componente principal da aplicação -->
<!-- Estrutura base com Sidebar, Navbar e conteúdo dinâmico -->

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar de navegação -->
    <Sidebar />

    <!-- Área principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar superior -->
      <Navbar />

      <!-- Conteúdo dinâmico -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <!-- Conteúdo inicial (logos + HelloWorld) -->
        <section class="mt-8 text-center">
          <div class="flex justify-center gap-6">
            <a href="https://vite.dev" target="_blank">
              <img src="/vite.svg" class="logo" alt="Vite logo" />
            </a>
            <a href="https://vuejs.org/" target="_blank">
              <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
            </a>
          </div>
          <HelloWorld msg="Vite + Vue + Tailwind" />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
// Importa componentes de layout
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

</script>

<style scoped>
/* Transição suave entre páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilo dos logos */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

