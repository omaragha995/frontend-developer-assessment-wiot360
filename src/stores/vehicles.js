import { defineStore } from "pinia";

import { generateFleet } from "../services/fleetMockService";

export const useVehicleStore = defineStore("vehicles", {
  state: () => ({
    vehicles: [],
    selectedVehicleId: null,
    page: 1,
    itemsPerPage: 50,
    searchTerm: "",
    statusFilter: "all",
    sortBy: "name",
    sortDir: "asc",
    centerOnVehicleId: null,
  }),
  getters: {
    selectedVehicle(state) {
      return (
        state.vehicles.find((v) => v.id === state.selectedVehicleId) || null
      );
    },

    vehiclesLength(state) {
      return state.vehicles.length;
    },

    filteredVehicles(state) {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage - 1;

      let list = state.vehicles.slice(start, end);

      if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        list = list.filter(
          (v) =>
            v.name.toLowerCase().includes(term) ||
            v.plate.toLowerCase().includes(term)
        );
      }

      if (state.statusFilter !== "all") {
        list = list.filter((v) => v.status === state.statusFilter);
      }

      list.sort((a, b) => {
        let valA;
        let valB;

        if (state.sortBy === "name") {
          valA = a.name;
          valB = b.name;
        } else if (state.sortBy === "plate") {
          valA = a.plate;
          valB = b.plate;
        } else {
          valA = a.lastUpdated;
          valB = b.lastUpdated;
        }

        if (valA < valB) return state.sortDir === "asc" ? -1 : 1;
        if (valA > valB) return state.sortDir === "asc" ? 1 : -1;
        return 0;
      });

      return list;
    },
  },
  actions: {
    initFleet() {
      if (!this.vehicles.length) {
        this.vehicles = generateFleet(150);
      }
    },

    setSelectedVehicle(id) {
      this.selectedVehicleId = id;
    },

    setPage(page) {
      this.page = page;
    },

    setSort(sortBy, sortDir) {
      this.sortBy = sortBy;
      this.sortDir = sortDir;
    },

    applyUpdates(updates) {
      const map = new Map(updates.map((u) => [u.id, u]));
      this.vehicles = this.vehicles.map((v) => {
        const upd = map.get(v.id);
        if (!upd) return v;

        const newHistory = upd.historyPoint
          ? [...v.history, upd.historyPoint]
          : v.history;

        return {
          ...v,
          ...upd,
          history: newHistory,
        };
      });
    },

    requestCenterOnVehicle(id) {
      this.centerOnVehicleId = id;
    },

    clearCenterRequest() {
      this.centerOnVehicleId = null;
    },
  },
});
