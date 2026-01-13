<script setup>
import { formatDateTime, formatDuration } from '@/utils/formatters';
import { computed, ref } from 'vue';

const props = defineProps({
  vehicles: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['view-details']);

const searchQuery = ref('');

const filteredVehicles = computed(() => {
  if (!searchQuery.value) return props.vehicles;

  const query = searchQuery.value.toLowerCase();
  return props.vehicles.filter((vehicle) => {
    return (
      vehicle.plateNumber?.toLowerCase().includes(query) ||
      vehicle.vehicleType?.toLowerCase().includes(query) ||
      vehicle.zone?.toLowerCase().includes(query)
    );
  });
});

const getStatusSeverity = (status) => {
  const statusMap = {
    active: 'success',
    completed: 'info',
    cancelled: 'danger',
  };
  return statusMap[status] || 'secondary';
};

const calculateDuration = (entryTime) => {
  if (!entryTime) return '-';
  const entry = new Date(entryTime);
  const now = new Date();
  const minutes = Math.floor((now - entry) / (1000 * 60));
  return formatDuration(minutes);
};

const onRowClick = (event) => {
  emit('view-details', event.data);
};
</script>

<template>
  <Card>
    <template #title>
      <div class="section-title">
        <i class="pi pi-car"></i>
        <span>Active Vehicles</span>
      </div>
    </template>
    <template #content>
      <!-- Search Box -->
      <div class="search-box">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Search by plate number, type, or zone..."
            class="search-input"
          />
        </span>
        <span v-if="filteredVehicles.length" class="result-count">
          {{ filteredVehicles.length }} vehicle{{ filteredVehicles.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Data Table -->
      <DataTable
        :value="filteredVehicles"
        :loading="loading"
        stripedRows
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        responsiveLayout="scroll"
        @row-click="onRowClick"
        class="active-vehicles-table"
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-inbox"></i>
            <p>No active vehicles found</p>
          </div>
        </template>

        <template #loading>
          <div class="loading-state">
            <i class="pi pi-spinner pi-spin"></i>
            <p>Loading vehicles...</p>
          </div>
        </template>

        <Column field="plateNumber" header="Plate Number" :sortable="true" style="min-width: 150px">
          <template #body="{ data }">
            <span class="plate-number">{{ data.plateNumber }}</span>
          </template>
        </Column>

        <Column field="vehicleType" header="Vehicle Type" :sortable="true" style="min-width: 140px">
          <template #body="{ data }">
            <Tag :value="data.vehicleType" severity="info" />
          </template>
        </Column>

        <Column field="zone" header="Zone" :sortable="true" style="min-width: 120px">
          <template #body="{ data }">
            <span class="zone-badge">{{ data.zone }}</span>
          </template>
        </Column>

        <Column field="entryTime" header="Entry Time" :sortable="true" style="min-width: 180px">
          <template #body="{ data }">
            {{ formatDateTime(data.entryTime) }}
          </template>
        </Column>

        <Column field="duration" header="Duration" style="min-width: 120px">
          <template #body="{ data }">
            <span class="duration-text">{{ calculateDuration(data.entryTime) }}</span>
          </template>
        </Column>

        <Column field="status" header="Status" :sortable="true" style="min-width: 100px">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
          </template>
        </Column>

        <Column header="Actions" style="min-width: 100px">
          <template #body="{ data }">
            <button
              @click.stop="emit('view-details', data)"
              class="action-button"
              title="View Details"
            >
              <i class="pi pi-eye"></i>
            </button>
          </template>
        </Column>
      </DataTable>
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

.search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.search-input {
  width: 100%;
  max-width: 400px;
}

.result-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.active-vehicles-table {
  cursor: pointer;
}

.active-vehicles-table :deep(tbody tr:hover) {
  background: var(--surface-100);
}

.plate-number {
  font-weight: 600;
  color: var(--text-primary);
  font-family: monospace;
  font-size: 0.95rem;
}

.zone-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-50);
  color: var(--primary-700);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.duration-text {
  font-weight: 500;
  color: var(--text-primary);
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background: var(--primary-600);
  transform: scale(1.05);
}

.action-button i {
  font-size: 0.875rem;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
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
  .search-box {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: none;
  }

  .result-count {
    text-align: center;
  }
}
</style>
