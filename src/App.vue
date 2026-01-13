<script setup>
import { useAuthStore } from '@/stores/auth.store';
import Toast from 'primevue/toast';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuth();
});
</script>

<template>
  <div id="app">
    <Toast />
    <ConfirmDialog />
    <router-view />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}
</style>
