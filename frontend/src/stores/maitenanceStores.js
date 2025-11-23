/**
 * maintenanceStore.js - Store Pinia para Manutenções
 * 
 * Gerencia o histórico de manutenções realizadas.
 * Centraliza toda a lógica relacionada a manutenções.
 */

// Importa a função para criar stores do Pinia
import { defineStore } from "pinia";

// Importa a instância do Axios já configurada
import api from "../services/api";

// Cria e exporta a store "maintenance"
export const useMaintenanceStore = defineStore("maintenance", {
    
    // ===== ESTADO (STATE) =====
    // Dados reativos que são compartilhados entre componentes
    state: () => ({
        maintenances: [],    // Array que armazena todas as manutenções
        loading: false,      // Indica se está carregando (true/false)
        error: null          // Armazena mensagens de erro (string ou null)
    }),

    // ===== GETTERS =====
    // Propriedades computadas baseadas no state
    // São como "computed properties" do Vue
    getters: {
        /**
         * Retorna manutenções ordenadas por data
         * As mais recentes aparecem primeiro
         */
        maintenancesByDate: (state) => {
            // Cria uma cópia do array para não modificar o original
            // Ordena por data decrescente (mais recente = maior valor de data)
            return [...state.maintenances].sort((a, b) => {
                return new Date(b.data) - new Date(a.data);
            });
        },

        /**
         * Agrupa manutenções por tipo
         * Retorna um objeto: { "Preventiva": [...], "Corretiva": [...] }
         */
        maintenancesByType: (state) => {
            // reduce percorre o array e vai construindo um objeto
            return state.maintenances.reduce((acc, maintenance) => {
                // Pega o tipo da manutenção (ou 'Sem tipo' se não tiver)
                const tipo = maintenance.tipo || 'Sem tipo';
                
                // Se ainda não existe esse tipo no objeto, cria array vazio
                if (!acc[tipo]) {
                    acc[tipo] = [];
                }
                
                // Adiciona a manutenção no array do tipo correspondente
                acc[tipo].push(maintenance);
                
                return acc; // Retorna o acumulador para próxima iteração
            }, {}); // Começa com objeto vazio {}
        },

        /**
         * Conta quantas manutenções existem de cada tipo
         * Retorna: { "Preventiva": 5, "Corretiva": 3, "Preditiva": 2 }
         */
        countByType: (state) => {
            return state.maintenances.reduce((acc, maintenance) => {
                const tipo = maintenance.tipo || 'Sem tipo';
                
                // Se já existe o tipo, incrementa. Se não, começa com 1
                acc[tipo] = (acc[tipo] || 0) + 1;
                
                return acc;
            }, {});
        },

        /**
         * Retorna o total de manutenções cadastradas
         */
        totalMaintenances: (state) => state.maintenances.length,

        /**
         * Retorna apenas manutenções dos últimos 30 dias
         */
        recentMaintenances: (state) => {
            // Cria uma data de 1 mês atrás
            const umMesAtras = new Date();
            umMesAtras.setMonth(umMesAtras.getMonth() - 1);
            
            // Filtra manutenções que tem data >= umMesAtras
            return state.maintenances.filter(maintenance => {
                const dataMaintenance = new Date(maintenance.data);
                return dataMaintenance >= umMesAtras;
            });
        }
    },

    // ===== ACTIONS =====
    // Métodos que modificam o estado e fazem chamadas à API
    // Podem ser assíncronos (async/await)
    actions: {
        /**
         * Busca todas as manutenções do backend
         */
        async fetchMaintenances() {
            this.loading = true;   // Ativa indicador de carregamento
            this.error = null;     // Limpa erros anteriores
            
            try {
                // GET /api/manutencoes - busca todas as manutenções
                const res = await api.get("/manutencoes");
                
                // Atualiza o estado com os dados recebidos
                this.maintenances = res.data;
                
            } catch (err) {
                // Se der erro, captura e armazena a mensagem
                this.error = err.response?.data?.erro || "Erro ao buscar manutenções";
                console.error("Erro ao buscar manutenções:", err);
                
                // Repassa o erro para o componente poder tratar também
                throw err;
                
            } finally {
                // finally executa SEMPRE, deu erro ou não
                this.loading = false; // Desativa loading
            }
        },

        /**
         * Adiciona uma nova manutenção no backend e no estado local
         * @param {Object} maintenance - Objeto com dados da manutenção
         *   { maquina, data, tipo, descricao, tecnico }
         */
        async addMaintenance(maintenance) {
            this.loading = true;
            this.error = null;
            
            try {
                // POST /api/manutencoes - envia dados da nova manutenção
                const res = await api.post("/manutencoes", maintenance);
                
                // unshift adiciona no INÍCIO do array (mais recente primeiro)
                this.maintenances.unshift(res.data);
                
                // Retorna a manutenção criada (com _id do MongoDB)
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
         * Atualiza uma manutenção existente
         * @param {string} id - ID da manutenção (_id do MongoDB)
         * @param {Object} updates - Campos a serem atualizados
         */
        async updateMaintenance(id, updates) {
            this.loading = true;
            this.error = null;
            
            try {
                // PUT /api/manutencoes/:id - atualiza manutenção
                const res = await api.put(`/manutencoes/${id}`, updates);
                
                // Encontra o índice da manutenção no array local
                const index = this.maintenances.findIndex(m => m._id === id);
                
                // Se encontrou, substitui pelos dados atualizados
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
         * Remove uma manutenção do backend e do estado local
         * @param {string} id - ID da manutenção a ser removida
         */
        async deleteMaintenance(id) {
            this.loading = true;
            this.error = null;
            
            try {
                // DELETE /api/manutencoes/:id - remove do banco
                await api.delete(`/manutencoes/${id}`);
                
                // filter cria novo array SEM a manutenção removida
                // Mantém todas as manutenções que têm _id diferente do id passado
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
         * Busca manutenções de uma máquina específica (filtro local)
         * @param {string} machineId - ID da máquina
         * @returns {Array} Array com manutenções da máquina
         */
        getMaintenancesByMachine(machineId) {
            // Filtra manutenções que pertencem à máquina especificada
            return this.maintenances.filter(m => m.maquinaId === machineId);
        },

        /**
         * Busca manutenções por período (filtro local)
         * @param {Date} dataInicio - Data inicial
         * @param {Date} dataFim - Data final
         * @returns {Array} Manutenções no período
         */
        getMaintenancesByPeriod(dataInicio, dataFim) {
            return this.maintenances.filter(m => {
                const data = new Date(m.data);
                return data >= dataInicio && data <= dataFim;
            });
        },

        /**
         * Limpa a mensagem de erro
         * Útil para fechar alertas manualmente
         */
        clearError() {
            this.error = null;
        }
    }
});