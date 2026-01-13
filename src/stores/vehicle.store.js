/**
 * Vehicle Store
 * Manages vehicle search, filtering, and management state
 */

import { useNotification } from '@/composables/useNotification';
import vehicleService from '@/services/vehicleService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useVehicleStore = defineStore('vehicle', () => {
  const { showSuccess, showError } = useNotification();

  // State
  const vehicles = ref([]);
  const selectedVehicle = ref(null);
  const vehicleHistory = ref([]);
  const vehicleStats = ref(null);

  // Pagination
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalRecords = ref(0);
  const totalPages = ref(0);

  // Filters
  const filters = ref({
    plateNumber: '',
    startDate: null,
    endDate: null,
    status: null, // active, completed
    vehicleTypeId: null,
    zoneId: null,
    paymentStatus: null, // paid, unpaid
    sortBy: 'entry_time',
    sortOrder: 'desc',
  });

  // Loading states
  const loading = ref(false);
  const loadingDetails = ref(false);
  const loadingHistory = ref(false);
  const updating = ref(false);
  const exporting = ref(false);

  // Computed properties
  const hasFilters = computed(() => {
    return (
      filters.value.plateNumber ||
      filters.value.startDate ||
      filters.value.endDate ||
      filters.value.status ||
      filters.value.vehicleTypeId ||
      filters.value.zoneId ||
      filters.value.paymentStatus
    );
  });

  const hasVehicles = computed(() => vehicles.value.length > 0);

  const formattedFilters = computed(() => {
    const formatted = {};

    if (filters.value.plateNumber) {
      formatted.plateNumber = vehicleService.formatPlateNumber(filters.value.plateNumber);
    }
    if (filters.value.startDate) {
      formatted.startDate = filters.value.startDate;
    }
    if (filters.value.endDate) {
      formatted.endDate = filters.value.endDate;
    }
    if (filters.value.status) {
      formatted.status = filters.value.status;
    }
    if (filters.value.vehicleTypeId) {
      formatted.vehicleTypeId = filters.value.vehicleTypeId;
    }
    if (filters.value.zoneId) {
      formatted.zoneId = filters.value.zoneId;
    }
    if (filters.value.paymentStatus) {
      formatted.paymentStatus = filters.value.paymentStatus;
    }
    if (filters.value.sortBy) {
      formatted.sortBy = filters.value.sortBy;
      formatted.sortOrder = filters.value.sortOrder;
    }

    return formatted;
  });

  // Actions

  /**
   * Search vehicles with current filters
   */
  const searchVehicles = async () => {
    loading.value = true;
    try {
      const response = await vehicleService.searchVehicles(
        formattedFilters.value,
        currentPage.value,
        pageSize.value
      );

      if (response.data) {
        vehicles.value = response.data.vehicles || response.data.data || [];
        totalRecords.value = response.data.total || 0;
        totalPages.value =
          response.data.totalPages || Math.ceil(totalRecords.value / pageSize.value);
      }
    } catch (error) {
      console.error('Failed to search vehicles:', error);
      showError('Failed to search vehicles');
      vehicles.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get vehicle details by session ID
   */
  const fetchVehicleDetails = async (sessionId) => {
    loadingDetails.value = true;
    try {
      const response = await vehicleService.getVehicleDetails(sessionId);
      selectedVehicle.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vehicle details:', error);
      showError('Failed to load vehicle details');
      return null;
    } finally {
      loadingDetails.value = false;
    }
  };

  /**
   * Get parking history for a vehicle
   */
  const fetchParkingHistory = async (plateNumber) => {
    loadingHistory.value = true;
    try {
      const response = await vehicleService.getParkingHistory(plateNumber);
      vehicleHistory.value = response.data || [];

      // Calculate stats
      vehicleStats.value = vehicleService.calculateStats(vehicleHistory.value);

      return vehicleHistory.value;
    } catch (error) {
      console.error('Failed to fetch parking history:', error);
      showError('Failed to load parking history');
      vehicleHistory.value = [];
      return [];
    } finally {
      loadingHistory.value = false;
    }
  };

  /**
   * Update parking session (manual correction)
   */
  const updateSession = async (sessionId, data) => {
    updating.value = true;
    try {
      const response = await vehicleService.updateSession(sessionId, data);
      showSuccess('Session updated successfully');

      // Refresh vehicles list
      await searchVehicles();

      // Update selected vehicle if it's the one being edited
      if (selectedVehicle.value && selectedVehicle.value.id === sessionId) {
        selectedVehicle.value = response.data;
      }

      return response.data;
    } catch (error) {
      console.error('Failed to update session:', error);
      showError(error.response?.data?.message || 'Failed to update session');
      throw error;
    } finally {
      updating.value = false;
    }
  };

  /**
   * Export vehicles to CSV
   */
  const exportVehicles = async () => {
    exporting.value = true;
    try {
      const response = await vehicleService.exportToCSV(formattedFilters.value);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vehicles_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess('Vehicles exported successfully');
    } catch (error) {
      console.error('Failed to export vehicles:', error);
      showError('Failed to export vehicles');
    } finally {
      exporting.value = false;
    }
  };

  /**
   * Set filter value
   */
  const setFilter = (key, value) => {
    filters.value[key] = value;
  };

  /**
   * Set multiple filters at once
   */
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    filters.value = {
      plateNumber: '',
      startDate: null,
      endDate: null,
      status: null,
      vehicleTypeId: null,
      zoneId: null,
      paymentStatus: null,
      sortBy: 'entry_time',
      sortOrder: 'desc',
    };
  };

  /**
   * Go to specific page
   */
  const goToPage = (page) => {
    currentPage.value = page;
    searchVehicles();
  };

  /**
   * Change page size
   */
  const changePageSize = (size) => {
    pageSize.value = size;
    currentPage.value = 1; // Reset to first page
    searchVehicles();
  };

  /**
   * Set selected vehicle
   */
  const selectVehicle = (vehicle) => {
    selectedVehicle.value = vehicle;
  };

  /**
   * Clear selected vehicle
   */
  const clearSelectedVehicle = () => {
    selectedVehicle.value = null;
  };

  /**
   * Reset store
   */
  const resetStore = () => {
    vehicles.value = [];
    selectedVehicle.value = null;
    vehicleHistory.value = [];
    vehicleStats.value = null;
    currentPage.value = 1;
    pageSize.value = 10;
    totalRecords.value = 0;
    totalPages.value = 0;
    clearFilters();
  };

  return {
    // State
    vehicles,
    selectedVehicle,
    vehicleHistory,
    vehicleStats,
    currentPage,
    pageSize,
    totalRecords,
    totalPages,
    filters,
    loading,
    loadingDetails,
    loadingHistory,
    updating,
    exporting,

    // Computed
    hasFilters,
    hasVehicles,
    formattedFilters,

    // Actions
    searchVehicles,
    fetchVehicleDetails,
    fetchParkingHistory,
    updateSession,
    exportVehicles,
    setFilter,
    setFilters,
    clearFilters,
    goToPage,
    changePageSize,
    selectVehicle,
    clearSelectedVehicle,
    resetStore,
  };
});
