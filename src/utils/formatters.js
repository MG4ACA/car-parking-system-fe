/**
 * Format date to locale string
 * @param {Date|string} date 
 * @param {string} locale 
 * @returns {string}
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString(locale)
}

/**
 * Format datetime to locale string
 * @param {Date|string} datetime 
 * @param {string} locale 
 * @returns {string}
 */
export const formatDateTime = (datetime, locale = 'en-US') => {
  if (!datetime) return ''
  const d = new Date(datetime)
  return d.toLocaleString(locale)
}

/**
 * Format time to locale string
 * @param {Date|string} time 
 * @param {string} locale 
 * @returns {string}
 */
export const formatTime = (time, locale = 'en-US') => {
  if (!time) return ''
  const d = new Date(time)
  return d.toLocaleTimeString(locale)
}

/**
 * Format currency
 * @param {number} amount 
 * @param {string} currency 
 * @param {string} locale 
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return ''
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Format number with thousand separator
 * @param {number} num 
 * @param {string} locale 
 * @returns {string}
 */
export const formatNumber = (num, locale = 'en-US') => {
  if (num === null || num === undefined) return ''
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Calculate duration between two dates
 * @param {Date|string} start 
 * @param {Date|string} end 
 * @returns {string}
 */
export const calculateDuration = (start, end) => {
  if (!start || !end) return ''
  
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = endDate - startDate
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

/**
 * Calculate duration in minutes
 * @param {Date|string} start 
 * @param {Date|string} end 
 * @returns {number}
 */
export const calculateDurationInMinutes = (start, end) => {
  if (!start || !end) return 0
  
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = endDate - startDate
  
  return Math.floor(diff / (1000 * 60))
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const past = new Date(date)
  const diff = now - past
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

/**
 * Truncate text
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitalize first letter
 * @param {string} str 
 * @returns {string}
 */
export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Format file size
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
