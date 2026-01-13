<script setup>
import exitService from '@/services/exitService';
import { formatDate, formatTime } from '@/utils/formatters';
import { computed } from 'vue';

const props = defineProps({
  session: {
    type: Object,
    required: true,
  },
  charges: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Computed
const entryDate = computed(() => {
  if (!props.session?.entryTime) return '-';
  return formatDate(props.session.entryTime);
});

const entryTime = computed(() => {
  if (!props.session?.entryTime) return '-';
  return formatTime(props.session.entryTime);
});

const exitTime = computed(() => {
  return formatTime(new Date());
});

const duration = computed(() => {
  if (!props.charges?.durationMinutes) return '-';
  return exitService.formatDuration(props.charges.durationMinutes);
});

const baseCharge = computed(() => {
  if (!props.charges?.baseCharge) return 'Rs 0.00';
  return exitService.formatCurrency(props.charges.baseCharge);
});

const gracePeriodApplied = computed(() => {
  return props.charges?.gracePeriodApplied || false;
});

const minimumChargeApplied = computed(() => {
  return props.charges?.minimumChargeApplied || false;
});

const totalAmount = computed(() => {
  if (!props.charges?.totalAmount) return 'Rs 0.00';
  return exitService.formatCurrency(props.charges.totalAmount);
});

const hourlyRate = computed(() => {
  if (!props.charges?.hourlyRate) return 'Rs 0.00';
  return exitService.formatCurrency(props.charges.hourlyRate);
});
</script>

<template>
  <Card class="bill-display">
    <template #title>
      <div class="bill-header">
        <i class="pi pi-file-invoice"></i>
        <span>Parking Bill</span>
      </div>
    </template>

    <template #content>
      <div v-if="loading" class="loading-state">
        <Skeleton height="30px" class="mb-2" />
        <Skeleton height="30px" class="mb-2" />
        <Skeleton height="30px" class="mb-2" />
        <Skeleton height="50px" />
      </div>

      <div v-else class="bill-content">
        <!-- Vehicle Information -->
        <div class="bill-section">
          <h4 class="section-title">Vehicle Information</h4>

          <div class="bill-row">
            <span class="label">License Plate:</span>
            <span class="value plate-number">{{ session.vehiclePlateNumber }}</span>
          </div>

          <div class="bill-row">
            <span class="label">Vehicle Type:</span>
            <span class="value">{{ session.vehicleType?.name || '-' }}</span>
          </div>

          <div class="bill-row">
            <span class="label">Parking Zone:</span>
            <span class="value">{{ session.zone?.name || '-' }}</span>
          </div>
        </div>

        <Divider />

        <!-- Parking Duration -->
        <div class="bill-section">
          <h4 class="section-title">Parking Duration</h4>

          <div class="bill-row">
            <span class="label">Entry Date:</span>
            <span class="value">{{ entryDate }}</span>
          </div>

          <div class="bill-row">
            <span class="label">Entry Time:</span>
            <span class="value">{{ entryTime }}</span>
          </div>

          <div class="bill-row">
            <span class="label">Exit Time:</span>
            <span class="value">{{ exitTime }}</span>
          </div>

          <div class="bill-row highlight">
            <span class="label">Total Duration:</span>
            <span class="value duration">{{ duration }}</span>
          </div>
        </div>

        <Divider />

        <!-- Charges Breakdown -->
        <div class="bill-section">
          <h4 class="section-title">Charges</h4>

          <div class="bill-row">
            <span class="label">Hourly Rate:</span>
            <span class="value">{{ hourlyRate }}</span>
          </div>

          <div v-if="charges" class="bill-row">
            <span class="label">Billable Hours:</span>
            <span class="value">{{ charges.billableHours || 0 }} hrs</span>
          </div>

          <div class="bill-row">
            <span class="label">Base Charge:</span>
            <span class="value">{{ baseCharge }}</span>
          </div>

          <!-- Special Tags -->
          <div v-if="gracePeriodApplied || minimumChargeApplied" class="tags-row">
            <Tag
              v-if="gracePeriodApplied"
              value="Grace Period Applied"
              severity="info"
              icon="pi pi-info-circle"
            />
            <Tag
              v-if="minimumChargeApplied"
              value="Minimum Charge Applied"
              severity="warning"
              icon="pi pi-exclamation-circle"
            />
          </div>
        </div>

        <Divider />

        <!-- Total Amount -->
        <div class="bill-section total-section">
          <div class="bill-row total-row">
            <span class="label">Total Amount:</span>
            <span class="value total-amount">{{ totalAmount }}</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.bill-display {
  background: var(--surface-card);
  border: 2px solid var(--primary-color);
}

.bill-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary-color);
}

.bill-header i {
  font-size: 1.5rem;
}

.bill-content {
  display: flex;
  flex-direction: column;
}

.bill-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bill-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.bill-row.highlight {
  background: var(--blue-50);
  padding: 0.75rem;
  border-radius: 6px;
  margin: 0.5rem 0;
}

.bill-row .label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.bill-row .value {
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

.duration {
  color: var(--blue-600);
  font-size: 1.125rem;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.total-section {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--blue-50) 100%);
  padding: 1rem;
  border-radius: 8px;
}

.total-row {
  padding: 0;
}

.total-row .label {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.total-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--green-600);
}

.loading-state {
  padding: 1rem 0;
}

@media (max-width: 768px) {
  .bill-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .total-row {
    flex-direction: row;
    justify-content: space-between;
  }

  .total-amount {
    font-size: 1.5rem;
  }
}
</style>
