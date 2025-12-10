import { defineStore } from "pinia";
import api from "../services/api";

export const useMaintenanceStore = defineStore("maintenance", {
    state: () => ({
        maintenances: [],
        loading: false,
        error: null
    }),

    getters: {
        maintenancesByDate: (state) => {
            return [...state.maintenances].sort((a, b) => {
                return new Date(b.data) - new Date(a.data);
            });
        },

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

        countByType: (state) => {
            return state.maintenances.reduce((acc, maintenance) => {
                const tipo = maintenance.tipo || 'Sem tipo';
                acc[tipo] = (acc[tipo] || 0) + 1;
                return acc;
            }, {});
        },

        totalMaintenances: (state) => state.maintenances.length,

        recentMaintenances: (state) => {
            const umMesAtras = new Date();
            umMesAtras.setMonth(umMesAtras.getMonth() - 1);
            return state.maintenances.filter(maintenance => {
                const dataMaintenance = new Date(maintenance.data);
                return dataMaintenance >= umMesAtras;
            });
        }
    },

    actions: {
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

        async addMaintenance(maintenance) {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.post("/api/manutencoes", maintenance);
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

        async deleteMaintenance(id) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/api/manutencoes/${id}`);
                this.maintenances = this.maintenances.filter(m => m._id !== id);
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao remover manutenção";
                console.error("Erro ao remover manutenção:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        getMaintenancesByMachine(machineId) {
            return this.maintenances.filter(m => m.maquinaId === machineId);
        },

        clearError() {
            this.error = null;
        }
    }
});
