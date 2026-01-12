<script setup>
import dashboardService from '@/services/dashboardService';
import { useAuthStore } from '@/stores/auth.store';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import { computed, onMounted, ref } from 'vue';

const authStore = useAuthStore();
const loading = ref(true);
const error = ref(null);

// Dashboard data
const stats = ref({
  totalSpaces: 0,
  occupiedSpaces: 0,
  availableSpaces: 0,
  activeSessions: 0,
  todayRevenue: 0,
  totalVehicles: 0,
});

const recentSessions = ref([]);
const zoneOccupancy = ref([]);

// Computed properties
const occupancyPercentage = computed(() => {
  if (stats.value.totalSpaces === 0) return 0;
  return Math.round((stats.value.occupiedSpaces / stats.value.totalSpaces) * 100);
});

const userName = computed(() => authStore.user?.username || 'Admin');

// Load dashboard data
const loadDashboardData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // In parallel, fetch all dashboard data
    const [statsResponse, sessionsResponse, zonesResponse] = await Promise.allSettled([
      dashboardService.getStats(),
      dashboardService.getRecentSessions(10),
      dashboardService.getZoneOccupancy(),
    ]);

    // Handle stats
    if (statsResponse.status === 'fulfilled') {
      const data = statsResponse.value.data;
      stats.value = {
        totalSpaces: data.totalSpaces || 0,
        occupiedSpaces: data.occupiedSpaces || 0,
        availableSpaces: data.availableSpaces || 0,
        activeSessions: data.activeSessions || 0,
        todayRevenue: data.todayRevenue || 0,
        totalVehicles: data.totalVehicles || 0,
      };
    }

    // Handle recent sessions
    if (sessionsResponse.status === 'fulfilled') {
      recentSessions.value = sessionsResponse.value.data || [];
    }

    // Handle zone occupancy
    if (zonesResponse.status === 'fulfilled') {
      zoneOccupancy.value = zonesResponse.value.data || [];
    }
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
    error.value = 'Failed to load dashboard data';
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

const getOccupancyColor = (percentage) => {
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warn';
  return 'success';
};

const getSessionStatusSeverity = (status) => {
  const statusMap = {
    active: 'success',
    completed: 'info',
    cancelled: 'danger',
  };
  return statusMap[status] || 'secondary';
};

onMounted(() => {
  loadDashboardData();

  // Refresh dashboard every 30 seconds
  const interval = setInterval(loadDashboardData, 30000);

  // Cleanup on unmount
  return () => clearInterval(interval);
});
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p class="text-secondary">Welcome back, {{ userName }}!</p>
      </div>
      <div class="header-actions">
        <span class="last-updated">Last updated: {{ new Date().toLocaleTimeString() }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !stats.totalSpaces" class="loading-state">
      <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
      <p>Loading dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <i class="pi pi-exclamation-circle" style="font-size: 2rem"></i>
      <p>{{ error }}</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Grid -->
      <div class="stats-grid">
        <Card class="stat-card total-spaces">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon">
                <i class="pi pi-map"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ stats.totalSpaces }}</div>
                <div class="stat-label">Total Parking Spaces</div>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card occupied">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon">
                <i class="pi pi-car"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ stats.occupiedSpaces }}</div>
                <div class="stat-label">Occupied Spaces</div>
                <div class="stat-extra">{{ occupancyPercentage }}% Occupancy</div>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card available">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ stats.availableSpaces }}</div>
                <div class="stat-label">Available Spaces</div>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card revenue">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon">
                <i class="pi pi-dollar"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ formatCurrency(stats.todayRevenue) }}</div>
                <div class="stat-label">Today's Revenue</div>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card active-sessions">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon">
                <i class="pi pi-clock"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ stats.activeSessions }}</div>
                <div class="stat-label">Active Sessions</div>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card total-vehicles">
          <template #content>
            <div class="stat-content">
              <div class="stat-icon">
                <i class="pi pi-list"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ stats.totalVehicles }}</div>
                <div class="stat-label">Total Vehicles Today</div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Zone Occupancy -->
      <div class="zone-section" v-if="zoneOccupancy.length > 0">
        <Card>
          <template #title>
            <div class="section-title">
              <i class="pi pi-map-marker"></i>
              <span>Zone Occupancy</span>
            </div>
          </template>
          <template #content>
            <div class="zones-grid">
              <div v-for="zone in zoneOccupancy" :key="zone.id" class="zone-item">
                <div class="zone-header">
                  <span class="zone-name">{{ zone.name }}</span>
                  <span class="zone-count">{{ zone.occupied }}/{{ zone.capacity }}</span>
                </div>
                <ProgressBar
                  :value="Math.round((zone.occupied / zone.capacity) * 100)"
                  :showValue="false"
                  :severity="getOccupancyColor(Math.round((zone.occupied / zone.capacity) * 100))"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Recent Sessions -->
      <div class="recent-section">
        <Card>
          <template #title>
            <div class="section-title">
              <i class="pi pi-history"></i>
              <span>Recent Parking Sessions</span>
            </div>
          </template>
          <template #content>
            <DataTable :value="recentSessions" :rows="10" :loading="loading" stripedRows>
              <template #empty>
                <div class="empty-state">
                  <i class="pi pi-inbox"></i>
                  <p>No recent sessions</p>
                </div>
              </template>

              <Column field="vehicle_number" header="Vehicle Number" style="min-width: 150px">
                <template #body="{ data }">
                  <span class="vehicle-number">{{ data.vehicle_number }}</span>
                </template>
              </Column>

              <Column field="vehicle_type_name" header="Type" style="min-width: 120px">
                <template #body="{ data }">
                  <Tag :value="data.vehicle_type_name" severity="info" />
                </template>
              </Column>

              <Column field="zone_name" header="Zone" style="min-width: 120px" />

              <Column field="station_name" header="Station" style="min-width: 150px" />

              <Column field="entry_time" header="Entry Time" style="min-width: 180px">
                <template #body="{ data }">
                  {{ formatDateTime(data.entry_time) }}
                </template>
              </Column>

              <Column field="status" header="Status" style="min-width: 100px">
                <template #body="{ data }">
                  <Tag :value="data.status" :severity="getSessionStatusSeverity(data.status)" />
                </template>
              </Column>

              <Column field="fee" header="Fee" style="min-width: 100px">
                <template #body="{ data }">
                  <span v-if="data.fee" class="fee-amount">{{ formatCurrency(data.fee) }}</span>
                  <span v-else class="text-secondary">-</span>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--spacing-lg);
  max-width: 1600px;
  margin: 0 auto;
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

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: var(--text-secondary);
}

.loading-state i,
.error-state i {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.error-state i {
  color: var(--red-500);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  box-shadow: var(--card-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  flex-shrink: 0;
}

.stat-card.total-spaces .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.occupied .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.available .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card.revenue .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card.active-sessions .stat-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-card.total-vehicles .stat-icon {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.stat-details {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-extra {
  font-size: 0.75rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Zone Section */
.zone-section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.section-title i {
  color: var(--primary-color);
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.zone-item {
  padding: var(--spacing-md);
  background: var(--surface-50);
  border-radius: 8px;
  border: 1px solid var(--surface-border);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.zone-name {
  font-weight: 600;
  color: var(--text-primary);
}

.zone-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Recent Sessions */
.recent-section {
  margin-bottom: var(--spacing-xl);
}

.vehicle-number {
  font-weight: 600;
  color: var(--text-primary);
  font-family: monospace;
}

.fee-amount {
  font-weight: 600;
  color: var(--green-600);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
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

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .zones-grid {
    grid-template-columns: 1fr;
  }

  .stat-content {
    gap: var(--spacing-md);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
