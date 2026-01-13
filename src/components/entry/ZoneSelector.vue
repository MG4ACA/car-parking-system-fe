<script setup>
import entryService from '@/services/entryService';
import { useZoneStore } from '@/stores/zone.store';
import { storeToRefs } from 'pinia';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showCapacity: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'capacity-warning']);

// Store
const zoneStore = useZoneStore();
const { zones, loading } = storeToRefs(zoneStore);

// Local state
const capacityData = ref({});
const loadingCapacity = ref(false);

// Computed
const activeZones = computed(() => zones.value.filter((zone) => zone.isActive));

const selectedZone = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const selectedZoneData = computed(() => {
  return activeZones.value.find((z) => z.id === selectedZone.value);
});

// Methods
const selectZone = (zoneId) => {
  if (!props.disabled) {
    selectedZone.value = zoneId;
  }
};

const isSelected = (zoneId) => {
  return selectedZone.value === zoneId;
};

const loadZoneCapacity = async (zoneId) => {
  try {
    const response = await entryService.getZoneCapacity(zoneId);
    if (response.success) {
      capacityData.value[zoneId] = response.data;
    }
  } catch (error) {
    console.error('Error loading capacity:', error);
  }
};

const getOccupancyPercentage = (zone) => {
  const data = capacityData.value[zone.id];
  if (!data) return 0;
  return (data.occupied / data.total) * 100;
};

const getCapacityStatus = (zone) => {
  const percentage = getOccupancyPercentage(zone);
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warning';
  return 'success';
};

const getAvailableSpots = (zone) => {
  const data = capacityData.value[zone.id];
  if (!data) return zone.capacity;
  return data.available;
};

const isFull = (zone) => {
  return getAvailableSpots(zone) === 0;
};

const checkCapacityWarning = (zone) => {
  const available = getAvailableSpots(zone);
  if (available === 0) {
    emit('capacity-warning', { zone, message: 'Zone is full', level: 'error' });
  } else if (available <= 5) {
    emit('capacity-warning', {
      zone,
      message: `Only ${available} spots remaining`,
      level: 'warning',
    });
  }
};

// Lifecycle
onMounted(async () => {
  if (!zones.value.length) {
    await zoneStore.fetchZones();
  }

  // Load capacity for all zones
  if (props.showCapacity) {
    loadingCapacity.value = true;
    await Promise.all(activeZones.value.map((zone) => loadZoneCapacity(zone.id)));
    loadingCapacity.value = false;
  }
});

// Watch selected zone for capacity warnings
watch(selectedZone, (newZoneId) => {
  if (newZoneId) {
    const zone = activeZones.value.find((z) => z.id === newZoneId);
    if (zone) {
      checkCapacityWarning(zone);
    }
  }
});
</script>

<template>
  <div class="zone-selector">
    <div class="selector-header">
      <h3>Select Parking Zone</h3>
      <span class="required-badge">Required</span>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="zone-grid">
        <Skeleton v-for="i in 4" :key="i" height="140px" border-radius="12px" />
      </div>
    </div>

    <div v-else-if="activeZones.length === 0" class="empty-state">
      <i class="pi pi-exclamation-circle"></i>
      <p>No parking zones available</p>
    </div>

    <div v-else class="zone-grid">
      <Card
        v-for="zone in activeZones"
        :key="zone.id"
        :class="[
          'zone-card',
          {
            selected: isSelected(zone.id),
            disabled: disabled || isFull(zone),
            full: isFull(zone),
          },
        ]"
        @click="selectZone(zone.id)"
      >
        <template #content>
          <div class="zone-content">
            <div class="zone-header">
              <span class="zone-name">{{ zone.name }}</span>
              <Tag v-if="isFull(zone)" value="FULL" severity="danger" />
              <i v-else-if="isSelected(zone.id)" class="pi pi-check-circle selected-icon"></i>
            </div>

            <div v-if="showCapacity && !loadingCapacity" class="capacity-info">
              <div class="capacity-numbers">
                <span class="available">{{ getAvailableSpots(zone) }} available</span>
                <span class="total">of {{ zone.capacity }}</span>
              </div>

              <ProgressBar
                :value="getOccupancyPercentage(zone)"
                :show-value="false"
                :class="['capacity-bar', getCapacityStatus(zone)]"
              />
            </div>

            <div v-if="loadingCapacity" class="capacity-loading">
              <Skeleton height="30px" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-if="selectedZoneData" class="selection-summary">
      <i class="pi pi-info-circle"></i>
      <span>
        Selected:
        <strong>{{ selectedZoneData.name }}</strong>
        - {{ getAvailableSpots(selectedZoneData) }} spots available
      </span>
    </div>
  </div>
</template>

<style scoped>
.zone-selector {
  width: 100%;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.selector-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.required-badge {
  padding: 0.25rem 0.75rem;
  background: var(--red-100);
  color: var(--red-700);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.zone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.zone-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid var(--surface-border);
}

.zone-card:hover:not(.disabled):not(.full) {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.zone-card.selected {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--blue-50) 100%);
}

.zone-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zone-card.full {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: var(--red-400);
}

.zone-content {
  padding: 0.5rem;
}

.zone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.zone-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.selected-icon {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.capacity-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.capacity-numbers {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.available {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.total {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.capacity-bar {
  height: 8px;
  border-radius: 4px;
}

.capacity-bar.success :deep(.p-progressbar-value) {
  background: var(--green-500);
}

.capacity-bar.warning :deep(.p-progressbar-value) {
  background: var(--orange-500);
}

.capacity-bar.danger :deep(.p-progressbar-value) {
  background: var(--red-500);
}

.capacity-loading {
  margin-top: 1rem;
}

.loading-container {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--orange-500);
}

.selection-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--blue-50);
  border-radius: 8px;
  color: var(--blue-700);
}

.selection-summary i {
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .zone-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
}
</style>
