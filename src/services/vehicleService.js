/**
 * Vehicle Service
 * Handles API calls for vehicle search, history, and management
 */

import api from './api';

const vehicleService = {
  /**
   * Search vehicles with advanced filters
   * @param {Object} filters - Search filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Search results with pagination
   */
  searchVehicles: (filters = {}, page = 1, limit = 10) => {
    return api.get('/vehicles/search', {
      params: {
        ...filters,
        page,
        limit,
      },
    });
  },

  /**
   * Get vehicle parking history
   * @param {string} plateNumber - Vehicle plate number
   * @returns {Promise} Parking history
   */
  getParkingHistory: (plateNumber) => {
    return api.get(`/vehicles/${encodeURIComponent(plateNumber)}/history`);
  },

  /**
   * Get vehicle details by session ID
   * @param {number} sessionId - Parking session ID
   * @returns {Promise} Vehicle details
   */
  getVehicleDetails: (sessionId) => {
    return api.get(`/vehicles/session/${sessionId}`);
  },

  /**
   * Get all parking sessions with filters
   * @param {Object} filters - Filter options
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Paginated sessions
   */
  getAllSessions: (filters = {}, page = 1, limit = 10) => {
    return api.get('/vehicles/sessions', {
      params: {
        ...filters,
        page,
        limit,
      },
    });
  },

  /**
   * Update parking session (manual correction)
   * @param {number} sessionId - Session ID
   * @param {Object} data - Updated data
   * @returns {Promise} Updated session
   */
  updateSession: (sessionId, data) => {
    return api.put(`/vehicles/session/${sessionId}`, data);
  },

  /**
   * Export vehicles to CSV
   * @param {Object} filters - Filter options
   * @returns {Promise} CSV file blob
   */
  exportToCSV: (filters = {}) => {
    return api.get('/vehicles/export/csv', {
      params: filters,
      responseType: 'blob',
    });
  },

  /**
   * Get vehicle statistics
   * @param {string} plateNumber - Vehicle plate number
   * @returns {Promise} Vehicle statistics
   */
  getVehicleStats: (plateNumber) => {
    return api.get(`/vehicles/${encodeURIComponent(plateNumber)}/stats`);
  },

  /**
   * Format plate number (uppercase, trim)
   * @param {string} plate - Plate number
   * @returns {string} Formatted plate number
   */
  formatPlateNumber: (plate) => {
    if (!plate) return '';
    return plate.toString().toUpperCase().trim();
  },

  /**
   * Validate plate number format
   * @param {string} plate - Plate number
   * @returns {boolean} Is valid
   */
  validatePlateNumber: (plate) => {
    if (!plate) return false;
    const formatted = vehicleService.formatPlateNumber(plate);
    // Basic validation: 2-15 characters, alphanumeric with hyphens
    return /^[A-Z0-9-]{2,15}$/.test(formatted);
  },

  /**
   * Calculate session statistics
   * @param {Array} sessions - Array of sessions
   * @returns {Object} Statistics
   */
  calculateStats: (sessions) => {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        totalRevenue: 0,
        totalDuration: 0,
        averageDuration: 0,
        averageAmount: 0,
      };
    }

    const totalSessions = sessions.length;
    const totalRevenue = sessions.reduce((sum, s) => sum + (s.calculated_amount || 0), 0);
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    return {
      totalSessions,
      totalRevenue,
      totalDuration,
      averageDuration: Math.round(totalDuration / totalSessions),
      averageAmount: Math.round(totalRevenue / totalSessions),
    };
  },
};

export default vehicleService;
