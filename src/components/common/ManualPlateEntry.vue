<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  initialValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'License Plate Number',
  },
  placeholder: {
    type: String,
    default: 'Enter vehicle plate number',
  },
  required: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const plateNumber = ref(props.initialValue || '');
const error = ref('');

// Watch for initial value changes
watch(
  () => props.initialValue,
  (newValue) => {
    if (newValue) {
      plateNumber.value = newValue;
    }
  }
);

const validatePlateNumber = () => {
  const value = plateNumber.value.trim().toUpperCase();

  if (!value) {
    error.value = 'License plate number is required';
    return false;
  }

  // Basic validation: Allow alphanumeric and hyphens, 3-15 characters
  const plateRegex = /^[A-Z0-9-]{3,15}$/;
  if (!plateRegex.test(value)) {
    error.value = 'Invalid plate number format (3-15 alphanumeric characters)';
    return false;
  }

  error.value = '';
  return true;
};

const handleSubmit = () => {
  if (validatePlateNumber()) {
    const formattedPlate = plateNumber.value.trim().toUpperCase();
    emit('submit', formattedPlate);
  }
};

const handleCancel = () => {
  plateNumber.value = '';
  error.value = '';
  emit('cancel');
};

const handleInput = () => {
  // Auto-capitalize and remove invalid characters
  plateNumber.value = plateNumber.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');

  // Clear error when user types
  if (error.value) {
    error.value = '';
  }
};
</script>

<template>
  <div class="manual-plate-entry">
    <div class="form-group">
      <label :for="'plate-input'" class="form-label">
        {{ label }}
        <span v-if="required" class="required">*</span>
      </label>

      <InputText
        id="plate-input"
        v-model="plateNumber"
        :placeholder="placeholder"
        :class="{ 'p-invalid': error }"
        @input="handleInput"
        @keyup.enter="handleSubmit"
        class="plate-input"
      />

      <small v-if="error" class="error-text">
        <i class="pi pi-exclamation-circle"></i>
        {{ error }}
      </small>

      <small v-else class="help-text">Enter the license plate number as shown on the vehicle</small>
    </div>

    <div class="button-group">
      <Button
        label="Submit"
        icon="pi pi-check"
        @click="handleSubmit"
        :disabled="!plateNumber.trim()"
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
        outlined
        @click="handleCancel"
      />
    </div>
  </div>
</template>

<style scoped>
.manual-plate-entry {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--surface-50);
  border-radius: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.required {
  color: var(--red-500);
}

.plate-input {
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
}

.error-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--red-500);
  font-size: 0.875rem;
}

.help-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.button-group {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }

  .button-group button {
    width: 100%;
  }
}
</style>
