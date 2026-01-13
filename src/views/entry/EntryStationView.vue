<script setup>
import ImageCapture from '@/components/common/ImageCapture.vue';
import ManualPlateEntry from '@/components/common/ManualPlateEntry.vue';
import EntryConfirmation from '@/components/entry/EntryConfirmation.vue';
import VehicleTypeSelector from '@/components/entry/VehicleTypeSelector.vue';
import ZoneSelector from '@/components/entry/ZoneSelector.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useEntryStore } from '@/stores/entry.store';
import { useStationStore } from '@/stores/station.store';
import { useVehicleTypeStore } from '@/stores/vehicleType.store';
import { useZoneStore } from '@/stores/zone.store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';

// Stores
const entryStore = useEntryStore();
const vehicleTypeStore = useVehicleTypeStore();
const zoneStore = useZoneStore();
const stationStore = useStationStore();
const authStore = useAuthStore();

const {
  creating,
  checkingDuplicate,
  isDuplicate,
  duplicateSession,
  plateNumber,
  vehicleTypeId,
  zoneId,
  imageData,
  ocrResult,
  notes,
  currentEntry,
} = storeToRefs(entryStore);

// Local state
const activeStep = ref(0);
const showManualEntry = ref(false);
const showConfirmation = ref(false);
const capacityWarning = ref(null);
const currentStation = ref(null);

// Computed
const canProceedToStep2 = computed(() => {
  return plateNumber.value && imageData.value && !isDuplicate.value;
});

const canProceedToStep3 = computed(() => {
  return vehicleTypeId.value !== null;
});

const canProceedToStep4 = computed(() => {
  return zoneId.value !== null;
});

const canSubmit = computed(() => {
  return (
    canProceedToStep2.value && canProceedToStep3.value && canProceedToStep4.value && !creating.value
  );
});

const selectedVehicleType = computed(() => {
  return vehicleTypeStore.vehicleTypes.find((t) => t.id === vehicleTypeId.value);
});

const selectedZone = computed(() => {
  return zoneStore.zones.find((z) => z.id === zoneId.value);
});

// Methods
const handleImageUpload = (data) => {
  entryStore.setImageData(data);

  // Auto-advance if we have OCR result
  if (data.ocrResult && data.ocrResult.plateNumber) {
    entryStore.setPlateFromOCR(data.ocrResult);
  } else {
    showManualEntry.value = true;
  }
};

const handlePlateDetected = (plate, confidence) => {
  entryStore.setPlateFromOCR({ plateNumber: plate, confidence });
  checkForDuplicate(plate);
};

const handleManualEntry = (plate) => {
  entryStore.setPlateManually(plate);
  showManualEntry.value = false;
  checkForDuplicate(plate);
};

const checkForDuplicate = async (plate) => {
  if (plate) {
    await entryStore.checkDuplicate(plate);
  }
};

const handleCapacityWarning = (warning) => {
  capacityWarning.value = warning;
};

const nextStep = () => {
  if (activeStep.value < 3) {
    activeStep.value++;
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

const submitEntry = async () => {
  if (!canSubmit.value) return;

  // Set station ID
  if (currentStation.value) {
    entryStore.setStation(currentStation.value.id);
  }

  const result = await entryStore.createParkingSession();

  if (result) {
    showConfirmation.value = true;
  }
};

const resetForNewEntry = () => {
  entryStore.resetForm();
  activeStep.value = 0;
  showManualEntry.value = false;
  capacityWarning.value = null;
  showConfirmation.value = false;
};

// Lifecycle
onMounted(async () => {
  // Load initial data
  await Promise.all([
    vehicleTypeStore.fetchVehicleTypes(),
    zoneStore.fetchZones(),
    stationStore.fetchStations(),
  ]);

  // Find current user's assigned station
  const user = authStore.user;
  if (user?.assignedStationId) {
    const station = stationStore.stations.find((s) => s.id === user.assignedStationId);
    if (station && station.type === 'entry') {
      currentStation.value = station;
    }
  }
});

// Watch for changes in duplicate status
watch(isDuplicate, (newVal) => {
  if (newVal) {
    // Reset steps if duplicate found
    activeStep.value = 0;
  }
});
</script>

<template>
  <div class="entry-station-view">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="pi pi-sign-in"></i>
          Entry Station
        </h1>
        <p v-if="currentStation" class="station-name">
          {{ currentStation.name }}
        </p>
      </div>
      <Button
        label="Reset"
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        @click="resetForNewEntry"
      />
    </div>

    <!-- Main Content -->
    <div class="entry-content">
      <!-- Duplicate Warning -->
      <Message
        v-if="isDuplicate && duplicateSession"
        severity="warn"
        :closable="false"
        class="duplicate-warning"
      >
        <template #icon>
          <i class="pi pi-exclamation-triangle"></i>
        </template>
        <div class="warning-content">
          <strong>Duplicate Entry Detected!</strong>
          <p>
            Vehicle
            <strong>{{ duplicateSession.vehiclePlateNumber }}</strong>
            is already in the parking since
            {{ new Date(duplicateSession.entryTime).toLocaleString() }}
          </p>
        </div>
      </Message>

      <!-- Capacity Warning -->
      <Message
        v-if="capacityWarning"
        :severity="capacityWarning.level === 'error' ? 'error' : 'warn'"
        :closable="true"
        @close="capacityWarning = null"
      >
        {{ capacityWarning.message }}
      </Message>

      <!-- Stepper -->
      <Card class="stepper-card">
        <template #content>
          <Stepper v-model:activeStep="activeStep" linear>
            <!-- Step 1: Image Capture -->
            <StepPanel header="Vehicle Image & Plate">
              <template #content="{ nextCallback }">
                <div class="step-content">
                  <ImageCapture
                    type="entry"
                    :auto-upload="true"
                    :show-manual-entry="false"
                    @upload-success="handleImageUpload"
                    @plate-detected="handlePlateDetected"
                  />

                  <!-- Manual Entry Toggle -->
                  <div v-if="imageData && !plateNumber" class="manual-entry-section">
                    <Button
                      label="Enter Plate Number Manually"
                      icon="pi pi-pencil"
                      severity="info"
                      outlined
                      @click="showManualEntry = !showManualEntry"
                    />

                    <ManualPlateEntry
                      v-if="showManualEntry"
                      :initial-value="plateNumber"
                      label="License Plate Number"
                      @submit="handleManualEntry"
                      @cancel="showManualEntry = false"
                    />
                  </div>

                  <!-- Detected Plate Display -->
                  <div v-if="plateNumber && !isDuplicate" class="plate-display">
                    <div class="plate-info">
                      <span class="plate-label">Detected Plate:</span>
                      <span class="plate-number">{{ plateNumber }}</span>
                      <Button
                        icon="pi pi-pencil"
                        rounded
                        text
                        severity="secondary"
                        @click="showManualEntry = true"
                      />
                    </div>
                    <div v-if="ocrResult" class="ocr-confidence">
                      Confidence: {{ ocrResult.confidence }}%
                    </div>
                  </div>

                  <!-- Step Navigation -->
                  <div class="step-actions">
                    <Button
                      label="Next"
                      icon="pi pi-arrow-right"
                      icon-pos="right"
                      :disabled="!canProceedToStep2"
                      @click="nextCallback"
                    />
                  </div>
                </div>
              </template>
            </StepPanel>

            <!-- Step 2: Vehicle Type -->
            <StepPanel header="Vehicle Type">
              <template #content="{ prevCallback, nextCallback }">
                <div class="step-content">
                  <VehicleTypeSelector v-model="vehicleTypeId" />

                  <div class="step-actions">
                    <Button
                      label="Back"
                      icon="pi pi-arrow-left"
                      severity="secondary"
                      outlined
                      @click="prevCallback"
                    />
                    <Button
                      label="Next"
                      icon="pi pi-arrow-right"
                      icon-pos="right"
                      :disabled="!canProceedToStep3"
                      @click="nextCallback"
                    />
                  </div>
                </div>
              </template>
            </StepPanel>

            <!-- Step 3: Parking Zone -->
            <StepPanel header="Parking Zone">
              <template #content="{ prevCallback, nextCallback }">
                <div class="step-content">
                  <ZoneSelector
                    v-model="zoneId"
                    :show-capacity="true"
                    @capacity-warning="handleCapacityWarning"
                  />

                  <div class="step-actions">
                    <Button
                      label="Back"
                      icon="pi pi-arrow-left"
                      severity="secondary"
                      outlined
                      @click="prevCallback"
                    />
                    <Button
                      label="Next"
                      icon="pi pi-arrow-right"
                      icon-pos="right"
                      :disabled="!canProceedToStep4"
                      @click="nextCallback"
                    />
                  </div>
                </div>
              </template>
            </StepPanel>

            <!-- Step 4: Confirmation & Notes -->
            <StepPanel header="Confirm & Submit">
              <template #content="{ prevCallback }">
                <div class="step-content">
                  <!-- Summary -->
                  <Card class="summary-card">
                    <template #title>Entry Summary</template>
                    <template #content>
                      <div class="summary-row">
                        <span class="summary-label">License Plate:</span>
                        <span class="summary-value plate">{{ plateNumber }}</span>
                      </div>
                      <div class="summary-row">
                        <span class="summary-label">Vehicle Type:</span>
                        <span class="summary-value">{{ selectedVehicleType?.name }}</span>
                      </div>
                      <div class="summary-row">
                        <span class="summary-label">Parking Zone:</span>
                        <span class="summary-value">{{ selectedZone?.name }}</span>
                      </div>
                      <div class="summary-row">
                        <span class="summary-label">Hourly Rate:</span>
                        <span class="summary-value rate">
                          Rs {{ selectedVehicleType?.hourlyRate }}/hr
                        </span>
                      </div>
                    </template>
                  </Card>

                  <!-- Notes -->
                  <div class="notes-section">
                    <label for="notes">Notes (Optional)</label>
                    <Textarea
                      id="notes"
                      v-model="notes"
                      rows="3"
                      placeholder="Add any notes about this entry..."
                    />
                  </div>

                  <!-- Actions -->
                  <div class="step-actions">
                    <Button
                      label="Back"
                      icon="pi pi-arrow-left"
                      severity="secondary"
                      outlined
                      @click="prevCallback"
                    />
                    <Button
                      label="Submit Entry"
                      icon="pi pi-check"
                      severity="success"
                      :loading="creating"
                      :disabled="!canSubmit"
                      @click="submitEntry"
                    />
                  </div>
                </div>
              </template>
            </StepPanel>
          </Stepper>
        </template>
      </Card>
    </div>

    <!-- Entry Confirmation Dialog -->
    <EntryConfirmation
      v-model:visible="showConfirmation"
      :entry-data="currentEntry"
      :vehicle-type="selectedVehicleType"
      :zone="selectedZone"
      @new-entry="resetForNewEntry"
    />
  </div>
</template>

<style scoped>
.entry-station-view {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  color: var(--text-primary);
}

.station-name {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.entry-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.duplicate-warning {
  margin-bottom: var(--spacing-md);
}

.warning-content strong {
  display: block;
  margin-bottom: 0.5rem;
}

.stepper-card {
  background: var(--surface-card);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) 0;
  min-height: 400px;
}

.manual-entry-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
}

.plate-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: var(--green-50);
  border-radius: 12px;
  border: 2px solid var(--green-500);
}

.plate-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.plate-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.plate-number {
  font-family: monospace;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-primary);
}

.ocr-confidence {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.step-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  margin-top: auto;
}

.summary-card {
  background: var(--surface-50);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.summary-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.summary-value {
  font-weight: 600;
  color: var(--text-primary);
}

.summary-value.plate {
  font-family: monospace;
  font-size: 1.25rem;
  letter-spacing: 0.1em;
  color: var(--primary-color);
}

.summary-value.rate {
  color: var(--green-600);
}

.notes-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notes-section label {
  font-weight: 500;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .entry-station-view {
    padding: var(--spacing-md);
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .step-actions {
    flex-direction: column;
  }

  .step-actions button {
    width: 100%;
  }
}
</style>
