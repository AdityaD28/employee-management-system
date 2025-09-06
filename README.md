# Employee Management System

A complete, beginner-friendly full-stack employee management system built with Node.js, React, PostgreSQL, and Redis.

## 🎯 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, HR, Manager, Employee)
- **Employee Management**: Full CRUD operations with search, filtering, and pagination
- **Payroll Processing**: Automated payroll calculation with PDF payslip generation using Bull queues
- **Modern UI**: Responsive React frontend with Tailwind CSS
- **Containerized**: Docker support for easy deployment
- **Testing**: Unit and integration tests with Jest
- **CI/CD**: GitHub Actions pipeline for automated testing and building

## 🏗️ Architecture

```
┌─────────────────┐    HTTP     ┌─────────────────┐    SQL      ┌─────────────────┐
│                 │   Requests  │                 │   Queries   │                 │
│   React App     │ ◄────────► │   Express API   │ ◄────────► │   PostgreSQL    │
│   (Frontend)    │             │   (Backend)     │             │   (Database)    │
│                 │             │                 │             │                 │
└─────────────────┘             └─────────────────┘             └─────────────────┘
                                         │                               
                                         │ Queue Jobs                    
                                         ▼                               
                                ┌─────────────────┐                      
                                │                 │                      
                                │      Redis      │                      
                                │   (Job Queue)   │                      
                                │                 │                      
                                └─────────────────┘                      
```

## 🚀 I am a beginner — start here

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Docker Desktop ([Download](https://docs.docker.com/get-docker/))
- Git ([Download](https://git-scm.com/downloads))

### Quick Setup (5 minutes)

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo-url>
   cd employee-management-system
   make setup
   ```
   This will:
   - Start PostgreSQL and Redis containers
   - Install all dependencies
   - Seed the database with 1000+ sample employees

2. **Start development servers:**
   
   Open two terminal windows:
   
   **Terminal 1 - Backend:**
   ```bash
   make dev-backend
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

### That's it! 🎉

You now have a fully functional employee management system running locally.

## 📚 Detailed Setup Guide

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

## 🔧 Available Commands

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

## 📊 Sample Data

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

## 💼 Payroll System

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

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different roles
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Express-validator for all inputs
- **SQL Injection Prevention**: Sequelize ORM protections
- **CORS Protection**: Configured for frontend domain
- **Rate Limiting**: Built into the application (can be enhanced)

## 📱 Frontend Features

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

## 🐳 Docker Deployment

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

## 🧪 Testing

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

## 🚀 Deployment Options

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

## 🔧 Configuration

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

## 📈 Performance Considerations

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

## 🛠️ Extending the System

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

## 🐛 Troubleshooting

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

## 📝 Development Roadmap

### Phase 1 ✅ (Completed)
- [x] Basic authentication system
- [x] Employee CRUD operations
- [x] Payroll processing with queues
- [x] Frontend with React and Tailwind
- [x] Docker setup and documentation

### Phase 2 🚧 (In Progress)
- [ ] Employee detail views and forms
- [ ] Payroll dashboard in frontend
- [ ] Advanced search and filtering
- [ ] File upload for employee photos
- [ ] Email notifications

### Phase 3 📋 (Planned)
- [ ] Task management (Kanban board)
- [ ] Reporting and analytics
- [ ] Performance reviews
- [ ] Time tracking
- [ ] Mobile app (React Native)

### Phase 4 🎯 (Future)
- [ ] Advanced HR workflows
- [ ] Integration with external systems
- [ ] Multi-tenant support
- [ ] Advanced reporting
- [ ] API rate limiting and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit with clear messages
5. Push and create a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Frameworks**: Express.js, React, Sequelize
- **Styling**: Tailwind CSS
- **Testing**: Jest, Supertest, React Testing Library
- **Infrastructure**: Docker, PostgreSQL, Redis
- **CI/CD**: GitHub Actions

---

**Happy coding! 🚀**

If you found this helpful, please give it a ⭐ on GitHub!
