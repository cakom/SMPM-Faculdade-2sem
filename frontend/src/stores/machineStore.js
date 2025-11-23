/**
 * machineStore.js - Store Pinia para Máquinas
 * 
 * Gerencia o estado global de todas as máquinas do sistema.
 * Componentes podem acessar e modificar os dados através desta store.
 */

import { defineStore } from "pinia";  // Importa função para criar store
import api from "../services/api";     // Importa instância do Axios configurada

export const useMachineStore = defineStore("machine", {
    // Define a store com ID "machine"
    
    // ===== ESTADO (STATE) =====
    // Dados reativos compartilhados entre componentes
    state: () => ({
        machines: [],        // Array com todas as máquinas
        loading: false,      // Indica se está carregando dados
        error: null          // Armazena mensagens de erro
    }),

    // ===== GETTERS =====
    // Computações baseadas no estado (como computed no Vue)
    getters: {
        /**
         * Retorna máquinas ordenadas por proximidade da manutenção
         * As mais urgentes aparecem primeiro
         */
        machinesByUrgency: (state) => {
            return [...state.machines].sort((a, b) => {
                const dateA = new Date(a.proximaManutencao);
                const dateB = new Date(b.proximaManutencao);
                return dateA - dateB; // Ordem crescente (mais próximas primeiro)
            });
        },

        /**
         * Retorna apenas máquinas com manutenção atrasada
         */
        overdueMachines: (state) => {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            return state.machines.filter(machine => {
                const dataManutencao = new Date(machine.proximaManutencao);
                return dataManutencao < hoje;
            });
        },

        /**
         * Retorna total de máquinas cadastradas
         */
        totalMachines: (state) => state.machines.length
    },

    // ===== ACTIONS =====
    // Métodos que modificam o estado e chamam a API
    actions: {
        /**
         * Busca todas as máquinas do backend
         */
        async fetchMachines() {
            this.loading = true;   // Ativa loading
            this.error = null;     // Limpa erros anteriores
            
            try {
                // GET /api/maquinas
                const res = await api.get("/maquinas");
                
                // Atualiza estado com os dados da API
                this.machines = res.data;
                
            } catch (err) {
                // Captura e armazena erro
                this.error = err.response?.data?.erro || "Erro ao buscar máquinas";
                console.error("Erro ao buscar máquinas:", err);
                throw err; // Repassa o erro para o componente tratar
                
            } finally {
                this.loading = false; // Desativa loading sempre
            }
        },

        /**
         * Adiciona uma nova máquina
         * @param {Object} machine - Dados da máquina { nome, tipo, local, proximaManutencao }
         */
        async addMachine(machine) {
            this.loading = true;
            this.error = null;
            
            try {
                // POST /api/maquinas
                const res = await api.post("/maquinas", machine);
                
                // Adiciona a nova máquina no estado local
                this.machines.push(res.data);
                
                return res.data; // Retorna a máquina criada
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao adicionar máquina";
                console.error("Erro ao adicionar máquina:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Atualiza uma máquina existente
         * @param {string} id - ID da máquina
         * @param {Object} updates - Campos a serem atualizados
         */
        async updateMachine(id, updates) {
            this.loading = true;
            this.error = null;
            
            try {
                // PUT /api/maquinas/:id
                const res = await api.put(`/maquinas/${id}`, updates);
                
                // Atualiza no estado local
                const index = this.machines.findIndex(m => m._id === id);
                if (index !== -1) {
                    this.machines[index] = res.data;
                }
                
                return res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao atualizar máquina";
                console.error("Erro ao atualizar máquina:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Remove uma máquina
         * @param {string} id - ID da máquina a ser removida
         */
        async deleteMachine(id) {
            this.loading = true;
            this.error = null;
            
            try {
                // DELETE /api/maquinas/:id
                await api.delete(`/maquinas/${id}`);
                
                // Remove do estado local
                this.machines = this.machines.filter(m => m._id !== id);
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao remover máquina";
                console.error("Erro ao remover máquina:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Busca uma máquina específica por ID
         * @param {string} id - ID da máquina
         */
        getMachineById(id) {
            return this.machines.find(m => m._id === id);
        },

        /**
         * Limpa o estado de erro
         */
        clearError() {
            this.error = null;
        }
    }
});