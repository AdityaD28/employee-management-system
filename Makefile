# Employee Management System - Development Makefile
# Step 10: Local development commands for easy setup and running

.PHONY: help up down dev-backend dev-frontend seed test clean logs

# Default target
help:
	@echo "Employee Management System - Development Commands"
	@echo ""
	@echo "Setup Commands:"
	@echo "  make setup          - Complete setup (dependencies + Docker + seed)"
	@echo "  make up             - Start PostgreSQL and Redis with Docker Compose"
	@echo "  make down           - Stop Docker services"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev-backend    - Run backend in development mode"
	@echo "  make dev-frontend   - Run frontend in development mode"
	@echo "  make dev            - Run both backend and frontend concurrently"
	@echo ""
	@echo "Database Commands:"
	@echo "  make seed           - Run database seed script (1000+ employees)"
	@echo "  make seed-reset     - Reset database and re-seed"
	@echo ""
	@echo "Testing Commands:"
	@echo "  make test           - Run all tests"
	@echo "  make test-backend   - Run backend tests only"
	@echo "  make test-frontend  - Run frontend tests only"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make logs           - Show Docker logs"
	@echo "  make clean          - Clean up Docker volumes and containers"
	@echo "  make install        - Install dependencies for both backend and frontend"

# Complete setup for beginners
setup: up install seed
	@echo "✅ Setup complete! You can now run 'make dev' to start development"

# Start Docker services
up:
	@echo "🐳 Starting PostgreSQL and Redis..."
	docker compose up -d postgres redis
	@echo "✅ Docker services started"
	@echo "📊 PostgreSQL: localhost:5432"
	@echo "🔄 Redis: localhost:6379"

# Stop Docker services
down:
	@echo "🛑 Stopping Docker services..."
	docker compose down

# Install dependencies
install:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Dependencies installed"

# Run backend in development mode
dev-backend:
	@echo "🚀 Starting backend development server..."
	@echo "📋 Backend will be available at http://localhost:4000"
	@echo "🔍 Health check: http://localhost:4000/api/health"
	cd backend && npm run dev

# Run frontend in development mode
dev-frontend:
	@echo "🚀 Starting frontend development server..."
	@echo "🌐 Frontend will be available at http://localhost:5173"
	cd frontend && npm run dev

# Run both backend and frontend (requires terminal multiplexer)
dev:
	@echo "🚀 Starting both backend and frontend..."
	@echo "📋 Backend: http://localhost:4000"
	@echo "🌐 Frontend: http://localhost:5173"
	@echo ""
	@echo "💡 Tip: Open two terminals and run:"
	@echo "   Terminal 1: make dev-backend"
	@echo "   Terminal 2: make dev-frontend"

# Seed database with sample data
seed:
	@echo "🌱 Seeding database with sample data..."
	cd backend && npm run seed
	@echo "✅ Database seeded with 1000+ employees"
	@echo "💡 Login credentials:"
	@echo "   Admin: admin@company.com / password123"
	@echo "   HR: hr@company.com / password123"
	@echo "   Manager: manager@company.com / password123"

# Reset and re-seed database
seed-reset:
	@echo "🗑️ Resetting and re-seeding database..."
	cd backend && node scripts/seed.js --reset
	@echo "✅ Database reset and seeded"

# Run tests
test:
	@echo "🧪 Running all tests..."
	make test-backend
	make test-frontend

test-backend:
	@echo "🧪 Running backend tests..."
	cd backend && npm test

test-frontend:
	@echo "🧪 Running frontend tests..."
	cd frontend && npm test

# Show Docker logs
logs:
	@echo "📜 Showing Docker logs..."
	docker compose logs -f

# Clean up Docker resources
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker compose down -v
	docker system prune -f
	@echo "✅ Cleanup complete"

# Quick status check
status:
	@echo "📊 System Status:"
	@echo ""
	@echo "Docker Services:"
	@docker compose ps
	@echo ""
	@echo "Backend Health:"
	@curl -s http://localhost:4000/api/health 2>/dev/null || echo "❌ Backend not responding"
	@echo ""
	@echo "Frontend:"
	@curl -s http://localhost:5173 2>/dev/null >/dev/null && echo "✅ Frontend responding" || echo "❌ Frontend not responding"
