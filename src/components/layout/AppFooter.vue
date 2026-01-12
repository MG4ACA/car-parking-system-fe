<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="font-semibold">Car Parking System</span>
        <span class="text-500 ml-2">v1.0.0</span>
      </div>
      <div class="footer-center">
        <span class="text-500">© {{ currentYear }} All rights reserved</span>
      </div>
      <div class="footer-right">
        <a href="#" class="footer-link">Privacy Policy</a>
        <span class="mx-2">•</span>
        <a href="#" class="footer-link">Terms of Service</a>
        <span class="mx-2">•</span>
        <a href="#" class="footer-link">Support</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--surface-card);
  border-top: 1px solid var(--surface-border);
  padding: 1rem 2rem;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-left,
.footer-center,
.footer-right {
  display: flex;
  align-items: center;
}

.footer-link {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-left,
  .footer-center,
  .footer-right {
    justify-content: center;
    width: 100%;
  }
}
</style>
