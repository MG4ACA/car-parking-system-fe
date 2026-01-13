import { createRouter, createWebHistory } from 'vue-router';
import { authGuard, roleGuard } from './guards';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    beforeEnter: authGuard,
    meta: { requiresAuth: true },
  },
  {
    path: '/entry',
    name: 'EntryStation',
    component: () => import('@/views/entry/EntryStationView.vue'),
    beforeEnter: roleGuard(['admin', 'operator']),
    meta: { requiresAuth: true, roles: ['admin', 'operator'] },
  },
  {
    path: '/exit',
    name: 'ExitStation',
    component: () => import('@/views/exit/ExitStationView.vue'),
    beforeEnter: roleGuard(['admin', 'operator']),
    meta: { requiresAuth: true, roles: ['admin', 'operator'] },
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('@/views/vehicles/VehicleListView.vue'),
    beforeEnter: authGuard,
    meta: { requiresAuth: true },
  },
  {
    path: '/vehicles/:id',
    name: 'VehicleDetail',
    component: () => import('@/views/vehicles/VehicleDetailView.vue'),
    beforeEnter: authGuard,
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/reports/ReportsView.vue'),
    beforeEnter: authGuard,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/UsersView.vue'),
    beforeEnter: roleGuard(['admin']),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/zones',
    name: 'AdminZones',
    component: () => import('@/views/admin/ZonesView.vue'),
    beforeEnter: roleGuard(['admin']),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/stations',
    name: 'AdminStations',
    component: () => import('@/views/admin/StationsView.vue'),
    beforeEnter: roleGuard(['admin']),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/rates',
    name: 'AdminRates',
    component: () => import('@/views/admin/RatesView.vue'),
    beforeEnter: roleGuard(['admin']),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('@/views/admin/SettingsView.vue'),
    beforeEnter: roleGuard(['admin']),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/demo/image-processing',
    name: 'ImageDemo',
    component: () => import('@/views/ImageDemoView.vue'),
    beforeEnter: authGuard,
    meta: { requiresAuth: true },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/UnauthorizedView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
