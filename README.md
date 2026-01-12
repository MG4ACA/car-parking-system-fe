# Car Parking System - MVP

A comprehensive car parking management system with vehicle recognition, automated billing, and role-based access control.

## 🚀 Tech Stack

### Frontend

- **Vue.js 3** (Composition API, Script Setup)
- **PrimeVue** (UI Component Library)
- **Pinia** (State Management)
- **Vue Router** (Routing)
- **Axios** (HTTP Client)
- **Vite** (Build Tool)

### Backend

- **Express.js** (Node.js Framework)
- **PostgreSQL** (Database)
- **Sequelize** (ORM)
- **JWT** (Authentication)
- **Google Vision API** (OCR/License Plate Recognition)
- **Winston** (Logging)

## 📋 Features

- ✅ Vehicle entry/exit management with image capture
- ✅ OCR for license plate recognition
- ✅ Rate calculation by vehicle type & duration
- ✅ Role-based access (Admin/Operator/Viewer)
- ✅ Real-time dashboard with statistics
- ✅ Vehicle search & filtering
- ✅ Reports & analytics (CSV/PDF export)
- ✅ Zone and capacity management
- ✅ Payment status tracking
- ✅ Overstay alerts
- ✅ Auto-delete images after 30 days

## 🔐 User Roles

### Admin

- Full system access
- User management
- Rate configuration
- System settings
- Zone and capacity management
- All reports and analytics

### System Operator

- Entry/exit operations
- Manual vehicle search and correction
- Basic reports
- View dashboard

### Viewer

- View-only dashboard
- View reports
- View vehicle list

## 🚦 Vehicle Types

1. Motorcycle/Bike
2. Three-wheel
3. Car (Standard)
4. SUV/Large Vehicle/Van
5. Truck/Commercial
6. Others

## 📁 Project Structure

```
car-parking-system-2/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── validators/     # Validation schemas
│   ├── uploads/            # Image storage
│   ├── logs/              # Application logs
│   ├── .env               # Environment variables
│   ├── server.js          # Entry point
│   └── package.json
│
├── backend/frontend/       # Frontend Application
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Vue components
│   │   ├── composables/   # Composition functions
│   │   ├── router/        # Vue Router config
│   │   ├── services/      # API services
│   │   ├── stores/        # Pinia stores
│   │   ├── utils/         # Utility functions
│   │   ├── views/         # Page components
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env               # Environment variables
│   └── package.json
│
├── PROJECT_PLAN.md         # Complete project plan
└── CODE_STRUCTURE.md       # Code structure & standards
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Google Cloud Account (for Vision API)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd car-parking-system-2
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file:

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=parking_system
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Google Vision API
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=./path/to/credentials.json

# Image Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
IMAGE_RETENTION_DAYS=30
```

#### Setup Database

```bash
# Create database
createdb parking_system

# Run migrations
npm run migrate

# Seed data (optional)
npm run seed
```

#### Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on: `http://localhost:3000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd backend/frontend
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Car Parking System
```

#### Start Frontend Dev Server

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🎯 Development Workflow

### Phase 1: Project Setup ✅ (COMPLETED)

- [x] Backend initialization
- [x] Frontend initialization with Vue 3 + PrimeVue
- [x] Database configuration
- [x] Authentication setup
- [x] Project structure

### Phase 2: Authentication & User Management (Next)

- [ ] JWT authentication implementation
- [ ] Login/register functionality
- [ ] User CRUD operations
- [ ] Role-based access control

### Upcoming Phases

- Phase 3: Core System Setup
- Phase 4: Image Processing & Vehicle Recognition
- Phase 5: Entry Station
- Phase 6: Exit Station & Billing
- Phase 7: Dashboard & Real-time Updates
- Phase 8: Vehicle Management & Search
- Phase 9: Reports & Analytics
- Phase 10: Alerts & Notifications
- Phase 11: System Settings
- Phase 12-14: Testing, Documentation & Deployment

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token

### Main Endpoints (Coming Soon)

- `/users` - User management
- `/vehicle-types` - Vehicle types
- `/zones` - Parking zones
- `/stations` - Entry/Exit stations
- `/entries` - Vehicle entries
- `/exits` - Vehicle exits
- `/parking-sessions` - Parking sessions
- `/dashboard` - Dashboard statistics
- `/reports` - Reports & analytics
- `/settings` - System settings
- `/alerts` - Alerts & notifications

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd backend/frontend
npm test
```

## 🚀 Deployment

Deployment instructions will be added in Phase 13.

## 📝 Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database
- `npm test` - Run tests
- `npm run lint` - Lint code

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Input validation
- Secure file upload

## 📖 Documentation

- [Project Plan](PROJECT_PLAN.md) - Complete development roadmap
- [Code Structure](CODE_STRUCTURE.md) - Architecture & coding standards

## 🤝 Contributing

1. Follow the coding standards in `CODE_STRUCTURE.md`
2. Check `PROJECT_PLAN.md` before starting new features
3. Write tests for new functionality
4. Update documentation

## 📄 License

ISC

## 👥 Authors

Your Name

## 🎉 Acknowledgments

- PrimeVue for the amazing UI components
- Google Cloud Vision API for OCR capabilities
