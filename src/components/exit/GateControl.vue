<script setup>
import { ref } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  closeDelay: {
    type: Number,
    default: 10, // seconds
  },
});

const emit = defineEmits(['gate-opened', 'gate-closed']);

// Local state
const gateOpen = ref(false);
const opening = ref(false);
const closing = ref(false);
const autoCloseTimer = ref(null);
const countdown = ref(0);

// Methods
const openGate = () => {
  if (props.disabled || opening.value || gateOpen.value) return;

  opening.value = true;

  setTimeout(() => {
    opening.value = false;
    gateOpen.value = true;
    emit('gate-opened');

    if (props.autoClose) {
      startAutoClose();
    }
  }, 1500); // Simulate gate opening delay
};

const closeGate = () => {
  if (closing.value || !gateOpen.value) return;

  clearAutoClose();
  closing.value = true;

  setTimeout(() => {
    closing.value = false;
    gateOpen.value = false;
    emit('gate-closed');
  }, 1500); // Simulate gate closing delay
};

const startAutoClose = () => {
  countdown.value = props.closeDelay;

  autoCloseTimer.value = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      closeGate();
    }
  }, 1000);
};

const clearAutoClose = () => {
  if (autoCloseTimer.value) {
    clearInterval(autoCloseTimer.value);
    autoCloseTimer.value = null;
    countdown.value = 0;
  }
};

const getGateStatus = () => {
  if (opening.value) return 'Opening...';
  if (closing.value) return 'Closing...';
  if (gateOpen.value) return 'Open';
  return 'Closed';
};

const getStatusColor = () => {
  if (opening.value || closing.value) return 'var(--orange-500)';
  if (gateOpen.value) return 'var(--green-500)';
  return 'var(--red-500)';
};
</script>

<template>
  <Card class="gate-control">
    <template #title>
      <div class="gate-header">
        <i class="pi pi-sign-out"></i>
        <span>Gate Control</span>
      </div>
    </template>

    <template #content>
      <div class="gate-container">
        <!-- Gate Status Indicator -->
        <div class="gate-status">
          <div
            class="status-indicator"
            :class="{
              open: gateOpen,
              opening: opening,
              closing: closing,
            }"
            :style="{ borderColor: getStatusColor() }"
          >
            <div class="gate-icon">
              <i
                :class="[
                  'pi',
                  opening || closing
                    ? 'pi-spin pi-spinner'
                    : gateOpen
                    ? 'pi-check-circle'
                    : 'pi-times-circle',
                ]"
                :style="{ color: getStatusColor() }"
              ></i>
            </div>
            <div class="status-text" :style="{ color: getStatusColor() }">
              {{ getGateStatus() }}
            </div>
          </div>
        </div>

        <!-- Auto-close Countdown -->
        <div v-if="gateOpen && autoClose && countdown > 0" class="countdown-section">
          <div class="countdown-text">
            <i class="pi pi-clock"></i>
            <span>Gate closing in {{ countdown }}s</span>
          </div>
          <ProgressBar
            :value="(countdown / closeDelay) * 100"
            :show-value="false"
            class="countdown-bar"
          />
        </div>

        <!-- Control Buttons -->
        <div class="gate-actions">
          <Button
            v-if="!gateOpen"
            label="Open Gate"
            icon="pi pi-arrow-up"
            severity="success"
            size="large"
            :loading="opening"
            :disabled="disabled || opening || gateOpen"
            @click="openGate"
          />

          <Button
            v-else
            label="Close Gate"
            icon="pi pi-arrow-down"
            severity="danger"
            size="large"
            :loading="closing"
            :disabled="closing"
            @click="closeGate"
          />
        </div>

        <!-- Instructions -->
        <div class="gate-instructions">
          <div class="instruction">
            <i class="pi pi-info-circle"></i>
            <span v-if="!gateOpen">Click "Open Gate" to allow vehicle to exit</span>
            <span v-else>Gate will close automatically in {{ closeDelay }} seconds</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.gate-control {
  width: 100%;
}

.gate-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.gate-header i {
  font-size: 1.5rem;
}

.gate-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.gate-status {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.status-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 4px solid;
  border-radius: 50%;
  width: 180px;
  height: 180px;
  justify-content: center;
  transition: all 0.3s ease;
}

.status-indicator.opening,
.status-indicator.closing {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.gate-icon i {
  font-size: 4rem;
}

.status-text {
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.countdown-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--orange-50);
  border-radius: 8px;
}

.countdown-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--orange-700);
  font-weight: 600;
}

.countdown-bar {
  height: 8px;
}

.countdown-bar :deep(.p-progressbar-value) {
  background: var(--orange-500);
}

.gate-actions {
  display: flex;
  justify-content: center;
}

.gate-actions button {
  min-width: 200px;
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.gate-instructions {
  text-align: center;
}

.instruction {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--surface-50);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.instruction i {
  color: var(--primary-color);
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .status-indicator {
    width: 150px;
    height: 150px;
    padding: 1.5rem;
  }

  .gate-icon i {
    font-size: 3rem;
  }

  .status-text {
    font-size: 1rem;
  }

  .gate-actions button {
    width: 100%;
  }
}
</style>
