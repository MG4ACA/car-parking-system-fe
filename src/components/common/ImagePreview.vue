<script setup>
import Image from 'primevue/image';
import ProgressSpinner from 'primevue/progressspinner';
import { computed } from 'vue';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'Vehicle image',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  preview: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: 'auto',
  },
});

const containerStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));
</script>

<template>
  <div class="image-preview" :style="containerStyle">
    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner strokeWidth="4" animationDuration="1s" style="width: 50px; height: 50px" />
      <span class="loading-text">Processing...</span>
    </div>

    <!-- Image -->
    <Image v-else :src="imageUrl" :alt="alt" :preview="preview" class="preview-image">
      <template #indicator>
        <i class="pi pi-eye preview-icon"></i>
      </template>
    </Image>
  </div>
</template>

<style scoped>
.image-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-100);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-image :deep(img) {
  border-radius: 8px;
  max-height: 500px;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.preview-icon {
  font-size: 2rem;
  color: white;
}

@media (max-width: 768px) {
  .preview-image :deep(img) {
    max-height: 300px;
  }
}
</style>
