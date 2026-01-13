<script setup>
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'unpaid',
    validator: (value) => ['paid', 'unpaid'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['update:modelValue']);

// Payment options
const paymentOptions = [
  { label: 'Unpaid', value: 'unpaid', icon: 'pi-times-circle', severity: 'danger' },
  { label: 'Paid', value: 'paid', icon: 'pi-check-circle', severity: 'success' },
];

// Computed
const selectedStatus = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const statusSeverity = computed(() => {
  return props.modelValue === 'paid' ? 'success' : 'danger';
});

const statusIcon = computed(() => {
  return props.modelValue === 'paid' ? 'pi-check-circle' : 'pi-times-circle';
});

const statusLabel = computed(() => {
  return props.modelValue === 'paid' ? 'Paid' : 'Unpaid';
});
</script>

<template>
  <Card class="payment-status">
    <template #content>
      <div class="payment-container">
        <div class="payment-header">
          <h3>Payment Status</h3>
          <Tag
            :value="statusLabel"
            :severity="statusSeverity"
            :icon="statusIcon"
            class="status-tag"
          />
        </div>

        <div class="payment-amount">
          <span class="amount-label">Total Amount:</span>
          <span class="amount-value">Rs {{ amount.toFixed(2) }}</span>
        </div>

        <div class="payment-selector">
          <SelectButton
            v-model="selectedStatus"
            :options="paymentOptions"
            option-label="label"
            option-value="value"
            :disabled="disabled"
            class="payment-buttons"
          >
            <template #option="{ option }">
              <div class="payment-option">
                <i :class="['pi', option.icon]"></i>
                <span>{{ option.label }}</span>
              </div>
            </template>
          </SelectButton>
        </div>

        <div class="payment-info">
          <div v-if="modelValue === 'paid'" class="info-message success">
            <i class="pi pi-check-circle"></i>
            <span>Payment has been received</span>
          </div>
          <div v-else class="info-message warning">
            <i class="pi pi-exclamation-triangle"></i>
            <span>Payment is pending</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.payment-status {
  width: 100%;
}

.payment-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.status-tag {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

.payment-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, var(--surface-50) 0%, var(--surface-100) 100%);
  border-radius: 8px;
  border: 2px solid var(--surface-border);
}

.amount-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.amount-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--green-600);
}

.payment-selector {
  display: flex;
  justify-content: center;
}

.payment-buttons {
  width: 100%;
  max-width: 400px;
}

.payment-buttons :deep(.p-button) {
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.payment-option i {
  font-size: 1.25rem;
}

.payment-info {
  margin-top: 0.5rem;
}

.info-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
}

.info-message i {
  font-size: 1.25rem;
}

.info-message.success {
  background: var(--green-50);
  color: var(--green-700);
  border: 1px solid var(--green-200);
}

.info-message.warning {
  background: var(--orange-50);
  color: var(--orange-700);
  border: 1px solid var(--orange-200);
}

@media (max-width: 768px) {
  .payment-amount {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .payment-buttons {
    max-width: none;
  }

  .payment-buttons :deep(.p-button) {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
}
</style>
