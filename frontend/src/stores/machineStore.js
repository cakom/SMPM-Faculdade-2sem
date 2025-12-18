import { defineStore } from "pinia";
import api from "../services/api";

export const useMachineStore = defineStore("machine", {
  state: () => ({
    machines: [],
    loading: false,
    error: null
  }),

  actions: {
    // 🔄 BUSCAR MÁQUINAS
    async fetchMachines() {
      this.loading = true;
      this.error = null;

      try {
        // ✅ REMOVIDO /api
        const res = await api.get("/maquinas");
        this.machines = res.data;
      } catch (err) {
        this.error =
          err.response?.data?.erro || "Erro ao buscar máquinas";

        console.error("❌ Erro ao buscar máquinas:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ➕ ADICIONAR MÁQUINA
    async addMachine(machine) {
      this.loading = true;
      this.error = null;

      try {
        // ✅ REMOVIDO /api
        const res = await api.post("/maquinas", machine);
        this.machines.push(res.data);
        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.erro || "Erro ao adicionar máquina";

        console.error("❌ Erro ao adicionar máquina:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
