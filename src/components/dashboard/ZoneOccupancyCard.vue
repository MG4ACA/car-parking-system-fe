<script setup>
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Skeleton from 'primevue/skeleton';

const props = defineProps({
  zones: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const getOccupancyPercentage = (zone) => {
  if (!zone.capacity || zone.capacity === 0) return 0;
  return Math.round((zone.occupied / zone.capacity) * 100);
};

const getOccupancyColor = (percentage) => {
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warn';
  return 'success';
};

const getOccupancyStatus = (percentage) => {
  if (percentage >= 90) return 'Full';
  if (percentage >= 75) return 'Nearly Full';
  if (percentage >= 50) return 'Moderate';
  return 'Available';
};
</script>

<template>
  <Card>
    <template #title>
      <div class="section-title">
        <i class="pi pi-map-marker"></i>
        <span>Zone Occupancy</span>
      </div>
    </template>
    <template #content>
      <!-- Loading State -->
      <div v-if="loading" class="zones-grid">
        <div v-for="i in 4" :key="i" class="zone-item skeleton-zone">
          <Skeleton width="100%" height="1rem" class="mb-2" />
          <Skeleton width="100%" height="0.5rem" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="zones.length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>No zones configured</p>
      </div>

      <!-- Zone Data -->
      <div v-else class="zones-grid">
        <div v-for="zone in zones" :key="zone.id" class="zone-item">
          <div class="zone-header">
            <div class="zone-info">
              <span class="zone-name">{{ zone.name }}</span>
              <span :class="['zone-status', getOccupancyColor(getOccupancyPercentage(zone))]">
                {{ getOccupancyStatus(getOccupancyPercentage(zone)) }}
              </span>
            </div>
            <span class="zone-count">{{ zone.occupied }}/{{ zone.capacity }}</span>
          </div>
          <ProgressBar
            :value="getOccupancyPercentage(zone)"
            :showValue="false"
            :severity="getOccupancyColor(getOccupancyPercentage(zone))"
          />
          <div class="zone-footer">
            <span class="percentage-text">{{ getOccupancyPercentage(zone) }}% Occupied</span>
            <span class="available-text">{{ zone.capacity - zone.occupied }} Available</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
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
  transition: all 0.2s;
}

.zone-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-zone {
  padding: var(--spacing-md);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.zone-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.zone-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.zone-status {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.zone-status.success {
  color: var(--green-600);
}

.zone-status.warn {
  color: var(--orange-600);
}

.zone-status.danger {
  color: var(--red-600);
}

.zone-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
  font-family: monospace;
}

.zone-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
  font-size: 0.75rem;
}

.percentage-text {
  color: var(--text-secondary);
  font-weight: 500;
}

.available-text {
  color: var(--green-600);
  font-weight: 600;
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
@media (max-width: 768px) {
  .zones-grid {
    grid-template-columns: 1fr;
  }
}
</style>
