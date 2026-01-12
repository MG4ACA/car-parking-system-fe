import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isOperator = computed(() => user.value?.role === 'operator')
  const isViewer = computed(() => user.value?.role === 'viewer')

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        logout()
      }
    }
  }

  const updateUser = (updatedUser) => {
    user.value = { ...user.value, ...updatedUser }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  // Reset store
  const $reset = () => {
    user.value = null
    token.value = null
    loading.value = false
    error.value = null
  }

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
    initAuth,
    updateUser,
    $reset
  }
})
