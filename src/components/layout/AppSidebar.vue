<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const menuItems = computed(() => {
  const items = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => router.push('/dashboard'),
    },
  ];

  if (authStore.isAdmin || authStore.isOperator) {
    items.push({
      key: 'stations',
      label: 'Stations',
      icon: 'pi pi-car',
      items: [
        {
          key: 'entry',
          label: 'Entry Station',
          icon: 'pi pi-sign-in',
          command: () => router.push('/entry'),
        },
        {
          key: 'exit',
          label: 'Exit Station',
          icon: 'pi pi-sign-out',
          command: () => router.push('/exit'),
        },
      ],
    });
  }

  items.push({
    key: 'vehicles',
    label: 'Vehicles',
    icon: 'pi pi-list',
    command: () => router.push('/vehicles'),
  });

  items.push({
    key: 'reports',
    label: 'Reports',
    icon: 'pi pi-chart-bar',
    command: () => router.push('/reports'),
  });

  if (authStore.isAdmin) {
    items.push({
      key: 'admin',
      label: 'Administration',
      icon: 'pi pi-cog',
      items: [
        {
          key: 'users',
          label: 'Users',
          icon: 'pi pi-users',
          command: () => router.push('/admin/users'),
        },
        {
          key: 'zones',
          label: 'Zones',
          icon: 'pi pi-map',
          command: () => router.push('/admin/zones'),
        },
        {
          key: 'stations',
          label: 'Stations',
          icon: 'pi pi-building',
          command: () => router.push('/admin/stations'),
        },
        {
          key: 'rates',
          label: 'Rates',
          icon: 'pi pi-money-bill',
          command: () => router.push('/admin/rates'),
        },
        {
          key: 'settings',
          label: 'Settings',
          icon: 'pi pi-sliders-h',
          command: () => router.push('/admin/settings'),
        },
      ],
    });
  }

  return items;
});
</script>

<template>
  <aside class="app-sidebar">
    <PanelMenu :model="menuItems" class="w-full" />
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 280px;
  height: calc(100vh - 60px);
  background: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  overflow-y: auto;
  position: sticky;
  top: 60px;
}

@media (max-width: 768px) {
  .app-sidebar {
    display: none;
  }
}
</style>
