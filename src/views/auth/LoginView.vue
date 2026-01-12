<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNotification } from '@/composables/useNotification'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()
const { success, error } = useNotification()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    })
    
    success('Login successful')
    router.push('/dashboard')
  } catch (err) {
    error(err.response?.data?.error?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <Card class="login-card">
        <template #title>
          <div class="text-center">
            <h1>Car Parking System</h1>
          </div>
        </template>
        <template #content>
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <InputText 
                id="email"
                v-model="form.email" 
                type="email" 
                placeholder="Enter your email"
                class="w-full"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <Password 
                id="password"
                v-model="form.password" 
                placeholder="Enter your password"
                :feedback="false"
                toggleMask
                class="w-full"
                inputClass="w-full"
                required
              />
            </div>

            <Button 
              type="submit" 
              label="Login" 
              :loading="loading"
              class="w-full"
              severity="primary"
            />
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-lg);
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}
</style>
