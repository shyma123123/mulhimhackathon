/**
 * Development server that runs without database dependencies
 * This is a simplified version for development/testing purposes
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Compression middleware
app.use(compression());

// Request logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'development',
    services: {
      database: 'mock',
      redis: 'mock',
      model: 'mock'
    }
  });
});

// Mock API endpoints
app.get('/api/scan', (req, res) => {
  res.json({
    success: true,
    message: 'Mock scan endpoint - database not connected',
    data: {
      url: req.query.url || 'example.com',
      score: 0.5,
      label: 'unknown',
      reasons: ['Mock response - no actual analysis performed']
    }
  });
});

app.post('/api/scan', (req, res) => {
  res.json({
    success: true,
    message: 'Mock scan endpoint - database not connected',
    data: {
      url: req.body.url || 'example.com',
      score: Math.random(),
      label: Math.random() > 0.5 ? 'phishing' : 'safe',
      reasons: ['Mock response - no actual analysis performed']
    }
  });
});

app.get('/api/chat', (req, res) => {
  res.json({
    success: true,
    message: 'Mock chat endpoint - database not connected',
    data: {
      sessionId: 'mock-session-' + Date.now(),
      messages: [
        {
          role: 'assistant',
          content: 'This is a mock response. The backend is running in development mode without database connections.'
        }
      ]
    }
  });
});

app.post('/api/chat', (req, res) => {
  res.json({
    success: true,
    message: 'Mock chat endpoint - database not connected',
    data: {
      sessionId: req.body.sessionId || 'mock-session-' + Date.now(),
      messages: [
        {
          role: 'user',
          content: req.body.message || 'Hello'
        },
        {
          role: 'assistant',
          content: 'This is a mock response. The backend is running in development mode without database connections.'
        }
      ]
    }
  });
});

app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    message: 'Mock analytics endpoint - database not connected',
    data: {
      totalScans: 0,
      phishingDetected: 0,
      safeDetected: 0,
      averageScore: 0,
      recentActivity: []
    }
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    message: 'Mock stats endpoint - database not connected',
    data: {
      totalUsers: 0,
      totalScans: 0,
      systemHealth: 'mock',
      uptime: process.uptime()
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SmartShield API (Development Mode)',
    version: '1.0.0',
    status: 'operational',
    mode: 'development',
    note: 'Running without database connections',
    endpoints: {
      health: '/health',
      scan: '/api/scan',
      chat: '/api/chat',
      analytics: '/api/analytics',
      stats: '/api/stats'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/health',
      '/api/scan',
      '/api/chat',
      '/api/analytics',
      '/api/stats'
    ]
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartShield API server (Development Mode) running on port ${PORT}`);
  console.log(`📊 Environment: development`);
  console.log(`🔧 Mode: Mock endpoints (no database)`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

export default app;

