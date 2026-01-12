import api from './api';

const vehicleTypeService = {
  /**
   * Get all vehicle types with optional filters
   * @param {Object} params - Query parameters
   */
  getVehicleTypes: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/vehicle-types?${queryString}`);
  },

  /**
   * Get a single vehicle type by ID
   * @param {number} id - Vehicle type ID
   */
  getVehicleTypeById: (id) => api.get(`/vehicle-types/${id}`),

  /**
   * Create a new vehicle type
   * @param {Object} data - Vehicle type data
   * @param {string} data.name - Vehicle type name
   * @param {number} data.hourly_rate - Hourly rate
   * @param {boolean} data.is_active - Active status
   */
  createVehicleType: (data) => api.post('/vehicle-types', data),

  /**
   * Update an existing vehicle type
   * @param {number} id - Vehicle type ID
   * @param {Object} data - Updated vehicle type data
   */
  updateVehicleType: (id, data) => api.put(`/vehicle-types/${id}`, data),

  /**
   * Delete a vehicle type
   * @param {number} id - Vehicle type ID
   */
  deleteVehicleType: (id) => api.delete(`/vehicle-types/${id}`),

  /**
   * Toggle vehicle type active status
   * @param {number} id - Vehicle type ID
   * @param {boolean} isActive - New active status
   */
  toggleStatus: (id, isActive) => api.patch(`/vehicle-types/${id}/status`, { is_active: isActive }),

  /**
   * Get rate history for a vehicle type
   * @param {number} id - Vehicle type ID
   */
  getRateHistory: (id) => api.get(`/vehicle-types/${id}/rate-history`),

  /**
   * Get all rate history
   */
  getAllRateHistory: () => api.get('/vehicle-types/rate-history'),
};

export default vehicleTypeService;
