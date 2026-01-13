<script setup>
import { useVehicleTypeStore } from '@/stores/vehicleType.store';
import { storeToRefs } from 'pinia';
import { useConfirm } from 'primevue/useconfirm';
import { onMounted, ref } from 'vue';

import VehicleTypeForm from '@/components/admin/VehicleTypeForm.vue';

const vehicleTypeStore = useVehicleTypeStore();
const { vehicleTypes, rateHistory, loading } = storeToRefs(vehicleTypeStore);
const confirm = useConfirm();

const drawerVisible = ref(false);
const editingType = ref(null);
const formMode = ref('create');
const rateHistoryDialog = ref(false);

const loadData = async () => {
  try {
    await vehicleTypeStore.fetchVehicleTypes();
  } catch (err) {
    console.error('Failed to load vehicle types:', err);
  }
};

const openCreateDrawer = () => {
  editingType.value = null;
  formMode.value = 'create';
  drawerVisible.value = true;
};

const openEditDrawer = (type) => {
  editingType.value = { ...type };
  formMode.value = 'edit';
  drawerVisible.value = true;
};

const closeDrawer = () => {
  drawerVisible.value = false;
  editingType.value = null;
};

const handleFormSubmit = async (data) => {
  try {
    if (formMode.value === 'create') {
      await vehicleTypeStore.createVehicleType(data);
    } else {
      await vehicleTypeStore.updateVehicleType(editingType.value.id, data);
    }
    closeDrawer();
    loadData();
  } catch (err) {
    console.error('Failed to save vehicle type:', err);
  }
};

const handleDelete = (type) => {
  confirm.require({
    message: `Are you sure you want to delete "${type.name}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await vehicleTypeStore.deleteVehicleType(type.id);
        loadData();
      } catch (err) {
        console.error('Failed to delete vehicle type:', err);
      }
    },
  });
};

const handleToggleStatus = async (type) => {
  try {
    await vehicleTypeStore.toggleStatus(type.id, !type.is_active);
    loadData();
  } catch (err) {
    console.error('Failed to toggle status:', err);
  }
};

const openRateHistory = async () => {
  try {
    await vehicleTypeStore.fetchRateHistory();
    rateHistoryDialog.value = true;
  } catch (err) {
    console.error('Failed to load rate history:', err);
  }
};

const getStatusSeverity = (isActive) => {
  return isActive ? 'success' : 'danger';
};

const formatCurrency = (value) => {
  return `$${parseFloat(value).toFixed(2)}`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="rates-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Rate Management</h1>
        <p class="page-description">Manage vehicle types and hourly rates</p>
      </div>
      <div class="header-actions">
        <Button label="Rate History" icon="pi pi-history" outlined @click="openRateHistory" />
        <Button label="Add Vehicle Type" icon="pi pi-plus" @click="openCreateDrawer" />
      </div>
    </div>

    <div class="table-container">
      <DataTable :value="vehicleTypes" :loading="loading" stripedRows class="types-table">
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-car" style="font-size: 3rem"></i>
            <p>No vehicle types found</p>
          </div>
        </template>

        <Column field="name" header="Vehicle Type" sortable>
          <template #body="{ data }">
            <div class="type-info">
              <i class="pi pi-car type-icon"></i>
              <span class="type-name">{{ data.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="hourly_rate" header="Hourly Rate" sortable>
          <template #body="{ data }">
            <span class="rate-value">{{ formatCurrency(data.hourly_rate) }}</span>
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
      :header="formMode === 'create' ? 'Create Vehicle Type' : 'Edit Vehicle Type'"
      class="type-drawer"
    >
      <VehicleTypeForm
        :vehicleType="editingType"
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="closeDrawer"
      />
    </Drawer>

    <!-- Rate History Dialog -->
    <Dialog
      v-model:visible="rateHistoryDialog"
      header="Rate Change History"
      :modal="true"
      :closable="true"
      class="rate-history-dialog"
    >
      <div class="history-content">
        <Timeline :value="rateHistory" align="left">
          <template #marker="{ item }">
            <span class="timeline-marker">
              <i class="pi pi-dollar"></i>
            </span>
          </template>
          <template #content="{ item }">
            <div class="history-item">
              <div class="history-header">
                <strong>{{ item.vehicle_type_name }}</strong>
                <span class="history-date">{{ formatDate(item.changed_at) }}</span>
              </div>
              <div class="history-change">
                <span class="old-rate">{{ formatCurrency(item.old_rate) }}</span>
                <i class="pi pi-arrow-right"></i>
                <span class="new-rate">{{ formatCurrency(item.new_rate) }}</span>
              </div>
              <small class="history-user">Changed by: {{ item.changed_by_name }}</small>
            </div>
          </template>
        </Timeline>

        <div v-if="!rateHistory || rateHistory.length === 0" class="empty-history">
          <p>No rate history available</p>
        </div>
      </div>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style scoped>
.rates-view {
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

.type-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.type-icon {
  color: var(--primary-color);
}

.type-name {
  font-weight: 500;
}

.rate-value {
  font-weight: 600;
  color: var(--green-600);
  font-size: 1.1rem;
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

.type-drawer {
  width: 500px;
}

.rate-history-dialog {
  width: 600px;
}

.history-content {
  padding: 1rem 0;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.timeline-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
}

.history-item {
  padding: 0.5rem 0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.history-change {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.old-rate {
  text-decoration: line-through;
  color: var(--red-500);
}

.new-rate {
  font-weight: 600;
  color: var(--green-600);
}

.history-user {
  color: var(--text-secondary);
}

.empty-history {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
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

  .type-drawer,
  .rate-history-dialog {
    width: 100%;
  }
}
</style>
