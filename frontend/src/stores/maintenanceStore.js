import { defineStore } from "pinia";
import api from "../services/api";

export const useMachineStore = defineStore("machine", {

    // ===== STATE =====
    state: () => ({
        machines: [],
        loading: false,
        error: null
    }),

    // ===== GETTERS =====
    getters: {
        totalMachines: (state) => state.machines.length,

        activeMachines: (state) =>
            state.machines.filter(m => m.status === "ativa"),

        machineById: (state) => {
            return (id) => state.machines.find(m => m._id === id);
        }
    },

    // ===== ACTIONS =====
    actions: {

        async fetchMachines() {
            this.loading = true;
            this.error = null;

            try {
                const res = await api.get("/maquinas");
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
                const res = await api.post("/maquinas", machine);
                this.machines.push(res.data);
                return res.data;

            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao cadastrar máquina";
                console.error("Erro ao cadastrar máquina:", err);
                throw err;

            } finally {
                this.loading = false;
            }
        },

        async updateMachine(id, updates) {
            this.loading = true;
            this.error = null;

            try {
                const res = await api.put(`/maquinas/${id}`, updates);

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
                await api.delete(`/maquinas/${id}`);
                this.machines = this.machines.filter(m => m._id !== id);

            } catch (err) {
                this.error = err.response?.data?.erro || "Erro ao remover máquina";
                console.error("Erro ao remover máquina:", err);
                throw err;

            } finally {
                this.loading = false;
            }
        },

        clearError() {
            this.error = null;
        }
    }
});
