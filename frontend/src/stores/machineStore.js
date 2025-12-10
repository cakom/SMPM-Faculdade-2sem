import { defineStore } from "pinia";
import api from "../services/api";

export const useMachineStore = defineStore("machine", {
    state: () => ({
        machines: [],
        loading: false,
        error: null
    }),

    getters: {
        machinesByUrgency: (state) => {
            return [...state.machines].sort((a, b) => {
                const dateA = new Date(a.proximaManutencao);
                const dateB = new Date(b.proximaManutencao);
                return dateA - dateB;
            });
        },

        overdueMachines: (state) => {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            return state.machines.filter(machine => {
                const dataManutencao = new Date(machine.proximaManutencao);
                return dataManutencao < hoje;
            });
        },

        totalMachines: (state) => state.machines.length
    },

    actions: {
        async fetchMachines() {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.get("/api/maquinas");
                this.machines = res.data;
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao buscar máquinas";
                console.error("Erro ao buscar máquinas:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async addMachine(machine) {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.post("/api/maquinas", machine);
                this.machines.push(res.data);
                return res.data;
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao adicionar máquina";
                console.error("Erro ao adicionar máquina:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updateMachine(id, updates) {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.put(`/api/maquinas/${id}`, updates);
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

        async deleteMachine(id) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/api/maquinas/${id}`);
                this.machines = this.machines.filter(m => m._id !== id);
            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao remover máquina";
                console.error("Erro ao remover máquina:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        getMachineById(id) {
            return this.machines.find(m => m._id === id);
        },

        clearError() {
            this.error = null;
        }
    }
});
