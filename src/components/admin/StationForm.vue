<script setup>
import zoneService from '@/services/zoneService';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  station: {
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
  type: 'entry',
  zone_id: null,
  is_active: true,
});

// Options
const typeOptions = [
  { label: 'Entry Station', value: 'entry' },
  { label: 'Exit Station', value: 'exit' },
];

const zones = ref([]);
const loadingZones = ref(false);

// Validation
const errors = ref({});
const loading = ref(false);

// Watchers
watch(
  () => props.station,
  (newStation) => {
    if (newStation) {
      form.value = {
        name: newStation.name || '',
        type: newStation.type || 'entry',
        zone_id: newStation.zone_id || null,
        is_active: newStation.is_active !== undefined ? newStation.is_active : true,
      };
    }
  },
  { immediate: true }
);

// Methods
const fetchZones = async () => {
  loadingZones.value = true;
  try {
    const response = await zoneService.getActiveZones();
    zones.value = response.data.map((zone) => ({
      label: zone.name,
      value: zone.id,
    }));
  } catch (err) {
    console.error('Failed to fetch zones:', err);
  } finally {
    loadingZones.value = false;
  }
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.name || form.value.name.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
  }

  if (!form.value.zone_id) {
    errors.value.zone_id = 'Please select a zone';
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
    type: 'entry',
    zone_id: null,
    is_active: true,
  };
  errors.value = {};
};

onMounted(() => {
  fetchZones();
});

defineExpose({
  resetForm,
});
</script>

<template>
  <div class="station-form">
    <h3 class="form-title">{{ mode === 'create' ? 'Create Station' : 'Edit Station' }}</h3>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Name -->
      <div class="form-group">
        <label for="name" class="required">Station Name</label>
        <InputText
          id="name"
          v-model="form.name"
          placeholder="e.g., Main Entrance, Gate 1"
          :class="{ 'p-invalid': errors.name }"
          class="w-full"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Type -->
      <div class="form-group">
        <label for="type" class="required">Station Type</label>
        <Dropdown
          id="type"
          v-model="form.type"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select station type"
          class="w-full"
        />
      </div>

      <!-- Zone -->
      <div class="form-group">
        <label for="zone" class="required">Assigned Zone</label>
        <Dropdown
          id="zone"
          v-model="form.zone_id"
          :options="zones"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a zone"
          :loading="loadingZones"
          :class="{ 'p-invalid': errors.zone_id }"
          class="w-full"
        />
        <small v-if="errors.zone_id" class="p-error">{{ errors.zone_id }}</small>
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
.station-form {
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
