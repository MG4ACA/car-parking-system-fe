<script setup>
import ImageCapture from '@/components/common/ImageCapture.vue';
import ImageGallery from '@/components/common/ImageGallery.vue';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import { ref } from 'vue';

// Demo state
const detectedPlate = ref(null);
const uploadedImage = ref(null);
const captureType = ref('entry');

// Mock images for gallery demo
const mockImages = ref([
  {
    id: 1,
    path: 'entry/sample1.jpg',
    type: 'entry',
    plateNumber: 'ABC-1234',
    createdAt: new Date().toISOString(),
    alt: 'Entry image 1',
  },
  {
    id: 2,
    path: 'exit/sample2.jpg',
    type: 'exit',
    plateNumber: 'XYZ-5678',
    createdAt: new Date().toISOString(),
    alt: 'Exit image 1',
  },
]);

const handleUploadSuccess = (data) => {
  uploadedImage.value = data;
  console.log('Upload successful:', data);
};

const handleUploadError = (error) => {
  console.error('Upload error:', error);
};

const handlePlateDetected = (plateNumber, confidence) => {
  detectedPlate.value = {
    number: plateNumber,
    confidence: confidence,
    timestamp: new Date().toISOString(),
  };
  console.log('Plate detected:', plateNumber, 'Confidence:', confidence);
};

const handleManualEntry = (plateNumber) => {
  detectedPlate.value = {
    number: plateNumber,
    confidence: 100,
    timestamp: new Date().toISOString(),
    manual: true,
  };
  console.log('Manual plate entry:', plateNumber);
};
</script>

<template>
  <div class="image-demo-view">
    <div class="page-header">
      <h1>Phase 4: Image Processing Components</h1>
      <p class="subtitle">Demo of image capture, preview, and gallery components</p>
    </div>

    <!-- Detected Plate Display -->
    <Card v-if="detectedPlate" class="detection-card">
      <template #title>
        <div class="detection-header">
          <i class="pi pi-check-circle"></i>
          <span>License Plate Detected</span>
        </div>
      </template>
      <template #content>
        <div class="detection-content">
          <div class="plate-display">
            <span class="plate-label">Plate Number:</span>
            <span class="plate-number">{{ detectedPlate.number }}</span>
          </div>
          <div class="detection-meta">
            <Tag
              :value="detectedPlate.manual ? 'Manual Entry' : 'OCR Detected'"
              :severity="detectedPlate.manual ? 'warning' : 'success'"
            />
            <span class="confidence">Confidence: {{ detectedPlate.confidence }}%</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Image Capture Component -->
    <Card class="demo-section">
      <template #title>
        <span>1. Image Capture Component</span>
      </template>
      <template #subtitle>
        <span>Upload vehicle image with automatic OCR and manual entry fallback</span>
      </template>
      <template #content>
        <ImageCapture
          :type="captureType"
          :autoUpload="true"
          :showManualEntry="true"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
          @plate-detected="handlePlateDetected"
          @manual-entry="handleManualEntry"
        />
      </template>
    </Card>

    <Divider />

    <!-- Image Gallery Component -->
    <Card class="demo-section">
      <template #title>
        <span>2. Image Gallery Component</span>
      </template>
      <template #subtitle>
        <span>View multiple vehicle images with metadata</span>
      </template>
      <template #content>
        <div class="gallery-demo">
          <p class="info-text">
            <i class="pi pi-info-circle"></i>
            This is a demo with mock images. In production, images will be loaded from the backend.
          </p>

          <ImageGallery :images="mockImages" :showMeta="true" />
        </div>
      </template>
    </Card>

    <!-- Component Features -->
    <Card class="features-section">
      <template #title>
        <span>✨ Implemented Features</span>
      </template>
      <template #content>
        <div class="features-grid">
          <div class="feature-item">
            <i class="pi pi-camera"></i>
            <h3>Mobile Camera Support</h3>
            <p>Capture images directly from mobile device camera</p>
          </div>

          <div class="feature-item">
            <i class="pi pi-upload"></i>
            <h3>File Upload</h3>
            <p>Upload images from device storage</p>
          </div>

          <div class="feature-item">
            <i class="pi pi-spinner"></i>
            <h3>Upload Progress</h3>
            <p>Visual feedback during image upload and processing</p>
          </div>

          <div class="feature-item">
            <i class="pi pi-eye"></i>
            <h3>Image Preview</h3>
            <p>Preview captured images before processing</p>
          </div>

          <div class="feature-item">
            <i class="pi pi-search"></i>
            <h3>Automatic OCR</h3>
            <p>Automatic license plate detection after upload</p>
          </div>

          <div class="feature-item">
            <i class="pi pi-pencil"></i>
            <h3>Manual Entry</h3>
            <p>Fallback to manual plate entry if OCR fails</p>
          </div>

          <div class="feature-item">
            <i class="pi pi-images"></i>
            <h3>Image Gallery</h3>
            <p>View multiple images with fullscreen support</p>
          </div>

          <div class="feature-item">
            <i class="pi pi-exclamation-triangle"></i>
            <h3>Error Handling</h3>
            <p>Comprehensive error handling and validation</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.image-demo-view {
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.detection-card {
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, var(--green-50) 0%, var(--blue-50) 100%);
  border: 2px solid var(--green-500);
}

.detection-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--green-700);
}

.detection-header i {
  font-size: 1.5rem;
}

.detection-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plate-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.plate-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.plate-number {
  font-family: monospace;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 8px;
  border: 2px solid var(--surface-border);
}

.detection-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.confidence {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.demo-section {
  margin-bottom: var(--spacing-lg);
}

.gallery-demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--blue-50);
  border-radius: 8px;
  color: var(--blue-700);
  margin: 0;
}

.features-section {
  margin-top: var(--spacing-xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: var(--surface-50);
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-item i {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-item h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.feature-item p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .image-demo-view {
    padding: var(--spacing-md);
  }

  .plate-number {
    font-size: 1.75rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
