<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  vehicleType: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value),
  },
});

const emit = defineEmits(['submit', 'cancel']);

// Form data
const form = ref({
  name: '',
  hourly_rate: 0,
  is_active: true,
});

// Validation
const errors = ref({});
const loading = ref(false);

// Watchers
watch(
  () => props.vehicleType,
  (newType) => {
    if (newType) {
      form.value = {
        name: newType.name || '',
        hourly_rate: newType.hourly_rate || 0,
        is_active: newType.is_active !== undefined ? newType.is_active : true,
      };
    }
  },
  { immediate: true }
);

// Methods
const validateForm = () => {
  errors.value = {};

  if (!form.value.name || form.value.name.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
  }

  if (form.value.hourly_rate === null || form.value.hourly_rate < 0) {
    errors.value.hourly_rate = 'Hourly rate must be a positive number';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  emit('submit', form.value);

  setTimeout(() => {
    loading.value = false;
  }, 300);
};

const handleCancel = () => {
  emit('cancel');
};

const resetForm = () => {
  form.value = {
    name: '',
    hourly_rate: 0,
    is_active: true,
  };
  errors.value = {};
};

defineExpose({
  resetForm,
});
</script>

<template>
  <div class="vehicle-type-form">
    <h3 class="form-title">
      {{ mode === 'create' ? 'Create Vehicle Type' : 'Edit Vehicle Type' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Name -->
      <div class="form-group">
        <label for="name" class="required">Vehicle Type Name</label>
        <InputText
          id="name"
          v-model="form.name"
          placeholder="e.g., Motorcycle, Car, SUV"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Hourly Rate -->
      <div class="form-group">
        <label for="hourly_rate" class="required">Hourly Rate ($)</label>
        <InputNumber
          id="hourly_rate"
          v-model="form.hourly_rate"
          :min="0"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          placeholder="0.00"
          :class="{ 'p-invalid': errors.hourly_rate }"
          class="w-full"
        />
        <small v-if="errors.hourly_rate" class="p-error">{{ errors.hourly_rate }}</small>
      </div>

      <!-- Active Status -->
      <div class="form-group form-switch">
        <label for="isActive">Active Status</label>
        <InputSwitch id="isActive" v-model="form.is_active" />
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          outlined
          @click="handleCancel"
          :disabled="loading"
        />
        <Button type="submit" :label="mode === 'create' ? 'Create' : 'Update'" :loading="loading" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.vehicle-type-form {
  padding: 1.5rem;
}

.form-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-group label.required::after {
  content: ' *';
  color: var(--red-500);
}

.form-switch {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

:deep(.p-invalid) {
  border-color: var(--red-500);
}
</style>
