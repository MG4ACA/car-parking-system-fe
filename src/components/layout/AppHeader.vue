<script setup>
import { useAuthStore } from '@/stores/auth.store';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const emit = defineEmits(['toggle-sidebar']);

const userMenu = ref();
const userMenuItems = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => router.push('/profile'),
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => router.push('/settings'),
    visible: () => authStore.isAdmin,
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => handleLogout(),
  },
]);

const menuItems = computed(() => {
  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => router.push('/dashboard'),
    },
  ];

  if (authStore.isAdmin || authStore.isOperator) {
    items.push({
      label: 'Stations',
      icon: 'pi pi-car',
      items: [
        {
          label: 'Entry Station',
          icon: 'pi pi-sign-in',
          command: () => router.push('/entry'),
        },
        {
          label: 'Exit Station',
          icon: 'pi pi-sign-out',
          command: () => router.push('/exit'),
        },
      ],
    });
  }

  items.push({
    label: 'Vehicles',
    icon: 'pi pi-list',
    command: () => router.push('/vehicles'),
  });

  items.push({
    label: 'Reports',
    icon: 'pi pi-chart-bar',
    command: () => router.push('/reports'),
  });

  if (authStore.isAdmin) {
    items.push({
      label: 'Admin',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Users',
          icon: 'pi pi-users',
          command: () => router.push('/admin/users'),
        },
        {
          label: 'Zones',
          icon: 'pi pi-map',
          command: () => router.push('/admin/zones'),
        },
        {
          label: 'Stations',
          icon: 'pi pi-building',
          command: () => router.push('/admin/stations'),
        },
        {
          label: 'Rates',
          icon: 'pi pi-money-bill',
          command: () => router.push('/admin/rates'),
        },
        {
          label: 'Settings',
          icon: 'pi pi-sliders-h',
          command: () => router.push('/admin/settings'),
        },
      ],
    });
  }

  return items;
});

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <header class="app-header">
    <Menubar :model="menuItems" class="app-menubar">
      <template #start>
        <Button
          icon="pi pi-bars"
          severity="secondary"
          text
          rounded
          @click="emit('toggle-sidebar')"
          class="md:hidden"
        />
        <div class="app-logo">
          <i class="pi pi-car text-3xl mr-2"></i>
          <span class="font-bold text-xl">Car Parking</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-3">
          <Button
            icon="pi pi-bell"
            severity="secondary"
            text
            rounded
            badge="3"
            badgeClass="p-badge-danger"
          />
          <div class="user-profile" @click="toggleUserMenu">
            <Avatar
              icon="pi pi-user"
              size="large"
              shape="circle"
              style="background-color: var(--primary-color); color: white; cursor: pointer"
            />
            <div class="user-info ml-2 hidden md:block">
              <div class="font-semibold">{{ authStore.user?.username }}</div>
              <div class="text-sm text-500">{{ authStore.user?.role }}</div>
            </div>
          </div>
          <Menu ref="userMenu" :model="userMenuItems" popup />
        </div>
      </template>
    </Menubar>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
}

.app-menubar {
  border: none;
  border-radius: 0;
}

.app-logo {
  display: flex;
  align-items: center;
  color: var(--primary-color);
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: var(--surface-hover);
}

.user-info {
  text-align: left;
}
</style>
