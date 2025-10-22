/**
 * SmartShield Backend API Server
 * 
 * This is the main entry point for the SmartShield phishing detection backend.
 * It provides APIs for:
 * - Phishing detection and analysis
 * - Chatbot integration with LLM providers
 * - Analytics data collection
 * - User authentication
 * - Admin dashboard data
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { config } from '@/config/config';
import { logger } from '@/config/logger';
import { connectDatabase } from '@/config/database';
import { connectRedis } from '@/config/redis';

// Import route handlers
import scanRoutes from '@/routes/scan';
import chatRoutes from '@/routes/chat';
import analyticsRoutes from '@/routes/analytics';
import authRoutes from '@/routes/auth';
import statsRoutes from '@/routes/stats';
import healthRoutes from '@/routes/health';

// Import middleware
import { errorHandler } from '@/middleware/errorHandler';
import { requestLogger } from '@/middleware/requestLogger';
import { validateApiKey } from '@/middleware/auth';

// Load environment variables
dotenv.config();

class Server {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize middleware for security, logging, and request processing
   */
  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
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
    this.app.use(cors({
      origin: config.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    }));

    // Compression middleware
    this.app.use(compression());

    // Request logging
    this.app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimitWindow,
      max: config.rateLimitRequests,
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(config.rateLimitWindow / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Custom request logging
    this.app.use(requestLogger);
  }

  /**
   * Initialize API routes
   */
  private initializeRoutes(): void {
    // Health check endpoint (no auth required)
    this.app.use('/health', healthRoutes);

    // API routes with authentication
    this.app.use('/api/scan', validateApiKey, scanRoutes);
    this.app.use('/api/chat', validateApiKey, chatRoutes);
    this.app.use('/api/analytics', validateApiKey, analyticsRoutes);
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/stats', validateApiKey, statsRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        name: 'SmartShield API',
        version: '1.0.0',
        status: 'operational',
        endpoints: {
          health: '/health',
          scan: '/api/scan',
          chat: '/api/chat',
          analytics: '/api/analytics',
          auth: '/api/auth',
          stats: '/api/stats'
        }
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`,
        availableEndpoints: [
          '/health',
          '/api/scan',
          '/api/chat',
          '/api/analytics',
          '/api/auth',
          '/api/stats'
        ]
      });
    });
  }

  /**
   * Initialize error handling middleware
   */
  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Start the server and connect to external services
   */
  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();
      logger.info('Database connected successfully');

      // Connect to Redis
      await connectRedis();
      logger.info('Redis connected successfully');

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`🚀 SmartShield API server running on port ${this.port}`);
        logger.info(`📊 Environment: ${config.nodeEnv}`);
        logger.info(`🤖 Model Provider: ${config.modelProvider}`);
        logger.info(`🔒 Privacy Mode: ${config.privacyMode ? 'enabled' : 'disabled'}`);
      });

      // Graceful shutdown handling
      process.on('SIGTERM', this.gracefulShutdown);
      process.on('SIGINT', this.gracefulShutdown);

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown handler
   */
  private gracefulShutdown = (signal: string): void => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    
    // Close server
    process.exit(0);
  };
}

// Create and start server
const server = new Server();
server.start().catch((error) => {
  logger.error('Server startup failed:', error);
  process.exit(1);
});

export default server;
