<script setup>
import { useSettingsStore } from '@/stores/settings.store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const settingsStore = useSettingsStore();
const { settings, loading } = storeToRefs(settingsStore);

const gracePeriod = ref(0);
const minimumCharge = ref(0);
const theme = ref('light');
const emailNotifications = ref(true);
const autoLogout = ref(true);
const saving = ref(false);

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Auto', value: 'auto' },
];

const hasChanges = computed(() => {
  const graceSetting = settingsStore.getSetting('grace_period');
  const minChargeSetting = settingsStore.getSetting('minimum_charge');
  const themeSetting = settingsStore.getSetting('theme');

  return (
    gracePeriod.value !== (graceSetting ? parseInt(graceSetting.value) : 0) ||
    minimumCharge.value !== (minChargeSetting ? parseFloat(minChargeSetting.value) : 0) ||
    theme.value !== (themeSetting ? themeSetting.value : 'light')
  );
});

const loadSettings = async () => {
  try {
    await settingsStore.fetchSettings();

    const graceSetting = settingsStore.getSetting('grace_period');
    const minChargeSetting = settingsStore.getSetting('minimum_charge');
    const themeSetting = settingsStore.getSetting('theme');

    gracePeriod.value = graceSetting ? parseInt(graceSetting.value) : 15;
    minimumCharge.value = minChargeSetting ? parseFloat(minChargeSetting.value) : 2.0;
    theme.value = themeSetting ? themeSetting.value : 'light';
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
};

const saveSettings = async () => {
  saving.value = true;
  try {
    const updates = [
      { key: 'grace_period', value: gracePeriod.value.toString() },
      { key: 'minimum_charge', value: minimumCharge.value.toString() },
      { key: 'theme', value: theme.value },
    ];

    for (const update of updates) {
      await settingsStore.updateSetting(update.key, update.value);
    }

    await loadSettings();
  } catch (err) {
    console.error('Failed to save settings:', err);
  } finally {
    saving.value = false;
  }
};

const resetToDefaults = () => {
  gracePeriod.value = 15;
  minimumCharge.value = 2.0;
  theme.value = 'light';
};

onMounted(() => {
  loadSettings();
});
</script>

<template>
  <div class="settings-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">System Settings</h1>
        <p class="page-description">Configure system-wide settings and preferences</p>
      </div>
      <div class="header-actions">
        <Button
          label="Reset to Defaults"
          icon="pi pi-refresh"
          outlined
          severity="secondary"
          @click="resetToDefaults"
          :disabled="loading"
        />
        <Button
          label="Save Changes"
          icon="pi pi-save"
          @click="saveSettings"
          :disabled="!hasChanges || loading"
          :loading="saving"
        />
      </div>
    </div>

    <div class="settings-grid">
      <!-- Parking Configuration -->
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-car"></i>
            <span>Parking Configuration</span>
          </div>
        </template>
        <template #content>
          <div class="setting-item">
            <div class="setting-label">
              <label for="grace-period">Grace Period (minutes)</label>
              <small>Free parking duration before charging begins</small>
            </div>
            <div class="setting-control">
              <InputNumber
                id="grace-period"
                v-model="gracePeriod"
                :min="0"
                :max="60"
                :step="5"
                suffix=" min"
                showButtons
                :disabled="loading"
              />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">
              <label for="min-charge">Minimum Charge</label>
              <small>Minimum parking fee regardless of duration</small>
            </div>
            <div class="setting-control">
              <InputNumber
                id="min-charge"
                v-model="minimumCharge"
                :min="0"
                :max="100"
                :step="0.5"
                mode="currency"
                currency="USD"
                :minFractionDigits="2"
                :disabled="loading"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Appearance Settings -->
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-palette"></i>
            <span>Appearance</span>
          </div>
        </template>
        <template #content>
          <div class="setting-item">
            <div class="setting-label">
              <label for="theme">Theme</label>
              <small>Choose your preferred color scheme</small>
            </div>
            <div class="setting-control">
              <Dropdown
                id="theme"
                v-model="theme"
                :options="themeOptions"
                optionLabel="label"
                optionValue="value"
                :disabled="loading"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Notification Settings (Placeholder) -->
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-bell"></i>
            <span>Notifications</span>
          </div>
        </template>
        <template #content>
          <div class="setting-item">
            <div class="setting-label">
              <label for="email-notif">Email Notifications</label>
              <small>Receive email alerts for important events</small>
            </div>
            <div class="setting-control">
              <InputSwitch id="email-notif" v-model="emailNotifications" disabled />
            </div>
          </div>

          <small class="coming-soon">
            <i class="pi pi-info-circle"></i>
            Notification settings coming in future updates
          </small>
        </template>
      </Card>

      <!-- Security Settings (Placeholder) -->
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-shield"></i>
            <span>Security</span>
          </div>
        </template>
        <template #content>
          <div class="setting-item">
            <div class="setting-label">
              <label for="auto-logout">Auto Logout</label>
              <small>Automatically logout after inactivity</small>
            </div>
            <div class="setting-control">
              <InputSwitch id="auto-logout" v-model="autoLogout" disabled />
            </div>
          </div>

          <small class="coming-soon">
            <i class="pi pi-info-circle"></i>
            Security settings coming in future updates
          </small>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
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

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
}

.settings-card {
  box-shadow: var(--card-shadow);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.card-title i {
  color: var(--primary-color);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--surface-border);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex: 1;
  margin-right: 1rem;
}

.setting-label label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.setting-label small {
  display: block;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.setting-control {
  min-width: 200px;
}

.coming-soon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--surface-50);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.coming-soon i {
  color: var(--primary-color);
}

@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .setting-control {
    width: 100%;
  }
}
</style>
