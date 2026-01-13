<script setup>
import { ref } from 'vue';
import AppFooter from './AppFooter.vue';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';

const sidebarVisible = ref(true);

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div class="main-layout">
    <AppHeader @toggle-sidebar="toggleSidebar" />
    <div class="layout-container">
      <aside v-if="sidebarVisible" class="sidebar-wrapper">
        <AppSidebar />
      </aside>
      <main class="main-content">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--surface-ground);
}

.layout-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar-wrapper {
  width: 280px;
  background-color: var(--surface-section);
  border-right: 1px solid var(--surface-border);
  overflow-y: auto;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--surface-ground);
}

@media (max-width: 768px) {
  .sidebar-wrapper {
    width: 100%;
    position: absolute;
    left: -280px;
    top: 0;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
  }

  .sidebar-wrapper.visible {
    left: 0;
  }

  .main-content {
    width: 100%;
  }
}
</style>
