import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'

// PrimeIcons
import 'primeicons/primeicons.css'

// Global styles
import './assets/styles/main.css'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '[data-theme="dark"]',
      cssLayer: {
        name: 'primevue',
        order: 'primevue'
      }
    }
  }
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)

app.mount('#app')
