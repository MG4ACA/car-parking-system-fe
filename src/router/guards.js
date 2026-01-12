import { useAuthStore } from '@/stores/auth.store'

export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
}

export const roleGuard = (allowedRoles) => {
  return (to, from, next) => {
    const authStore = useAuthStore()
    
    if (!authStore.isAuthenticated) {
      next('/login')
    } else if (!allowedRoles.includes(authStore.user?.role)) {
      next('/unauthorized')
    } else {
      next()
    }
  }
}
