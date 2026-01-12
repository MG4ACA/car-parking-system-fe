<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found-page">
    <Card class="not-found-card">
      <template #content>
        <div class="not-found-content">
          <i class="pi pi-exclamation-circle" style="font-size: 4rem; color: var(--error-color);"></i>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist.</p>
          <Button label="Go to Dashboard" icon="pi pi-home" @click="router.push('/dashboard')" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.not-found-content {
  text-align: center;
  padding: var(--spacing-2xl);
}

.not-found-content h1 {
  font-size: 6rem;
  color: var(--text-primary);
  margin: var(--spacing-md) 0;
}

.not-found-content h2 {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.not-found-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}
</style>
