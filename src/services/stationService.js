import api from './api';

const stationService = {
  /**
   * Get all active stations
   */
  getActiveStations: () => api.get('/stations?isActive=true'),

  /**
   * Get all stations
   */
  getStations: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/stations?${queryString}`);
  },

  /**
   * Get station by ID
   */
  getStationById: (id) => api.get(`/stations/${id}`),
};

export default stationService;
