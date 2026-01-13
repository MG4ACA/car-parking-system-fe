<script setup>
import { useZoneStore } from '@/stores/zone.store';
import { storeToRefs } from 'pinia';
import { useConfirm } from 'primevue/useconfirm';
import { onMounted, ref } from 'vue';
import Tooltip from 'primevue/tooltip';

import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Drawer from 'primevue/drawer';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';

const vTooltip = Tooltip;

import ZoneForm from '@/components/admin/ZoneForm.vue';

const zoneStore = useZoneStore();
const { zones, loading } = storeToRefs(zoneStore);
const confirm = useConfirm();

const drawerVisible = ref(false);
const editingZone = ref(null);
const formMode = ref('create');

const loadData = async () => {
  try {
    await zoneStore.fetchZones();
  } catch (err) {
    console.error('Failed to load zones:', err);
  }
};

const openCreateDrawer = () => {
  editingZone.value = null;
  formMode.value = 'create';
  drawerVisible.value = true;
};

const openEditDrawer = (zone) => {
  editingZone.value = { ...zone };
  formMode.value = 'edit';
  drawerVisible.value = true;
};

const closeDrawer = () => {
  drawerVisible.value = false;
  editingZone.value = null;
};

const handleFormSubmit = async (data) => {
  try {
    if (formMode.value === 'create') {
      await zoneStore.createZone(data);
    } else {
      await zoneStore.updateZone(editingZone.value.id, data);
    }
    closeDrawer();
    loadData();
  } catch (err) {
    console.error('Failed to save zone:', err);
  }
};

const handleDelete = (zone) => {
  confirm.require({
    message: `Are you sure you want to delete "${zone.name}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await zoneStore.deleteZone(zone.id);
        loadData();
      } catch (err) {
        console.error('Failed to delete zone:', err);
      }
    },
  });
};

const handleToggleStatus = async (zone) => {
  try {
    await zoneStore.toggleStatus(zone.id, !zone.is_active);
    loadData();
  } catch (err) {
    console.error('Failed to toggle status:', err);
  }
};

const getStatusSeverity = (isActive) => {
  return isActive ? 'success' : 'danger';
};

const getCapacityPercentage = (zone) => {
  return zoneStore.getZoneCapacityPercentage(zone);
};

const getCapacitySeverity = (percentage) => {
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warn';
  return 'success';
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="zones-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Parking Zones</h1>
        <p class="page-description">Manage parking zones and capacity</p>
      </div>
      <div class="header-actions">
        <Button label="Add Zone" icon="pi pi-plus" @click="openCreateDrawer" />
      </div>
    </div>

    <div class="table-container">
      <DataTable :value="zones" :loading="loading" stripedRows class="zones-table">
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-map-marker" style="font-size: 3rem"></i>
            <p>No zones found</p>
          </div>
        </template>

        <Column field="name" header="Zone Name" sortable>
          <template #body="{ data }">
            <div class="zone-info">
              <i class="pi pi-map-marker zone-icon"></i>
              <span class="zone-name">{{ data.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="capacity" header="Capacity" sortable>
          <template #body="{ data }">
            <div class="capacity-info">
              <div class="capacity-text">
                <span class="occupied">{{ data.occupied_slots || 0 }}</span>
                /
                <span class="total">{{ data.capacity }}</span>
              </div>
              <ProgressBar
                :value="getCapacityPercentage(data)"
                :showValue="false"
                :severity="getCapacitySeverity(getCapacityPercentage(data))"
                style="height: 6px"
              />
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
      :header="formMode === 'create' ? 'Create Zone' : 'Edit Zone'"
      class="zone-drawer"
    >
      <ZoneForm
        :zone="editingZone"
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="closeDrawer"
      />
    </Drawer>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style scoped>
.zones-view {
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

.table-container {
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  padding: var(--spacing-md);
}

.zone-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zone-icon {
  color: var(--primary-color);
}

.zone-name {
  font-weight: 500;
}

.capacity-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.capacity-text {
  font-size: 0.95rem;
}

.occupied {
  font-weight: 600;
  color: var(--primary-color);
}

.total {
  color: var(--text-secondary);
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

.zone-drawer {
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
  }

  .zone-drawer {
    width: 100%;
  }
}
</style>
