import { useNotification } from '@/composables/useNotification';
import exitService from '@/services/exitService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useExitStore = defineStore('exit', () => {
  const { showSuccess, showError, showWarning } = useNotification();

  // State
  const activeSession = ref(null);
  const recentExits = ref([]);
  const loading = ref(false);
  const searching = ref(false);
  const processing = ref(false);
  const calculatingCharges = ref(false);

  // Exit form data
  const searchQuery = ref('');
  const stationId = ref(null);
  const exitImageData = ref(null);
  const paymentStatus = ref('unpaid');
  const notes = ref('');

  // Billing data
  const charges = ref(null);
  const billPreview = ref(null);

  // Computed
  const hasActiveSession = computed(() => !!activeSession.value);

  const sessionDuration = computed(() => {
    if (!activeSession.value?.entryTime) return 0;
    return exitService.calculateElapsedTime(activeSession.value.entryTime);
  });

  const formattedDuration = computed(() => {
    return exitService.formatDuration(sessionDuration.value);
  });

  const totalAmount = computed(() => {
    return charges.value?.totalAmount || 0;
  });

  const formattedTotalAmount = computed(() => {
    return exitService.formatCurrency(totalAmount.value);
  });

  const canProcessExit = computed(() => {
    return hasActiveSession.value && exitImageData.value && stationId.value && !processing.value;
  });

  // Actions

  /**
   * Search for vehicle by plate number
   */
  const searchForVehicle = async (plateNumber) => {
    if (!plateNumber) {
      showError('Please enter a plate number');
      return null;
    }

    searching.value = true;
    try {
      const response = await exitService.searchVehicle(plateNumber);

      if (response.success && response.data) {
        activeSession.value = response.data;
        searchQuery.value = plateNumber;

        // Auto-calculate charges
        await calculateParkingCharges(response.data.id);

        showSuccess(`Vehicle found: ${response.data.vehiclePlateNumber}`);
        return response.data;
      } else {
        activeSession.value = null;
        charges.value = null;
        showWarning(`No active parking session found for ${plateNumber}`);
        return null;
      }
    } catch (error) {
      console.error('Vehicle search error:', error);
      activeSession.value = null;
      charges.value = null;
      showError(error.response?.data?.message || 'Failed to search vehicle');
      return null;
    } finally {
      searching.value = false;
    }
  };

  /**
   * Calculate parking charges
   */
  const calculateParkingCharges = async (sessionId) => {
    if (!sessionId) return null;

    calculatingCharges.value = true;
    try {
      const response = await exitService.calculateCharges(sessionId);

      if (response.success) {
        charges.value = response.data;
        return response.data;
      }
    } catch (error) {
      console.error('Charge calculation error:', error);
      showError('Failed to calculate charges');
      return null;
    } finally {
      calculatingCharges.value = false;
    }
  };

  /**
   * Get bill preview
   */
  const loadBillPreview = async (sessionId) => {
    if (!sessionId) return null;

    loading.value = true;
    try {
      const response = await exitService.getBillPreview(sessionId);

      if (response.success) {
        billPreview.value = response.data;
        return response.data;
      }
    } catch (error) {
      console.error('Bill preview error:', error);
      showError('Failed to load bill preview');
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Process vehicle exit
   */
  const processVehicleExit = async () => {
    if (!canProcessExit.value) {
      showError('Please complete all required fields');
      return null;
    }

    processing.value = true;
    try {
      const exitData = {
        sessionId: activeSession.value.id,
        exitStationId: stationId.value,
        exitImagePath: exitImageData.value.path || exitImageData.value.id,
        paymentStatus: paymentStatus.value,
        notes: notes.value,
      };

      const response = await exitService.processExit(exitData);

      if (response.success) {
        const exitedSession = response.data;

        // Add to recent exits
        recentExits.value.unshift(exitedSession);
        if (recentExits.value.length > 10) {
          recentExits.value.pop();
        }

        showSuccess('Vehicle exit processed successfully');
        return exitedSession;
      }
    } catch (error) {
      console.error('Exit processing error:', error);
      showError(error.response?.data?.message || 'Failed to process exit');
      return null;
    } finally {
      processing.value = false;
    }
  };

  /**
   * Update payment status
   */
  const updatePayment = async (sessionId, status) => {
    try {
      const response = await exitService.updatePaymentStatus(sessionId, status);

      if (response.success) {
        paymentStatus.value = status;
        if (activeSession.value?.id === sessionId) {
          activeSession.value.paymentStatus = status;
        }
        showSuccess(`Payment status updated to ${status}`);
        return response.data;
      }
    } catch (error) {
      console.error('Payment update error:', error);
      showError('Failed to update payment status');
      return null;
    }
  };

  /**
   * Download receipt PDF
   */
  const downloadReceiptPDF = async (sessionId) => {
    try {
      const blob = await exitService.downloadReceipt(sessionId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt_${sessionId}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess('Receipt downloaded successfully');
    } catch (error) {
      console.error('Receipt download error:', error);
      showError('Failed to download receipt');
    }
  };

  /**
   * Fetch recent exits for station
   */
  const fetchRecentExits = async (stId, limit = 10) => {
    loading.value = true;
    try {
      const response = await exitService.getRecentExits(stId, limit);

      if (response.success) {
        recentExits.value = response.data;
      }
    } catch (error) {
      console.error('Fetch recent exits error:', error);
      showError('Failed to load recent exits');
    } finally {
      loading.value = false;
    }
  };

  /**
   * Set exit image data
   */
  const setExitImageData = (imgData) => {
    exitImageData.value = imgData;
  };

  /**
   * Set station ID
   */
  const setStation = (stId) => {
    stationId.value = stId;
  };

  /**
   * Set payment status
   */
  const setPaymentStatus = (status) => {
    paymentStatus.value = status;
  };

  /**
   * Set notes
   */
  const setNotes = (notesText) => {
    notes.value = notesText;
  };

  /**
   * Reset exit form
   */
  const resetForm = () => {
    searchQuery.value = '';
    activeSession.value = null;
    exitImageData.value = null;
    paymentStatus.value = 'unpaid';
    notes.value = '';
    charges.value = null;
    billPreview.value = null;
  };

  /**
   * Clear active session
   */
  const clearSession = () => {
    activeSession.value = null;
    charges.value = null;
    billPreview.value = null;
  };

  return {
    // State
    activeSession,
    recentExits,
    loading,
    searching,
    processing,
    calculatingCharges,
    searchQuery,
    stationId,
    exitImageData,
    paymentStatus,
    notes,
    charges,
    billPreview,

    // Computed
    hasActiveSession,
    sessionDuration,
    formattedDuration,
    totalAmount,
    formattedTotalAmount,
    canProcessExit,

    // Actions
    searchForVehicle,
    calculateParkingCharges,
    loadBillPreview,
    processVehicleExit,
    updatePayment,
    downloadReceiptPDF,
    fetchRecentExits,
    setExitImageData,
    setStation,
    setPaymentStatus,
    setNotes,
    resetForm,
    clearSession,
  };
});
