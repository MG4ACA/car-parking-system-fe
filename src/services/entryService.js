import api from './api';

/**
 * Entry Service - Handles all entry station operations
 */

/**
 * Create a new parking session (vehicle entry)
 * @param {Object} entryData - Entry data
 * @param {string} entryData.vehiclePlateNumber - License plate number
 * @param {number} entryData.vehicleTypeId - Vehicle type ID
 * @param {number} entryData.zoneId - Parking zone ID
 * @param {number} entryData.entryStationId - Entry station ID
 * @param {string} entryData.entryImagePath - Path to uploaded entry image
 * @param {string} entryData.notes - Optional notes
 * @returns {Promise<Object>} Created parking session
 */
export const createEntry = async (entryData) => {
  const response = await api.post('/api/entry', entryData);
  return response.data;
};

/**
 * Check if a vehicle is already in the parking (duplicate check)
 * @param {string} plateNumber - License plate number
 * @returns {Promise<Object>} Active session if exists
 */
export const checkDuplicateEntry = async (plateNumber) => {
  const response = await api.get(`/api/entry/check/${plateNumber}`);
  return response.data;
};

/**
 * Get zone capacity information
 * @param {number} zoneId - Zone ID
 * @returns {Promise<Object>} Zone capacity info (total, occupied, available)
 */
export const getZoneCapacity = async (zoneId) => {
  const response = await api.get(`/api/zones/${zoneId}/capacity`);
  return response.data;
};

/**
 * Get entry receipt data
 * @param {number} sessionId - Parking session ID
 * @returns {Promise<Object>} Receipt data
 */
export const getEntryReceipt = async (sessionId) => {
  const response = await api.get(`/api/entry/receipt/${sessionId}`);
  return response.data;
};

/**
 * Get recent entries for current station
 * @param {number} stationId - Entry station ID
 * @param {number} limit - Number of records to fetch
 * @returns {Promise<Array>} Recent entries
 */
export const getRecentEntries = async (stationId, limit = 10) => {
  const response = await api.get(`/api/entry/recent/${stationId}`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Validate plate number format
 * @param {string} plateNumber - License plate number
 * @returns {boolean} Is valid
 */
export const validatePlateNumber = (plateNumber) => {
  if (!plateNumber || typeof plateNumber !== 'string') return false;

  // Remove spaces and convert to uppercase
  const cleaned = plateNumber.trim().toUpperCase();

  // Must be 3-15 characters, alphanumeric with optional hyphens
  const regex = /^[A-Z0-9-]{3,15}$/;
  return regex.test(cleaned);
};

/**
 * Format plate number (uppercase, trim)
 * @param {string} plateNumber - License plate number
 * @returns {string} Formatted plate number
 */
export const formatPlateNumber = (plateNumber) => {
  if (!plateNumber) return '';
  return plateNumber.trim().toUpperCase();
};

export default {
  createEntry,
  checkDuplicateEntry,
  getZoneCapacity,
  getEntryReceipt,
  getRecentEntries,
  validatePlateNumber,
  formatPlateNumber,
};
