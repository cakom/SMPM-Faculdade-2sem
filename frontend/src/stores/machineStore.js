import { defineStore } from "pinia";
import api from "../services/api";

export const useMachineStore = defineStore("machine", {
  state: () => ({
    machines: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMachines() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get("/maquinas");
        this.machines = data;
      } catch (err) {
        this.error = "Erro ao buscar máquinas";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addMachine(machine) {
      const { data } = await api.post("/maquinas", machine);
      this.machines.push(data);
    }
  }
});
