<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
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
