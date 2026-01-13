# Car Parking System - Project Plan

## Project Overview

A comprehensive car parking management system with vehicle recognition, automated billing, and role-based access control.

## Tech Stack

- **Frontend**: Vue.js 3 (Composition API, Script Setup) + PrimeVue UI Library
- **Backend**: Express.js + MySQL
- **Authentication**: JWT tokens
- **Image Recognition**: Google Vision API
- **Image Storage**: Local server filesystem

### PrimeVue Components Used

- **DataTable** - Vehicle lists, reports, user management
- **Dialog** - Modals and popups
- **Toast** - Notifications
- **Calendar** - Date pickers for reports
- **Dropdown/MultiSelect** - Form inputs
- **Button** - Action buttons
- **Card** - Content containers
- **Menubar/PanelMenu** - Navigation
- **Tag/Badge** - Status indicators
- **Chart** - Analytics visualizations
- **FileUpload** - Image uploads
- **ConfirmDialog** - Confirmations

---

## Vehicle Types

1. Motorcycle/Bike
2. Three-wheel
3. Car (Standard)
4. SUV/Large Vehicle/Van
5. Truck/Commercial
6. Others

## User Roles & Permissions

### Admin

- Full system access
- User management (add/edit/delete users)
- Rate configuration per vehicle type
- System settings (grace period, minimum charge, theme)
- Zone and capacity management
- All reports and analytics
- View all parking stations

### System Operator

- Entry/exit operations
- Manual vehicle search and correction
- Basic reports (daily summary)
- View dashboard
- Manage assigned station only

### Viewer

- View-only dashboard
- View reports
- View vehicle list
- No modification rights

---

## Core Features

### 1. Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Session management
- Password hashing (bcrypt)
- Token refresh mechanism

### 2. Entry Station Interface

- Camera/mobile image capture
- License plate recognition (Google Vision API)
- Manual entry option (if OCR fails)
- Vehicle type selection
- Zone assignment
- Entry timestamp recording
- Entry receipt generation

### 3. Exit Station Interface

- Automatic vehicle identification (by plate)
- Manual search fallback
- Duration calculation
- Price calculation based on rates
- Payment status tracking (Paid/Unpaid)
- Bill/receipt generation (PDF)
- Gate control button
- Exit timestamp recording

### 4. Dashboard (Real-time)

- Total vehicles currently parked
- Available/occupied spots per zone
- Today's revenue
- Active vehicles list
- Zone occupancy visualization
- Recent entries/exits
- Alert notifications

### 5. Vehicle Management

- Search by plate number, date, status
- Filter by vehicle type, zone, payment status
- Vehicle history view
- Manual corrections (admin/operator)
- Image gallery view

### 6. Rate Management (Admin)

- Configure hourly rates per vehicle type
- Set grace period (minutes)
- Set minimum charge (hours)
- Rounding rules (nearest hour)
- Rate history tracking

### 7. Zone Management (Admin)

- Create/edit/delete zones
- Set capacity per zone
- Zone status (active/inactive)
- Assign zones to entry stations

### 8. Parking Station Management (Admin)

- Configure entry stations
- Configure exit stations
- Assign operators to stations
- Station status monitoring

### 9. User Management (Admin)

- Create/edit/delete users
- Assign roles
- Set station assignments
- User activity logs

### 10. Reports & Analytics

- Daily revenue report (CSV/PDF)
- Monthly revenue report (CSV/PDF)
- Vehicle logs (entry/exit history)
- Occupancy trends
- Peak hours analysis
- Vehicle type distribution
- Payment status reports
- Export functionality

### 11. Alerts & Notifications

- Vehicle overstay alerts (>24 hours configurable)
- Parking full alerts
- Low capacity warnings
- System notifications

### 12. System Settings (Admin)

- Theme/branding configuration
- System-wide settings
- Grace period configuration
- Minimum charge configuration
- Email/notification settings
- Backup and maintenance

### 13. Image Management

- Auto-delete images after 30 days
- Image compression
- Image archiving
- Storage monitoring

---

## Database Schema (MySQL)

### Tables

#### users

- id (PK)
- username (unique)
- email (unique)
- password_hash
- role (admin/operator/viewer)
- assigned_station_id (FK)
- is_active
- created_at
- updated_at

#### parking_zones

- id (PK)
- name (e.g., Zone A)
- capacity
- current_occupancy
- is_active
- created_at
- updated_at

#### vehicle_types

- id (PK)
- name (Motorcycle, Car, etc.)
- hourly_rate
- is_active
- created_at
- updated_at

#### parking_stations

- id (PK)
- name
- type (entry/exit)
- zone_id (FK)
- is_active
- created_at
- updated_at

#### parking_sessions

- id (PK)
- vehicle_plate_number
- vehicle_type_id (FK)
- zone_id (FK)
- entry_station_id (FK)
- exit_station_id (FK, nullable)
- entry_image_path
- exit_image_path (nullable)
- entry_time
- exit_time (nullable)
- duration_minutes (nullable)
- calculated_amount (nullable)
- payment_status (unpaid/paid)
- status (active/completed)
- entry_operator_id (FK)
- exit_operator_id (FK, nullable)
- notes
- created_at
- updated_at

#### system_settings

- id (PK)
- key (unique)
- value
- description
- updated_at
- updated_by (FK to users)

#### rate_history

- id (PK)
- vehicle_type_id (FK)
- old_rate
- new_rate
- changed_by (FK to users)
- changed_at

#### alerts

- id (PK)
- parking_session_id (FK)
- alert_type (overstay/full/low_capacity)
- message
- is_read
- created_at

#### activity_logs

- id (PK)
- user_id (FK)
- action
- entity_type
- entity_id
- details (JSON)
- created_at

---

## Phase-wise Implementation

### Phase 1: Project Setup & Foundation (Week 1) ✅ COMPLETED

**Backend**

- [x] 1.1 Initialize Express.js project structure
- [x] 1.2 Setup MySQL database connection
- [x] 1.3 Configure environment variables (.env)
- [x] 1.4 Setup middleware (cors, body-parser, helmet, compression)
- [x] 1.5 Create database schema and migrations
- [x] 1.6 Setup error handling middleware
- [x] 1.7 Setup logging (winston/morgan)
- [x] 1.8 Create seed data for initial setup

**Frontend**

- [x] 1.9 Initialize Vue 3 project (Vite)
- [x] 1.10 Install and configure PrimeVue library
- [x] 1.11 Setup PrimeVue theme (Aura/Lara)
- [x] 1.12 Configure PrimeVue icons (PrimeIcons)
- [x] 1.13 Setup Pinia store structure
- [x] 1.14 Configure Vue Router
- [x] 1.15 Setup Axios interceptors
- [x] 1.16 Create base layout components
- [x] 1.17 Setup global styles and theme structure
- [x] 1.18 Setup utility functions
- [x] 1.19 Configure environment variables

### Phase 2: Authentication & User Management (Week 1-2)

**Backend**

- [ ] 2.1 Implement JWT authentication middleware
- [ ] 2.2 Create user registration API
- [ ] 2.3 Create login API
- [ ] 2.4 Create token refresh API
- [ ] 2.5 Create user CRUD APIs
- [ ] 2.6 Implement role-based access control middleware
- [ ] 2.7 Create password reset functionality
- [ ] 2.8 Activity logging for auth events

**Frontend**

- [x] 2.9 Create login page
- [x] 2.10 Create auth store (Pinia)
- [x] 2.11 Implement route guards
- [x] 2.12 Create user management UI (admin)
- [x] 2.13 Create user form components
- [x] 2.14 Implement token refresh logic

### Phase 3: Core System Setup (Week 2)

**Backend**

- [ ] 3.1 Vehicle types CRUD APIs
- [ ] 3.2 Parking zones CRUD APIs
- [ ] 3.3 Parking stations CRUD APIs
- [ ] 3.4 System settings CRUD APIs
- [ ] 3.5 Rate management APIs
- [ ] 3.6 Validation middleware for all endpoints

**Frontend**

- [ ] 3.7 Create vehicle types management UI
- [ ] 3.8 Create zones management UI
- [ ] 3.9 Create stations management UI
- [ ] 3.10 Create system settings UI
- [ ] 3.11 Create rate configuration UI
- [ ] 3.12 Create admin dashboard shell

### Phase 4: Image Processing & Vehicle Recognition (Week 3)

**Backend**

- [ ] 4.1 Setup Google Vision API integration
- [ ] 4.2 Create image upload handler
- [ ] 4.3 Create license plate recognition service
- [ ] 4.4 Implement image storage (local filesystem)
- [ ] 4.5 Create image compression service
- [ ] 4.6 Create image cleanup scheduler (30-day deletion)
- [ ] 4.7 Image retrieval APIs
- [ ] 4.8 Error handling for OCR failures

**Frontend**

- [x] 4.9 Create image capture component (mobile/camera)
- [x] 4.10 Create image preview component
- [x] 4.11 Create image gallery component
- [x] 4.12 Handle upload progress and errors
- [x] 4.13 Create manual plate entry fallback UI

### Phase 5: Entry Station (Week 3-4)

**Backend**

- [ ] 5.1 Create parking session entry API
- [ ] 5.2 Validate zone capacity
- [ ] 5.3 Check for duplicate entries
- [ ] 5.4 Generate entry receipt data
- [ ] 5.5 Update zone occupancy
- [ ] 5.6 Log entry activities

**Frontend**

- [x] 5.7 Create entry station interface
- [x] 5.8 Integrate image capture
- [x] 5.9 Display OCR results
- [x] 5.10 Create vehicle type selector
- [x] 5.11 Create zone selector
- [x] 5.12 Show capacity warnings
- [x] 5.13 Display entry confirmation
- [x] 5.14 Create entry store (Pinia)

### Phase 6: Exit Station & Billing (Week 4-5)

**Backend**

- [ ] 6.1 Create vehicle search API (by plate)
- [ ] 6.2 Create exit processing API
- [ ] 6.3 Implement price calculation service
- [ ] 6.4 Apply grace period logic
- [ ] 6.5 Apply minimum charge logic
- [ ] 6.6 Round to nearest hour
- [ ] 6.7 Generate bill/receipt PDF
- [ ] 6.8 Update parking session (exit)
- [ ] 6.9 Update zone occupancy
- [ ] 6.10 Payment status update API

**Frontend**

- [x] 6.11 Create exit station interface
- [x] 6.12 Automatic vehicle identification display
- [x] 6.13 Manual search interface
- [x] 6.14 Display parking duration
- [x] 6.15 Display calculated amount
- [x] 6.16 Payment status toggle
- [x] 6.17 Show bill preview
- [x] 6.18 Gate control button
- [x] 6.19 Exit confirmation flow
- [x] 6.20 Create exit store (Pinia)

### Phase 7: Dashboard & Real-time Updates (Week 5)

**Backend**

- [ ] 7.1 Create dashboard statistics API
- [ ] 7.2 Create active vehicles API
- [ ] 7.3 Create recent activities API
- [ ] 7.4 Create zone occupancy API
- [ ] 7.5 Create revenue summary API
- [ ] 7.6 Optimize queries for performance

**Frontend**

- [x] 7.7 Create dashboard layout
- [x] 7.8 Create statistics cards
- [x] 7.9 Create zone occupancy visualization
- [x] 7.10 Create active vehicles table
- [x] 7.11 Create recent activities feed
- [x] 7.12 Implement auto-refresh (polling)
- [x] 7.13 Create dashboard store (Pinia)
- [x] 7.14 Add loading states and skeletons

### Phase 8: Vehicle Management & Search (Week 5-6)

**Backend**

- [ ] 8.1 Create vehicle search API (advanced filters)
- [ ] 8.2 Create parking history API
- [ ] 8.3 Create manual correction API
- [ ] 8.4 Implement pagination
- [ ] 8.5 Create export endpoints (CSV)

**Frontend**

- [x] 8.6 Create vehicle search interface
- [x] 8.7 Create advanced filters
- [x] 8.8 Create vehicle list table
- [x] 8.9 Create vehicle details modal
- [x] 8.10 Create manual correction form
- [x] 8.11 Implement pagination controls
- [x] 8.12 Create vehicle store (Pinia)

### Phase 9: Reports & Analytics (Week 6)

**Backend**

- [ ] 9.1 Create daily report API
- [ ] 9.2 Create monthly report API
- [ ] 9.3 Create vehicle logs API
- [ ] 9.4 Create analytics APIs (occupancy, peak hours)
- [ ] 9.5 Implement CSV export service
- [ ] 9.6 Implement PDF export service
- [ ] 9.7 Add date range filters

**Frontend**

- [ ] 9.8 Create reports interface
- [ ] 9.9 Create date range picker
- [ ] 9.10 Create report type selector
- [ ] 9.11 Display report data (tables/charts)
- [ ] 9.12 Implement export buttons
- [ ] 9.13 Create analytics visualizations
- [ ] 9.14 Create reports store (Pinia)

### Phase 10: Alerts & Notifications (Week 6-7)

**Backend**

- [ ] 10.1 Create alerts scheduler (overstay detection)
- [ ] 10.2 Create capacity monitoring
- [ ] 10.3 Create alerts CRUD APIs
- [ ] 10.4 Implement notification service
- [ ] 10.5 Create alert history tracking

**Frontend**

- [ ] 10.6 Create notification bell component
- [ ] 10.7 Create alerts list
- [ ] 10.8 Create alert details modal
- [ ] 10.9 Mark as read functionality
- [ ] 10.10 Create alerts store (Pinia)

### Phase 11: System Settings & Configuration (Week 7)

**Backend**

- [ ] 11.1 Settings update APIs
- [ ] 11.2 Theme configuration API
- [ ] 11.3 Validation for settings

**Frontend**

- [ ] 11.4 Create settings interface
- [ ] 11.5 Grace period configuration UI
- [ ] 11.6 Minimum charge configuration UI
- [ ] 11.7 Theme customization UI
- [ ] 11.8 Apply theme dynamically
- [ ] 11.9 Create settings store (Pinia)

### Phase 12: Testing & Bug Fixes (Week 7-8)

- [ ] 12.1 Backend unit tests (critical services)
- [ ] 12.2 API integration tests
- [ ] 12.3 Frontend component tests
- [ ] 12.4 E2E testing (critical flows)
- [ ] 12.5 Performance testing
- [ ] 12.6 Security audit
- [ ] 12.7 Bug fixes and refinements
- [ ] 12.8 Code review and refactoring

### Phase 13: Documentation & Deployment Prep (Week 8)

- [ ] 13.1 API documentation (Swagger/Postman)
- [ ] 13.2 User manual
- [ ] 13.3 Admin guide
- [ ] 13.4 Deployment guide
- [ ] 13.5 Database backup strategy
- [ ] 13.6 Environment setup docs
- [ ] 13.7 Production build optimization

### Phase 14: Future Enhancements (Post-MVP)

- [ ] 14.1 Payment gateway integration
- [ ] 14.2 Mobile app (React Native/Flutter)
- [ ] 14.3 Multiple parking location support
- [ ] 14.4 Advanced analytics (ML predictions)
- [ ] 14.5 Email notifications
- [ ] 14.6 SMS notifications
- [ ] 14.7 Automated gate control hardware integration
- [ ] 14.8 Loyalty programs
- [ ] 14.9 Reserved parking
- [ ] 14.10 Online booking

---

## Testing Strategy

### Backend Testing

- Unit tests for services and utilities
- Integration tests for API endpoints
- Database migration tests
- Authentication middleware tests

### Frontend Testing

- Component unit tests (Vitest)
- Store tests (Pinia)
- E2E tests (Cypress/Playwright)
- Responsive design testing

### Performance Testing

- Load testing (concurrent users)
- Image upload performance
- Database query optimization
- API response time monitoring

---

## Security Considerations

- JWT token security
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF protection
- Rate limiting on APIs
- Input validation and sanitization
- Secure password storage (bcrypt)
- HTTPS enforcement
- Image file type validation
- Role-based access enforcement

---

## Deployment Checklist

- [ ] Environment variables configuration
- [ ] Database setup and migrations
- [ ] SSL certificate setup
- [ ] Image storage directory setup
- [ ] Backup automation
- [ ] Monitoring setup
- [ ] Error tracking (Sentry)
- [ ] Log rotation
- [ ] Scheduled jobs (image cleanup)

---

## Success Metrics

- Entry processing time < 30 seconds
- Exit processing time < 30 seconds
- OCR accuracy > 85%
- System uptime > 99%
- Page load time < 2 seconds
- Mobile responsiveness across devices
