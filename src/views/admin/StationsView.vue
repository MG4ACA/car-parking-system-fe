<script setup>
import { useStationStore } from '@/stores/station.store';
import { storeToRefs } from 'pinia';
import { useConfirm } from 'primevue/useconfirm';
import { computed, onMounted, ref } from 'vue';

import StationForm from '@/components/admin/StationForm.vue';

const stationStore = useStationStore();
const { stations, loading } = storeToRefs(stationStore);
const confirm = useConfirm();

const drawerVisible = ref(false);
const editingStation = ref(null);
const formMode = ref('create');
const filterType = ref(null);

const typeOptions = [
  { label: 'All Types', value: null },
  { label: 'Entry', value: 'entry' },
  { label: 'Exit', value: 'exit' },
];

const filteredStations = computed(() => {
  if (!filterType.value) return stations.value;
  return stations.value.filter((s) => s.type === filterType.value);
});

const loadData = async () => {
  try {
    await stationStore.fetchStations();
  } catch (err) {
    console.error('Failed to load stations:', err);
  }
};

const openCreateDrawer = () => {
  editingStation.value = null;
  formMode.value = 'create';
  drawerVisible.value = true;
};

const openEditDrawer = (station) => {
  editingStation.value = { ...station };
  formMode.value = 'edit';
  drawerVisible.value = true;
};

const closeDrawer = () => {
  drawerVisible.value = false;
  editingStation.value = null;
};

const handleFormSubmit = async (data) => {
  try {
    if (formMode.value === 'create') {
      await stationStore.createStation(data);
    } else {
      await stationStore.updateStation(editingStation.value.id, data);
    }
    closeDrawer();
    loadData();
  } catch (err) {
    console.error('Failed to save station:', err);
  }
};

const handleDelete = (station) => {
  confirm.require({
    message: `Are you sure you want to delete "${station.name}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await stationStore.deleteStation(station.id);
        loadData();
      } catch (err) {
        console.error('Failed to delete station:', err);
      }
    },
  });
};

const handleToggleStatus = async (station) => {
  try {
    await stationStore.toggleStatus(station.id, !station.is_active);
    loadData();
  } catch (err) {
    console.error('Failed to toggle status:', err);
  }
};

const getStatusSeverity = (isActive) => {
  return isActive ? 'success' : 'danger';
};

const getTypeSeverity = (type) => {
  return type === 'entry' ? 'info' : 'warning';
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="stations-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Parking Stations</h1>
        <p class="page-description">Manage entry and exit stations</p>
      </div>
      <div class="header-actions">
        <Dropdown
          v-model="filterType"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Filter by Type"
          class="type-filter"
        />
        <Button label="Add Station" icon="pi pi-plus" @click="openCreateDrawer" />
      </div>
    </div>

    <div class="table-container">
      <DataTable :value="filteredStations" :loading="loading" stripedRows class="stations-table">
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-building" style="font-size: 3rem"></i>
            <p>No stations found</p>
          </div>
        </template>

        <Column field="name" header="Station Name" sortable>
          <template #body="{ data }">
            <div class="station-info">
              <i class="pi pi-building station-icon"></i>
              <span class="station-name">{{ data.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="type" header="Type" sortable>
          <template #body="{ data }">
            <Tag :value="data.type.toUpperCase()" :severity="getTypeSeverity(data.type)" />
          </template>
        </Column>

        <Column field="zone_name" header="Zone" sortable>
          <template #body="{ data }">
            <div class="zone-badge">
              <i class="pi pi-map-marker"></i>
              <span>{{ data.zone_name || 'N/A' }}</span>
            </div>
          </template>
        </Column>

        <Column field="is_active" header="Status" sortable>
          <template #body="{ data }">
            <Tag
              :value="data.is_active ? 'Active' : 'Inactive'"
              :severity="getStatusSeverity(data.is_active)"
            />
          </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 180px">
          <template #body="{ data }">
            <div class="action-buttons">
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="openEditDrawer(data)"
                v-tooltip.top="'Edit'"
              />
              <Button
                :icon="data.is_active ? 'pi pi-ban' : 'pi pi-check'"
                :severity="data.is_active ? 'warning' : 'success'"
                text
                rounded
                @click="handleToggleStatus(data)"
                v-tooltip.top="data.is_active ? 'Deactivate' : 'Activate'"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="handleDelete(data)"
                v-tooltip.top="'Delete'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Form Drawer -->
    <Drawer
      v-model:visible="drawerVisible"
      position="right"
      :header="formMode === 'create' ? 'Create Station' : 'Edit Station'"
      class="station-drawer"
    >
      <StationForm
        :station="editingStation"
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="closeDrawer"
      />
    </Drawer>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style scoped>
.stations-view {
  padding: var(--spacing-lg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.page-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.type-filter {
  min-width: 160px;
}

.table-container {
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  padding: var(--spacing-md);
}

.station-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.station-icon {
  color: var(--primary-color);
}

.station-name {
  font-weight: 500;
}

.zone-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.zone-badge i {
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-state i {
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}

.station-drawer {
  width: 500px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .type-filter {
    width: 100%;
  }

  .station-drawer {
    width: 100%;
  }
}
</style>
