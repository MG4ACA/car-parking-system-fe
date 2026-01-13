/**
 * Image Service
 * Handles API calls for image upload, OCR, and retrieval
 */

import api from './api';

const imageService = {
  /**
   * Upload image and perform OCR
   * @param {File} file - Image file to upload
   * @param {string} type - Image type (entry/exit)
   * @returns {Promise} Upload response with OCR results
   */
  uploadImage: (file, type = 'entry') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    return api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        // This can be used by components to track upload progress
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        return percentCompleted;
      },
    });
  },

  /**
   * Upload image with progress tracking
   * @param {File} file - Image file to upload
   * @param {string} type - Image type (entry/exit)
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Upload response with OCR results
   */
  uploadImageWithProgress: (file, type = 'entry', onProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    return api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
  },

  /**
   * Get image by ID
   * @param {number} imageId - Image ID
   * @returns {Promise} Image data
   */
  getImage: (imageId) => {
    return api.get(`/images/${imageId}`);
  },

  /**
   * Get image URL
   * @param {string} imagePath - Image path from database
   * @returns {string} Full image URL
   */
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${imagePath}`;
  },

  /**
   * Get images for a parking session
   * @param {number} sessionId - Parking session ID
   * @returns {Promise} Array of images
   */
  getSessionImages: (sessionId) => {
    return api.get(`/parking-sessions/${sessionId}/images`);
  },

  /**
   * Retry OCR on existing image
   * @param {number} imageId - Image ID
   * @returns {Promise} OCR results
   */
  retryOCR: (imageId) => {
    return api.post(`/images/${imageId}/retry-ocr`);
  },

  /**
   * Delete image
   * @param {number} imageId - Image ID
   * @returns {Promise} Delete confirmation
   */
  deleteImage: (imageId) => {
    return api.delete(`/images/${imageId}`);
  },

  /**
   * Validate image file
   * @param {File} file - Image file to validate
   * @returns {Object} Validation result
   */
  validateImage: (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WEBP images are allowed',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit',
      };
    }

    return { valid: true };
  },
};

export default imageService;
