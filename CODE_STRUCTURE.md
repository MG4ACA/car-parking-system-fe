# Car Parking System - Code Structure & Standards

## Project Architecture

### Backend Architecture (Express.js)

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MySQL connection
│   │   ├── jwt.js           # JWT configuration
│   │   └── logger.js        # Winston logger setup
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── rbac.js          # Role-based access control
│   │   ├── validation.js    # Request validation
│   │   ├── errorHandler.js  # Global error handler
│   │   └── upload.js        # Image upload handling
│   ├── models/              # Database models (Sequelize ORM)
│   │   ├── User.js
│   │   ├── ParkingZone.js
│   │   ├── VehicleType.js
│   │   ├── ParkingStation.js
│   │   ├── ParkingSession.js
│   │   ├── SystemSetting.js
│   │   ├── RateHistory.js
│   │   ├── Alert.js
│   │   └── ActivityLog.js
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── vehicleTypeController.js
│   │   ├── zoneController.js
│   │   ├── stationController.js
│   │   ├── entryController.js
│   │   ├── exitController.js
│   │   ├── dashboardController.js
│   │   ├── reportController.js
│   │   ├── settingsController.js
│   │   └── alertController.js
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── imageService.js
│   │   ├── ocrService.js    # Google Vision API integration
│   │   ├── priceCalculationService.js
│   │   ├── receiptService.js # PDF generation
│   │   ├── exportService.js  # CSV/PDF exports
│   │   ├── alertService.js
│   │   ├── cleanupService.js # Image cleanup scheduler
│   │   └── activityLogService.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── vehicleType.routes.js
│   │   ├── zone.routes.js
│   │   ├── station.routes.js
│   │   ├── entry.routes.js
│   │   ├── exit.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── report.routes.js
│   │   ├── settings.routes.js
│   │   └── alert.routes.js
│   ├── utils/               # Utility functions
│   │   ├── responseHelper.js
│   │   ├── dateHelper.js
│   │   ├── validationSchemas.js
│   │   ├── constants.js
│   │   └── errorTypes.js
│   ├── validators/          # Joi/Yup validation schemas
│   │   ├── authValidator.js
│   │   ├── userValidator.js
│   │   ├── entryValidator.js
│   │   └── exitValidator.js
│   ├── database/            # Database migrations & seeds
│   │   ├── migrations/
│   │   └── seeds/
│   ├── jobs/                # Scheduled jobs
│   │   ├── imageCleanup.js
│   │   └── overstayAlerts.js
│   └── app.js               # Express app initialization
├── uploads/                 # Image storage directory
│   ├── entry/
│   └── exit/
├── tests/                   # Test files
├── .env.example
├── .gitignore
└── package.json
```

### Frontend Architecture (Vue 3 + PrimeVue)

```
frontend/
├── public/
├── src/
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       ├── main.css
│   │       ├── variables.css  # Theme variables
│   │       └── utilities.css
│   ├── components/          # Reusable components
│   │   ├── common/          # Generic components (PrimeVue wrappers & custom)
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseSelect.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── BaseTable.vue
│   │   │   ├── BasePagination.vue
│   │   │   ├── BaseCard.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── ErrorMessage.vue
│   │   │   └── ConfirmDialog.vue
│   │   ├── layout/          # Layout components
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── BreadcrumbNav.vue
│   │   ├── auth/            # Auth related
│   │   │   ├── LoginForm.vue
│   │   │   └── PasswordReset.vue
│   │   ├── dashboard/       # Dashboard widgets
│   │   │   ├── StatCard.vue
│   │   │   ├── ZoneOccupancy.vue
│   │   │   ├── ActiveVehicles.vue
│   │   │   └── RecentActivity.vue
│   │   ├── entry/           # Entry station components
│   │   │   ├── ImageCapture.vue
│   │   │   ├── VehicleTypeSelector.vue
│   │   │   ├── ZoneSelector.vue
│   │   │   └── EntryConfirmation.vue
│   │   ├── exit/            # Exit station components
│   │   │   ├── VehicleSearch.vue
│   │   │   ├── BillDisplay.vue
│   │   │   ├── PaymentStatus.vue
│   │   │   └── GateControl.vue
│   │   ├── vehicle/         # Vehicle management
│   │   │   ├── VehicleList.vue
│   │   │   ├── VehicleDetails.vue
│   │   │   ├── VehicleFilters.vue
│   │   │   └── ImageGallery.vue
│   │   ├── admin/           # Admin components
│   │   │   ├── UserForm.vue
│   │   │   ├── UserList.vue
│   │   │   ├── ZoneForm.vue
│   │   │   ├── StationForm.vue
│   │   │   ├── RateConfig.vue
│   │   │   └── SystemSettings.vue
│   │   ├── reports/         # Report components
│   │   │   ├── DateRangePicker.vue
│   │   │   ├── ReportFilters.vue
│   │   │   ├── ReportTable.vue
│   │   │   └── ChartComponent.vue
│   │   └── notifications/   # Notification components
│   │       ├── NotificationBell.vue
│   │       └── AlertsList.vue
│   ├── views/               # Page components (Route components)
│   │   ├── auth/
│   │   │   └── LoginView.vue
│   │   ├── dashboard/
│   │   │   └── DashboardView.vue
│   │   ├── entry/
│   │   │   └── EntryStationView.vue
│   │   ├── exit/
│   │   │   └── ExitStationView.vue
│   │   ├── vehicles/
│   │   │   ├── VehicleListView.vue
│   │   │   └── VehicleDetailView.vue
│   │   ├── admin/
│   │   │   ├── UsersView.vue
│   │   │   ├── ZonesView.vue
│   │   │   ├── StationsView.vue
│   │   │   ├── RatesView.vue
│   │   │   └── SettingsView.vue
│   │   ├── reports/
│   │   │   └── ReportsView.vue
│   │   └── NotFoundView.vue
│   ├── stores/              # Pinia stores
│   │   ├── auth.store.js
│   │   ├── user.store.js
│   │   ├── entry.store.js
│   │   ├── exit.store.js
│   │   ├── vehicle.store.js
│   │   ├── dashboard.store.js
│   │   ├── zone.store.js
│   │   ├── station.store.js
│   │   ├── settings.store.js
│   │   ├── report.store.js
│   │   ├── alert.store.js
│   │   └── theme.store.js
│   ├── composables/         # Composition functions
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useImageCapture.js
│   │   ├── useDebounce.js
│   │   ├── useFormValidation.js
│   │   └── useNotification.js
│   ├── services/            # API service layer
│   │   ├── api.js           # Axios instance
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── entryService.js
│   │   ├── exitService.js
│   │   ├── vehicleService.js
│   │   ├── dashboardService.js
│   │   ├── zoneService.js
│   │   ├── stationService.js
│   │   ├── settingsService.js
│   │   ├── reportService.js
│   │   └── alertService.js
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   ├── formatters.js    # Date, currency formatters
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── errorHandler.js
│   ├── router/              # Vue Router
│   │   ├── index.js
│   │   └── guards.js        # Route guards
│   ├── plugins/             # Vue plugins
│   ├── App.vue
│   └── main.js
├── tests/                   # Test files
├── .env.example
├── .gitignore
├── index.html
├── vite.config.js
└── package.json
```

---

## Coding Standards & Conventions

### Backend Standards (Express.js)

#### 1. **File Naming**

- Use camelCase for files: `authController.js`, `userService.js`
- Model files: PascalCase: `User.js`, `ParkingSession.js`

#### 2. **API Response Structure**

```javascript
// Success Response
{
  success: true,
  data: {...} or [...],
  message: "Operation successful",
  timestamp: "2026-01-12T10:30:00Z"
}

// Error Response
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable message",
    details: {...} // Optional
  },
  timestamp: "2026-01-12T10:30:00Z"
}

// Paginated Response
{
  success: true,
  data: [...],
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10
  },
  timestamp: "2026-01-12T10:30:00Z"
}
```

#### 3. **Controller Pattern**

```javascript
// controllers/userController.js
const userService = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await userService.getUsers(page, limit);
    return successResponse(res, result, 'Users fetched successfully');
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};

module.exports = { getUsers };
```

#### 4. **Service Layer Pattern**

```javascript
// services/userService.js
const { User } = require('../models');
const { AppError } = require('../utils/errorTypes');

const getUsers = async (page, limit) => {
  const offset = (page - 1) * limit;

  const { rows: users, count: totalItems } = await User.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ['password_hash'] }, // Don't expose passwords
    order: [['created_at', 'DESC']],
  });

  if (!users.length) {
    throw new AppError('No users found', 404, 'NOT_FOUND');
  }

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      itemsPerPage: limit,
    },
  };
};

module.exports = { getUsers };
```

#### 5. **Error Handling**

```javascript
// utils/errorTypes.js
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error codes
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

module.exports = { AppError, ERROR_CODES };

// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  logger.error({
    message: err.message,
    code,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
  });
};
```

#### 6. **Validation Pattern**

```javascript
// validators/entryValidator.js
const Joi = require('joi');

const entrySchema = Joi.object({
  vehiclePlate: Joi.string().required().min(2).max(20),
  vehicleTypeId: Joi.number().integer().required(),
  zoneId: Joi.number().integer().required(),
  image: Joi.string().required(), // Base64 or file path
});

// middleware/validation.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return errorResponse(res, 'Validation failed', 400, 'VALIDATION_ERROR', details);
    }
    next();
  };
};
```

#### 7. **Database Queries**

```javascript
// Always use parameterized queries (Sequelize handles this)
// Good
const user = await User.findOne({ where: { email: userEmail } });

// For raw queries (avoid if possible)
const [results] = await sequelize.query('SELECT * FROM users WHERE email = :email', {
  replacements: { email: userEmail },
  type: QueryTypes.SELECT,
});
```

#### 8. **Logging**

```javascript
// config/logger.js (Winston)
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Usage
logger.info('User login successful', { userId: user.id, email: user.email });
logger.error('Database connection failed', { error: err.message });
```

---

### Frontend Standards (Vue 3)

#### 1. **Component Structure (Script Setup)**

```vue
<!-- components/entry/VehicleTypeSelector.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVehicleStore } from '@/stores/vehicle.store';
import { storeToRefs } from 'pinia';

// Props
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Stores
const vehicleStore = useVehicleStore();
const { vehicleTypes, loading } = storeToRefs(vehicleStore);

// Local state
const selectedType = ref(props.modelValue);

// Computed
const activeVehicleTypes = computed(() => vehicleTypes.value.filter((type) => type.isActive));

// Methods
const handleSelection = (typeId) => {
  selectedType.value = typeId;
  emit('update:modelValue', typeId);
};

// Lifecycle
onMounted(async () => {
  if (!vehicleTypes.value.length) {
    await vehicleStore.fetchVehicleTypes();
  }
});
</script>

<template>
  <div class="vehicle-type-selector">
    <h3 class="selector-title">Select Vehicle Type</h3>

    <div v-if="loading" class="loading">
      <LoadingSpinner />
    </div>

    <div v-else class="type-grid">
      <button
        v-for="type in activeVehicleTypes"
        :key="type.id"
        :class="['type-button', { active: selectedType === type.id }]"
        @click="handleSelection(type.id)"
      >
        <span class="type-name">{{ type.name }}</span>
        <span class="type-rate">${{ type.hourlyRate }}/hr</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.vehicle-type-selector {
  padding: 1rem;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.type-button {
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  cursor: pointer;
  transition: all 0.3s;
}

.type-button.active {
  border-color: var(--primary-color);
  background: var(--primary-light);
}
</style>
```

#### 2. **Pinia Store Pattern**

```javascript
// stores/entry.store.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import entryService from '@/services/entryService';
import { useNotification } from '@/composables/useNotification';

export const useEntryStore = defineStore('entry', () => {
  // State
  const currentEntry = ref(null);
  const recentEntries = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters (Computed)
  const hasCurrentEntry = computed(() => currentEntry.value !== null);

  // Actions
  const createEntry = async (entryData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await entryService.createEntry(entryData);
      currentEntry.value = response.data;
      recentEntries.value.unshift(response.data);

      useNotification().success('Vehicle entry recorded successfully');
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Entry failed';
      useNotification().error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearCurrentEntry = () => {
    currentEntry.value = null;
  };

  const fetchRecentEntries = async (limit = 10) => {
    loading.value = true;
    try {
      const response = await entryService.getRecentEntries(limit);
      recentEntries.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch entries';
    } finally {
      loading.value = false;
    }
  };

  // Reset store
  const $reset = () => {
    currentEntry.value = null;
    recentEntries.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    currentEntry,
    recentEntries,
    loading,
    error,
    // Getters
    hasCurrentEntry,
    // Actions
    createEntry,
    clearCurrentEntry,
    fetchRecentEntries,
    $reset,
  };
});
```

#### 3. **API Service Pattern**

```javascript
// services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data, // Return only data
  async (error) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      // Token expired or invalid
      authStore.logout()
      router.push('/login')
    }

    return Promise.reject(error)
  }
)

export default api

// services/entryService.js
import api from './api'

const entryService = {
  createEntry: (entryData) => api.post('/entries', entryData),
  getRecentEntries: (limit) => api.get(`/entries/recent?limit=${limit}`),
  getEntryById: (id) => api.get(`/entries/${id}`)
}

export default entryService
```

#### 4. **Composable Pattern**

```javascript
// composables/useImageCapture.js
import { ref } from 'vue';

export const useImageCapture = () => {
  const imageData = ref(null);
  const captureError = ref(null);
  const isCapturing = ref(false);

  const captureFromCamera = async () => {
    isCapturing.value = true;
    captureError.value = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      // Return stream for video element
      return stream;
    } catch (err) {
      captureError.value = 'Camera access denied or not available';
      throw err;
    } finally {
      isCapturing.value = false;
    }
  };

  const captureFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        imageData.value = e.target.result;
        resolve(e.target.result);
      };

      reader.onerror = () => {
        captureError.value = 'Failed to read file';
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  const reset = () => {
    imageData.value = null;
    captureError.value = null;
    isCapturing.value = false;
  };

  return {
    imageData,
    captureError,
    isCapturing,
    captureFromCamera,
    captureFromFile,
    reset,
  };
};
```

#### 5. **Route Guard Pattern**

```javascript
// router/guards.js
import { useAuthStore } from '@/stores/auth.store';

export const authGuard = (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
};

export const roleGuard = (allowedRoles) => {
  return (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
      next('/login');
    } else if (!allowedRoles.includes(authStore.user.role)) {
      next('/unauthorized');
    } else {
      next();
    }
  };
};

// router/index.js
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
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/UsersView.vue'),
    beforeEnter: roleGuard(['admin']),
  },
];
```

#### 6. **Error Handling in Components**

```vue
<script setup>
import { ref } from 'vue';
import { useNotification } from '@/composables/useNotification';

const { success, error: showError } = useNotification();
const loading = ref(false);
const error = ref(null);

const submitForm = async (data) => {
  loading.value = true;
  error.value = null;

  try {
    await someService.submit(data);
    success('Form submitted successfully');
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Submission failed';
    showError(error.value);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <ErrorMessage v-if="error" :message="error" />
    <BaseButton type="submit" :loading="loading">Submit</BaseButton>
  </form>
</template>
```

---

## PrimeVue Integration

### Installation & Setup

```bash
# Install PrimeVue and dependencies
npm install primevue primeicons
```

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'; // or Lara theme
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';

// PrimeIcons
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '[data-theme="dark"]',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
});

app.use(ToastService);
app.use(ConfirmationService);
app.use(DialogService);

app.mount('#app');
```

### PrimeVue Components to Use

#### Layout & Navigation

- **Menubar** - Main navigation
- **PanelMenu** - Sidebar navigation
- **TabMenu** - Tab-based navigation for Entry/Exit stations
- **Breadcrumb** - Page navigation trail
- **Card** - Content containers
- **Toolbar** - Action toolbars

#### Forms & Inputs

- **InputText** - Text inputs
- **InputNumber** - Numeric inputs
- **Calendar** - Date/time pickers (for reports, filters)
- **Dropdown** - Select dropdowns (vehicle type, zones)
- **MultiSelect** - Multiple selections
- **RadioButton** - Radio selections
- **Checkbox** - Checkboxes
- **InputSwitch** - Toggle switches (payment status)
- **FileUpload** - Image upload

#### Data Display

- **DataTable** - Vehicle lists, reports, user management
- **Paginator** - Pagination controls
- **DataView** - Card-based data display
- **Timeline** - Activity logs
- **Tag** - Status badges (active, paid, unpaid)
- **Badge** - Notification counts
- **Chip** - Small labels (vehicle types)

#### Dialogs & Overlays

- **Dialog** - Modal dialogs
- **ConfirmDialog** - Confirmation popups
- **OverlayPanel** - Dropdown panels
- **Toast** - Notification messages
- **Sidebar** - Slide-out panels

#### Buttons & Actions

- **Button** - Standard buttons
- **SplitButton** - Buttons with dropdown actions
- **SpeedDial** - Floating action button

#### Charts (via Chart.js integration)

- **Chart** - Revenue charts, occupancy graphs

#### Misc

- **ProgressSpinner** - Loading indicators
- **Skeleton** - Loading placeholders
- **Divider** - Section dividers
- **Avatar** - User avatars

### Example Component with PrimeVue

```vue
<!-- components/vehicle/VehicleList.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useVehicleStore } from '@/stores/vehicle.store';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { FilterMatchMode } from 'primevue/api';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

const vehicleStore = useVehicleStore();
const toast = useToast();
const confirm = useConfirm();

const vehicles = ref([]);
const loading = ref(false);
const selectedVehicle = ref(null);
const showDetailsDialog = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  vehiclePlate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const fetchVehicles = async () => {
  loading.value = true;
  try {
    vehicles.value = await vehicleStore.fetchVehicles();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch vehicles',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const viewDetails = (vehicle) => {
  selectedVehicle.value = vehicle;
  showDetailsDialog.value = true;
};

const getStatusSeverity = (status) => {
  return (
    {
      active: 'success',
      completed: 'info',
      overstay: 'warning',
    }[status] || 'secondary'
  );
};

onMounted(() => {
  fetchVehicles();
});
</script>

<template>
  <div class="vehicle-list">
    <DataTable
      v-model:filters="filters"
      :value="vehicles"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      filterDisplay="row"
      stripedRows
      showGridlines
    >
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h2>Active Vehicles</h2>
          <InputText
            v-model="filters.global.value"
            placeholder="Search..."
            class="p-inputtext-sm"
          />
        </div>
      </template>

      <Column field="vehiclePlate" header="Plate Number" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="Search by plate"
          />
        </template>
      </Column>

      <Column field="vehicleType" header="Type" sortable />

      <Column field="zone" header="Zone" sortable />

      <Column field="entryTime" header="Entry Time" sortable>
        <template #body="{ data }">
          {{ new Date(data.entryTime).toLocaleString() }}
        </template>
      </Column>

      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="['active', 'completed', 'overstay']"
            placeholder="Select Status"
            showClear
          />
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <Button icon="pi pi-eye" severity="info" text rounded @click="viewDetails(data)" />
        </template>
      </Column>

      <template #empty>
        <div class="text-center p-4">No vehicles found.</div>
      </template>
    </DataTable>

    <Dialog
      v-model:visible="showDetailsDialog"
      header="Vehicle Details"
      :modal="true"
      :style="{ width: '50vw' }"
    >
      <div v-if="selectedVehicle">
        <!-- Vehicle details content -->
      </div>
    </Dialog>
  </div>
</template>
```

### PrimeVue Toast Notifications

```javascript
// composables/useNotification.js
import { useToast } from 'primevue/usetoast';

export const useNotification = () => {
  const toast = useToast();

  const success = (message, detail = '') => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: detail || message,
      life: 3000,
    });
  };

  const error = (message, detail = '') => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: detail || message,
      life: 5000,
    });
  };

  const warning = (message, detail = '') => {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: detail || message,
      life: 4000,
    });
  };

  const info = (message, detail = '') => {
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: detail || message,
      life: 3000,
    });
  };

  return { success, error, warning, info };
};
```

### PrimeVue Confirmation Dialog

```javascript
// Usage in components
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();

const deleteVehicle = (id) => {
  confirm.require({
    message: 'Are you sure you want to delete this vehicle record?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      // Delete logic
      await vehicleStore.deleteVehicle(id);
      toast.add({ severity: 'success', summary: 'Deleted', life: 3000 });
    },
    reject: () => {
      // User cancelled
    },
  });
};
```

### PrimeVue Theme Customization

```javascript
// For dynamic theme switching (admin configurable)
import { useTheme } from 'primevue/themes';

const theme = useTheme();

// Change primary color
theme.set('primary', {
  50: '#f5f9ff',
  100: '#e0ecff',
  // ... full color palette
});

// Or use preset themes
import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';

// Switch theme
app.use(PrimeVue, {
  theme: {
    preset: Aura, // or Lara
  },
});
```

---

## Theme & Styling

### CSS Variables Structure (with PrimeVue)

```css
/* assets/styles/variables.css */
:root {
  /* Colors - Primary (Override PrimeVue if needed) */
  --primary-color: #3b82f6;
  --primary-light: #60a5fa;
  --primary-dark: #2563eb;

  /* Colors - Secondary */
  --secondary-color: #10b981;
  --secondary-light: #34d399;
  --secondary-dark: #059669;

  /* Colors - Neutral */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Semantic Colors */
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --info-color: #3b82f6;

  /* Background */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;

  /* Text */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  /* Border */
  --border-color: #e5e7eb;
  --border-radius: 8px;
  --border-radius-sm: 4px;
  --border-radius-lg: 12px;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;

  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-tooltip: 1070;
}

/* Dark mode (future enhancement) */
[data-theme='dark'] {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-tertiary: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --border-color: #374151;
}
```

---

## Naming Conventions

### Variables & Functions

- **JavaScript**: camelCase (`getUserById`, `isActive`, `totalAmount`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Components**: PascalCase (`BaseButton`, `VehicleList`)
- **Stores**: camelCase with `.store.js` suffix (`auth.store.js`)

### Database

- **Tables**: snake_case, plural (`parking_sessions`, `vehicle_types`)
- **Columns**: snake_case (`vehicle_plate_number`, `created_at`)
- **Foreign Keys**: `tablename_id` (`vehicle_type_id`)

### API Endpoints

- RESTful naming
- Lowercase with hyphens

```
GET    /api/parking-sessions
POST   /api/parking-sessions
GET    /api/parking-sessions/:id
PUT    /api/parking-sessions/:id
DELETE /api/parking-sessions/:id
GET    /api/vehicle-types
POST   /api/entries
POST   /api/exits/:id/process
```

---

## Git Commit Convention

```
feat: Add vehicle entry form
fix: Resolve image upload issue
docs: Update API documentation
style: Format code with Prettier
refactor: Restructure entry service
test: Add unit tests for price calculation
chore: Update dependencies
```

---

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=parking_system
DB_USER=root
DB_PASSWORD=1234

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Google Vision API
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=./path/to/credentials.json

# Image Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
IMAGE_RETENTION_DAYS=30

# Logging
LOG_LEVEL=info
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Car Parking System
```

---

## Performance Best Practices

### Backend

1. Use database indexes on frequently queried columns
2. Implement pagination for list endpoints
3. Use connection pooling for database
4. Compress images before storage
5. Implement caching where appropriate (Redis)
6. Use async/await for I/O operations
7. Limit payload sizes

### Frontend

1. Lazy load routes and components
2. Implement virtual scrolling for long lists (PrimeVue DataTable supports virtualScroll)
3. Debounce search inputs (use PrimeVue's built-in filtering)
4. Use v-memo for expensive components
5. Optimize images (compression, lazy loading)
6. Minimize bundle size (tree shaking, import PrimeVue components individually)
7. Use web workers for heavy computations
8. Use PrimeVue's lazy loading for DataTable pagination
9. Implement Skeleton loaders (PrimeVue Skeleton component) for better UX

---

## Security Checklist

- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (sanitize outputs)
- [ ] CSRF tokens for state-changing operations
- [ ] Rate limiting on authentication endpoints
- [ ] Secure password hashing (bcrypt, min 10 rounds)
- [ ] JWT secret rotation strategy
- [ ] HTTPS only in production
- [ ] Security headers (Helmet.js)
- [ ] File upload validation (type, size, content)
- [ ] Role-based access control enforcement
- [ ] Audit logging for sensitive operations

---

## Testing Guidelines

### Unit Tests

- Test individual functions/services
- Mock external dependencies
- Aim for 70%+ coverage on business logic

### Integration Tests

- Test API endpoints
- Test database interactions
- Test authentication flow

### E2E Tests

- Test critical user journeys
- Entry flow (capture → OCR → save)
- Exit flow (search → calculate → bill)
- Admin workflows

---

This document should be referenced before starting any new task to maintain consistency throughout the project.
