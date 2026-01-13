<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  zone: {
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
  capacity: 0,
  is_active: true,
});

// Validation
const errors = ref({});
const loading = ref(false);

// Watchers
watch(
  () => props.zone,
  (newZone) => {
    if (newZone) {
      form.value = {
        name: newZone.name || '',
        capacity: newZone.capacity || 0,
        is_active: newZone.is_active !== undefined ? newZone.is_active : true,
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

  if (form.value.capacity === null || form.value.capacity < 1) {
    errors.value.capacity = 'Capacity must be at least 1';
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
    capacity: 0,
    is_active: true,
  };
  errors.value = {};
};

defineExpose({
  resetForm,
});
</script>

<template>
  <div class="zone-form">
    <h3 class="form-title">{{ mode === 'create' ? 'Create Zone' : 'Edit Zone' }}</h3>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Name -->
      <div class="form-group">
        <label for="name" class="required">Zone Name</label>
        <InputText
          id="name"
          v-model="form.name"
          placeholder="e.g., Zone A, North Parking"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Capacity -->
      <div class="form-group">
        <label for="capacity" class="required">Capacity</label>
        <InputNumber
          id="capacity"
          v-model="form.capacity"
          :min="1"
          :useGrouping="false"
          placeholder="Enter capacity"
          :class="{ 'p-invalid': errors.capacity }"
          class="w-full"
        />
        <small v-if="errors.capacity" class="p-error">{{ errors.capacity }}</small>
        <small class="help-text">Maximum number of vehicles this zone can accommodate</small>
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
.zone-form {
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

.help-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
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
