/**
 * Image Capture Composable
 * Reusable composition function for image capture, upload, and OCR
 */

import imageService from '@/services/imageService';
import { computed, ref } from 'vue';
import { useNotification } from './useNotification';

export function useImageCapture() {
  const { showSuccess, showError, showWarning } = useNotification();

  // State
  const selectedFile = ref(null);
  const previewUrl = ref(null);
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const ocrResult = ref(null);
  const ocrLoading = ref(false);
  const ocrError = ref(null);
  const imageData = ref(null);

  // Computed
  const hasImage = computed(() => !!previewUrl.value);
  const hasOcrResult = computed(() => !!ocrResult.value);
  const isProcessing = computed(() => uploading.value || ocrLoading.value);

  /**
   * Handle file selection
   * @param {Event} event - File input change event
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validation = imageService.validateImage(file);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    selectedFile.value = file;
    createPreview(file);
  };

  /**
   * Create image preview from file
   * @param {File} file - Image file
   */
  const createPreview = (file) => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }

    previewUrl.value = URL.createObjectURL(file);
  };

  /**
   * Upload image and perform OCR
   * @param {string} type - Image type (entry/exit)
   * @returns {Promise} Upload result with OCR data
   */
  const uploadImage = async (type = 'entry') => {
    if (!selectedFile.value) {
      showError('No image selected');
      return null;
    }

    uploading.value = true;
    ocrLoading.value = true;
    uploadProgress.value = 0;
    ocrError.value = null;

    try {
      const response = await imageService.uploadImageWithProgress(
        selectedFile.value,
        type,
        (progress) => {
          uploadProgress.value = progress;
        }
      );

      imageData.value = response.data;
      ocrResult.value = response.data.ocrResult || null;

      if (ocrResult.value && ocrResult.value.plateNumber) {
        showSuccess('License plate detected successfully');
      } else {
        showWarning('Could not detect license plate. Please enter manually.');
      }

      return response.data;
    } catch (error) {
      console.error('Image upload failed:', error);
      ocrError.value = error.response?.data?.error || 'Upload failed';
      showError(ocrError.value);
      return null;
    } finally {
      uploading.value = false;
      ocrLoading.value = false;
      uploadProgress.value = 0;
    }
  };

  /**
   * Retry OCR on uploaded image
   * @returns {Promise} OCR result
   */
  const retryOCR = async () => {
    if (!imageData.value || !imageData.value.id) {
      showError('No image to retry OCR');
      return null;
    }

    ocrLoading.value = true;
    ocrError.value = null;

    try {
      const response = await imageService.retryOCR(imageData.value.id);
      ocrResult.value = response.data.ocrResult || null;

      if (ocrResult.value && ocrResult.value.plateNumber) {
        showSuccess('License plate detected successfully');
      } else {
        showWarning('Could not detect license plate');
      }

      return ocrResult.value;
    } catch (error) {
      console.error('OCR retry failed:', error);
      ocrError.value = error.response?.data?.error || 'OCR retry failed';
      showError(ocrError.value);
      return null;
    } finally {
      ocrLoading.value = false;
    }
  };

  /**
   * Clear all image data and reset state
   */
  const clearImage = () => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }

    selectedFile.value = null;
    previewUrl.value = null;
    ocrResult.value = null;
    ocrError.value = null;
    imageData.value = null;
    uploadProgress.value = 0;
  };

  /**
   * Reset OCR result (for manual entry)
   */
  const resetOCR = () => {
    ocrResult.value = null;
    ocrError.value = null;
  };

  return {
    // State
    selectedFile,
    previewUrl,
    uploading,
    uploadProgress,
    ocrResult,
    ocrLoading,
    ocrError,
    imageData,

    // Computed
    hasImage,
    hasOcrResult,
    isProcessing,

    // Methods
    handleFileSelect,
    uploadImage,
    retryOCR,
    clearImage,
    resetOCR,
  };
}
