import api from './api';

const settingsService = {
  /**
   * Get all system settings
   */
  getSettings: () => api.get('/settings'),

  /**
   * Get setting by key
   * @param {string} key - Setting key
   */
  getSettingByKey: (key) => api.get(`/settings/${key}`),

  /**
   * Update a setting
   * @param {string} key - Setting key
   * @param {string|number} value - Setting value
   */
  updateSetting: (key, value) => api.put(`/settings/${key}`, { value }),

  /**
   * Update multiple settings at once
   * @param {Object} settings - Object with key-value pairs
   */
  updateSettings: (settings) => api.put('/settings', settings),
};

export default settingsService;
