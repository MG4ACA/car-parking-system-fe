import api from './api';

const stationService = {
  /**
   * Get all stations with optional filters
   * @param {Object} params - Query parameters
   */
  getStations: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/stations?${queryString}`);
  },

  /**
   * Get station by ID
   * @param {number} id - Station ID
   */
  getStationById: (id) => api.get(`/stations/${id}`),

  /**
   * Create a new station
   * @param {Object} data - Station data
   */
  createStation: (data) => api.post('/stations', data),

  /**
   * Update an existing station
   * @param {number} id - Station ID
   * @param {Object} data - Updated station data
   */
  updateStation: (id, data) => api.put(`/stations/${id}`, data),

  /**
   * Delete a station
   * @param {number} id - Station ID
   */
  deleteStation: (id) => api.delete(`/stations/${id}`),

  /**
   * Toggle station active status
   * @param {number} id - Station ID
   * @param {boolean} isActive - New active status
   */
  toggleStatus: (id, isActive) => api.patch(`/stations/${id}/status`, { is_active: isActive }),

  /**
   * Get active stations only
   */
  getActiveStations: () => api.get('/stations?isActive=true'),
};

export default stationService;
