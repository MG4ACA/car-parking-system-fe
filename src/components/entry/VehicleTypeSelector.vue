<script setup>
import { useVehicleTypeStore } from '@/stores/vehicleType.store';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// Store
const vehicleTypeStore = useVehicleTypeStore();
const { vehicleTypes, loading } = storeToRefs(vehicleTypeStore);

// Computed
const activeVehicleTypes = computed(() => vehicleTypes.value.filter((type) => type.isActive));

const selectedType = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Methods
const selectType = (typeId) => {
  if (!props.disabled) {
    selectedType.value = typeId;
  }
};

const isSelected = (typeId) => {
  return selectedType.value === typeId;
};

// Lifecycle
onMounted(async () => {
  if (!vehicleTypes.value.length) {
    await vehicleTypeStore.fetchVehicleTypes();
  }
});
</script>

<template>
  <div class="vehicle-type-selector">
    <div class="selector-header">
      <h3>Select Vehicle Type</h3>
      <span class="required-badge">Required</span>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="type-grid">
        <Skeleton v-for="i in 6" :key="i" height="120px" border-radius="12px" />
      </div>
    </div>

    <div v-else-if="activeVehicleTypes.length === 0" class="empty-state">
      <i class="pi pi-exclamation-circle"></i>
      <p>No vehicle types available</p>
    </div>

    <div v-else class="type-grid">
      <Card
        v-for="type in activeVehicleTypes"
        :key="type.id"
        :class="[
          'type-card',
          {
            selected: isSelected(type.id),
            disabled: disabled,
          },
        ]"
        @click="selectType(type.id)"
      >
        <template #content>
          <div class="type-content">
            <div class="type-icon">
              <i :class="getVehicleIcon(type.name)"></i>
            </div>
            <div class="type-info">
              <span class="type-name">{{ type.name }}</span>
              <span class="type-rate">Rs {{ type.hourlyRate }}/hr</span>
            </div>
            <div v-if="isSelected(type.id)" class="selected-indicator">
              <i class="pi pi-check-circle"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-if="selectedType" class="selection-summary">
      <i class="pi pi-info-circle"></i>
      <span>
        Selected:
        <strong>{{ getSelectedTypeName }}</strong>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getVehicleIcon(typeName) {
      const name = typeName.toLowerCase();
      if (name.includes('motorcycle') || name.includes('bike')) {
        return 'pi pi-shield';
      } else if (name.includes('three-wheel')) {
        return 'pi pi-car';
      } else if (name.includes('suv') || name.includes('van')) {
        return 'pi pi-truck';
      } else if (name.includes('truck') || name.includes('commercial')) {
        return 'pi pi-box';
      } else if (name.includes('car')) {
        return 'pi pi-car';
      }
      return 'pi pi-circle';
    },
  },
  computed: {
    getSelectedTypeName() {
      const selected = this.activeVehicleTypes.find((t) => t.id === this.selectedType);
      return selected ? selected.name : '';
    },
  },
};
</script>

<style scoped>
.vehicle-type-selector {
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

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.type-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid var(--surface-border);
}

.type-card:hover:not(.disabled) {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.type-card.selected {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--blue-50) 100%);
}

.type-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.type-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  position: relative;
}

.type-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-100);
  border-radius: 50%;
  color: var(--primary-color);
}

.type-icon i {
  font-size: 1.5rem;
}

.type-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.type-name {
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  font-size: 0.95rem;
}

.type-rate {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.selected-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: var(--primary-color);
  font-size: 1.25rem;
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
  .type-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-sm);
  }

  .type-icon {
    width: 40px;
    height: 40px;
  }

  .type-icon i {
    font-size: 1.25rem;
  }
}
</style>
