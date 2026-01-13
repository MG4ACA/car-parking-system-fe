<script setup>
import { ref } from 'vue';

const props = defineProps({
  activities: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
});

const feedRef = ref(null);

const getActivityColor = (type) => {
  const colorMap = {
    entry: 'success',
    exit: 'info',
    payment: 'warn',
    alert: 'danger',
  };
  return colorMap[type] || 'secondary';
};

const getActivityIcon = (type) => {
  const iconMap = {
    entry: 'pi-sign-in',
    exit: 'pi-sign-out',
    payment: 'pi-dollar',
    alert: 'pi-exclamation-circle',
  };
  return iconMap[type] || 'pi-circle';
};

const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;

  const hours = Math.floor(diffInMinutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};
</script>

<template>
  <Card>
    <template #title>
      <div class="section-title">
        <i class="pi pi-history"></i>
        <span>Recent Activities</span>
      </div>
    </template>
    <template #content>
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div v-for="i in 5" :key="i" class="activity-skeleton">
          <Skeleton shape="circle" size="2.5rem" />
          <div class="skeleton-content">
            <Skeleton width="80%" height="1rem" class="mb-2" />
            <Skeleton width="60%" height="0.75rem" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="activities.length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>No recent activities</p>
      </div>

      <!-- Activities Timeline -->
      <div v-else ref="feedRef" class="activities-feed">
        <div
          v-for="activity in activities"
          :key="activity.id"
          :class="['activity-item', `activity-type-${activity.type}`]"
        >
          <div class="activity-header">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-time">
              <i class="pi pi-clock"></i>
              {{ formatRelativeTime(activity.timestamp) }}
            </span>
          </div>
          <div class="activity-details">
            <span class="plate-number">{{ activity.plateNumber }}</span>
            <div class="activity-meta">
              <Tag :value="activity.type" :severity="getActivityColor(activity.type)" />
              <span>{{ activity.vehicleType }} • {{ activity.zone }}</span>
            </div>
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

.activities-feed {
  max-height: 500px;
  overflow-y: auto;
  padding-right: var(--spacing-xs);
}

.activities-feed::-webkit-scrollbar {
  width: 6px;
}

.activities-feed::-webkit-scrollbar-track {
  background: var(--surface-100);
  border-radius: 3px;
}

.activities-feed::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.activity-item {
  position: relative;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background: var(--surface-50);
  border-radius: 8px;
  border-left: 4px solid var(--surface-border);
  transition: all 0.2s;
}

.activity-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateX(4px);
}

.activity-type-entry {
  border-left-color: var(--green-500);
}

.activity-type-exit {
  border-left-color: var(--blue-500);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.activity-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.activity-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.plate-number {
  font-weight: 600;
  font-family: monospace;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  padding: 3rem 1rem;
}

.empty-state i,
.loading-state i {
  font-size: 3rem;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.loading-state i {
  color: var(--primary-color);
}

.empty-state p,
.loading-state p {
  margin: 0;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .timeline {
    padding: 0;
  }

  .timeline-item {
    padding-left: 2.5rem;
  }

  .timeline-marker {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }

  .timeline-content {
    padding: 0.75rem;
  }

  .activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
