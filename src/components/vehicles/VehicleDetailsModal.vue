<script setup>
import ImageGallery from '@/components/shared/ImageGallery.vue';
import { formatCurrency, formatDateTime, formatDuration } from '@/utils/formatters';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Tag from 'primevue/tag';
import { computed, ref } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  vehicle: {
    type: Object,
    default: null,
  },
  history: {
    type: Array,
    default: () => [],
  },
  stats: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'edit', 'close']);

const activeTab = ref(0);
const showImageGallery = ref(false);
const galleryImages = ref([]);

const statusSeverity = computed(() => {
  if (!props.vehicle) return 'secondary';
  const statusMap = {
    active: 'success',
    completed: 'info',
    cancelled: 'danger',
  };
  return statusMap[props.vehicle.status] || 'secondary';
});

const paymentSeverity = computed(() => {
  if (!props.vehicle) return 'secondary';
  return props.vehicle.payment_status === 'paid' ? 'success' : 'warn';
});

const sessionDuration = computed(() => {
  if (!props.vehicle || !props.vehicle.duration_minutes) return '-';
  return formatDuration(props.vehicle.duration_minutes);
});

const handleClose = () => {
  emit('update:visible', false);
  emit('close');
};

const handleEdit = () => {
  emit('edit', props.vehicle);
};

const handleViewImages = () => {
  const images = [];

  if (props.vehicle.entry_image_path) {
    images.push({
      src: props.vehicle.entry_image_path,
      caption: `Entry - ${formatDateTime(props.vehicle.entry_time)}`,
      type: 'entry',
    });
  }

  if (props.vehicle.exit_image_path) {
    images.push({
      src: props.vehicle.exit_image_path,
      caption: `Exit - ${formatDateTime(props.vehicle.exit_time)}`,
      type: 'exit',
    });
  }

  galleryImages.value = images;
  showImageGallery.value = true;
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="handleClose"
    modal
    :header="`Vehicle: ${vehicle?.vehicle_plate_number || 'N/A'}`"
    :style="{ width: '90vw', maxWidth: '900px' }"
    :dismissableMask="true"
  >
    <div v-if="loading" class="loading-state">
      <i class="pi pi-spinner pi-spin"></i>
      <p>Loading details...</p>
    </div>

    <div v-else-if="vehicle" class="vehicle-details">
      <TabView v-model:activeIndex="activeTab">
        <!-- Session Details Tab -->
        <TabPanel header="Session Details">
          <div class="details-grid">
            <!-- Basic Info -->
            <div class="detail-section">
              <h3>Basic Information</h3>
              <div class="detail-row">
                <span class="detail-label">Plate Number:</span>
                <span class="detail-value plate-number">{{ vehicle.vehicle_plate_number }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Vehicle Type:</span>
                <span class="detail-value">{{ vehicle.vehicle_type_name || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Zone:</span>
                <span class="detail-value">{{ vehicle.zone_name || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <Tag :value="vehicle.status" :severity="statusSeverity" />
              </div>
            </div>

            <!-- Timing Info -->
            <div class="detail-section">
              <h3>Timing Information</h3>
              <div class="detail-row">
                <span class="detail-label">Entry Time:</span>
                <span class="detail-value">{{ formatDateTime(vehicle.entry_time) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Exit Time:</span>
                <span class="detail-value">
                  {{ vehicle.exit_time ? formatDateTime(vehicle.exit_time) : 'Not exited' }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ sessionDuration }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Entry Station:</span>
                <span class="detail-value">{{ vehicle.entry_station_name || 'N/A' }}</span>
              </div>
              <div v-if="vehicle.exit_station_name" class="detail-row">
                <span class="detail-label">Exit Station:</span>
                <span class="detail-value">{{ vehicle.exit_station_name }}</span>
              </div>
            </div>

            <!-- Billing Info -->
            <div class="detail-section">
              <h3>Billing Information</h3>
              <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value amount">
                  {{ vehicle.calculated_amount ? formatCurrency(vehicle.calculated_amount) : '-' }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <Tag :value="vehicle.payment_status" :severity="paymentSeverity" />
              </div>
              <div class="detail-row">
                <span class="detail-label">Hourly Rate:</span>
                <span class="detail-value">
                  {{ vehicle.hourly_rate ? formatCurrency(vehicle.hourly_rate) : '-' }}
                </span>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="detail-section">
              <h3>Additional Information</h3>
              <div class="detail-row">
                <span class="detail-label">Entry Operator:</span>
                <span class="detail-value">{{ vehicle.entry_operator_name || 'N/A' }}</span>
              </div>
              <div v-if="vehicle.exit_operator_name" class="detail-row">
                <span class="detail-label">Exit Operator:</span>
                <span class="detail-value">{{ vehicle.exit_operator_name }}</span>
              </div>
              <div v-if="vehicle.notes" class="detail-row">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">{{ vehicle.notes }}</span>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div v-if="vehicle.entry_image_path || vehicle.exit_image_path" class="images-section">
            <h3>Images</h3>
            <Button
              label="View Images"
              icon="pi pi-images"
              @click="handleViewImages"
              outlined
              size="small"
            />
          </div>
        </TabPanel>

        <!-- History Tab -->
        <TabPanel v-if="history.length > 0" header="Parking History">
          <div class="history-section">
            <div v-if="stats" class="stats-summary">
              <div class="stat-item">
                <span class="stat-label">Total Visits:</span>
                <span class="stat-value">{{ stats.totalSessions }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total Revenue:</span>
                <span class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Avg Duration:</span>
                <span class="stat-value">{{ formatDuration(stats.averageDuration) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Avg Amount:</span>
                <span class="stat-value">{{ formatCurrency(stats.averageAmount) }}</span>
              </div>
            </div>

            <DataTable :value="history" stripedRows paginator :rows="5">
              <Column field="entry_time" header="Entry Time" style="min-width: 180px">
                <template #body="{ data }">
                  {{ formatDateTime(data.entry_time) }}
                </template>
              </Column>
              <Column field="exit_time" header="Exit Time" style="min-width: 180px">
                <template #body="{ data }">
                  {{ data.exit_time ? formatDateTime(data.exit_time) : '-' }}
                </template>
              </Column>
              <Column field="duration_minutes" header="Duration" style="min-width: 120px">
                <template #body="{ data }">
                  {{ data.duration_minutes ? formatDuration(data.duration_minutes) : '-' }}
                </template>
              </Column>
              <Column field="calculated_amount" header="Amount" style="min-width: 120px">
                <template #body="{ data }">
                  {{ data.calculated_amount ? formatCurrency(data.calculated_amount) : '-' }}
                </template>
              </Column>
              <Column field="payment_status" header="Payment" style="min-width: 100px">
                <template #body="{ data }">
                  <Tag
                    :value="data.payment_status"
                    :severity="data.payment_status === 'paid' ? 'success' : 'warn'"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button label="Close" icon="pi pi-times" @click="handleClose" severity="secondary" />
        <Button label="Edit Session" icon="pi pi-pencil" @click="handleEdit" />
      </div>
    </template>

    <!-- Image Gallery Dialog -->
    <ImageGallery v-model:visible="showImageGallery" :images="galleryImages" />
  </Dialog>
</template>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.loading-state i {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.vehicle-details {
  min-height: 400px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.detail-section {
  background: var(--surface-50);
  padding: var(--spacing-md);
  border-radius: 8px;
  border: 1px solid var(--surface-border);
}

.detail-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--primary-color);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--surface-border);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.detail-value {
  color: var(--text-primary);
  font-weight: 500;
}

.plate-number {
  font-family: monospace;
  font-weight: 600;
  font-size: 1.125rem;
}

.amount {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--green-600);
}

.images-section {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--surface-50);
  border-radius: 8px;
}

.images-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
}

.history-section {
  padding: var(--spacing-md) 0;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--surface-50);
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

/* Responsive Design */
@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }

  .stats-summary {
    grid-template-columns: 1fr;
  }

  .dialog-footer {
    flex-direction: column-reverse;
  }

  .dialog-footer button {
    width: 100%;
  }
}
</style>
