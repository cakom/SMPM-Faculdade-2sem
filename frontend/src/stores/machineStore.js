import { defineStore } from "pinia";// Importa a função que cria uma store (estado global) no Pinia
import api from "../services/api";// Importa a instância do Axios já configurada com baseURL da API

export const useMachineStore = defineStore("machine", {
    state: () => ({// state: função que retorna o estado inicial (reativo)
        machines: []// machines: array que armazenará a lista de maquinas vinda da API
    }),// fim do state

    actions: {  // actions: métodos assíncronos que podem alterar o estado e chamar a API
        async fetchMachines() {// fetchmachines: busca a lista de maquinas no backend
            const res = await api.get("/machines");
            // Faz requisição GET para /api/machines (via baseURL + "/machines")
            this.machines = res.data;
            // Atualiza o estado com os dados retornados (res.data é o array de maquinas
        },  // fim de fetchmachines

        async addMachine(machine) {
            // addmachine: cria um novo maquinas no backend
            const res = await api.post("/machines", machine);
            // Envia o objeto "machine" em uma requisição POST para /api/machines
            this.machines.push(res.data);
            // Insere o maquinas criado (retornado pela API) no array local (estado)
        },// fim de addmachine

        async deleteMachine(id) {
            // deletemachine: remove um maquinas pelo _id
            await api.delete('/machines/${id}');
            // Chama DELETE em /api/machines/:id para excluir no backend
            this.machines = this.machines.filter(u => u._id !== id); // Remove do estado local o maquinas com o id informado
        }// fim de deletemachine
    }// fim de actions   
});// fim da definição da store