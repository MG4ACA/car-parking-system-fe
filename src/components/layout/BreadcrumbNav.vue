<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbItems = computed(() => {
  const items = [];
  const pathArray = route.path.split('/').filter(Boolean);

  // Add home
  items.push({
    label: 'Home',
    icon: 'pi pi-home',
    to: '/dashboard',
  });

  // Build breadcrumb from path
  let currentPath = '';
  pathArray.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Format segment for display
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    items.push({
      label: label,
      to: currentPath,
    });
  });

  return items;
});

const home = computed(() => ({
  icon: 'pi pi-home',
  to: '/dashboard',
}));
</script>

<template>
  <nav class="breadcrumb-nav" v-if="breadcrumbItems.length > 1">
    <Breadcrumb :model="breadcrumbItems" :home="home" class="bg-transparent border-none p-0">
      <template #item="{ item }">
        <router-link v-if="item.to" :to="item.to" class="breadcrumb-item">
          <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
          <span>{{ item.label }}</span>
        </router-link>
        <span v-else class="breadcrumb-item">
          <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
          <span>{{ item.label }}</span>
        </span>
      </template>
    </Breadcrumb>
  </nav>
</template>

<style scoped>
.breadcrumb-nav {
  padding: 1rem 2rem;
  background: var(--surface-ground);
  border-bottom: 1px solid var(--surface-border);
}

.breadcrumb-item {
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .breadcrumb-nav {
    padding: 0.75rem 1rem;
  }
}
</style>
