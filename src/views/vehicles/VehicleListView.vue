<script setup>
import AdvancedFilters from '@/components/vehicles/AdvancedFilters.vue';
import ManualCorrectionForm from '@/components/vehicles/ManualCorrectionForm.vue';
import VehicleDetailsModal from '@/components/vehicles/VehicleDetailsModal.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useVehicleStore } from '@/stores/vehicle.store';
import { formatCurrency, formatDateTime, formatDuration } from '@/utils/formatters';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const vehicleStore = useVehicleStore();
const authStore = useAuthStore();

const {
  vehicles,
  selectedVehicle,
  vehicleHistory,
  vehicleStats,
  currentPage,
  pageSize,
  totalRecords,
  loading,
  loadingDetails,
  loadingHistory,
  updating,
  exporting,
} = storeToRefs(vehicleStore);

// Modal states
const showDetailsModal = ref(false);
const showCorrectionForm = ref(false);

// Permissions
const canEdit = computed(() => {
  const role = authStore.user?.role;
  return role === 'admin' || role === 'operator';
});

// Load vehicles on mount
onMounted(async () => {
  await vehicleStore.searchVehicles();
});

// Cleanup on unmount
onUnmounted(() => {
  vehicleStore.resetStore();
});

// Table methods
const getStatusSeverity = (status) => {
  const statusMap = {
    active: 'success',
    completed: 'info',
    cancelled: 'danger',
  };
  return statusMap[status] || 'secondary';
};

const getPaymentSeverity = (paymentStatus) => {
  return paymentStatus === 'paid' ? 'success' : 'warn';
};

// Event handlers
const handleSearch = async () => {
  vehicleStore.currentPage = 1;
  await vehicleStore.searchVehicles();
};

const handleClear = async () => {
  await vehicleStore.searchVehicles();
};

const handleExport = async () => {
  await vehicleStore.exportVehicles();
};

const handlePageChange = (event) => {
  vehicleStore.goToPage(event.page + 1);
};

const handleRowClick = async (event) => {
  const vehicle = event.data;
  await handleViewDetails(vehicle);
};

const handleViewDetails = async (vehicle) => {
  vehicleStore.selectVehicle(vehicle);

  // Fetch history and details in parallel
  await Promise.all([
    vehicleStore.fetchVehicleDetails(vehicle.id),
    vehicleStore.fetchParkingHistory(vehicle.vehicle_plate_number),
  ]);

  showDetailsModal.value = true;
};

const handleEditSession = () => {
  showDetailsModal.value = false;
  showCorrectionForm.value = true;
};

const handleSaveCorrection = async (data) => {
  try {
    await vehicleStore.updateSession(selectedVehicle.value.id, data);
    showCorrectionForm.value = false;
    vehicleStore.clearSelectedVehicle();
  } catch (error) {
    // Error already handled in store
  }
};

const handleCloseDetailsModal = () => {
  showDetailsModal.value = false;
  vehicleStore.clearSelectedVehicle();
};

const handleCloseCorrectionForm = () => {
  showCorrectionForm.value = false;
};
</script>

<template>
  <div class="vehicle-list-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Vehicle Management</h1>
        <p class="text-secondary">Search, view, and manage parking sessions</p>
      </div>
      <div class="header-actions">
        <Button
          label="Export CSV"
          icon="pi pi-download"
          :loading="exporting"
          @click="handleExport"
          outlined
        />
      </div>
    </div>

    <!-- Advanced Filters -->
    <AdvancedFilters @search="handleSearch" @clear="handleClear" />

    <!-- Vehicles Table -->
    <Card>
      <template #title>
        <div class="table-header">
          <span>Parking Sessions</span>
          <span v-if="totalRecords > 0" class="record-count">
            {{ totalRecords }} record{{ totalRecords !== 1 ? 's' : '' }}
          </span>
        </div>
      </template>
      <template #content>
        <DataTable
          :value="vehicles"
          :loading="loading"
          stripedRows
          responsiveLayout="scroll"
          @row-click="handleRowClick"
          class="vehicles-table"
        >
          <template #empty>
            <div class="empty-state">
              <i class="pi pi-inbox"></i>
              <p>No vehicles found</p>
              <small>Try adjusting your filters</small>
            </div>
          </template>

          <template #loading>
            <div class="loading-state">
              <i class="pi pi-spinner pi-spin"></i>
              <p>Loading vehicles...</p>
            </div>
          </template>

          <!-- Plate Number -->
          <Column field="vehicle_plate_number" header="Plate Number" style="min-width: 150px">
            <template #body="{ data }">
              <span class="plate-number">{{ data.vehicle_plate_number }}</span>
            </template>
          </Column>

          <!-- Vehicle Type -->
          <Column field="vehicle_type_name" header="Type" style="min-width: 140px">
            <template #body="{ data }">
              <Tag :value="data.vehicle_type_name" severity="info" />
            </template>
          </Column>

          <!-- Zone -->
          <Column field="zone_name" header="Zone" style="min-width: 120px">
            <template #body="{ data }">
              <span class="zone-badge">{{ data.zone_name || 'N/A' }}</span>
            </template>
          </Column>

          <!-- Entry Time -->
          <Column field="entry_time" header="Entry Time" style="min-width: 180px">
            <template #body="{ data }">
              {{ formatDateTime(data.entry_time) }}
            </template>
          </Column>

          <!-- Exit Time -->
          <Column field="exit_time" header="Exit Time" style="min-width: 180px">
            <template #body="{ data }">
              {{ data.exit_time ? formatDateTime(data.exit_time) : '-' }}
            </template>
          </Column>

          <!-- Duration -->
          <Column field="duration_minutes" header="Duration" style="min-width: 120px">
            <template #body="{ data }">
              <span v-if="data.duration_minutes" class="duration-text">
                {{ formatDuration(data.duration_minutes) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>

          <!-- Amount -->
          <Column field="calculated_amount" header="Amount" style="min-width: 120px">
            <template #body="{ data }">
              <span v-if="data.calculated_amount" class="amount-text">
                {{ formatCurrency(data.calculated_amount) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>

          <!-- Payment Status -->
          <Column field="payment_status" header="Payment" style="min-width: 100px">
            <template #body="{ data }">
              <Tag
                :value="data.payment_status"
                :severity="getPaymentSeverity(data.payment_status)"
              />
            </template>
          </Column>

          <!-- Status -->
          <Column field="status" header="Status" style="min-width: 100px">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>

          <!-- Actions -->
          <Column header="Actions" style="min-width: 150px">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button
                  icon="pi pi-eye"
                  @click.stop="handleViewDetails(data)"
                  rounded
                  text
                  severity="info"
                  v-tooltip.top="'View Details'"
                />
                <Button
                  v-if="canEdit"
                  icon="pi pi-pencil"
                  @click.stop="
                    () => {
                      vehicleStore.selectVehicle(data);
                      showCorrectionForm = true;
                    }
                  "
                  rounded
                  text
                  severity="warn"
                  v-tooltip.top="'Edit Session'"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- Pagination -->
        <Paginator
          v-if="totalRecords > 0"
          :rows="pageSize"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[10, 20, 50, 100]"
          @page="handlePageChange"
          :first="(currentPage - 1) * pageSize"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        ></Paginator>
      </template>
    </Card>

    <!-- Vehicle Details Modal -->
    <VehicleDetailsModal
      v-model:visible="showDetailsModal"
      :vehicle="selectedVehicle"
      :history="vehicleHistory"
      :stats="vehicleStats"
      :loading="loadingDetails || loadingHistory"
      @edit="handleEditSession"
      @close="handleCloseDetailsModal"
    />

    <!-- Manual Correction Form -->
    <ManualCorrectionForm
      v-model:visible="showCorrectionForm"
      :session="selectedVehicle"
      :loading="updating"
      @save="handleSaveCorrection"
      @close="handleCloseCorrectionForm"
    />
  </div>
</template>

<style scoped>
.vehicle-list-page {
  padding: var(--spacing-lg);
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.page-header .text-secondary {
  margin: 0;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.vehicles-table {
  cursor: pointer;
}

.vehicles-table :deep(tbody tr:hover) {
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

.duration-text,
.amount-text {
  font-weight: 500;
  color: var(--text-primary);
}

.amount-text {
  color: var(--green-600);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-state i,
.loading-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state i {
  color: var(--text-tertiary);
}

.loading-state i {
  color: var(--primary-color);
}

.empty-state p,
.loading-state p {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
}

.empty-state small {
  color: var(--text-tertiary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .vehicle-list-page {
    padding: var(--spacing-md);
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
