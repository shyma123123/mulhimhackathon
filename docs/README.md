# SmartShield - Advanced Phishing Detection System

A production-ready Google Chrome extension + backend + analytics dashboard that detects phishing in pages and emails, shows in-browser warnings, and provides a floating contextual chatbot for explanations.

## 🚀 Features

### Chrome Extension (Manifest V3)
- **Real-time Content Analysis**: Scrapes full page content (DOM & visible email text)
- **Local ML Detection**: Runs heuristics and lightweight ML to detect phishing suspicion
- **Instant Warnings**: Shows immediate warning popup for suspicious content
- **Floating Chatbot**: Contextual AI assistant for explanations
- **Privacy-First**: On-device processing with minimal data transmission

### Backend API (Node.js + Express)
- **RESTful API**: Complete REST API for scan, chat, analytics, and auth
- **Model Bridge**: Configurable LLM provider switching (Gemini/OpenAI/Local)
- **Analytics Engine**: Comprehensive analytics and reporting
- **JWT Authentication**: Secure user authentication and authorization
- **PostgreSQL Database**: Robust data storage with proper indexing

### Dashboard (React + Terminal UI)
- **Terminal Aesthetic**: Geeky/tech vibe with Roboto + monospace fonts
- **Real-time Analytics**: Live monitoring of scans, threats, and user engagement
- **Interactive Charts**: Beautiful visualizations using Recharts
- **Admin Settings**: Configuration management and API key management
- **Export Capabilities**: CSV/JSON export functionality

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome        │    │   Backend       │    │   Dashboard     │
│   Extension     │◄──►│   API           │◄──►│   (React)       │
│                 │    │                 │    │                 │
│ • Content Script│    │ • Express.js    │    │ • Terminal UI   │
│ • Service Worker│    │ • PostgreSQL    │    │ • Analytics     │
│ • Popup UI      │    │ • Redis Cache   │    │ • Charts        │
│ • Chatbot Widget│    │ • Model Bridge  │    │ • Settings      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Extension
- **Manifest V3** - Latest Chrome extension standard
- **TypeScript** - Type-safe development
- **React** - Modern UI components
- **Webpack** - Module bundling

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend development
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **JWT** - Authentication tokens

### Dashboard
- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom terminal theme
- **Recharts** - Data visualization
- **React Query** - Data fetching and caching
- **Zustand** - State management

### ML/AI
- **Model Bridge Pattern** - Provider abstraction
- **Google Gemini** - Default/fallback LLM
- **OpenAI GPT** - Alternative LLM provider
- **Local Models** - Future local inference support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### 1. Clone and Setup
```bash
git clone <repository-url>
cd SmartShield
cp example.env .env
```

### 2. Configure Environment
Edit `.env` file with your settings:
```bash
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgres://postgres:password@localhost:5432/phish_prod

# Model Provider
MODEL_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

# Security
JWT_SECRET=your_strong_secret_here
```

### 3. Start with Docker
```bash
# Start all services
docker-compose up -d

# Or start individual services
docker-compose up -d db redis
npm run dev:backend
npm run dev:dashboard
```

### 4. Load Extension
```bash
cd extension
npm install
npm run build
```
Then load the `extension/dist` folder as an unpacked extension in Chrome.

## 📁 Project Structure

```
SmartShield/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Configuration management
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   ├── sql/                # Database migrations
│   └── Dockerfile
├── extension/              # Chrome extension
│   ├── src/
│   │   ├── background/     # Service worker
│   │   ├── content/        # Content scripts
│   │   ├── popup/          # Extension popup
│   │   ├── services/       # Extension services
│   │   └── utils/          # Utilities
│   ├── public/             # Static assets
│   └── webpack.config.js
├── dashboard/              # React dashboard
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # State management
│   │   └── utils/          # Utilities
│   └── Dockerfile
├── docker-compose.yml      # Container orchestration
└── README.md
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm test            # Run tests
npm run lint        # Lint code
```

### Extension Development
```bash
cd extension
npm install
npm run dev          # Build in watch mode
npm run build        # Production build
npm test            # Run tests
```

### Dashboard Development
```bash
cd dashboard
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm test            # Run tests
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:coverage     # Coverage report
npm run test:integration  # Integration tests
```

### Extension Tests
```bash
cd extension
npm test                  # Jest tests
npm run test:watch        # Watch mode
```

### E2E Tests
```bash
npm run test:e2e          # End-to-end tests
```

## 📊 API Documentation

### Core Endpoints

#### Scan Analysis
```http
POST /api/scan
Content-Type: application/json

{
  "sanitized_text": "Page content...",
  "metadata": {
    "url": "https://example.com",
    "domain": "example.com"
  }
}
```

#### Chat Interaction
```http
POST /api/chat
Content-Type: application/json

{
  "sanitized_text": "Context content...",
  "question": "Why was this flagged?",
  "session_id": "unique-session-id"
}
```

#### Analytics
```http
POST /api/analytics
Content-Type: application/json

{
  "event": "scan",
  "orgId": "organization-id",
  "meta": {
    "score": 0.8,
    "label": "phishing"
  }
}
```

## 🔒 Privacy & Security

### Privacy-First Design
- **On-Device Processing**: Local heuristics before cloud analysis
- **PII Redaction**: Automatic removal of sensitive information
- **Minimal Data**: Only necessary data transmitted to backend
- **User Control**: Clear opt-in/opt-out mechanisms

### Security Features
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin setup

## 🚀 Deployment

### Production Deployment
```bash
# Build all components
npm run build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
npm run migrate
```

### Environment Variables
See `example.env` for all available configuration options.

## 📈 Monitoring

### Health Checks
- `/health` - Basic health check
- `/health/detailed` - Comprehensive system health
- `/health/metrics` - Prometheus-style metrics

### Logging
- Structured JSON logging with Winston
- Correlation IDs for request tracking
- Security event logging
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for questions

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core extension functionality
- ✅ Backend API with model bridge
- ✅ Basic dashboard
- ✅ Docker deployment

### Phase 2 (Next)
- 🔄 Advanced analytics and reporting
- 🔄 Enhanced chatbot with context awareness
- 🔄 Mobile app support
- 🔄 Enterprise features

### Phase 3 (Future)
- 🔄 Local model integration
- 🔄 Advanced ML pipeline
- 🔄 Multi-language support
- 🔄 API marketplace integration

---

**Built with ❤️ by the SmartShield Team**
