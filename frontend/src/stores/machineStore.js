import { defineStore } from "pinia";

const API_URL = import.meta.env.VITE_API_URL;

export const useMachineStore = defineStore("machine", {
  state: () => ({
    machines: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMachines() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/maquinas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar máquinas");
        }

        this.machines = await res.json();
      } catch (err) {
        this.error = err.message;
        console.error("❌ Erro ao buscar máquinas:", err);
      } finally {
        this.loading = false;
      }
    },

    async addMachine(machine) {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/maquinas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(machine),
        });

        if (!res.ok) {
          throw new Error("Erro ao adicionar máquina");
        }

        const nova = await res.json();
        this.machines.push(nova);
      } catch (err) {
        console.error("❌ Erro ao adicionar máquina:", err);
      }
    },
  },
});
