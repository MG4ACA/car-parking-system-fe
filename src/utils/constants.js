// API Response Status
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer'
}

// Vehicle Types
export const VEHICLE_TYPES = {
  MOTORCYCLE: 'motorcycle',
  THREE_WHEEL: 'threewheel',
  CAR: 'car',
  SUV: 'suv',
  TRUCK: 'truck',
  OTHER: 'other'
}

// Parking Status
export const PARKING_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  OVERSTAY: 'overstay'
}

// Payment Status
export const PAYMENT_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid'
}

// Station Types
export const STATION_TYPES = {
  ENTRY: 'entry',
  EXIT: 'exit'
}

// Alert Types
export const ALERT_TYPES = {
  OVERSTAY: 'overstay',
  FULL: 'full',
  LOW_CAPACITY: 'low_capacity'
}

// Date Format
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const TIME_FORMAT = 'HH:mm:ss'

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Image
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
export const IMAGE_RETENTION_DAYS = 30

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  USERS: '/users',
  VEHICLE_TYPES: '/vehicle-types',
  ZONES: '/zones',
  STATIONS: '/stations',
  ENTRIES: '/entries',
  EXITS: '/exits',
  PARKING_SESSIONS: '/parking-sessions',
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  ALERTS: '/alerts'
}

// Notification Duration
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000
}
