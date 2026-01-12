import { useNotification } from '@/composables/useNotification';
import userService from '@/services/userService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const { success, error: showError } = useNotification();

  // State
  const users = ref([]);
  const currentUser = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Filters
  const filters = ref({
    role: null,
    isActive: null,
    search: '',
  });

  // Getters
  const activeUsers = computed(() => users.value.filter((user) => user.is_active));
  const inactiveUsers = computed(() => users.value.filter((user) => !user.is_active));
  const adminUsers = computed(() => users.value.filter((user) => user.role === 'admin'));
  const operatorUsers = computed(() => users.value.filter((user) => user.role === 'operator'));
  const viewerUsers = computed(() => users.value.filter((user) => user.role === 'viewer'));

  // Actions
  const fetchUsers = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const queryParams = {
        page: params.page || pagination.value.currentPage,
        limit: params.limit || pagination.value.itemsPerPage,
        ...filters.value,
        ...params,
      };

      const response = await userService.getUsers(queryParams);
      users.value = response.data.users || response.data;

      if (response.pagination) {
        pagination.value = response.pagination;
      }

      return response;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch users';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchUserById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await userService.getUserById(id);
      currentUser.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch user';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await userService.createUser(userData);
      users.value.unshift(response.data);

      success('User created successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to create user';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id, userData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await userService.updateUser(id, userData);

      // Update user in list
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = response.data;
      }

      success('User updated successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update user';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      await userService.deleteUser(id);

      // Remove user from list
      users.value = users.value.filter((u) => u.id !== id);

      success('User deleted successfully');
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to delete user';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetUserPassword = async (id, newPassword) => {
    loading.value = true;
    error.value = null;

    try {
      await userService.resetUserPassword(id, newPassword);
      success('Password reset successfully');
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to reset password';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const changePassword = async (passwordData) => {
    loading.value = true;
    error.value = null;

    try {
      await userService.changePassword(passwordData);
      success('Password changed successfully');
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to change password';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleUserStatus = async (id, isActive) => {
    loading.value = true;
    error.value = null;

    try {
      await userService.toggleUserStatus(id, isActive);

      // Update user in list
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index].is_active = isActive;
      }

      success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update user status';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const resetFilters = () => {
    filters.value = {
      role: null,
      isActive: null,
      search: '',
    };
  };

  const setCurrentPage = (page) => {
    pagination.value.currentPage = page;
  };

  const clearCurrentUser = () => {
    currentUser.value = null;
  };

  // Reset store
  const $reset = () => {
    users.value = [];
    currentUser.value = null;
    loading.value = false;
    error.value = null;
    pagination.value = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    };
    filters.value = {
      role: null,
      isActive: null,
      search: '',
    };
  };

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    pagination,
    filters,
    // Getters
    activeUsers,
    inactiveUsers,
    adminUsers,
    operatorUsers,
    viewerUsers,
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    changePassword,
    toggleUserStatus,
    setFilters,
    resetFilters,
    setCurrentPage,
    clearCurrentUser,
    $reset,
  };
});
