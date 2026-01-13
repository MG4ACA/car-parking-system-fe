import { useNotification } from '@/composables/useNotification';
import zoneService from '@/services/zoneService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useZoneStore = defineStore('zone', () => {
  const { success, error: showError } = useNotification();

  // State
  const zones = ref([]);
  const currentZone = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const activeZones = computed(() => zones.value.filter((zone) => zone.is_active));

  const inactiveZones = computed(() => zones.value.filter((zone) => !zone.is_active));

  const getZoneCapacityPercentage = (zone) => {
    if (!zone || zone.capacity === 0) return 0;
    return Math.round((zone.current_occupancy / zone.capacity) * 100);
  };

  // Actions
  const fetchZones = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await zoneService.getZones(params);
      // Handle both array and object with zones property responses
      zones.value = Array.isArray(response.data) ? response.data : response.data?.zones || [];
      return response;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch zones';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchZoneById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await zoneService.getZoneById(id);
      currentZone.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch zone';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createZone = async (data) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await zoneService.createZone(data);
      zones.value.unshift(response.data);

      success('Zone created successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to create zone';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateZone = async (id, data) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await zoneService.updateZone(id, data);

      // Update zone in list
      const index = zones.value.findIndex((z) => z.id === id);
      if (index !== -1) {
        zones.value[index] = response.data;
      }

      success('Zone updated successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update zone';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteZone = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      await zoneService.deleteZone(id);

      // Remove from list
      zones.value = zones.value.filter((z) => z.id !== id);

      success('Zone deleted successfully');
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to delete zone';
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
      await zoneService.toggleStatus(id, isActive);

      // Update in list
      const index = zones.value.findIndex((z) => z.id === id);
      if (index !== -1) {
        zones.value[index].is_active = isActive;
      }

      success(`Zone ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update status';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearCurrentZone = () => {
    currentZone.value = null;
  };

  // Reset store
  const $reset = () => {
    zones.value = [];
    currentZone.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    zones,
    currentZone,
    loading,
    error,
    // Getters
    activeZones,
    inactiveZones,
    getZoneCapacityPercentage,
    // Actions
    fetchZones,
    fetchZoneById,
    createZone,
    updateZone,
    deleteZone,
    toggleStatus,
    clearCurrentZone,
    $reset,
  };
});
