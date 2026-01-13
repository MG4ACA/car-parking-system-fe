<script setup>
import ImageCapture from '@/components/common/ImageCapture.vue';
import ImageGallery from '@/components/common/ImageGallery.vue';
import BillDisplay from '@/components/exit/BillDisplay.vue';
import GateControl from '@/components/exit/GateControl.vue';
import PaymentStatus from '@/components/exit/PaymentStatus.vue';
import VehicleSearch from '@/components/exit/VehicleSearch.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useExitStore } from '@/stores/exit.store';
import { useStationStore } from '@/stores/station.store';
import { formatDate, formatTime } from '@/utils/formatters';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Message from 'primevue/message';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import { computed, onMounted, ref } from 'vue';

// Stores
const exitStore = useExitStore();
const stationStore = useStationStore();
const authStore = useAuthStore();

const {
  activeSession,
  searching,
  processing,
  calculatingCharges,
  exitImageData,
  paymentStatus,
  notes,
  charges,
  hasActiveSession,
  canProcessExit,
} = storeToRefs(exitStore);

// Local state
const activeStep = ref(0);
const currentStation = ref(null);
const showConfirmation = ref(false);
const completedExit = ref(null);
const gateOpened = ref(false);
const showImageGallery = ref(false);

// Computed
const canProceedToStep2 = computed(() => {
  return hasActiveSession.value;
});

const canProceedToStep3 = computed(() => {
  return exitImageData.value !== null;
});

const canProceedToStep4 = computed(() => {
  return paymentStatus.value !== null;
});

const sessionImages = computed(() => {
  if (!activeSession.value) return [];

  const images = [];
  if (activeSession.value.entryImagePath) {
    images.push({
      id: 1,
      path: activeSession.value.entryImagePath,
      type: 'entry',
      plateNumber: activeSession.value.vehiclePlateNumber,
      createdAt: activeSession.value.entryTime,
    });
  }
  if (exitImageData.value) {
    images.push({
      id: 2,
      path: exitImageData.value.path || exitImageData.value.url,
      type: 'exit',
      plateNumber: activeSession.value.vehiclePlateNumber,
      createdAt: new Date().toISOString(),
    });
  }
  return images;
});

// Methods
const handleSearch = async (query) => {
  const result = await exitStore.searchForVehicle(query);
  if (result) {
    activeStep.value = 1;
  }
};

const handleImageUpload = (data) => {
  exitStore.setExitImageData(data);
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

const processExit = async () => {
  if (!canProcessExit.value) return;

  // Set station ID
  if (currentStation.value) {
    exitStore.setStation(currentStation.value.id);
  }

  const result = await exitStore.processVehicleExit();

  if (result) {
    completedExit.value = result;
    showConfirmation.value = true;
  }
};

const handleGateOpened = () => {
  gateOpened.value = true;
};

const handleGateClosed = () => {
  gateOpened.value = false;
};

const downloadReceipt = async () => {
  if (completedExit.value) {
    await exitStore.downloadReceiptPDF(completedExit.value.id);
  }
};

const resetForNewExit = () => {
  exitStore.resetForm();
  activeStep.value = 0;
  showConfirmation.value = false;
  completedExit.value = null;
  gateOpened.value = false;
};

const viewImages = () => {
  showImageGallery.value = true;
};

// Lifecycle
onMounted(async () => {
  // Load initial data
  await stationStore.fetchStations();

  // Find current user's assigned station
  const user = authStore.user;
  if (user?.assignedStationId) {
    const station = stationStore.stations.find((s) => s.id === user.assignedStationId);
    if (station && station.type === 'exit') {
      currentStation.value = station;
    }
  }
});
</script>

<template>
  <div class="exit-station-view">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="pi pi-sign-out"></i>
          Exit Station
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
        @click="resetForNewExit"
      />
    </div>

    <!-- Main Content -->
    <div class="exit-content">
      <!-- Active Session Info Banner -->
      <Message v-if="hasActiveSession" severity="success" :closable="false" class="session-banner">
        <template #icon>
          <i class="pi pi-car"></i>
        </template>
        <div class="banner-content">
          <strong>Vehicle Found:</strong>
          <span class="plate">{{ activeSession.vehiclePlateNumber }}</span>
          <span class="separator">|</span>
          <span>
            Entry: {{ formatDate(activeSession.entryTime) }}
            {{ formatTime(activeSession.entryTime) }}
          </span>
          <Button label="View Images" icon="pi pi-images" text size="small" @click="viewImages" />
        </div>
      </Message>

      <!-- Stepper -->
      <Card class="stepper-card">
        <template #content>
          <Stepper v-model:activeStep="activeStep" linear>
            <!-- Step 1: Search Vehicle -->
            <StepperPanel header="Search Vehicle">
              <template #content="{ nextCallback }">
                <div class="step-content">
                  <VehicleSearch :searching="searching" @search="handleSearch" />

                  <!-- Active Session Display -->
                  <Card v-if="hasActiveSession" class="session-card">
                    <template #title>Active Parking Session</template>
                    <template #content>
                      <div class="session-details">
                        <div class="detail-row">
                          <span class="label">Plate Number:</span>
                          <Tag :value="activeSession.vehiclePlateNumber" severity="info" />
                        </div>
                        <div class="detail-row">
                          <span class="label">Vehicle Type:</span>
                          <span>{{ activeSession.vehicleType?.name }}</span>
                        </div>
                        <div class="detail-row">
                          <span class="label">Zone:</span>
                          <span>{{ activeSession.zone?.name }}</span>
                        </div>
                        <div class="detail-row">
                          <span class="label">Entry Time:</span>
                          <span>
                            {{ formatDate(activeSession.entryTime) }}
                            {{ formatTime(activeSession.entryTime) }}
                          </span>
                        </div>
                      </div>
                    </template>
                  </Card>

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
            </StepperPanel>

            <!-- Step 2: Bill & Charges -->
            <StepperPanel header="Bill & Charges">
              <template #content="{ prevCallback, nextCallback }">
                <div class="step-content">
                  <BillDisplay
                    :session="activeSession"
                    :charges="charges"
                    :loading="calculatingCharges"
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
                      @click="nextCallback"
                    />
                  </div>
                </div>
              </template>
            </StepperPanel>

            <!-- Step 3: Exit Image -->
            <StepperPanel header="Exit Image">
              <template #content="{ prevCallback, nextCallback }">
                <div class="step-content">
                  <ImageCapture
                    type="exit"
                    :auto-upload="true"
                    :show-manual-entry="false"
                    @upload-success="handleImageUpload"
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
                      :disabled="!canProceedToStep3"
                      @click="nextCallback"
                    />
                  </div>
                </div>
              </template>
            </StepperPanel>

            <!-- Step 4: Payment & Confirm -->
            <StepperPanel header="Payment & Exit">
              <template #content="{ prevCallback }">
                <div class="step-content">
                  <div class="payment-section">
                    <PaymentStatus v-model="paymentStatus" :amount="charges?.totalAmount || 0" />
                  </div>

                  <div class="notes-section">
                    <label for="exit-notes">Notes (Optional)</label>
                    <Textarea
                      id="exit-notes"
                      v-model="notes"
                      rows="3"
                      placeholder="Add any notes about this exit..."
                    />
                  </div>

                  <Divider />

                  <div class="summary-section">
                    <h3>Exit Summary</h3>
                    <div class="summary-grid">
                      <div class="summary-item">
                        <span class="label">Vehicle:</span>
                        <span class="value">{{ activeSession.vehiclePlateNumber }}</span>
                      </div>
                      <div class="summary-item">
                        <span class="label">Duration:</span>
                        <span class="value">{{ exitStore.formattedDuration }}</span>
                      </div>
                      <div class="summary-item">
                        <span class="label">Amount:</span>
                        <span class="value amount">{{ exitStore.formattedTotalAmount }}</span>
                      </div>
                      <div class="summary-item">
                        <span class="label">Payment:</span>
                        <Tag
                          :value="paymentStatus.toUpperCase()"
                          :severity="paymentStatus === 'paid' ? 'success' : 'danger'"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="step-actions">
                    <Button
                      label="Back"
                      icon="pi pi-arrow-left"
                      severity="secondary"
                      outlined
                      @click="prevCallback"
                    />
                    <Button
                      label="Process Exit"
                      icon="pi pi-check"
                      severity="success"
                      :loading="processing"
                      :disabled="!canProcessExit"
                      @click="processExit"
                    />
                  </div>
                </div>
              </template>
            </StepperPanel>
          </Stepper>
        </template>
      </Card>
    </div>

    <!-- Exit Confirmation Dialog -->
    <Dialog
      v-model:visible="showConfirmation"
      modal
      :closable="false"
      :draggable="false"
      class="exit-confirmation-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <i class="pi pi-check-circle success-icon"></i>
          <h2>Exit Processed Successfully</h2>
        </div>
      </template>

      <div v-if="completedExit" class="confirmation-content">
        <Card class="confirmation-card">
          <template #content>
            <div class="confirmation-details">
              <div class="detail-row">
                <span class="label">Vehicle:</span>
                <span class="value plate">{{ completedExit.vehiclePlateNumber }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">
                  {{ exitStore.formatDuration(completedExit.durationMinutes) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Total Amount:</span>
                <span class="value amount">
                  {{ exitStore.formatCurrency(completedExit.calculatedAmount) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Status:</span>
                <Tag
                  :value="completedExit.paymentStatus.toUpperCase()"
                  :severity="completedExit.paymentStatus === 'paid' ? 'success' : 'danger'"
                />
              </div>
            </div>
          </template>
        </Card>

        <GateControl
          :disabled="!completedExit"
          @gate-opened="handleGateOpened"
          @gate-closed="handleGateClosed"
        />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <Button
            label="Download Receipt"
            icon="pi pi-download"
            severity="secondary"
            outlined
            @click="downloadReceipt"
          />
          <Button label="New Exit" icon="pi pi-plus" severity="success" @click="resetForNewExit" />
        </div>
      </template>
    </Dialog>

    <!-- Image Gallery Dialog -->
    <Dialog
      v-model:visible="showImageGallery"
      modal
      header="Session Images"
      :style="{ width: '90vw', maxWidth: '800px' }"
    >
      <ImageGallery :images="sessionImages" :show-meta="true" />
    </Dialog>
  </div>
</template>

<style scoped>
.exit-station-view {
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

.exit-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.session-banner {
  margin-bottom: var(--spacing-md);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.banner-content .plate {
  font-family: monospace;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.banner-content .separator {
  color: var(--text-secondary);
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

.session-card {
  background: var(--blue-50);
  border: 2px solid var(--blue-200);
}

.session-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row .label {
  font-weight: 500;
  color: var(--text-secondary);
}

.payment-section,
.notes-section {
  width: 100%;
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

.summary-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
}

.summary-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.summary-item .value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-item .value.amount {
  color: var(--green-600);
  font-size: 1.5rem;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  margin-top: auto;
}

.exit-confirmation-dialog {
  width: 90vw;
  max-width: 700px;
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

.confirmation-card {
  background: var(--green-50);
  border: 2px solid var(--green-200);
}

.confirmation-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.confirmation-details .plate {
  font-family: monospace;
  font-size: 1.25rem;
  letter-spacing: 0.1em;
  color: var(--primary-color);
}

.confirmation-details .amount {
  color: var(--green-600);
  font-size: 1.5rem;
}

.dialog-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .exit-station-view {
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

  .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .step-actions {
    flex-direction: column;
  }

  .step-actions button {
    width: 100%;
  }

  .dialog-footer {
    flex-direction: column;
  }

  .dialog-footer button {
    width: 100%;
  }
}
</style>
