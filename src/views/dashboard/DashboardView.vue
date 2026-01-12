<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'

const stats = ref([
  { label: 'Active Vehicles', value: 0, icon: 'pi-car', color: 'primary' },
  { label: 'Available Spots', value: 0, icon: 'pi-map-marker', color: 'success' },
  { label: "Today's Revenue", value: '$0', icon: 'pi-dollar', color: 'info' },
  { label: 'Overstay Alerts', value: 0, icon: 'pi-exclamation-triangle', color: 'warning' }
])
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p class="text-secondary">Welcome to Car Parking System</p>
    </div>

    <div class="stats-grid">
      <Card v-for="stat in stats" :key="stat.label" class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-icon" :class="`bg-${stat.color}`">
              <i :class="`pi ${stat.icon}`"></i>
            </div>
            <div class="stat-details">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="content-placeholder">
      <Card>
        <template #content>
          <p class="text-center text-secondary">Dashboard content will be implemented in Phase 7</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--spacing-xl);
}

.dashboard-header {
  margin-bottom: var(--spacing-xl);
}

.dashboard-header h1 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-xs);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  border-left: 4px solid var(--primary-color);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.bg-primary {
  background: var(--primary-color);
}

.stat-icon.bg-success {
  background: var(--success-color);
}

.stat-icon.bg-info {
  background: var(--info-color);
}

.stat-icon.bg-warning {
  background: var(--warning-color);
}

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.content-placeholder {
  margin-top: var(--spacing-xl);
}
</style>
