import api from './api'

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData)
}

export default authService
