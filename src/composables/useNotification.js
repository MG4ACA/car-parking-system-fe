import { useToast } from 'primevue/usetoast'

export const useNotification = () => {
  const toast = useToast()

  const success = (message, detail = '') => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: detail || message,
      life: 3000
    })
  }

  const error = (message, detail = '') => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: detail || message,
      life: 5000
    })
  }

  const warning = (message, detail = '') => {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: detail || message,
      life: 4000
    })
  }

  const info = (message, detail = '') => {
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: detail || message,
      life: 3000
    })
  }

  return { success, error, warning, info }
}
