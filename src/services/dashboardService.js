/**
 * Dashboard Service
 * Handles API calls for dashboard statistics and analytics
 */

import api from './api';

const dashboardService = {
  /**
   * Get dashboard statistics
   * Aggregated data for admin dashboard overview
   * @returns {Promise} Dashboard statistics
   */
  getStats: () => {
    return api.get('/dashboard/stats');
  },

  /**
   * Get recent parking sessions
   * @param {number} limit - Number of recent sessions to fetch
   * @returns {Promise} Recent sessions
   */
  getRecentSessions: (limit = 10) => {
    return api.get('/dashboard/recent-sessions', {
      params: { limit },
    });
  },

  /**
   * Get occupancy data for zones
   * @returns {Promise} Zone occupancy data
   */
  getZoneOccupancy: () => {
    return api.get('/dashboard/zone-occupancy');
  },

  /**
   * Get revenue analytics
   * @param {string} period - Time period (today, week, month, year)
   * @returns {Promise} Revenue data
   */
  getRevenue: (period = 'today') => {
    return api.get('/dashboard/revenue', {
      params: { period },
    });
  },
};

export default dashboardService;
