# SmartShield - AI-Powered Phishing Detection Platform

![SmartShield Logo](https://img.shields.io/badge/SmartShield-AI%20Phishing%20Detection-blue?style=for-the-badge)

A comprehensive cybersecurity platform that combines AI-powered phishing detection with interactive training games to protect users from cyber threats.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### One-Command Setup
```bash
# Clone and start everything
git clone <repository-url>
cd SmartShield
docker-compose up -d
```

### Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp example.env .env
# Edit .env with your configuration

# 3. Start database
docker-compose up -d db redis

# 4. Run migrations
cd backend && npm run migrate

# 5. Start services
npm run dev
```

## 📁 Project Structure

```
SmartShield/
├── 📁 backend/           # Node.js API server
│   ├── src/
│   │   ├── config/       # Database, Redis, Logger configs
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Auth, error handling
│   │   └── utils/        # Helper functions
│   ├── sql/             # Database schemas
│   └── Dockerfile       # Container config
├── 📁 dashboard/         # React admin dashboard
│   ├── src/
│   │   ├── pages/       # Dashboard pages
│   │   ├── components/  # Reusable components
│   │   └── stores/      # State management
│   └── Dockerfile
├── 📁 extension/         # Chrome extension
│   ├── src/
│   │   ├── background/  # Service worker
│   │   ├── content/     # Content scripts
│   │   └── services/    # Detection logic
│   └── webpack.config.js
├── 📁 website/          # Marketing website + games
│   ├── *.html          # Game pages
│   ├── *.js            # Game logic
│   └── styles.css      # Styling
├── 📁 docs/            # Documentation
├── 📁 test-dataset/    # Phishing samples
└── docker-compose.yml  # Multi-service setup
```

## 🎮 Features

### 🛡️ Phishing Detection
- **Real-time scanning** of websites and emails
- **AI-powered analysis** using multiple ML models
- **Chrome extension** for browser protection
- **API integration** for enterprise systems

### 🎯 Interactive Training Games
- **Phish or Safe?** - Email classification training
- **Spot the Red Flag** - Visual phishing detection
- **Phishroom Escape** - Scenario-based learning

### 📊 Analytics & Monitoring
- **Real-time dashboard** with threat analytics
- **User behavior tracking** and reporting
- **Custom alerts** and notifications
- **Compliance reporting** for organizations

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgres://user:pass@localhost:5432/smartshield
REDIS_URL=redis://localhost:6379

# AI Models
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
MODEL_PROVIDER=gemini

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=http://localhost:3000,http://localhost:4000

# Application
NODE_ENV=development
PORT=4000
```

### Database Setup
```bash
# Start PostgreSQL
docker-compose up -d db

# Run migrations
cd backend
npm run migrate

# Seed test data
npm run seed
```

## 🚀 Development

### Backend API
```bash
cd backend
npm install
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run migrate      # Database migrations
```

### Dashboard
```bash
cd dashboard
npm install
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
```

### Chrome Extension
```bash
cd extension
npm install
npm run build        # Build extension
npm run test         # Run tests
```

### Website & Games
```bash
cd website
# Static files - serve with any HTTP server
python -m http.server 8000
# or
npx serve .
```

## 🧪 Testing

### Unit Tests
```bash
# Backend tests
cd backend && npm test

# Dashboard tests  
cd dashboard && npm test

# Extension tests
cd extension && npm test
```

### Integration Tests
```bash
# Full system test
npm run test:integration

# Database tests
npm run test:db

# API tests
npm run test:api
```

### Manual Testing
See [Testing Guide](docs/testing_guide.md) for comprehensive testing instructions.

## 📦 Deployment

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Manual Deployment
```bash
# Build all services
npm run build:all

# Deploy backend
cd backend && npm run deploy

# Deploy dashboard
cd dashboard && npm run deploy
```

## 🔒 Security

### API Security
- JWT-based authentication
- Rate limiting with Redis
- Input validation and sanitization
- CORS protection

### Database Security
- Connection pooling
- Prepared statements
- Encrypted connections
- Regular backups

### Extension Security
- Content Security Policy
- Manifest v3 compliance
- Secure message passing
- Permission minimization

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Testing Guide](docs/testing_guide.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guide](docs/security.md)
- [Contributing Guide](docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [Contributing Guide](docs/contributing.md) for detailed instructions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/smartshield/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/smartshield/discussions)
- **Email**: support@smartshield.com

## 🏆 Acknowledgments

- AI models powered by Google Gemini and OpenAI
- Database design inspired by cybersecurity best practices
- UI/UX design following modern web standards
- Security practices based on OWASP guidelines

---

**Made with ❤️ for cybersecurity education and protection**
