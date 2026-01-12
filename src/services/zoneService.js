import api from './api';

const zoneService = {
  /**
   * Get all parking zones with optional filters
   * @param {Object} params - Query parameters
   */
  getZones: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/zones?${queryString}`);
  },

  /**
   * Get a single zone by ID
   * @param {number} id - Zone ID
   */
  getZoneById: (id) => api.get(`/zones/${id}`),

  /**
   * Create a new zone
   * @param {Object} data - Zone data
   * @param {string} data.name - Zone name
   * @param {number} data.capacity - Zone capacity
   * @param {boolean} data.is_active - Active status
   */
  createZone: (data) => api.post('/zones', data),

  /**
   * Update an existing zone
   * @param {number} id - Zone ID
   * @param {Object} data - Updated zone data
   */
  updateZone: (id, data) => api.put(`/zones/${id}`, data),

  /**
   * Delete a zone
   * @param {number} id - Zone ID
   */
  deleteZone: (id) => api.delete(`/zones/${id}`),

  /**
   * Toggle zone active status
   * @param {number} id - Zone ID
   * @param {boolean} isActive - New active status
   */
  toggleStatus: (id, isActive) => api.patch(`/zones/${id}/status`, { is_active: isActive }),

  /**
   * Get active zones only
   */
  getActiveZones: () => api.get('/zones?isActive=true'),
};

export default zoneService;
