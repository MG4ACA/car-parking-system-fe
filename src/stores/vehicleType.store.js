import { useNotification } from '@/composables/useNotification';
import vehicleTypeService from '@/services/vehicleTypeService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useVehicleTypeStore = defineStore('vehicleType', () => {
  const { success, error: showError } = useNotification();

  // State
  const vehicleTypes = ref([]);
  const rateHistory = ref([]);
  const currentVehicleType = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const activeVehicleTypes = computed(() => vehicleTypes.value.filter((type) => type.is_active));

  const inactiveVehicleTypes = computed(() => vehicleTypes.value.filter((type) => !type.is_active));

  // Actions
  const fetchVehicleTypes = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await vehicleTypeService.getVehicleTypes(params);
      vehicleTypes.value = response.data;
      return response;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch vehicle types';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchVehicleTypeById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await vehicleTypeService.getVehicleTypeById(id);
      currentVehicleType.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch vehicle type';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createVehicleType = async (data) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await vehicleTypeService.createVehicleType(data);
      vehicleTypes.value.unshift(response.data);

      success('Vehicle type created successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to create vehicle type';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateVehicleType = async (id, data) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await vehicleTypeService.updateVehicleType(id, data);

      // Update vehicle type in list
      const index = vehicleTypes.value.findIndex((vt) => vt.id === id);
      if (index !== -1) {
        vehicleTypes.value[index] = response.data;
      }

      success('Vehicle type updated successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update vehicle type';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteVehicleType = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      await vehicleTypeService.deleteVehicleType(id);

      // Remove from list
      vehicleTypes.value = vehicleTypes.value.filter((vt) => vt.id !== id);

      success('Vehicle type deleted successfully');
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to delete vehicle type';
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
      await vehicleTypeService.toggleStatus(id, isActive);

      // Update in list
      const index = vehicleTypes.value.findIndex((vt) => vt.id === id);
      if (index !== -1) {
        vehicleTypes.value[index].is_active = isActive;
      }

      success(`Vehicle type ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update status';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchRateHistory = async (id = null) => {
    loading.value = true;
    error.value = null;

    try {
      const response = id
        ? await vehicleTypeService.getRateHistory(id)
        : await vehicleTypeService.getAllRateHistory();

      rateHistory.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch rate history';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearCurrentVehicleType = () => {
    currentVehicleType.value = null;
  };

  // Reset store
  const $reset = () => {
    vehicleTypes.value = [];
    rateHistory.value = [];
    currentVehicleType.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    vehicleTypes,
    rateHistory,
    currentVehicleType,
    loading,
    error,
    // Getters
    activeVehicleTypes,
    inactiveVehicleTypes,
    // Actions
    fetchVehicleTypes,
    fetchVehicleTypeById,
    createVehicleType,
    updateVehicleType,
    deleteVehicleType,
    toggleStatus,
    fetchRateHistory,
    clearCurrentVehicleType,
    $reset,
  };
});
