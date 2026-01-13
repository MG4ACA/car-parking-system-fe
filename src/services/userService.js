import api from './api';

const userService = {
  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.role - Filter by role
   * @param {boolean} params.isActive - Filter by active status
   * @param {string} params.search - Search by username or email
   */
  getUsers: (params = {}) => {
    // Filter out null values and convert camelCase to snake_case
    const cleanParams = {};
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.limit !== undefined) cleanParams.limit = params.limit;
    if (params.role !== null && params.role !== undefined) cleanParams.role = params.role;
    if (params.isActive !== null && params.isActive !== undefined)
      cleanParams.is_active = params.isActive;
    if (params.search !== null && params.search !== undefined && params.search !== '')
      cleanParams.search = params.search;

    const queryString = new URLSearchParams(cleanParams).toString();
    return api.get(`/users${queryString ? '?' + queryString : ''}`);
  },

  /**
   * Get a single user by ID
   * @param {number} id - User ID
   */
  getUserById: (id) => api.get(`/users/${id}`),

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email
   * @param {string} userData.password - Password
   * @param {string} userData.role - Role (admin/operator/viewer)
   * @param {number} userData.assigned_station_id - Assigned station ID
   * @param {boolean} userData.is_active - Active status
   */
  createUser: (userData) => api.post('/users', userData),

  /**
   * Update an existing user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   */
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),

  /**
   * Delete a user
   * @param {number} id - User ID
   */
  deleteUser: (id) => api.delete(`/users/${id}`),

  /**
   * Reset user password (admin only)
   * @param {number} id - User ID
   * @param {string} newPassword - New password
   */
  resetUserPassword: (id, newPassword) => api.put(`/users/${id}/reset-password`, { newPassword }),

  /**
   * Change own password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   */
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),

  /**
   * Toggle user active status
   * @param {number} id - User ID
   * @param {boolean} isActive - New active status
   */
  toggleUserStatus: (id, isActive) => api.patch(`/users/${id}/status`, { is_active: isActive }),
};

export default userService;
