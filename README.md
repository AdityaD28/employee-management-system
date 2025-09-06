# Employee Management System

A complete, modern full-stack employee management system built with React, Node.js, Express, SQLite, and featuring comprehensive employee lifecycle management, payroll processing, and analytics.

## Features

### Authentication & Security
- JWT-based authentication with secure token management
- Role-based access control (Admin, HR, Manager, Employee)
- Secure password hashing with bcrypt
- Session management and auto-logout

### Employee Management
- **Complete CRUD Operations**: Add, view, edit, and delete employees
- **Advanced Search & Filtering**: Search by name, email, department
- **Department Management**: Organize employees by departments
- **Employee Profiles**: Detailed employee information with photos
- **Responsive Design**: Beautiful, modern UI that works on all devices

### Payroll Processing
- **Automated Payroll Calculation**: Calculate salaries, taxes, and deductions
- **Payroll History**: Track all payroll records with persistence
- **Status Management**: Process, review, and approve payroll entries
- **Local Storage Persistence**: Payroll data persists across browser sessions

### Reports & Analytics
- **Overview Dashboard**: Key metrics and KPIs at a glance
- **Performance Reports**: Employee performance tracking and ratings
- **Financial Reports**: Revenue, expenses, and profit analysis
- **Department Analytics**: Department-wise statistics and insights
- **Export Functionality**: Export reports to PDF and Excel formats

### Modern UI/UX
- **Beautiful Design**: Modern gradient-based UI with clean aesthetics
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Forms**: Enhanced form validation with real-time feedback
- **Modal System**: Smooth modal dialogs for all operations
- **Notifications**: Toast notifications for user feedback

##  Architecture

```
Frontend (React + Vite)          Backend (Node.js + Express)       Database (SQLite)
┌─────────────────────────┐     ┌─────────────────────────┐       ┌─────────────────┐
│                         │     │                         │       │                 │
│   React Components      │────▶│  Authentication         │──────▶│ Users Table      
│   Modern UI/UX          │     │ Employee APIs           │       │ Employees       │
│   Dashboard & Reports   │     │ Payroll Processing      │       │ Payroll         │
│   Search & Filters      │     │ Analytics APIs          │       │ Reports         │
│   Responsive Design     │     │ JWT Middleware          │       │                 │
│                         │     │                         │       │                 │
└─────────────────────────┘     └─────────────────────────┘       └─────────────────┘
                                                                          │
                                  ┌─────────────────────────┐             │
                                  │  Local Storage          │             │
                                  │  State Management       │             │
                                  │  Form Persistence       │◀────────────┘
                                  │  Notifications          │
                                  └─────────────────────────┘
```

## Quick Start Guide

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Code Editor** (VS Code recommended)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/employee-management-system.git
   cd employee-management-system
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm start
   ```

3. **Setup Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

### Default Login Credentials

```
Email: admin@demo.com
Password: password123
```

## Project Structure

```
employee-management-system/
├──  frontend/                 # React frontend application
│   ├──  src/
│   │   ├──  components/       # Reusable UI components
│   │   │   ├── EmployeeCard.jsx
│   │   │   └── Notification.jsx
│   │   ├──  pages/           # Main application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeesPage.jsx
│   │   │   ├── PayrollPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├──  backend/                  # Node.js backend API
│   ├── � src/
│   │   ├──  controllers/      # API route handlers
│   │   ├──  middleware/       # Authentication & validation
│   │   ├──  models/          # Database models (Sequelize)
│   │   ├──  routes/          # API route definitions
│   │   └── server.js           # Server entry point
│   ├── scripts/
│   │   └── seed.js             # Database seeding script
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── database.sqlite         # SQLite database file
│
├──  README.md                # Project documentation
├──  docker-compose.yml       # Docker container orchestration
└── Makefile                 # Build and deployment scripts
```
## Features Overview

### Authentication System
- **Secure Login**: JWT-based authentication with token refresh
- **Role Management**: Admin, HR, Manager, and Employee roles
- **Session Persistence**: Automatic login/logout handling
- **Password Security**: Bcrypt hashing for secure password storage

###  Employee Management
- **Add New Employees**: Beautiful modal form with validation
- **View Employee Details**: Comprehensive employee profiles
- **Edit Employee Information**: Update any employee details
- **Search & Filter**: Find employees by name, email, or department
- **Department Organization**: Group employees by departments

###  Payroll System
- **Automated Calculations**: Calculate gross pay, taxes, and net pay
- **Payroll History**: View all processed payroll records
- **Status Tracking**: Pending, Processed, and Approved statuses
- **Data Persistence**: Payroll records saved locally and persist across sessions
- **Batch Processing**: Process payroll for multiple employees

###  Reports & Analytics
- **Dashboard Overview**: Key metrics and statistics
- **Department Reports**: Performance and cost analysis by department
- **Employee Performance**: Individual performance tracking
- **Financial Reports**: Revenue, expenses, and profit analysis
- **Export Options**: Download reports as PDF or Excel

###  User Interface
- **Modern Design**: Clean, professional interface with gradients
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth animations and hover effects
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: User-friendly feedback system

##  Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Styled with inline styles and gradients
- **Local Storage** - Client-side data persistence

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework
- **Sequelize ORM** - Database object-relational mapping
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing library
- **SQLite** - Lightweight database for development

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Auto-restart development server
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

##  Usage Guide

### 1. Authentication
1. Open http://localhost:5173 in your browser
2. Login with: `admin@demo.com` / `password123`
3. You'll be redirected to the dashboard

### 2. Managing Employees
1. Navigate to "Employees" in the sidebar
2. **Add Employee**: Click "Add Employee" button, fill the form
3. **View Employee**: Click "View" button on any employee card
4. **Edit Employee**: Click "Edit" button to modify employee details
5. **Search**: Use the search bar to find specific employees
6. **Filter**: Select department from dropdown to filter employees

### 3. Processing Payroll
1. Navigate to "Payroll" in the sidebar
2. Select employees from the list
3. Enter hours worked and overtime (if applicable)
4. Click "Process Payroll" to calculate payments
5. View processed payroll in the history table
6. Records persist across browser sessions

### 4. Viewing Reports
1. Navigate to "Reports" in the sidebar
2. **Overview**: View key metrics and department statistics
3. **Performance**: Track employee performance and ratings
4. **Financial**: Analyze revenue, expenses, and profitability
5. **Export**: Click "Export PDF" or "Export Excel" buttons
6. **Date Range**: Adjust date filters for specific periods

##  Sample Data

The system comes with pre-populated sample data:

### Default Users
- **Admin**: admin@demo.com (password123)
- **HR Manager**: hr@company.com (password123)
- **Manager**: manager@company.com (password123)

### Sample Employees
- **John Doe** - Software Engineer, Engineering ($75,000)
- **Jane Smith** - Marketing Manager, Marketing ($65,000)
- **Bob Johnson** - Financial Analyst, Finance ($60,000)
- **Alice Brown** - HR Specialist, HR ($55,000)
- **Charlie Wilson** - Sales Representative, Sales ($50,000)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Reports
- `GET /api/reports/overview` - Dashboard overview data
- `GET /api/reports/performance` - Employee performance data
- `GET /api/reports/financial` - Financial analytics data

## Screenshots

### Dashboard
- Clean overview with key metrics
- Department statistics
- Recent activities

### Employee Management
- Modern card-based layout
- Advanced search and filtering
- Beautiful add/edit forms with validation

### Payroll Processing
- Interactive payroll calculation
- Persistent payroll history
- Status tracking system

### Reports & Analytics
- Comprehensive business insights
- Visual performance indicators
- Export functionality

## Environment Configuration

### Backend (.env)
```env
# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DATABASE_URL=sqlite:./database.sqlite

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Email Configuration (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@yourcompany.com
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:4000/api
```

## Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

### Production Build
```bash
# Frontend build
cd frontend && npm run build

# Backend production
cd backend && npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Run all tests
npm run test:all
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   make dev-frontend
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Health Check: http://localhost:4000/api/health

4. **Login with demo credentials:**
   - **Admin**: admin@company.com / password123
   - **HR**: hr@company.com / password123
   - **Manager**: manager@company.com / password123

### That's it! 

You now have a fully functional employee management system running locally.

## Detailed Setup Guide

### Manual Setup Steps

If you prefer to run commands manually:

1. **Start database services:**
   ```bash
   docker compose up -d postgres redis
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your settings if needed
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   ```

4. **Seed the database:**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

##  Available Commands

### Development Commands
```bash
make dev-backend     # Start backend development server
make dev-frontend    # Start frontend development server
make up              # Start PostgreSQL and Redis
make down            # Stop Docker services
make seed            # Seed database with sample data
make seed-reset      # Reset and re-seed database
```

### Testing Commands
```bash
make test            # Run all tests
make test-backend    # Run backend tests only
make test-frontend   # Run frontend tests only
```

### Utility Commands
```bash
make status          # Check system status
make logs            # Show Docker logs
make clean           # Clean up Docker resources
make help            # Show all available commands
```

##  Sample Data

The seed script creates:
- **3 default users** (Admin, HR, Manager)
- **1000+ employees** across 8 departments
- **Realistic salary data** based on roles and departments
- **Various employment statuses** (active, inactive, on leave, terminated)

### Default Login Credentials

| Role    | Email                 | Password    |
|---------|-----------------------|-------------|
| Admin   | admin@company.com     | password123 |
| HR      | hr@company.com        | password123 |
| Manager | manager@company.com   | password123 |

Employee accounts use their email addresses with `password123`.

##  Payroll System

### Running Payroll

1. **Login as Admin or HR**
2. **Navigate to Payroll section** (coming in frontend)
3. **Or use API directly:**
   ```bash
   curl -X POST http://localhost:4000/api/payrolls/run \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "payPeriod": {
         "start_date": "2024-01-01",
         "end_date": "2024-01-31"
       },
       "filters": {
         "department": "Engineering"
       },
       "options": {
         "sendEmails": false
       }
     }'
   ```

### Payroll Features

- **Automated calculations**: Tax, health insurance, 401k deductions
- **PDF payslips**: Generated automatically for each employee
- **Background processing**: Uses Redis queues for large payroll runs
- **Configurable tax rates**: Set via environment variables
- **Idempotency**: Prevents duplicate payroll runs for the same period

### Generated Files

- **Payslips**: `backend/payslips/payslip_[employee_id]_[date].pdf`
- **Summaries**: `backend/payrolls/payroll_summary_[date].json`

## 🌐 API Documentation

### Authentication Endpoints

| Method | Endpoint           | Description    | Access    |
|--------|--------------------|----------------|-----------|
| POST   | /api/auth/register | Register user  | Public    |
| POST   | /api/auth/login    | Login user     | Public    |
| POST   | /api/auth/logout   | Logout user    | Authenticated |
| POST   | /api/auth/refresh  | Refresh token  | Public    |

### Employee Endpoints

| Method | Endpoint              | Description       | Access        |
|--------|-----------------------|-------------------|---------------|
| GET    | /api/employees        | List employees    | Authenticated |
| GET    | /api/employees/:id    | Get employee      | Authenticated |
| POST   | /api/employees        | Create employee   | Admin, HR     |
| PUT    | /api/employees/:id    | Update employee   | Admin, HR, Manager |
| DELETE | /api/employees/:id    | Delete employee   | Admin         |

### Payroll Endpoints

| Method | Endpoint                    | Description         | Access    |
|--------|-----------------------------|---------------------|-----------|
| POST   | /api/payrolls/run          | Start payroll job   | Admin, HR |
| GET    | /api/payrolls/jobs/:id/status | Check job status   | Admin, HR |
| GET    | /api/payrolls              | List payrolls       | Admin, HR |
| GET    | /api/payrolls/:id          | Get payroll details | Admin, HR |

##  Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different roles
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Express-validator for all inputs
- **SQL Injection Prevention**: Sequelize ORM protections
- **CORS Protection**: Configured for frontend domain
- **Rate Limiting**: Built into the application (can be enhanced)

## Frontend Features

### Current Features
- **Authentication**: Login/logout with JWT tokens
- **Employee List**: Paginated table with search and filters
- **Responsive Design**: Works on desktop and mobile
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth user experience

### Coming Soon
- **Employee Details**: View individual employee profiles
- **Employee Forms**: Add/edit employee information
- **Payroll Dashboard**: Visual payroll management
- **Task Management**: Kanban board for project tasks
- **Reports**: Generate various business reports

## Docker Deployment

### Development with Docker
```bash
# Start only database services
docker compose up -d postgres redis

# Start full stack (optional)
docker compose --profile full up -d
```

### Production Deployment
```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d
```

## Testing

### Running Tests
```bash
# All tests
npm test

# Backend tests only
cd backend && npm test

# Frontend tests only
cd frontend && npm test

# With coverage
cd backend && npm test -- --coverage
```

### Test Structure
```
backend/tests/
├── setup.js           # Test configuration
├── auth.test.js       # Authentication tests
└── payroll.test.js    # Payroll calculation tests
```

## Deployment Options

### Option 1: Traditional Server
1. Set up PostgreSQL and Redis
2. Clone repository and install dependencies
3. Configure environment variables
4. Run `npm start` in backend and serve frontend build

### Option 2: Docker Compose
1. Clone repository
2. Configure environment in docker-compose.prod.yml
3. Run `docker compose -f docker-compose.prod.yml up -d`

### Option 3: Cloud Platforms
- **Heroku**: Use provided Procfile
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Use App Platform
- **AWS**: ECS with provided Dockerfiles

## Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgres://user:pass@host:5432/dbname

# JWT
JWT_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret

# Redis
REDIS_URL=redis://localhost:6379

# Payroll
TAX_RATE=0.10
PAYROLL_CURRENCY=USD

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_USER=your_email
SMTP_PASS=your_password
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:4000/api
```

## Performance Considerations

### Database Optimizations
- **Indexing**: Key fields are indexed for fast queries
- **Pagination**: Large result sets are paginated
- **Connection Pooling**: Sequelize manages database connections

### Frontend Optimizations
- **React Query**: Caching and background updates
- **Code Splitting**: Dynamic imports for better loading
- **Image Optimization**: Vite build optimizations

### Background Jobs
- **Redis Queues**: Heavy operations don't block API requests
- **Job Retry**: Failed jobs are automatically retried
- **Queue Monitoring**: Built-in job status tracking

## Extending the System

### Adding New Roles
1. Update the User model enum in `backend/src/models/User.js`
2. Update validation in `backend/src/routes/auth.js`
3. Add role checks in middleware

### Adding New Employee Fields
1. Update Employee model in `backend/src/models/Employee.js`
2. Update validation in employee routes
3. Update frontend forms and displays

### Adding New Features
1. **Create backend routes** in `backend/src/routes/`
2. **Add frontend pages** in `frontend/src/pages/`
3. **Update navigation** in `frontend/src/components/Header.jsx`
4. **Add tests** for new functionality

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check if PostgreSQL is running: `docker compose ps`
- Verify DATABASE_URL in .env
- Check logs: `make logs`

**Frontend won't connect to backend:**
- Verify VITE_API_URL in frontend/.env
- Check if backend is running on port 4000
- Look for CORS errors in browser console

**Database connection errors:**
- Ensure PostgreSQL container is healthy
- Check if database exists
- Verify credentials in DATABASE_URL

**Payroll jobs fail:**
- Check Redis connection
- Verify employee data exists
- Check payroll directory permissions

### Getting Help

1. **Check logs**: `make logs` or `docker compose logs`
2. **Verify status**: `make status`
3. **Reset everything**: `make clean && make setup`


## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding!**

If you found this helpful, please give it a ⭐ on GitHub!

## Developed By

* **Aditya Dasappanavar**
* **GitHub:** [AdityaD28](https://github.com/AdityaD28)
* **LinkedIn:** [adityadasappanavar](https://www.linkedin.com/in/adityadasappanavar/)
