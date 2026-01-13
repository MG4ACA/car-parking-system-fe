<script setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, ref } from 'vue';

const props = defineProps({
  searching: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['search']);

// Local state
const searchInput = ref('');

// Computed
const canSearch = computed(() => {
  return searchInput.value.trim().length >= 3 && !props.searching && !props.disabled;
});

// Methods
const handleSearch = () => {
  if (canSearch.value) {
    const query = searchInput.value.trim().toUpperCase();
    emit('search', query);
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};

const clearSearch = () => {
  searchInput.value = '';
};
</script>

<template>
  <Card class="vehicle-search">
    <template #content>
      <div class="search-container">
        <div class="search-header">
          <h3>Search Vehicle</h3>
          <span class="search-hint">Enter license plate number</span>
        </div>

        <div class="search-input-group">
          <span class="p-input-icon-left search-wrapper">
            <i class="pi pi-search"></i>
            <InputText
              v-model="searchInput"
              placeholder="Enter plate number (e.g., ABC-1234)"
              :disabled="disabled || searching"
              class="search-input"
              @keypress="handleKeyPress"
            />
          </span>

          <Button
            v-if="searchInput"
            icon="pi pi-times"
            rounded
            text
            severity="secondary"
            class="clear-button"
            :disabled="searching"
            @click="clearSearch"
          />
        </div>

        <div class="search-actions">
          <Button
            label="Search Vehicle"
            icon="pi pi-search"
            :loading="searching"
            :disabled="!canSearch"
            class="search-button"
            @click="handleSearch"
          />
        </div>

        <div v-if="searching" class="searching-indicator">
          <ProgressSpinner style="width: 30px; height: 30px" stroke-width="4" />
          <span>Searching for vehicle...</span>
        </div>

        <div class="search-tips">
          <div class="tip">
            <i class="pi pi-info-circle"></i>
            <span>Search for active parking sessions by license plate number</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.vehicle-search {
  width: 100%;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.search-header h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.search-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.search-wrapper {
  flex: 1;
}

.search-input {
  width: 100%;
  font-size: 1.125rem;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  text-transform: uppercase;
}

.clear-button {
  position: absolute;
  right: 0.5rem;
}

.search-actions {
  display: flex;
  justify-content: center;
}

.search-button {
  min-width: 200px;
}

.searching-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--blue-50);
  border-radius: 8px;
  color: var(--blue-700);
}

.search-tips {
  margin-top: var(--spacing-sm);
}

.tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--surface-50);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.tip i {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .search-input {
    font-size: 1rem;
  }

  .search-button {
    width: 100%;
  }
}
</style>
