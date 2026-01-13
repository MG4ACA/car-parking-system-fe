/**
 * Dashboard Store
 * Manages dashboard data, statistics, and real-time updates
 */

import { useNotification } from '@/composables/useNotification';
import dashboardService from '@/services/dashboardService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useDashboardStore = defineStore('dashboard', () => {
  const { showError } = useNotification();

  // State
  const stats = ref({
    totalSpaces: 0,
    occupiedSpaces: 0,
    availableSpaces: 0,
    activeSessions: 0,
    todayRevenue: 0,
    totalVehicles: 0,
  });

  const recentSessions = ref([]);
  const recentActivities = ref([]);
  const activeVehicles = ref([]);
  const zoneOccupancy = ref([]);

  // Loading states
  const loading = ref(false);
  const loadingStats = ref(false);
  const loadingSessions = ref(false);
  const loadingActivities = ref(false);
  const loadingVehicles = ref(false);
  const loadingZones = ref(false);

  // Auto-refresh settings
  const autoRefreshEnabled = ref(true);
  const refreshInterval = ref(30000); // 30 seconds default
  const lastRefreshTime = ref(null);
  let refreshTimer = null;

  // Computed properties
  const occupancyPercentage = computed(() => {
    if (stats.value.totalSpaces === 0) return 0;
    return Math.round((stats.value.occupiedSpaces / stats.value.totalSpaces) * 100);
  });

  const occupancyStatus = computed(() => {
    const percentage = occupancyPercentage.value;
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    if (percentage >= 50) return 'normal';
    return 'low';
  });

  const formattedRevenue = computed(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(stats.value.todayRevenue);
  });

  const hasData = computed(() => {
    return stats.value.totalSpaces > 0 || recentSessions.value.length > 0;
  });

  // Actions

  /**
   * Fetch dashboard statistics
   */
  const fetchStats = async () => {
    loadingStats.value = true;
    try {
      const response = await dashboardService.getStats();
      if (response.data) {
        stats.value = {
          totalSpaces: response.data.totalSpaces || 0,
          occupiedSpaces: response.data.occupiedSpaces || 0,
          availableSpaces: response.data.availableSpaces || 0,
          activeSessions: response.data.activeSessions || 0,
          todayRevenue: response.data.todayRevenue || 0,
          totalVehicles: response.data.totalVehicles || 0,
        };
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      showError('Failed to load dashboard statistics');
    } finally {
      loadingStats.value = false;
    }
  };

  /**
   * Fetch recent parking sessions
   */
  const fetchRecentSessions = async (limit = 10) => {
    loadingSessions.value = true;
    try {
      const response = await dashboardService.getRecentSessions(limit);
      recentSessions.value = response.data || [];
    } catch (error) {
      console.error('Failed to fetch recent sessions:', error);
      showError('Failed to load recent sessions');
    } finally {
      loadingSessions.value = false;
    }
  };

  /**
   * Fetch recent activities (entries/exits)
   */
  const fetchRecentActivities = async (limit = 20) => {
    loadingActivities.value = true;
    try {
      const response = await dashboardService.getRecentActivities(limit);
      recentActivities.value = response.data || [];
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      showError('Failed to load recent activities');
    } finally {
      loadingActivities.value = false;
    }
  };

  /**
   * Fetch active vehicles currently parked
   */
  const fetchActiveVehicles = async () => {
    loadingVehicles.value = true;
    try {
      const response = await dashboardService.getActiveVehicles();
      activeVehicles.value = response.data || [];
    } catch (error) {
      console.error('Failed to fetch active vehicles:', error);
      showError('Failed to load active vehicles');
    } finally {
      loadingVehicles.value = false;
    }
  };

  /**
   * Fetch zone occupancy data
   */
  const fetchZoneOccupancy = async () => {
    loadingZones.value = true;
    try {
      const response = await dashboardService.getZoneOccupancy();
      zoneOccupancy.value = response.data || [];
    } catch (error) {
      console.error('Failed to fetch zone occupancy:', error);
      showError('Failed to load zone occupancy');
    } finally {
      loadingZones.value = false;
    }
  };

  /**
   * Load all dashboard data
   */
  const loadDashboard = async () => {
    loading.value = true;
    try {
      // Fetch all data in parallel
      await Promise.allSettled([
        fetchStats(),
        fetchRecentSessions(),
        fetchRecentActivities(),
        fetchActiveVehicles(),
        fetchZoneOccupancy(),
      ]);
      lastRefreshTime.value = new Date();
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Refresh dashboard data (silent refresh without loading state)
   */
  const refreshDashboard = async () => {
    try {
      await Promise.allSettled([
        fetchStats(),
        fetchRecentSessions(),
        fetchRecentActivities(),
        fetchActiveVehicles(),
        fetchZoneOccupancy(),
      ]);
      lastRefreshTime.value = new Date();
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    }
  };

  /**
   * Start auto-refresh timer
   */
  const startAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    if (autoRefreshEnabled.value) {
      refreshTimer = setInterval(() => {
        refreshDashboard();
      }, refreshInterval.value);
    }
  };

  /**
   * Stop auto-refresh timer
   */
  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  };

  /**
   * Toggle auto-refresh
   */
  const toggleAutoRefresh = () => {
    autoRefreshEnabled.value = !autoRefreshEnabled.value;
    if (autoRefreshEnabled.value) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  };

  /**
   * Set refresh interval (in milliseconds)
   */
  const setRefreshInterval = (interval) => {
    refreshInterval.value = interval;
    if (autoRefreshEnabled.value) {
      startAutoRefresh();
    }
  };

  /**
   * Reset store state
   */
  const resetStore = () => {
    stats.value = {
      totalSpaces: 0,
      occupiedSpaces: 0,
      availableSpaces: 0,
      activeSessions: 0,
      todayRevenue: 0,
      totalVehicles: 0,
    };
    recentSessions.value = [];
    recentActivities.value = [];
    activeVehicles.value = [];
    zoneOccupancy.value = [];
    loading.value = false;
    stopAutoRefresh();
  };

  return {
    // State
    stats,
    recentSessions,
    recentActivities,
    activeVehicles,
    zoneOccupancy,
    loading,
    loadingStats,
    loadingSessions,
    loadingActivities,
    loadingVehicles,
    loadingZones,
    autoRefreshEnabled,
    refreshInterval,
    lastRefreshTime,

    // Computed
    occupancyPercentage,
    occupancyStatus,
    formattedRevenue,
    hasData,

    // Actions
    fetchStats,
    fetchRecentSessions,
    fetchRecentActivities,
    fetchActiveVehicles,
    fetchZoneOccupancy,
    loadDashboard,
    refreshDashboard,
    startAutoRefresh,
    stopAutoRefresh,
    toggleAutoRefresh,
    setRefreshInterval,
    resetStore,
  };
});
