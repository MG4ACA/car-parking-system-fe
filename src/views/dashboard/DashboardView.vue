<script setup>
import ActiveVehiclesTable from '@/components/dashboard/ActiveVehiclesTable.vue';
import RecentActivitiesFeed from '@/components/dashboard/RecentActivitiesFeed.vue';
import StatisticsCard from '@/components/dashboard/StatisticsCard.vue';
import ZoneOccupancyCard from '@/components/dashboard/ZoneOccupancyCard.vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useDashboardStore } from '@/stores/dashboard.store';
import { formatCurrency } from '@/utils/formatters';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { computed, onMounted, onUnmounted } from 'vue';

const dashboardStore = useDashboardStore();
const authStore = useAuthStore();

const {
  stats,
  zoneOccupancy,
  activeVehicles,
  recentActivities,
  loading,
  loadingStats,
  loadingZones,
  loadingVehicles,
  loadingActivities,
  autoRefreshEnabled,
  lastRefreshTime,
  occupancyPercentage,
} = storeToRefs(dashboardStore);

const userName = computed(() => authStore.user?.username || 'User');

const formattedRevenue = computed(() => formatCurrency(stats.value.todayRevenue));

const lastUpdateTime = computed(() => {
  if (!lastRefreshTime.value) return 'Never';
  return new Date(lastRefreshTime.value).toLocaleTimeString();
});

// Load dashboard on mount
onMounted(async () => {
  await dashboardStore.loadDashboard();
  dashboardStore.startAutoRefresh();
});

// Cleanup on unmount
onUnmounted(() => {
  dashboardStore.stopAutoRefresh();
});

const handleRefresh = async () => {
  await dashboardStore.loadDashboard();
};

const handleToggleAutoRefresh = () => {
  dashboardStore.toggleAutoRefresh();
};

const handleViewVehicleDetails = (vehicle) => {
  console.log('View vehicle details:', vehicle);
  // TODO: Navigate to vehicle details or show modal
};
</script>

<template>
  <MainLayout>
    <div class="dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p class="text-secondary">Welcome back, {{ userName }}!</p>
        </div>
        <div class="header-actions">
          <span class="last-updated">Last updated: {{ lastUpdateTime }}</span>
          <Button
            icon="pi pi-refresh"
            :loading="loading"
            @click="handleRefresh"
            label="Refresh"
            size="small"
            outlined
          />
          <Button
            :icon="autoRefreshEnabled ? 'pi pi-pause' : 'pi pi-play'"
            :label="autoRefreshEnabled ? 'Auto-refresh ON' : 'Auto-refresh OFF'"
            @click="handleToggleAutoRefresh"
            size="small"
            :severity="autoRefreshEnabled ? 'success' : 'secondary'"
            outlined
          />
        </div>
      </div>

      <!-- Statistics Cards Grid -->
      <div class="stats-grid">
        <StatisticsCard
          icon="pi pi-map"
          :value="stats.totalSpaces"
          label="Total Parking Spaces"
          gradient="purple"
          :loading="loadingStats"
        />
        <StatisticsCard
          icon="pi pi-car"
          :value="stats.occupiedSpaces"
          label="Occupied Spaces"
          :extra="`${occupancyPercentage}% Occupancy`"
          gradient="pink"
          :loading="loadingStats"
        />
        <StatisticsCard
          icon="pi pi-check-circle"
          :value="stats.availableSpaces"
          label="Available Spaces"
          gradient="blue"
          :loading="loadingStats"
        />
        <StatisticsCard
          icon="pi pi-dollar"
          :value="formattedRevenue"
          label="Today's Revenue"
          gradient="green"
          :loading="loadingStats"
        />
        <StatisticsCard
          icon="pi pi-clock"
          :value="stats.activeSessions"
          label="Active Sessions"
          gradient="orange"
          :loading="loadingStats"
        />
        <StatisticsCard
          icon="pi pi-list"
          :value="stats.totalVehicles"
          label="Total Vehicles Today"
          gradient="teal"
          :loading="loadingStats"
        />
      </div>

      <!-- Zone Occupancy -->
      <div class="zone-section">
        <ZoneOccupancyCard :zones="zoneOccupancy" :loading="loadingZones" />
      </div>

      <!-- Two Column Layout -->
      <div class="content-grid">
        <!-- Active Vehicles Table -->
        <div class="vehicles-section">
          <ActiveVehiclesTable
            :vehicles="activeVehicles"
            :loading="loadingVehicles"
            @view-details="handleViewVehicleDetails"
          />
        </div>

        <!-- Recent Activities Feed -->
        <div class="activities-section">
          <RecentActivitiesFeed :activities="recentActivities" :loading="loadingActivities" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.dashboard {
  padding: var(--spacing-lg);
  max-width: 100%;
  margin: 0;
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.dashboard-header .text-secondary {
  margin: 0;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.last-updated {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

/* Zone Section */
.zone-section {
  margin-bottom: var(--spacing-xl);
}

/* Content Grid - Two Column Layout */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.vehicles-section,
.activities-section {
  min-width: 0; /* Prevents overflow */
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-md);
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .header-actions button {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
