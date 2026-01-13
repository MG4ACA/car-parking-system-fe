<script setup>
import { useVehicleTypeStore } from '@/stores/vehicleType.store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  session: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'save', 'close']);

const vehicleTypeStore = useVehicleTypeStore();
const { vehicleTypes } = storeToRefs(vehicleTypeStore);

// Form data
const formData = ref({
  plateNumber: '',
  vehicleTypeId: null,
  entryTime: null,
  exitTime: null,
  notes: '',
});

const formErrors = ref({});

const vehicleTypeOptions = computed(() =>
  vehicleTypes.value.map((type) => ({
    label: type.name,
    value: type.id,
  }))
);

// Load vehicle types on mount
onMounted(async () => {
  await vehicleTypeStore.fetchVehicleTypes();

  // Populate form if session is provided
  if (props.session) {
    populateForm();
  }
});

// Watch for session changes
const populateForm = () => {
  if (!props.session) return;

  formData.value = {
    plateNumber: props.session.vehicle_plate_number || '',
    vehicleTypeId: props.session.vehicle_type_id || null,
    entryTime: props.session.entry_time ? new Date(props.session.entry_time) : null,
    exitTime: props.session.exit_time ? new Date(props.session.exit_time) : null,
    notes: props.session.notes || '',
  };
};

// Validation
const validateForm = () => {
  formErrors.value = {};

  if (!formData.value.plateNumber || formData.value.plateNumber.trim().length < 2) {
    formErrors.value.plateNumber = 'Plate number must be at least 2 characters';
  }

  if (!formData.value.vehicleTypeId) {
    formErrors.value.vehicleTypeId = 'Vehicle type is required';
  }

  if (!formData.value.entryTime) {
    formErrors.value.entryTime = 'Entry time is required';
  }

  if (formData.value.exitTime && formData.value.entryTime) {
    const entry = new Date(formData.value.entryTime);
    const exit = new Date(formData.value.exitTime);

    if (exit <= entry) {
      formErrors.value.exitTime = 'Exit time must be after entry time';
    }
  }

  return Object.keys(formErrors.value).length === 0;
};

const handleSave = () => {
  if (!validateForm()) {
    return;
  }

  const updateData = {
    vehicle_plate_number: formData.value.plateNumber.toUpperCase().trim(),
    vehicle_type_id: formData.value.vehicleTypeId,
    entry_time: formData.value.entryTime,
    exit_time: formData.value.exitTime,
    notes: formData.value.notes,
  };

  emit('save', updateData);
};

const handleClose = () => {
  formErrors.value = {};
  emit('update:visible', false);
  emit('close');
};

const handlePlateInput = (event) => {
  formData.value.plateNumber = event.target.value.toUpperCase();
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="handleClose"
    modal
    header="Manual Correction"
    :style="{ width: '90vw', maxWidth: '600px' }"
    :dismissableMask="false"
  >
    <div class="correction-form">
      <Message severity="warn" :closable="false">
        <strong>Warning:</strong>
        Manual corrections should only be made when necessary. Changes will be logged for audit
        purposes.
      </Message>

      <div class="form-grid">
        <!-- Plate Number -->
        <div class="form-field">
          <label for="plateNumber" class="required">Plate Number</label>
          <InputText
            id="plateNumber"
            v-model="formData.plateNumber"
            placeholder="Enter plate number"
            @input="handlePlateInput"
            :class="{ 'p-invalid': formErrors.plateNumber }"
          />
          <small v-if="formErrors.plateNumber" class="p-error">{{ formErrors.plateNumber }}</small>
        </div>

        <!-- Vehicle Type -->
        <div class="form-field">
          <label for="vehicleType" class="required">Vehicle Type</label>
          <Dropdown
            id="vehicleType"
            v-model="formData.vehicleTypeId"
            :options="vehicleTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select vehicle type"
            :class="{ 'p-invalid': formErrors.vehicleTypeId }"
          />
          <small v-if="formErrors.vehicleTypeId" class="p-error">
            {{ formErrors.vehicleTypeId }}
          </small>
        </div>

        <!-- Entry Time -->
        <div class="form-field">
          <label for="entryTime" class="required">Entry Time</label>
          <Calendar
            id="entryTime"
            v-model="formData.entryTime"
            :showIcon="true"
            :showTime="true"
            :showSeconds="false"
            hourFormat="24"
            dateFormat="yy-mm-dd"
            placeholder="Select entry time"
            :class="{ 'p-invalid': formErrors.entryTime }"
          />
          <small v-if="formErrors.entryTime" class="p-error">{{ formErrors.entryTime }}</small>
        </div>

        <!-- Exit Time -->
        <div class="form-field">
          <label for="exitTime">Exit Time (Optional)</label>
          <Calendar
            id="exitTime"
            v-model="formData.exitTime"
            :showIcon="true"
            :showTime="true"
            :showSeconds="false"
            hourFormat="24"
            dateFormat="yy-mm-dd"
            placeholder="Select exit time"
            :class="{ 'p-invalid': formErrors.exitTime }"
          />
          <small v-if="formErrors.exitTime" class="p-error">{{ formErrors.exitTime }}</small>
        </div>

        <!-- Notes -->
        <div class="form-field full-width">
          <label for="notes">Correction Notes</label>
          <Textarea
            id="notes"
            v-model="formData.notes"
            rows="3"
            placeholder="Enter reason for correction (optional)"
          />
          <small class="help-text">Explain why this correction is being made</small>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="handleClose"
          severity="secondary"
          :disabled="loading"
        />
        <Button label="Save Changes" icon="pi pi-check" @click="handleSave" :loading="loading" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.correction-form {
  padding: var(--spacing-md) 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-field label.required::after {
  content: ' *';
  color: var(--red-500);
}

.help-text {
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid {
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
