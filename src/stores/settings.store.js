import { useNotification } from '@/composables/useNotification';
import settingsService from '@/services/settingsService';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const { success, error: showError } = useNotification();

  // State
  const settings = ref({});
  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchSettings = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await settingsService.getSettings();
      // Convert array of settings to object for easier access
      settings.value = response.data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch settings';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchSettingByKey = async (key) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await settingsService.getSettingByKey(key);
      settings.value[key] = response.data.value;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch setting';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (key, value) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await settingsService.updateSetting(key, value);
      settings.value[key] = value;

      success('Setting updated successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update setting';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSettings = async (settingsData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await settingsService.updateSettings(settingsData);

      // Update all settings in state
      Object.keys(settingsData).forEach((key) => {
        settings.value[key] = settingsData[key];
      });

      success('Settings updated successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update settings';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Reset store
  const $reset = () => {
    settings.value = {};
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    settings,
    loading,
    error,
    // Actions
    fetchSettings,
    fetchSettingByKey,
    updateSetting,
    updateSettings,
    $reset,
  };
});
