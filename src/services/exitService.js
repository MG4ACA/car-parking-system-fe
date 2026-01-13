import api from './api';

/**
 * Exit Service - Handles all exit station operations
 */

/**
 * Search for active parking session by plate number
 * @param {string} plateNumber - License plate number
 * @returns {Promise<Object>} Active parking session if found
 */
export const searchVehicle = async (plateNumber) => {
  const response = await api.get(`/api/exit/search/${plateNumber}`);
  return response.data;
};

/**
 * Process vehicle exit
 * @param {Object} exitData - Exit data
 * @param {number} exitData.sessionId - Parking session ID
 * @param {number} exitData.exitStationId - Exit station ID
 * @param {string} exitData.exitImagePath - Path to uploaded exit image
 * @param {string} exitData.paymentStatus - Payment status (paid/unpaid)
 * @param {string} exitData.notes - Optional notes
 * @returns {Promise<Object>} Updated parking session with billing info
 */
export const processExit = async (exitData) => {
  const response = await api.post('/api/exit/process', exitData);
  return response.data;
};

/**
 * Calculate parking charges
 * @param {number} sessionId - Parking session ID
 * @returns {Promise<Object>} Calculated charges with breakdown
 */
export const calculateCharges = async (sessionId) => {
  const response = await api.get(`/api/exit/calculate/${sessionId}`);
  return response.data;
};

/**
 * Get bill/receipt preview
 * @param {number} sessionId - Parking session ID
 * @returns {Promise<Object>} Bill data for preview
 */
export const getBillPreview = async (sessionId) => {
  const response = await api.get(`/api/exit/bill/${sessionId}`);
  return response.data;
};

/**
 * Generate and download PDF receipt
 * @param {number} sessionId - Parking session ID
 * @returns {Promise<Blob>} PDF blob
 */
export const downloadReceipt = async (sessionId) => {
  const response = await api.get(`/api/exit/receipt/${sessionId}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Update payment status
 * @param {number} sessionId - Parking session ID
 * @param {string} paymentStatus - Payment status (paid/unpaid)
 * @returns {Promise<Object>} Updated session
 */
export const updatePaymentStatus = async (sessionId, paymentStatus) => {
  const response = await api.patch(`/api/exit/payment/${sessionId}`, {
    paymentStatus,
  });
  return response.data;
};

/**
 * Get recent exits for current station
 * @param {number} stationId - Exit station ID
 * @param {number} limit - Number of records to fetch
 * @returns {Promise<Array>} Recent exits
 */
export const getRecentExits = async (stationId, limit = 10) => {
  const response = await api.get(`/api/exit/recent/${stationId}`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Format duration in minutes to human-readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "2h 30m")
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format currency amount
 * @param {number} amount - Amount
 * @returns {string} Formatted currency (e.g., "Rs 150.00")
 */
export const formatCurrency = (amount) => {
  if (!amount) return 'Rs 0.00';
  return `Rs ${parseFloat(amount).toFixed(2)}`;
};

/**
 * Calculate time elapsed since entry
 * @param {string|Date} entryTime - Entry timestamp
 * @returns {number} Minutes elapsed
 */
export const calculateElapsedTime = (entryTime) => {
  if (!entryTime) return 0;

  const entry = new Date(entryTime);
  const now = new Date();
  const diffMs = now - entry;

  return Math.floor(diffMs / (1000 * 60));
};

export default {
  searchVehicle,
  processExit,
  calculateCharges,
  getBillPreview,
  downloadReceipt,
  updatePaymentStatus,
  getRecentExits,
  formatDuration,
  formatCurrency,
  calculateElapsedTime,
};
