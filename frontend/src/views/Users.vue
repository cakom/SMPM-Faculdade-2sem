<template> <!-- Início do bloco de marcação (UI) do componente -->
    <div> <!-- Contêiner raiz do componente (um único nó raiz é obrigatório no Vue 3)-->
        <h2>Usuários</h2> <!-- Título da seção/página -->
        <!-- Botão que dispara a ação fetchUsers da store quando clicado-->
        <button @click="store.fetchUsers">Carregar</button>
        <ul> <!-- Lista não ordenada que exibirá os usuários carregados-->
            <!-- v-for: itera sobre o array "users" da store
                key: chave única por item para o Vue reconciliar o DOM com eficiência -->
            <li v-for="u in store.users" :key="u._id">
                <!-- Interpolação mostrando nome e e-mail vindos da API-->
                {{ u.nome }} {{ u.email }}
                
                <!-- Botão de exclusão: chama a action deleteuser passando o id do usuário -->
                <button @click="store.deleteUser(u._id)">Excluir</button>
            </li>
        </ul>
    </div> <!-- Fim do contêiner raiz-->
</template>
<script setup>
// <script setup> é a sintaxe simplificada da Composition API do Vue 3
// Importa o hook que expõe a store de usuários do Pinia
import { useUserStore } from "../stores/userStore";
// Cria/obtém a instância reativa da store para este componente
const store = useUserStore();
// (Opcional) Carregar automaticamente ao montar o componente:
// import { onMounted) from "vue";
// onMounted(() => store.fetchUsers());
</script>