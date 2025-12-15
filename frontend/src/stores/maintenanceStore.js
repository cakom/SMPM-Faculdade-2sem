/**
 * stores/maintenanceStore.js - Store Pinia para Manutenções
 * 
 * Gerencia o histórico de manutenções realizadas.
 */

// Importa a função defineStore do Pinia
import { defineStore } from "pinia";

// Importa a instância do Axios configurada
import api from "../services/api";

// Cria e exporta a store "maintenance"
export const useMaintenanceStore = defineStore("maintenance", {
    
    // ===== ESTADO (STATE) =====
    // Dados reativos compartilhados
    state: () => ({
        maintenances: [],    // Array com todas as manutenções
        loading: false,      // Indica se está carregando
        error: null          // Mensagem de erro
    }),

    // ===== GETTERS =====
    // Valores calculados baseados no state
    getters: {
        /**
         * Retorna manutenções ordenadas por data (mais recente primeiro)
         */
        maintenancesByDate: (state) => {
            return [...state.maintenances].sort((a, b) => {
                return new Date(b.data) - new Date(a.data);
            });
        },

        /**
         * Agrupa manutenções por tipo
         * Retorna: { "Preventiva": [...], "Corretiva": [...] }
         */
        maintenancesByType: (state) => {
            return state.maintenances.reduce((acc, maintenance) => {
                const tipo = maintenance.tipo || 'Sem tipo';
                if (!acc[tipo]) {
                    acc[tipo] = [];
                }
                acc[tipo].push(maintenance);
                return acc;
            }, {});
        },

        /**
         * Conta quantas manutenções de cada tipo
         * Retorna: { "Preventiva": 5, "Corretiva": 3 }
         */
        countByType: (state) => {
            return state.maintenances.reduce((acc, maintenance) => {
                const tipo = maintenance.tipo || 'Sem tipo';
                acc[tipo] = (acc[tipo] || 0) + 1;
                return acc;
            }, {});
        },

        /**
         * Total de manutenções
         */
        totalMaintenances: (state) => state.maintenances.length,

        /**
         * Manutenções dos últimos 30 dias
         */
        recentMaintenances: (state) => {
            const umMesAtras = new Date();
            umMesAtras.setMonth(umMesAtras.getMonth() - 1);
            
            return state.maintenances.filter(maintenance => {
                const dataMaintenance = new Date(maintenance.data);
                return dataMaintenance >= umMesAtras;
            });
        }
    },

    // ===== ACTIONS =====
    // Métodos que modificam o estado
    actions: {
        /**
         * Busca todas as manutenções do backend
         */
        async fetchMaintenances() {
            this.loading = true;
            this.error = null;
            
            try {
                const res = await api.get("/api/manutencoes");
                this.maintenances = res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao buscar manutenções";
                console.error("Erro ao buscar manutenções:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Adiciona nova manutenção
         * @param {Object} maintenance - { maquina, data, tipo, descricao, tecnico }
         */
        async addMaintenance(maintenance) {
            this.loading = true;
            this.error = null;
            
            try {
                const res = await api.post("/api/manutencoes", maintenance);
                
                // Adiciona no início (mais recente primeiro)
                this.maintenances.unshift(res.data);
                
                return res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao adicionar manutenção";
                console.error("Erro ao adicionar manutenção:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Atualiza uma manutenção
         * @param {string} id - ID da manutenção
         * @param {Object} updates - Campos a atualizar
         */
        async updateMaintenance(id, updates) {
            this.loading = true;
            this.error = null;
            
            try {
                const res = await api.put(`/api/manutencoes/${id}`, updates);
                
                const index = this.maintenances.findIndex(m => m._id === id);
                if (index !== -1) {
                    this.maintenances[index] = res.data;
                }
                
                return res.data;
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao atualizar manutenção";
                console.error("Erro ao atualizar manutenção:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Remove uma manutenção
         * @param {string} id - ID da manutenção
         */
        async deleteMaintenance(id) {
            this.loading = true;
            this.error = null;
            
            try {
                await api.delete(`/api/manutencoes/${id}`);
                
                // Remove do estado local
                this.maintenances = this.maintenances.filter(m => m._id !== id);
                
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao remover manutenção";
                console.error("Erro ao remover manutenção:", err);
                throw err;
                
            } finally {
                this.loading = false;
            }
        },

        /**
         * Busca manutenções de uma máquina (filtro local)
         * @param {string} machineId - ID da máquina
         */
        getMaintenancesByMachine(machineId) {
            return this.maintenances.filter(m => m.maquinaId === machineId);
        },

        /**
         * Limpa mensagens de erro
         */
        clearError() {
            this.error = null;
        }
    }
});