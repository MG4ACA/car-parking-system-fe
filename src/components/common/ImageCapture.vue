<script setup>
import { useImageCapture } from '@/composables/useImageCapture';
import { ref, watch } from 'vue';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import ProgressBar from 'primevue/progressbar';

import ImagePreview from './ImagePreview.vue';
import ManualPlateEntry from './ManualPlateEntry.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'entry',
    validator: (value) => ['entry', 'exit'].includes(value),
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
  showManualEntry: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['upload-success', 'upload-error', 'plate-detected', 'manual-entry']);

const {
  selectedFile,
  previewUrl,
  uploading,
  uploadProgress,
  ocrResult,
  ocrLoading,
  ocrError,
  imageData,
  hasImage,
  hasOcrResult,
  isProcessing,
  handleFileSelect,
  uploadImage,
  retryOCR,
  clearImage,
  resetOCR,
} = useImageCapture();

const fileInput = ref(null);
const showManualEntryForm = ref(false);

// Watch for file selection and auto-upload
watch(selectedFile, async (newFile) => {
  if (newFile && props.autoUpload) {
    await handleUpload();
  }
});

// Watch for OCR result
watch(ocrResult, (result) => {
  if (result && result.plateNumber) {
    emit('plate-detected', result.plateNumber, result.confidence);
  } else if (result === null && ocrError.value) {
    // OCR failed, show manual entry if enabled
    if (props.showManualEntry) {
      showManualEntryForm.value = true;
    }
  }
});

const handleUpload = async () => {
  const result = await uploadImage(props.type);
  if (result) {
    emit('upload-success', result);
  } else {
    emit('upload-error', ocrError.value);
  }
};

const handleRetryOCR = async () => {
  await retryOCR();
};

const handleClear = () => {
  clearImage();
  showManualEntryForm.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const toggleManualEntry = () => {
  showManualEntryForm.value = !showManualEntryForm.value;
};

const handleManualSubmit = (plateNumber) => {
  emit('manual-entry', plateNumber);
  emit('plate-detected', plateNumber, 100); // 100% confidence for manual entry
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="image-capture">
    <Card>
      <template #title>
        <div class="capture-header">
          <i class="pi pi-camera"></i>
          <span>Capture Vehicle Image</span>
        </div>
      </template>

      <template #content>
        <!-- File Input (Hidden) -->
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          capture="environment"
          style="display: none"
          @change="handleFileSelect"
        />

        <!-- Upload Buttons -->
        <div v-if="!hasImage" class="upload-section">
          <Button
            label="Take Photo"
            icon="pi pi-camera"
            class="upload-btn"
            @click="triggerFileInput"
            :disabled="isProcessing"
          />
          <Button
            label="Choose File"
            icon="pi pi-upload"
            class="upload-btn"
            outlined
            @click="triggerFileInput"
            :disabled="isProcessing"
          />
        </div>

        <!-- Image Preview -->
        <div v-if="hasImage" class="preview-section">
          <ImagePreview :imageUrl="previewUrl" :loading="uploading" />

          <!-- Upload Progress -->
          <div v-if="uploading" class="progress-section">
            <ProgressBar :value="uploadProgress" :showValue="true" />
            <small class="progress-text">Uploading image...</small>
          </div>

          <!-- OCR Loading -->
          <div v-if="ocrLoading && !uploading" class="ocr-loading">
            <i class="pi pi-spin pi-spinner"></i>
            <span>Processing license plate...</span>
          </div>

          <!-- OCR Result -->
          <div v-if="hasOcrResult && !ocrLoading" class="ocr-result success">
            <div class="result-header">
              <i class="pi pi-check-circle"></i>
              <span>License Plate Detected</span>
            </div>
            <div class="plate-number">{{ ocrResult.plateNumber }}</div>
            <div class="confidence">Confidence: {{ Math.round(ocrResult.confidence || 0) }}%</div>
          </div>

          <!-- OCR Error -->
          <div v-if="ocrError && !ocrLoading" class="ocr-result error">
            <div class="result-header">
              <i class="pi pi-exclamation-circle"></i>
              <span>Could not detect license plate</span>
            </div>
            <p class="error-message">{{ ocrError }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <Button
              v-if="!autoUpload && !uploading"
              label="Upload & Process"
              icon="pi pi-cloud-upload"
              @click="handleUpload"
              :disabled="isProcessing"
            />
            <Button
              v-if="ocrError && imageData"
              label="Retry OCR"
              icon="pi pi-refresh"
              outlined
              @click="handleRetryOCR"
              :disabled="isProcessing"
            />
            <Button
              label="Clear Image"
              icon="pi pi-times"
              severity="secondary"
              outlined
              @click="handleClear"
              :disabled="isProcessing"
            />
          </div>
        </div>

        <!-- Manual Entry Section -->
        <div v-if="showManualEntry && hasImage" class="manual-entry-section">
          <Divider />

          <div class="manual-header">
            <span>Or enter license plate manually</span>
            <Button
              :icon="showManualEntryForm ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
              text
              rounded
              @click="toggleManualEntry"
            />
          </div>

          <div v-if="showManualEntryForm" class="manual-form">
            <ManualPlateEntry :initialValue="ocrResult?.plateNumber" @submit="handleManualSubmit" />
          </div>
        </div>

        <!-- Instructions -->
        <div v-if="!hasImage" class="instructions">
          <h4>Tips for best results:</h4>
          <ul>
            <li>Ensure good lighting</li>
            <li>Center the license plate in frame</li>
            <li>Avoid glare and reflections</li>
            <li>Keep camera steady</li>
          </ul>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.image-capture {
  width: 100%;
}

.capture-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary-color);
}

.capture-header i {
  font-size: 1.5rem;
}

.upload-section {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.upload-btn {
  min-width: 150px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-text {
  text-align: center;
  color: var(--text-secondary);
}

.ocr-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
  color: var(--primary-color);
  font-weight: 500;
}

.ocr-loading i {
  font-size: 1.25rem;
}

.ocr-result {
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid;
}

.ocr-result.success {
  background: var(--green-50);
  border-color: var(--green-500);
}

.ocr-result.error {
  background: var(--red-50);
  border-color: var(--red-500);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.ocr-result.success .result-header {
  color: var(--green-700);
}

.ocr-result.error .result-header {
  color: var(--red-700);
}

.result-header i {
  font-size: 1.25rem;
}

.plate-number {
  font-size: 2rem;
  font-weight: 700;
  font-family: monospace;
  text-align: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
  color: var(--text-primary);
}

.confidence {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.error-message {
  margin: 0;
  color: var(--red-700);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
}

.manual-entry-section {
  margin-top: var(--spacing-md);
}

.manual-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.manual-form {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.instructions {
  margin-top: var(--spacing-lg);
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.instructions h4 {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.instructions ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

.instructions li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .upload-section {
    flex-direction: column;
  }

  .upload-btn {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }

  .plate-number {
    font-size: 1.5rem;
  }
}
</style>
