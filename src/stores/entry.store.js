import { useNotification } from '@/composables/useNotification';
import entryService from '@/services/entryService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useEntryStore = defineStore('entry', () => {
  const { showSuccess, showError, showWarning } = useNotification();

  // State
  const currentEntry = ref(null);
  const recentEntries = ref([]);
  const loading = ref(false);
  const creating = ref(false);
  const checkingDuplicate = ref(false);

  // Entry form data
  const plateNumber = ref('');
  const vehicleTypeId = ref(null);
  const zoneId = ref(null);
  const stationId = ref(null);
  const imageData = ref(null);
  const ocrResult = ref(null);
  const notes = ref('');

  // Duplicate check result
  const duplicateSession = ref(null);
  const isDuplicate = ref(false);

  // Computed
  const hasValidData = computed(() => {
    return (
      plateNumber.value && vehicleTypeId.value && zoneId.value && stationId.value && imageData.value
    );
  });

  const formattedPlateNumber = computed(() => {
    return entryService.formatPlateNumber(plateNumber.value);
  });

  // Actions

  /**
   * Create a new parking session
   */
  const createParkingSession = async () => {
    if (!hasValidData.value) {
      showError('Please fill all required fields');
      return null;
    }

    creating.value = true;
    try {
      const entryData = {
        vehiclePlateNumber: formattedPlateNumber.value,
        vehicleTypeId: vehicleTypeId.value,
        zoneId: zoneId.value,
        entryStationId: stationId.value,
        entryImagePath: imageData.value.path || imageData.value.id,
        notes: notes.value,
      };

      const response = await entryService.createEntry(entryData);

      if (response.success) {
        currentEntry.value = response.data;

        // Add to recent entries
        recentEntries.value.unshift(response.data);
        if (recentEntries.value.length > 10) {
          recentEntries.value.pop();
        }

        showSuccess('Vehicle entry recorded successfully');
        return response.data;
      }
    } catch (error) {
      console.error('Entry creation error:', error);
      showError(error.response?.data?.message || 'Failed to create entry');
      return null;
    } finally {
      creating.value = false;
    }
  };

  /**
   * Check for duplicate entry
   */
  const checkDuplicate = async (plate) => {
    if (!plate) return false;

    checkingDuplicate.value = true;
    isDuplicate.value = false;
    duplicateSession.value = null;

    try {
      const response = await entryService.checkDuplicateEntry(plate);

      if (response.success && response.data) {
        isDuplicate.value = true;
        duplicateSession.value = response.data;
        showWarning(`Vehicle ${plate} is already in the parking`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Duplicate check error:', error);
      return false;
    } finally {
      checkingDuplicate.value = false;
    }
  };

  /**
   * Fetch recent entries for station
   */
  const fetchRecentEntries = async (stId, limit = 10) => {
    loading.value = true;
    try {
      const response = await entryService.getRecentEntries(stId, limit);

      if (response.success) {
        recentEntries.value = response.data;
      }
    } catch (error) {
      console.error('Fetch recent entries error:', error);
      showError('Failed to load recent entries');
    } finally {
      loading.value = false;
    }
  };

  /**
   * Set plate number from OCR result
   */
  const setPlateFromOCR = (ocrData) => {
    if (ocrData && ocrData.plateNumber) {
      plateNumber.value = ocrData.plateNumber;
      ocrResult.value = ocrData;
    }
  };

  /**
   * Set plate number manually
   */
  const setPlateManually = (plate) => {
    plateNumber.value = plate;
    ocrResult.value = null;
  };

  /**
   * Set image data
   */
  const setImageData = (imgData) => {
    imageData.value = imgData;
  };

  /**
   * Set vehicle type
   */
  const setVehicleType = (typeId) => {
    vehicleTypeId.value = typeId;
  };

  /**
   * Set zone
   */
  const setZone = (zId) => {
    zoneId.value = zId;
  };

  /**
   * Set station
   */
  const setStation = (stId) => {
    stationId.value = stId;
  };

  /**
   * Set notes
   */
  const setNotes = (notesText) => {
    notes.value = notesText;
  };

  /**
   * Reset entry form
   */
  const resetForm = () => {
    plateNumber.value = '';
    vehicleTypeId.value = null;
    zoneId.value = null;
    imageData.value = null;
    ocrResult.value = null;
    notes.value = '';
    isDuplicate.value = false;
    duplicateSession.value = null;
    currentEntry.value = null;
  };

  /**
   * Reset only entry result (for new entry)
   */
  const resetEntry = () => {
    currentEntry.value = null;
  };

  /**
   * Validate plate number
   */
  const isValidPlate = (plate) => {
    return entryService.validatePlateNumber(plate);
  };

  return {
    // State
    currentEntry,
    recentEntries,
    loading,
    creating,
    checkingDuplicate,
    plateNumber,
    vehicleTypeId,
    zoneId,
    stationId,
    imageData,
    ocrResult,
    notes,
    duplicateSession,
    isDuplicate,

    // Computed
    hasValidData,
    formattedPlateNumber,

    // Actions
    createParkingSession,
    checkDuplicate,
    fetchRecentEntries,
    setPlateFromOCR,
    setPlateManually,
    setImageData,
    setVehicleType,
    setZone,
    setStation,
    setNotes,
    resetForm,
    resetEntry,
    isValidPlate,
  };
});
