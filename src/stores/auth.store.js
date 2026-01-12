import authService from '@/services/authService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isOperator = computed(() => user.value?.role === 'operator');
  const isViewer = computed(() => user.value?.role === 'viewer');

  // Actions
  const login = async (credentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      // Backend returns { accessToken, refreshToken, user }
      token.value = response.data.accessToken;
      user.value = response.data.user;

      // Store in localStorage or sessionStorage based on rememberMe
      if (credentials.rememberMe) {
        localStorage.setItem('token', token.value);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(user.value));
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('token', token.value);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
        sessionStorage.setItem('user', JSON.stringify(user.value));
        localStorage.removeItem('rememberMe');
      }

      return response;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      // Backend returns { accessToken }
      token.value = response.accessToken;

      // Update token in storage
      const rememberMe = localStorage.getItem('rememberMe');
      if (rememberMe) {
        localStorage.setItem('token', token.value);
      } else {
        sessionStorage.setItem('token', token.value);
      }

      return token.value;
    } catch (err) {
      logout();
      throw err;
    }
  };

  const initAuth = () => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = JSON.parse(storedUser);
      } catch (e) {
        logout();
      }
    }
  };

  const updateUser = (updatedUser) => {
    user.value = { ...user.value, ...updatedUser };

    // Update in the correct storage based on rememberMe
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(user.value));
    } else {
      sessionStorage.setItem('user', JSON.stringify(user.value));
    }
  };

  // Reset store
  const $reset = () => {
    user.value = null;
    token.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isOperator,
    isViewer,
    // Actions
    login,
    logout,
    refreshToken,
    initAuth,
    updateUser,
    $reset,
  };
});
