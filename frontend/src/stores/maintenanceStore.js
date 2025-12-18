import { defineStore } from "pinia";
import api from "../services/api";

export const useMaintenanceStore = defineStore("maintenance", {
  state: () => ({
    maintenances: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMaintenances() {
      this.loading = true;
      try {
        const { data } = await api.get("/manutencoes");
        this.maintenances = data;
      } finally {
        this.loading = false;
      }
    },

    async addMaintenance(maintenance) {
      const { data } = await api.post("/manutencoes", maintenance);
      this.maintenances.unshift(data);
    },

    async updateMaintenance(id, updates) {
      const { data } = await api.put(`/manutencoes/${id}`, updates);
      const index = this.maintenances.findIndex(m => m._id === id);
      if (index !== -1) this.maintenances[index] = data;
    },

    async deleteMaintenance(id) {
      await api.delete(`/manutencoes/${id}`);
      this.maintenances = this.maintenances.filter(m => m._id !== id);
    }
  }
});
