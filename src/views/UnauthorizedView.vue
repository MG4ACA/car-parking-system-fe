<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="unauthorized-page">
    <Card class="unauthorized-card">
      <template #content>
        <div class="unauthorized-content">
          <i class="pi pi-lock" style="font-size: 4rem; color: var(--warning-color)"></i>
          <h1>403</h1>
          <h2>Unauthorized Access</h2>
          <p>You don't have permission to access this page.</p>
          <Button label="Go Back" icon="pi pi-arrow-left" @click="router.back()" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.unauthorized-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.unauthorized-content {
  text-align: center;
  padding: var(--spacing-2xl);
}

.unauthorized-content h1 {
  font-size: 6rem;
  color: var(--text-primary);
  margin: var(--spacing-md) 0;
}

.unauthorized-content h2 {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.unauthorized-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}
</style>
