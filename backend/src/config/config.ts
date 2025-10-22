/**
 * Configuration management for SmartShield backend
 * 
 * This module centralizes all configuration settings including:
 * - Server configuration
 * - Database settings
 * - Model provider settings
 * - Security and privacy settings
 * - Detection thresholds
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
  // Server configuration
  port: number;
  nodeEnv: string;
  baseUrl: string;
  
  // Database configuration
  databaseUrl: string;
  redisUrl: string;
  
  // Authentication
  jwtSecret: string;
  
  // Model provider configuration
  modelProvider: 'gemini' | 'openai' | 'local';
  modelName: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  
  // Extension configuration
  extensionBackendUrl: string;
  
  // Analytics and privacy
  retentionDays: number;
  privacyMode: boolean;
  piiRedaction: boolean;
  
  // Security and monitoring
  sentryDsn?: string;
  corsOrigins: string[];
  
  // Detection thresholds
  lowThreshold: number;
  highThreshold: number;
  reportThreshold: number;
  
  // Rate limiting
  rateLimitRequests: number;
  rateLimitWindow: number;
}

/**
 * Validate required environment variables
 */
function validateConfig(): void {
  const required = [
    'JWT_SECRET',
    'DATABASE_URL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate model provider configuration
  const modelProvider = process.env.MODEL_PROVIDER as string;
  if (modelProvider && !['gemini', 'openai', 'local'].includes(modelProvider)) {
    throw new Error(`Invalid MODEL_PROVIDER: ${modelProvider}. Must be one of: gemini, openai, local`);
  }

  // Validate thresholds
  const lowThreshold = parseFloat(process.env.LOW_THRESHOLD || '0.3');
  const highThreshold = parseFloat(process.env.HIGH_THRESHOLD || '0.7');
  const reportThreshold = parseFloat(process.env.REPORT_THRESHOLD || '0.8');

  if (lowThreshold >= highThreshold || highThreshold >= reportThreshold) {
    throw new Error('Invalid thresholds: LOW_THRESHOLD < HIGH_THRESHOLD < REPORT_THRESHOLD');
  }
}

/**
 * Parse comma-separated CORS origins
 */
function parseCorsOrigins(origins: string): string[] {
  return origins.split(',').map(origin => origin.trim()).filter(Boolean);
}

/**
 * Load and validate configuration
 */
export const config: Config = (() => {
  try {
    validateConfig();

    return {
      // Server configuration
      port: parseInt(process.env.PORT || '4000', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      baseUrl: process.env.BASE_URL || 'http://localhost:4000',
      
      // Database configuration
      databaseUrl: process.env.DATABASE_URL!,
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      
      // Authentication
      jwtSecret: process.env.JWT_SECRET!,
      
      // Model provider configuration
      modelProvider: (process.env.MODEL_PROVIDER as 'gemini' | 'openai' | 'local') || 'gemini',
      modelName: process.env.MODEL_NAME || 'gemini-free',
      geminiApiKey: process.env.GEMINI_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
      
      // Extension configuration
      extensionBackendUrl: process.env.EXTENSION_BACKEND_URL || 'http://localhost:4000',
      
      // Analytics and privacy
      retentionDays: parseInt(process.env.RETENTION_DAYS || '365', 10),
      privacyMode: process.env.PRIVACY_MODE !== 'false',
      piiRedaction: process.env.PII_REDACTION !== 'false',
      
      // Security and monitoring
      sentryDsn: process.env.SENTRY_DSN,
      corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:4000'),
      
      // Detection thresholds
      lowThreshold: parseFloat(process.env.LOW_THRESHOLD || '0.3'),
      highThreshold: parseFloat(process.env.HIGH_THRESHOLD || '0.7'),
      reportThreshold: parseFloat(process.env.REPORT_THRESHOLD || '0.8'),
      
      // Rate limiting
      rateLimitRequests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100', 10),
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
    };
  } catch (error) {
    console.error('Configuration validation failed:', error);
    process.exit(1);
  }
})();

/**
 * Get model provider specific configuration
 */
export function getModelConfig(): { provider: string; apiKey?: string; modelName: string } {
  switch (config.modelProvider) {
    case 'gemini':
      return {
        provider: 'gemini',
        apiKey: config.geminiApiKey,
        modelName: config.modelName
      };
    case 'openai':
      return {
        provider: 'openai',
        apiKey: config.openaiApiKey,
        modelName: config.modelName
      };
    case 'local':
      return {
        provider: 'local',
        modelName: config.modelName
      };
    default:
      throw new Error(`Unsupported model provider: ${config.modelProvider}`);
  }
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return config.nodeEnv === 'development' && process.env.DEBUG_MODE === 'true';
}

/**
 * Get detection threshold configuration
 */
export function getThresholds() {
  return {
    low: config.lowThreshold,
    high: config.highThreshold,
    report: config.reportThreshold
  };
}
