import { defineStore } from "pinia";// Importa a função que cria uma store (estado global) no Pinia
import api from "../services/api";// Importa a instância do Axios já configurada com baseURL da API

export const useUserStore = defineStore("user", { // Cria e exporta a store "user" (ID único usado internamente pelo Pinia)
    state: () => ({// state: função que retorna o estado inicial (reativo)
        users: []// users: array que armazenará a lista de usuários vinda da API
    }),// fim do state

    actions: {  // actions: métodos assíncronos que podem alterar o estado e chamar a API
        async fetchUsers() {// fetchUsers: busca a lista de usuários no backend
            const res = await api.get("/users");
            // Faz requisição GET para /api/users (via baseURL + "/users")
            this.users = res.data;
            // Atualiza o estado com os dados retornados (res.data é o array de usuários
        },  // fim de fetchUsers

        async addUser(user) {
            // adduser: cria um novo usuário no backend
            const res = await api.post("/users", user);
            // Envia o objeto "user" em uma requisição POST para /api/users
            this.users.push(res.data);
            // Insere o usuário criado (retornado pela API) no array local (estado)
        },// fim de addUser

        async deleteUser(id) {
            // deleteuser: remove um usuário pelo _id
            await api.delete('/users/${id}');
            // Chama DELETE em /api/users/:id para excluir no backend
            this.users = this.users.filter(u => u._id !== id); // Remove do estado local o usuário com o id informado
        }// fim de deleteUser
    }// fim de actions   
});// fim da definição da store