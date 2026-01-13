<script setup>
import imageService from '@/services/imageService';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  sessionId: {
    type: Number,
    default: null,
  },
  images: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showMeta: {
    type: Boolean,
    default: true,
  },
  responsiveOptions: {
    type: Array,
    default: () => [
      {
        breakpoint: '1024px',
        numVisible: 5,
      },
      {
        breakpoint: '768px',
        numVisible: 3,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
      },
    ],
  },
});

const emit = defineEmits(['load-error']);

const galleryImages = ref([]);
const loadingImages = ref(false);
const error = ref(null);

const hasImages = computed(() => galleryImages.value.length > 0);

// Transform images for Galleria component
const transformImages = (images) => {
  return images.map((img) => ({
    id: img.id,
    itemImageSrc: imageService.getImageUrl(img.path || img.imagePath),
    thumbnailImageSrc: imageService.getImageUrl(img.path || img.imagePath),
    alt: img.alt || `Vehicle image ${img.type || ''}`,
    title: img.type
      ? `${img.type.charAt(0).toUpperCase() + img.type.slice(1)} Image`
      : 'Vehicle Image',
    type: img.type,
    timestamp: img.createdAt || img.timestamp,
    ocrResult: img.ocrResult || img.plateNumber,
  }));
};

// Load images if sessionId is provided
const loadSessionImages = async () => {
  if (!props.sessionId) return;

  loadingImages.value = true;
  error.value = null;

  try {
    const response = await imageService.getSessionImages(props.sessionId);
    galleryImages.value = transformImages(response.data || []);
  } catch (err) {
    console.error('Failed to load session images:', err);
    error.value = 'Failed to load images';
    emit('load-error', err);
  } finally {
    loadingImages.value = false;
  }
};

// Initialize gallery
onMounted(() => {
  if (props.images && props.images.length > 0) {
    galleryImages.value = transformImages(props.images);
  } else if (props.sessionId) {
    loadSessionImages();
  }
});

const getTypeColor = (type) => {
  return type === 'entry' ? 'info' : 'success';
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};
</script>

<template>
  <div class="image-gallery">
    <!-- Loading State -->
    <div v-if="loading || loadingImages" class="loading-state">
      <ProgressSpinner />
      <p>Loading images...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <i class="pi pi-exclamation-circle"></i>
      <p>{{ error }}</p>
      <Button label="Retry" icon="pi pi-refresh" @click="loadSessionImages" outlined />
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasImages" class="empty-state">
      <i class="pi pi-images"></i>
      <p>No images available</p>
    </div>

    <!-- Gallery -->
    <div v-else class="gallery-container">
      <Galleria
        :value="galleryImages"
        :responsiveOptions="responsiveOptions"
        :numVisible="5"
        :circular="true"
        :fullScreen="true"
        :showItemNavigators="true"
        :showThumbnails="true"
        containerStyle="max-width: 100%"
      >
        <template #item="{ item }">
          <div class="gallery-item">
            <img :src="item.itemImageSrc" :alt="item.alt" class="gallery-image" />

            <div v-if="showMeta" class="image-meta">
              <Tag
                v-if="item.type"
                :value="item.type.toUpperCase()"
                :severity="getTypeColor(item.type)"
                class="type-tag"
              />

              <div v-if="item.ocrResult" class="ocr-result">
                <span class="plate-label">Plate:</span>
                <span class="plate-number">{{ item.ocrResult }}</span>
              </div>

              <div v-if="item.timestamp" class="timestamp">
                <i class="pi pi-clock"></i>
                <span>{{ formatDate(item.timestamp) }}</span>
              </div>
            </div>
          </div>
        </template>

        <template #thumbnail="{ item }">
          <div class="thumbnail-wrapper">
            <img :src="item.thumbnailImageSrc" :alt="item.alt" class="thumbnail-image" />
            <Tag
              v-if="item.type"
              :value="item.type"
              :severity="getTypeColor(item.type)"
              class="thumbnail-tag"
            />
          </div>
        </template>
      </Galleria>

      <!-- Image Count -->
      <div class="image-count">
        <i class="pi pi-images"></i>
        <span>
          {{ galleryImages.length }} {{ galleryImages.length === 1 ? 'image' : 'images' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-gallery {
  width: 100%;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
  color: var(--text-secondary);
}

.loading-state i,
.error-state i,
.empty-state i {
  font-size: 3rem;
  color: var(--text-tertiary);
}

.error-state i {
  color: var(--red-500);
}

.gallery-container {
  position: relative;
}

.gallery-item {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-900);
}

.gallery-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.image-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 2rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: white;
}

.type-tag {
  align-self: flex-start;
}

.ocr-result {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
}

.plate-label {
  opacity: 0.8;
}

.plate-number {
  font-family: monospace;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.1em;
}

.timestamp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.thumbnail-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.thumbnail-tag {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.625rem;
}

.image-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: var(--spacing-md);
  padding: 0.5rem 1rem;
  background: var(--surface-50);
  border-radius: 4px;
  color: var(--text-secondary);
  justify-content: center;
}

/* Override Galleria styles */
:deep(.p-galleria-thumbnail-container) {
  background: var(--surface-100);
}

:deep(.p-galleria-thumbnail-item) {
  opacity: 0.6;
  transition: opacity 0.3s;
}

:deep(.p-galleria-thumbnail-item:hover),
:deep(.p-galleria-thumbnail-item.p-galleria-thumbnail-item-current) {
  opacity: 1;
}

@media (max-width: 768px) {
  .gallery-image {
    max-height: 50vh;
  }

  .plate-number {
    font-size: 1.25rem;
  }

  .image-meta {
    padding: 1.5rem 0.75rem 0.75rem;
  }
}
</style>
