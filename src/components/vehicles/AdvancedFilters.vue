<script setup>
import { useVehicleStore } from '@/stores/vehicle.store';
import { useVehicleTypeStore } from '@/stores/vehicleType.store';
import { useZoneStore } from '@/stores/zone.store';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { computed, onMounted, ref } from 'vue';

const vehicleStore = useVehicleStore();
const vehicleTypeStore = useVehicleTypeStore();
const zoneStore = useZoneStore();

const { filters } = storeToRefs(vehicleStore);
const { vehicleTypes } = storeToRefs(vehicleTypeStore);
const { zones } = storeToRefs(zoneStore);

const emit = defineEmits(['search', 'clear']);

// Local refs for date range
const dateRange = ref(null);

// Status options
const statusOptions = [
  { label: 'All Status', value: null },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

// Payment status options
const paymentOptions = [
  { label: 'All Payments', value: null },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
];

// Sort options
const sortOptions = [
  { label: 'Entry Time (Newest)', value: { sortBy: 'entry_time', sortOrder: 'desc' } },
  { label: 'Entry Time (Oldest)', value: { sortBy: 'entry_time', sortOrder: 'asc' } },
  { label: 'Exit Time (Newest)', value: { sortBy: 'exit_time', sortOrder: 'desc' } },
  { label: 'Exit Time (Oldest)', value: { sortBy: 'exit_time', sortOrder: 'asc' } },
  { label: 'Amount (High to Low)', value: { sortBy: 'calculated_amount', sortOrder: 'desc' } },
  { label: 'Amount (Low to High)', value: { sortBy: 'calculated_amount', sortOrder: 'asc' } },
];

// Computed
const vehicleTypeOptions = computed(() => [
  { label: 'All Vehicle Types', value: null },
  ...vehicleTypes.value.map((type) => ({
    label: type.name,
    value: type.id,
  })),
]);

const zoneOptions = computed(() => [
  { label: 'All Zones', value: null },
  ...zones.value.map((zone) => ({
    label: zone.name,
    value: zone.id,
  })),
]);

const selectedSort = ref(sortOptions[0].value);

// Load data on mount
onMounted(async () => {
  await Promise.all([vehicleTypeStore.fetchVehicleTypes(), zoneStore.fetchZones()]);
});

// Methods
const handleSearch = () => {
  // Update date filters from date range
  if (dateRange.value && dateRange.value.length === 2) {
    filters.value.startDate = dateRange.value[0];
    filters.value.endDate = dateRange.value[1];
  } else {
    filters.value.startDate = null;
    filters.value.endDate = null;
  }

  // Update sort
  filters.value.sortBy = selectedSort.value.sortBy;
  filters.value.sortOrder = selectedSort.value.sortOrder;

  emit('search');
};

const handleClear = () => {
  // Clear all filters
  vehicleStore.clearFilters();
  dateRange.value = null;
  selectedSort.value = sortOptions[0].value;
  emit('clear');
};

const handlePlateInput = (event) => {
  // Auto-uppercase plate number
  filters.value.plateNumber = event.target.value.toUpperCase();
};
</script>

<template>
  <Card class="advanced-filters">
    <template #title>
      <div class="filter-header">
        <i class="pi pi-filter"></i>
        <span>Advanced Filters</span>
      </div>
    </template>
    <template #content>
      <div class="filters-grid">
        <!-- Plate Number -->
        <div class="filter-field">
          <label for="plateNumber">Plate Number</label>
          <InputText
            id="plateNumber"
            v-model="filters.plateNumber"
            placeholder="Enter plate number"
            @input="handlePlateInput"
          />
        </div>

        <!-- Date Range -->
        <div class="filter-field">
          <label for="dateRange">Date Range</label>
          <Calendar
            id="dateRange"
            v-model="dateRange"
            selectionMode="range"
            placeholder="Select date range"
            :showIcon="true"
            dateFormat="yy-mm-dd"
            :manualInput="false"
          />
        </div>

        <!-- Status -->
        <div class="filter-field">
          <label for="status">Status</label>
          <Dropdown
            id="status"
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select status"
          />
        </div>

        <!-- Vehicle Type -->
        <div class="filter-field">
          <label for="vehicleType">Vehicle Type</label>
          <Dropdown
            id="vehicleType"
            v-model="filters.vehicleTypeId"
            :options="vehicleTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select vehicle type"
          />
        </div>

        <!-- Zone -->
        <div class="filter-field">
          <label for="zone">Zone</label>
          <Dropdown
            id="zone"
            v-model="filters.zoneId"
            :options="zoneOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select zone"
          />
        </div>

        <!-- Payment Status -->
        <div class="filter-field">
          <label for="payment">Payment Status</label>
          <Dropdown
            id="payment"
            v-model="filters.paymentStatus"
            :options="paymentOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select payment status"
          />
        </div>

        <!-- Sort By -->
        <div class="filter-field">
          <label for="sortBy">Sort By</label>
          <Dropdown
            id="sortBy"
            v-model="selectedSort"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Select sort order"
          />
        </div>
      </div>

      <Divider />

      <!-- Action Buttons -->
      <div class="filter-actions">
        <Button
          label="Clear Filters"
          icon="pi pi-times"
          severity="secondary"
          outlined
          @click="handleClear"
        />
        <Button label="Search" icon="pi pi-search" @click="handleSearch" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.advanced-filters {
  margin-bottom: var(--spacing-lg);
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.filter-header i {
  color: var(--primary-color);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-field label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

/* Responsive Design */
@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column-reverse;
  }

  .filter-actions button {
    width: 100%;
  }
}
</style>
