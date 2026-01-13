<script setup>
import { useNotification } from '@/composables/useNotification';
import { useUserStore } from '@/stores/user.store';
import { storeToRefs } from 'pinia';
import Tooltip from 'primevue/tooltip';
import { useConfirm } from 'primevue/useconfirm';
import { computed, onMounted, ref, watch } from 'vue';

import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Tag from 'primevue/tag';

import UserForm from '@/components/admin/UserForm.vue';

// Register tooltip directive
const vTooltip = Tooltip;

const userStore = useUserStore();
const { users, loading, pagination, filters } = storeToRefs(userStore);
const confirm = useConfirm();
const { success, error } = useNotification();

// Local state
const drawerVisible = ref(false);
const editingUser = ref(null);
const formMode = ref('create');
const globalFilterValue = ref('');
const resetPasswordDialog = ref(false);
const selectedUserForReset = ref(null);
const newPassword = ref('');

// Filter options
const roleOptions = [
  { label: 'All Roles', value: null },
  { label: 'Admin', value: 'admin' },
  { label: 'Operator', value: 'operator' },
  { label: 'Viewer', value: 'viewer' },
];

const statusOptions = [
  { label: 'All Status', value: null },
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
];

// Computed
const selectedRole = computed({
  get: () => filters.value.role,
  set: (value) => {
    userStore.setFilters({ role: value });
    loadUsers();
  },
});

const selectedStatus = computed({
  get: () => filters.value.isActive,
  set: (value) => {
    userStore.setFilters({ isActive: value });
    loadUsers();
  },
});

// Methods
const loadUsers = async () => {
  try {
    await userStore.fetchUsers();
  } catch (err) {
    console.error('Failed to load users:', err);
  }
};

const openCreateDrawer = () => {
  editingUser.value = null;
  formMode.value = 'create';
  drawerVisible.value = true;
};

const openEditDrawer = (user) => {
  editingUser.value = { ...user };
  formMode.value = 'edit';
  drawerVisible.value = true;
};

const closeDrawer = () => {
  drawerVisible.value = false;
  editingUser.value = null;
};

const handleFormSubmit = async (userData) => {
  try {
    if (formMode.value === 'create') {
      await userStore.createUser(userData);
    } else {
      await userStore.updateUser(editingUser.value.id, userData);
    }
    closeDrawer();
    loadUsers();
  } catch (err) {
    console.error('Failed to save user:', err);
  }
};

const handleDelete = (user) => {
  confirm.require({
    message: `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await userStore.deleteUser(user.id);
        loadUsers();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    },
  });
};

const handleToggleStatus = async (user) => {
  try {
    await userStore.toggleUserStatus(user.id, !user.is_active);
    loadUsers();
  } catch (err) {
    console.error('Failed to toggle user status:', err);
  }
};

const openResetPasswordDialog = (user) => {
  selectedUserForReset.value = user;
  newPassword.value = '';
  resetPasswordDialog.value = true;
};

const handleResetPassword = async () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    error('Password must be at least 6 characters');
    return;
  }

  try {
    await userStore.resetUserPassword(selectedUserForReset.value.id, newPassword.value);
    resetPasswordDialog.value = false;
    newPassword.value = '';
    selectedUserForReset.value = null;
  } catch (err) {
    console.error('Failed to reset password:', err);
  }
};

const onPageChange = (event) => {
  userStore.setCurrentPage(event.page + 1);
  loadUsers();
};

const onSearch = () => {
  userStore.setFilters({ search: globalFilterValue.value });
  loadUsers();
};

const clearFilters = () => {
  globalFilterValue.value = '';
  userStore.resetFilters();
  loadUsers();
};

const getRoleSeverity = (role) => {
  const severities = {
    admin: 'danger',
    operator: 'info',
    viewer: 'secondary',
  };
  return severities[role] || 'secondary';
};

const getStatusSeverity = (isActive) => {
  return isActive ? 'success' : 'danger';
};

// Watchers
watch(globalFilterValue, (newValue) => {
  if (newValue === '') {
    onSearch();
  }
});

// Lifecycle
onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="users-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">User Management</h1>
        <p class="page-description">Manage system users, roles, and permissions</p>
      </div>
      <Button label="Add User" icon="pi pi-plus" @click="openCreateDrawer" severity="primary" />
    </div>

    <div class="filters-section">
      <div class="filters-left">
        <span class="p-input-icon-left search-input">
          <i class="pi pi-search" />
          <InputText
            v-model="globalFilterValue"
            placeholder="Search by username or email..."
            @keyup.enter="onSearch"
            class="search-field"
          />
        </span>
        <Button icon="pi pi-search" label="Search" @click="onSearch" outlined />
      </div>

      <div class="filters-right">
        <Dropdown
          v-model="selectedRole"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Filter by Role"
          class="filter-dropdown"
        />
        <Dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Filter by Status"
          class="filter-dropdown"
        />
        <Button icon="pi pi-filter-slash" label="Clear" @click="clearFilters" text />
      </div>
    </div>

    <div class="table-container">
      <DataTable
        :value="users"
        :loading="loading"
        :paginator="true"
        :rows="pagination.itemsPerPage"
        :totalRecords="pagination.totalItems"
        :lazy="true"
        @page="onPageChange"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
        stripedRows
        class="users-table"
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-users" style="font-size: 3rem"></i>
            <p>No users found</p>
          </div>
        </template>

        <Column field="username" header="Username" sortable>
          <template #body="{ data }">
            <div class="user-info">
              <i class="pi pi-user user-icon"></i>
              <span class="username">{{ data.username }}</span>
            </div>
          </template>
        </Column>

        <Column field="email" header="Email" sortable></Column>

        <Column field="role" header="Role" sortable>
          <template #body="{ data }">
            <Tag :value="data.role.toUpperCase()" :severity="getRoleSeverity(data.role)" />
          </template>
        </Column>

        <Column field="assigned_station_id" header="Station">
          <template #body="{ data }">
            <span v-if="data.assigned_station_id">Station {{ data.assigned_station_id }}</span>
            <span v-else class="text-muted">N/A</span>
          </template>
        </Column>

        <Column field="is_active" header="Status" sortable>
          <template #body="{ data }">
            <Tag
              :value="data.is_active ? 'Active' : 'Inactive'"
              :severity="getStatusSeverity(data.is_active)"
            />
          </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 200px">
          <template #body="{ data }">
            <div class="action-buttons">
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="openEditDrawer(data)"
                v-tooltip.top="'Edit User'"
              />
              <Button
                icon="pi pi-key"
                severity="warning"
                text
                rounded
                @click="openResetPasswordDialog(data)"
                v-tooltip.top="'Reset Password'"
              />
              <Button
                :icon="data.is_active ? 'pi pi-ban' : 'pi pi-check'"
                :severity="data.is_active ? 'warning' : 'success'"
                text
                rounded
                @click="handleToggleStatus(data)"
                v-tooltip.top="data.is_active ? 'Deactivate' : 'Activate'"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="handleDelete(data)"
                v-tooltip.top="'Delete User'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- User Form Drawer -->
    <Drawer
      v-model:visible="drawerVisible"
      position="right"
      :header="formMode === 'create' ? 'Create New User' : 'Edit User'"
      class="user-drawer"
    >
      <UserForm
        :user="editingUser"
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="closeDrawer"
      />
    </Drawer>

    <!-- Reset Password Dialog -->
    <Dialog
      v-model:visible="resetPasswordDialog"
      header="Reset Password"
      :modal="true"
      :closable="true"
      class="reset-password-dialog"
    >
      <div class="dialog-content">
        <p class="dialog-message">
          Reset password for user:
          <strong>{{ selectedUserForReset?.username }}</strong>
        </p>
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <Password
            id="newPassword"
            v-model="newPassword"
            placeholder="Enter new password"
            :feedback="true"
            toggleMask
            class="w-full"
            inputClass="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" severity="secondary" outlined @click="resetPasswordDialog = false" />
        <Button label="Reset Password" severity="warning" @click="handleResetPassword" />
      </template>
    </Dialog>

    <!-- Confirm Dialog -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style scoped>
.users-view {
  padding: var(--spacing-lg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.page-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
}

.filters-left {
  display: flex;
  gap: var(--spacing-sm);
  flex: 1;
  max-width: 500px;
}

.search-input {
  flex: 1;
}

.search-field {
  width: 100%;
}

.filters-right {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.filter-dropdown {
  min-width: 160px;
}

.table-container {
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  padding: var(--spacing-md);
}

.users-table {
  font-size: 0.95rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-icon {
  color: var(--primary-color);
}

.username {
  font-weight: 500;
}

.text-muted {
  color: var(--text-secondary);
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-state i {
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}

.user-drawer {
  width: 500px;
}

.reset-password-dialog {
  width: 450px;
}

.dialog-content {
  padding: 1rem 0;
}

.dialog-message {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left,
  .filters-right {
    width: 100%;
    max-width: none;
  }

  .filters-right {
    flex-wrap: wrap;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .user-drawer {
    width: 100%;
  }
}
</style>
