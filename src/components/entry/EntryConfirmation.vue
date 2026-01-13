<script setup>
import ImagePreview from '@/components/common/ImagePreview.vue';
import { formatDate, formatTime } from '@/utils/formatters';
import { computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  entryData: {
    type: Object,
    default: null,
  },
  vehicleType: {
    type: Object,
    default: null,
  },
  zone: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:visible', 'new-entry', 'close']);

// Computed
const hasData = computed(() => !!props.entryData);

const entryTime = computed(() => {
  if (!props.entryData?.entryTime) return '-';
  return formatTime(props.entryData.entryTime);
});

const entryDate = computed(() => {
  if (!props.entryData?.entryTime) return '-';
  return formatDate(props.entryData.entryTime);
});

const imageUrl = computed(() => {
  if (!props.entryData?.entryImagePath) return null;
  // Construct full URL if needed
  return props.entryData.entryImagePath;
});

// Methods
const handleClose = () => {
  emit('update:visible', false);
  emit('close');
};

const handleNewEntry = () => {
  emit('new-entry');
  emit('update:visible', false);
};

const printReceipt = () => {
  window.print();
};
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :closable="true"
    :draggable="false"
    class="entry-confirmation-dialog"
    @update:visible="handleClose"
  >
    <template #header>
      <div class="dialog-header">
        <i class="pi pi-check-circle success-icon"></i>
        <h2>Entry Recorded Successfully</h2>
      </div>
    </template>

    <div v-if="hasData" class="confirmation-content">
      <!-- Entry Details Card -->
      <Card class="details-card">
        <template #content>
          <div class="detail-row">
            <span class="label">Entry ID:</span>
            <span class="value">
              <Tag :value="`#${entryData.id}`" severity="info" />
            </span>
          </div>

          <Divider />

          <div class="detail-row">
            <span class="label">License Plate:</span>
            <span class="value plate-number">{{ entryData.vehiclePlateNumber }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Vehicle Type:</span>
            <span class="value">{{ vehicleType?.name || '-' }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Parking Zone:</span>
            <span class="value">{{ zone?.name || '-' }}</span>
          </div>

          <Divider />

          <div class="detail-row">
            <span class="label">Entry Date:</span>
            <span class="value">{{ entryDate }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Entry Time:</span>
            <span class="value">{{ entryTime }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Hourly Rate:</span>
            <span class="value rate">Rs {{ vehicleType?.hourlyRate || 0 }}/hr</span>
          </div>

          <Divider />

          <div class="detail-row">
            <span class="label">Status:</span>
            <Tag value="ACTIVE" severity="success" />
          </div>
        </template>
      </Card>

      <!-- Entry Image -->
      <Card v-if="imageUrl" class="image-card">
        <template #title>
          <span>Entry Image</span>
        </template>
        <template #content>
          <ImagePreview
            :image-url="imageUrl"
            alt="Entry vehicle image"
            :preview="true"
            width="100%"
            height="auto"
          />
        </template>
      </Card>

      <!-- Notes -->
      <Card v-if="entryData.notes" class="notes-card">
        <template #title>
          <span>Notes</span>
        </template>
        <template #content>
          <p class="notes-text">{{ entryData.notes }}</p>
        </template>
      </Card>

      <!-- Info Message -->
      <div class="info-message">
        <i class="pi pi-info-circle"></i>
        <span>Vehicle has been successfully registered. Please collect the entry receipt.</span>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
          label="Print Receipt"
          icon="pi pi-print"
          severity="secondary"
          outlined
          @click="printReceipt"
        />
        <Button label="New Entry" icon="pi pi-plus" severity="success" @click="handleNewEntry" />
        <Button label="Close" icon="pi pi-times" severity="secondary" @click="handleClose" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.entry-confirmation-dialog {
  width: 90vw;
  max-width: 600px;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.success-icon {
  font-size: 2rem;
  color: var(--green-500);
}

.dialog-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.confirmation-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.details-card {
  background: var(--surface-card);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.detail-row .label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.detail-row .value {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.plate-number {
  font-family: monospace;
  font-size: 1.25rem;
  letter-spacing: 0.1em;
  color: var(--primary-color);
}

.rate {
  color: var(--green-600);
}

.image-card {
  background: var(--surface-card);
}

.notes-card {
  background: var(--surface-50);
}

.notes-text {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.info-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--blue-50);
  border-radius: 8px;
  color: var(--blue-700);
  border-left: 4px solid var(--blue-500);
}

.info-message i {
  font-size: 1.25rem;
}

.dialog-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .entry-confirmation-dialog {
    width: 95vw;
  }

  .dialog-footer {
    flex-direction: column;
  }

  .dialog-footer button {
    width: 100%;
  }
}

@media print {
  .dialog-footer {
    display: none;
  }
}
</style>
