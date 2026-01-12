import { useNotification } from '@/composables/useNotification';
import stationService from '@/services/stationService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useStationStore = defineStore('station', () => {
  const { success, error: showError } = useNotification();

  // State
  const stations = ref([]);
  const currentStation = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const activeStations = computed(() => stations.value.filter((station) => station.is_active));

  const inactiveStations = computed(() => stations.value.filter((station) => !station.is_active));

  const entryStations = computed(() =>
    stations.value.filter((station) => station.type === 'entry')
  );

  const exitStations = computed(() => stations.value.filter((station) => station.type === 'exit'));

  // Actions
  const fetchStations = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await stationService.getStations(params);
      stations.value = response.data;
      return response;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch stations';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchStationById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await stationService.getStationById(id);
      currentStation.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch station';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createStation = async (data) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await stationService.createStation(data);
      stations.value.unshift(response.data);

      success('Station created successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to create station';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateStation = async (id, data) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await stationService.updateStation(id, data);

      // Update station in list
      const index = stations.value.findIndex((s) => s.id === id);
      if (index !== -1) {
        stations.value[index] = response.data;
      }

      success('Station updated successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update station';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteStation = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      await stationService.deleteStation(id);

      // Remove from list
      stations.value = stations.value.filter((s) => s.id !== id);

      success('Station deleted successfully');
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to delete station';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleStatus = async (id, isActive) => {
    loading.value = true;
    error.value = null;

    try {
      await stationService.toggleStatus(id, isActive);

      // Update in list
      const index = stations.value.findIndex((s) => s.id === id);
      if (index !== -1) {
        stations.value[index].is_active = isActive;
      }

      success(`Station ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update status';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearCurrentStation = () => {
    currentStation.value = null;
  };

  // Reset store
  const $reset = () => {
    stations.value = [];
    currentStation.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    stations,
    currentStation,
    loading,
    error,
    // Getters
    activeStations,
    inactiveStations,
    entryStations,
    exitStations,
    // Actions
    fetchStations,
    fetchStationById,
    createStation,
    updateStation,
    deleteStation,
    toggleStatus,
    clearCurrentStation,
    $reset,
  };
});
