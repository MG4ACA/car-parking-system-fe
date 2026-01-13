<script setup>
import stationService from '@/services/stationService';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'create', // 'create' or 'edit'
    validator: (value) => ['create', 'edit'].includes(value),
  },
});

const emit = defineEmits(['submit', 'cancel']);

// Form data
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'operator',
  assigned_station_id: null,
  is_active: true,
});

// Stations
const stations = ref([]);
const loadingStations = ref(false);

// Role options
const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Operator', value: 'operator' },
  { label: 'Viewer', value: 'viewer' },
];

// Validation
const errors = ref({});
const loading = ref(false);

// Computed
const isEditMode = computed(() => props.mode === 'edit');
const formTitle = computed(() => (isEditMode.value ? 'Edit User' : 'Create New User'));
const submitLabel = computed(() => (isEditMode.value ? 'Update' : 'Create'));

const needsStation = computed(() => {
  return form.value.role === 'operator';
});

// Watchers
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.value = {
        username: newUser.username || '',
        email: newUser.email || '',
        password: '',
        confirmPassword: '',
        role: newUser.role || 'operator',
        assigned_station_id: newUser.assigned_station_id || null,
        is_active: newUser.is_active !== undefined ? newUser.is_active : true,
      };
    }
  },
  { immediate: true }
);

watch(
  () => form.value.role,
  (newRole) => {
    // Clear station assignment if not operator
    if (newRole !== 'operator') {
      form.value.assigned_station_id = null;
    }
  }
);

// Methods
const fetchStations = async () => {
  loadingStations.value = true;
  try {
    const response = await stationService.getActiveStations();
    stations.value = response.data.map((station) => ({
      label: station.name,
      value: station.id,
    }));
  } catch (err) {
    console.error('Failed to fetch stations:', err);
  } finally {
    loadingStations.value = false;
  }
};

const validateForm = () => {
  errors.value = {};

  // Username validation
  if (!form.value.username || form.value.username.trim().length < 3) {
    errors.value.username = 'Username must be at least 3 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email || !emailRegex.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address';
  }

  // Password validation (only for create mode or if password is entered in edit mode)
  if (!isEditMode.value || form.value.password) {
    if (!form.value.password || form.value.password.length < 6) {
      errors.value.password = 'Password must be at least 6 characters';
    }

    if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match';
    }
  }

  // Station validation for operators
  if (needsStation.value && !form.value.assigned_station_id) {
    errors.value.assigned_station_id = 'Please assign a station for operators';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  // Prepare data
  const submitData = {
    username: form.value.username,
    email: form.value.email,
    role: form.value.role,
    assigned_station_id: form.value.assigned_station_id,
    is_active: form.value.is_active,
  };

  // Only include password if it's create mode or password was entered in edit mode
  if (!isEditMode.value || form.value.password) {
    submitData.password = form.value.password;
  }

  emit('submit', submitData);

  // Reset loading after a short delay (parent will handle actual loading)
  setTimeout(() => {
    loading.value = false;
  }, 300);
};

const handleCancel = () => {
  emit('cancel');
};

const resetForm = () => {
  form.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'operator',
    assigned_station_id: null,
    is_active: true,
  };
  errors.value = {};
};

// Lifecycle
onMounted(() => {
  fetchStations();
});

// Expose methods
defineExpose({
  resetForm,
});
</script>

<template>
  <div class="user-form">
    <h3 class="form-title">{{ formTitle }}</h3>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Username -->
      <div class="form-group">
        <label for="username" class="required">Username</label>
        <InputText
          id="username"
          v-model="form.username"
          placeholder="Enter username"
          :class="{ 'p-invalid': errors.username }"
          class="w-full"
        />
        <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="required">Email</label>
        <InputText
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          :class="{ 'p-invalid': errors.email }"
          class="w-full"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password" :class="{ required: !isEditMode }">
          {{ isEditMode ? 'New Password (leave blank to keep current)' : 'Password' }}
        </label>
        <Password
          id="password"
          v-model="form.password"
          placeholder="Enter password"
          :feedback="!isEditMode"
          toggleMask
          :class="{ 'p-invalid': errors.password }"
          class="w-full"
          inputClass="w-full"
        />
        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
      </div>

      <!-- Confirm Password -->
      <div class="form-group" v-if="!isEditMode || form.password">
        <label for="confirmPassword" class="required">Confirm Password</label>
        <Password
          id="confirmPassword"
          v-model="form.confirmPassword"
          placeholder="Confirm password"
          :feedback="false"
          toggleMask
          :class="{ 'p-invalid': errors.confirmPassword }"
          class="w-full"
          inputClass="w-full"
        />
        <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
      </div>

      <!-- Role -->
      <div class="form-group">
        <label for="role" class="required">Role</label>
        <Dropdown
          id="role"
          v-model="form.role"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a role"
          class="w-full"
        />
      </div>

      <!-- Assigned Station (only for operators) -->
      <div class="form-group" v-if="needsStation">
        <label for="station" class="required">Assigned Station</label>
        <Dropdown
          id="station"
          v-model="form.assigned_station_id"
          :options="stations"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a station"
          :loading="loadingStations"
          :class="{ 'p-invalid': errors.assigned_station_id }"
          class="w-full"
        />
        <small v-if="errors.assigned_station_id" class="p-error">
          {{ errors.assigned_station_id }}
        </small>
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
        <Button type="submit" :label="submitLabel" :loading="loading" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.user-form {
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

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

:deep(.p-invalid) {
  border-color: var(--red-500);
}
</style>
