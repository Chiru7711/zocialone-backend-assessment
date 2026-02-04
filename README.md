# ZocialOne Backend Assessment

A production-ready backend system for user authentication, complaint handling, and time-based onboarding reminders.

## 🚀 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Scheduling**: node-cron

## 📋 Features

✅ **User Authentication** - Registration, login with JWT  
✅ **User Profile API** - Get user details with onboarding status  
✅ **Complaint System** - Create, update status with validation  
✅ **Status Transitions** - Enforced business rules  
✅ **Complaint Metrics** - Time tracking without extra tables  
✅ **Notifications** - Decoupled notification system  
✅ **Onboarding Reminders** - Cron-based reminder system  

## 📁 Project Structure

```
ZocialOne/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection setup
│   │   └── env.ts               # Environment configuration
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts   # Registration & login endpoints
│   │   │   ├── auth.service.ts      # Authentication business logic
│   │   │   └── auth.middleware.ts   # JWT token validation
│   │   │
│   │   ├── users/
│   │   │   ├── user.entity.ts       # User database model
│   │   │   ├── user.controller.ts   # User profile endpoints
│   │   │   └── user.service.ts      # User business logic
│   │   │
│   │   ├── complaints/
│   │   │   ├── complaint.entity.ts      # Complaint database model
│   │   │   ├── complaint.controller.ts  # Complaint CRUD endpoints
│   │   │   ├── complaint.service.ts     # Complaint business logic
│   │   │   ├── complaint.transitions.ts # Status transition rules
│   │   │   └── complaint.metrics.ts     # Time tracking calculations
│   │   │
│   │   ├── notifications/
│   │   │   ├── notification.entity.ts   # Notification database model
│   │   │   └── notification.service.ts  # Notification sending logic
│   │   │
│   │   └── onboarding/
│   │       ├── onboarding.service.ts    # Reminder business logic
│   │       └── onboarding.cron.ts       # Cron job configuration
│   │
│   ├── utils/
│   │   ├── enums.ts             # TypeScript enums
│   │   └── time.ts              # Time calculation utilities
│   │
│   ├── app.ts                   # Express app setup & routes
│   └── server.ts                # Application entry point
│
├── package.json                 # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## 🗄️ Database Structure

### Users Table
```sql
- id (PK)
- name
- email (unique)
- password (hashed)
- onboarding_stage (0/1/2)
- last_reminder_sent
- stage_updated_at
- created_at
```

### Complaints Table (Single Table Design)
```sql
- id (PK)
- user_id (FK)
- complaint_type (enum)
- status (enum)
- metadata (JSONB) -- Flexible complaint data
- created_at
- updated_at
- status_updated_at
```

### Notifications Table
```sql
- id (PK)
- user_id (FK)
- title
- body
- is_sent
- created_at
```

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb zocialone

# Database will auto-sync in development mode
```

### 4. Run Application
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔌 API Endpoints

### Authentication
```http
POST /register
POST /login
```

### User Management
```http
GET /user/details (Protected)
```

### Complaints
```http
POST /complaints (Protected)
PATCH /complaints/:id/status (Protected)
GET /complaints/:id/metrics (Protected)
```

### Health Check
```http
GET /health
```

## 📝 API Examples

### Register User
```json
POST /register
{
  "name": "Amit Sharma",
  "email": "amit@test.com",
  "password": "password123"
}
```

### Create Live Demo Complaint
```json
POST /complaints
Authorization: Bearer <token>
{
  "complaint_type": "live_demo",
  "metadata": {
    "preferred_date": "2026-02-10",
    "preferred_time": "15:00",
    "business_name": "ABC Fashion",
    "contact_number": "+91XXXXXXXXXX",
    "demo_type": "online"
  }
}
```

### Update Complaint Status
```json
PATCH /complaints/1/status
Authorization: Bearer <token>
{
  "status": "in_progress"
}
```

## 🔄 Business Logic

### Authentication Flow
```
User Registration:
POST /register → Validate Input → Hash Password → Save User → Generate JWT → Return Token

User Login:
POST /login → Validate Credentials → Verify Password → Generate JWT → Return Token

Protected Routes:
Request → Extract JWT → Verify Token → Load User → Continue to Controller
```

### Complaint Lifecycle Flow
```
Create Complaint:
POST /complaints → Validate Metadata → Save as 'raised' → Return Complaint

Status Update:
PATCH /status → Validate Transition → Update Status → Trigger Notification → Return Updated

Status Transitions:
raised → in_progress → waiting_on_user → resolved → closed
         ↓              ↓                ↓
    [notification]  [notification]   [notification]
```

### Onboarding Reminder System
```
Cron Job (Every 10 minutes):
┌─ Fetch Users in Stages 0,1,2
├─ For Each User:
│  ├─ Calculate Time Since Stage Entry
│  ├─ Check Reminder Schedule
│  ├─ Verify Not Already Sent
│  └─ Send Reminder + Update Tracking
└─ Log Results

Reminder Schedules:
Stage 0: 24h → 3d → 5d
Stage 1: 12h → 24h
Stage 2: 1d → 2d → 3d → 5d
```

### Status Transitions
- `raised` → `in_progress`
- `in_progress` → `waiting_on_user` | `resolved`
- `waiting_on_user` → `in_progress` | `resolved`
- `resolved` → `closed`
- `closed` → (final state)

### Onboarding Reminders
- **Stage 0**: 24h, 3d, 5d
- **Stage 1**: 12h, 24h
- **Stage 2**: 1d, 2d, 3d, 5d

## 🎯 Production Features

- **Type Safety**: Full TypeScript implementation
- **Validation**: Zod schemas for all inputs
- **Security**: JWT authentication, password hashing
- **Error Handling**: Proper error responses
- **Logging**: Console-based notification logging
- **Scalability**: Efficient database queries
- **Maintainability**: Clean architecture with services

## 🔧 Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=zocialone
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
REMINDER_CRON_SCHEDULE=*/10 * * * *
```

## 🚦 Testing the System

1. **Register a user** via `/register`
2. **Login** to get JWT token
3. **Create complaints** with different types
4. **Update complaint status** and see notifications
5. **Check complaint metrics** for time tracking
6. **Monitor cron logs** for onboarding reminders

## 📊 Monitoring

- Health check endpoint: `/health`
- Console logs for notifications and cron jobs
- Database query logging in development mode

## 🚀 Deployment

### Production Checklist
- [ ] Set strong `JWT_SECRET` in production
- [ ] Use production database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper logging system
- [ ] Set up database migrations
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificates

### Docker Support (Optional)
```dockerfile
# Add Dockerfile for containerization
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

**Built for ZocialOne Backend Assessment**  
*Production-ready, scalable, and maintainable backend system*