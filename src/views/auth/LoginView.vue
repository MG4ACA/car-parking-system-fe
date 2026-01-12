<script setup>
import { useNotification } from '@/composables/useNotification';
import { useAuthStore } from '@/stores/auth.store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

const router = useRouter();
const authStore = useAuthStore();
const { success, error } = useNotification();

const form = ref({
  email: '',
  password: '',
  rememberMe: false,
});

const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
      rememberMe: form.value.rememberMe,
    });

    success('Login successful');
    router.push('/dashboard');
  } catch (err) {
    error(err.response?.data?.error?.message || 'Login failed');
  } finally {
    loading.value = false;
  }
};
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

            <div class="form-extras">
              <div class="remember-me">
                <Checkbox v-model="form.rememberMe" inputId="rememberMe" :binary="true" />
                <label for="rememberMe">Remember me</label>
              </div>
              <a href="#" class="forgot-password" @click.prevent>Forgot Password?</a>
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

.form-extras {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.remember-me label {
  font-size: 0.9rem;
  cursor: pointer;
  margin: 0;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: var(--primary-color-dark);
  text-decoration: underline;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}
</style>
