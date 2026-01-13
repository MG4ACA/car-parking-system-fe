<script setup>
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  extra: {
    type: String,
    default: null,
  },
  gradient: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'purple', 'pink', 'blue', 'green', 'orange', 'teal'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const gradientClasses = {
  default: 'gradient-default',
  purple: 'gradient-purple',
  pink: 'gradient-pink',
  blue: 'gradient-blue',
  green: 'gradient-green',
  orange: 'gradient-orange',
  teal: 'gradient-teal',
};
</script>

<template>
  <Card class="statistics-card">
    <template #content>
      <div v-if="loading" class="stat-content">
        <Skeleton shape="circle" size="4rem" class="stat-icon-skeleton" />
        <div class="stat-details">
          <Skeleton width="80px" height="2rem" class="mb-2" />
          <Skeleton width="120px" height="1rem" />
        </div>
      </div>

      <div v-else class="stat-content">
        <div :class="['stat-icon', gradientClasses[gradient]]">
          <i :class="icon"></i>
        </div>
        <div class="stat-details">
          <div class="stat-value">{{ value }}</div>
          <div class="stat-label">{{ label }}</div>
          <div v-if="extra" class="stat-extra">{{ extra }}</div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.statistics-card {
  box-shadow: var(--card-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.statistics-card:hover {
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

.stat-icon-skeleton {
  flex-shrink: 0;
}

/* Gradient backgrounds */
.gradient-default {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-pink {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.gradient-teal {
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

/* Responsive Design */
@media (max-width: 768px) {
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
