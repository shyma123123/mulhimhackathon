# SmartShield Setup Guide

This guide will help you set up the complete SmartShield development environment.

## 📋 Prerequisites

### Required Software
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Docker & Docker Compose** - [Download](https://www.docker.com/)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL 15+** (if not using Docker)
- **Redis 7+** (if not using Docker)

### Recommended Tools
- **VS Code** with extensions:
  - TypeScript and JavaScript Language Features
  - Docker
  - PostgreSQL
  - REST Client
- **Postman** or **Insomnia** for API testing
- **Chrome** for extension testing

## 🚀 Quick Setup (Recommended)

### 1. Clone Repository
```bash
git clone <repository-url>
cd SmartShield
```

### 2. Environment Configuration
```bash
# Copy example environment file
cp example.env .env

# Edit with your settings
nano .env  # or use your preferred editor
```

### 3. Start Services with Docker
```bash
# Start database and Redis
docker-compose up -d db redis

# Wait for services to be ready
docker-compose logs -f db redis
```

### 4. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install dashboard dependencies
cd dashboard && npm install && cd ..

# Install extension dependencies
cd extension && npm install && cd ..
```

### 5. Database Setup
```bash
cd backend

# Run database migrations
npm run migrate

# Seed with test data (optional)
npm run seed
```

### 6. Start Development Servers
```bash
# Start all services
npm run dev

# Or start individually:
# Backend API (port 4000)
cd backend && npm run dev

# Dashboard (port 3000)
cd dashboard && npm run dev

# Website (port 8000)
cd website && python -m http.server 8000
```

## 🔧 Manual Setup (Alternative)

### Database Setup

#### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS:
brew install postgresql

# Windows:
# Download from https://www.postgresql.org/download/windows/

# Create database
sudo -u postgres createdb smartshield
sudo -u postgres psql -c "CREATE USER smartshield WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE smartshield TO smartshield;"
```

#### Option 2: Docker PostgreSQL
```bash
# Start PostgreSQL container
docker run -d \
  --name smartshield-db \
  -e POSTGRES_DB=smartshield \
  -e POSTGRES_USER=smartshield \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine
```

### Redis Setup

#### Option 1: Local Redis
```bash
# Ubuntu/Debian:
sudo apt-get install redis-server

# macOS:
brew install redis

# Windows:
# Download from https://github.com/microsoftarchive/redis/releases

# Start Redis
redis-server
```

#### Option 2: Docker Redis
```bash
# Start Redis container
docker run -d \
  --name smartshield-redis \
  -p 6379:6379 \
  redis:7-alpine
```

## 🔑 Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgres://smartshield:password@localhost:5432/smartshield
REDIS_URL=redis://localhost:6379

# AI Model Configuration
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
MODEL_PROVIDER=gemini

# Security Configuration
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGINS=http://localhost:3000,http://localhost:4000,http://localhost:8000

# Application Configuration
NODE_ENV=development
PORT=4000
LOG_LEVEL=debug

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Optional: Monitoring
SENTRY_DSN=your_sentry_dsn_here
```

### Getting API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to `GEMINI_API_KEY`

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to `OPENAI_API_KEY`

## 🗄️ Database Initialization

### Run Migrations
```bash
cd backend

# Check migration status
npm run migrate:status

# Run all migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback
```

### Seed Test Data
```bash
cd backend

# Seed with sample data
npm run seed

# Seed with phishing samples
npm run seed:phishing

# Clear all data
npm run seed:clear
```

## 🧪 Testing Setup

### Unit Tests
```bash
# Backend tests
cd backend
npm test

# Dashboard tests
cd dashboard
npm test

# Extension tests
cd extension
npm test
```

### Integration Tests
```bash
# Full system test
npm run test:integration

# API endpoint tests
npm run test:api

# Database tests
npm run test:db
```

### Manual Testing
```bash
# Start test environment
npm run test:env

# Run test scenarios
npm run test:scenarios
```

## 🌐 Service URLs

After setup, services will be available at:

- **Backend API**: http://localhost:4000
- **Dashboard**: http://localhost:3000
- **Website**: http://localhost:8000
- **Database**: localhost:5432
- **Redis**: localhost:6379

### API Health Check
```bash
curl http://localhost:4000/health
```

### Database Connection Test
```bash
cd backend
npm run db:test
```

## 🔧 Development Tools

### VS Code Configuration

Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

### Recommended Extensions
- TypeScript and JavaScript Language Features
- Docker
- PostgreSQL
- REST Client
- GitLens
- Prettier
- ESLint

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -h localhost -U smartshield -d smartshield

# Reset database
npm run db:reset
```

#### Redis Connection Failed
```bash
# Check if Redis is running
redis-cli ping

# Restart Redis
sudo systemctl restart redis
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :4000

# Kill process
kill -9 <PID>
```

#### Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Logs and Debugging

#### Backend Logs
```bash
cd backend
npm run logs

# Or with Docker
docker-compose logs -f backend
```

#### Database Logs
```bash
# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Or with Docker
docker-compose logs -f db
```

## 📚 Next Steps

After successful setup:

1. **Read the [API Documentation](docs/api.md)**
2. **Explore the [Testing Guide](docs/testing_guide.md)**
3. **Check out the [Database Schema](docs/database.md)**
4. **Review [Security Guidelines](docs/security.md)**

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Documentation](docs/)
3. Search [GitHub Issues](https://github.com/your-org/smartshield/issues)
4. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

---

**Happy coding! 🚀**
