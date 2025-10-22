/**
 * Logging configuration for SmartShield backend
 * 
 * This module provides centralized logging using Winston with:
 * - Structured JSON logging
 * - Different log levels for different environments
 * - Request correlation IDs
 * - Security-aware logging (no sensitive data)
 */

import winston from 'winston';
import { config } from './config';

/**
 * Custom log format for security and readability
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const logEntry = {
      timestamp,
      level,
      message,
      ...(stack && { stack }),
      ...meta
    };
    
    // Remove sensitive data from logs
    const sanitized = sanitizeLogData(logEntry);
    
    return JSON.stringify(sanitized, null, 2);
  })
);

/**
 * Sanitize log data to remove sensitive information
 */
function sanitizeLogData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveKeys = [
    'password', 'token', 'apiKey', 'secret', 'authorization',
    'email', 'phone', 'ssn', 'creditCard', 'bankAccount'
  ];

  const sanitized = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      (sanitized as any)[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as any)[key] = sanitizeLogData(value);
    } else {
      (sanitized as any)[key] = value;
    }
  }

  return sanitized;
}

/**
 * Create logger instance based on environment
 */
const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: {
    service: 'smartshield-backend',
    environment: config.nodeEnv
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

/**
 * Add file transport for production
 */
if (config.nodeEnv === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }));

  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }));
}

/**
 * Security logging utilities
 */
export const securityLogger = {
  /**
   * Log security events (phishing detections, suspicious activity)
   */
  logSecurityEvent: (event: string, details: any) => {
    logger.warn('Security Event', {
      event,
      ...details,
      category: 'security'
    });
  },

  /**
   * Log authentication events
   */
  logAuthEvent: (event: string, userId?: string, ip?: string) => {
    logger.info('Authentication Event', {
      event,
      userId,
      ip,
      category: 'auth'
    });
  },

  /**
   * Log API access
   */
  logApiAccess: (endpoint: string, method: string, ip: string, userAgent?: string) => {
    logger.info('API Access', {
      endpoint,
      method,
      ip,
      userAgent,
      category: 'api'
    });
  },

  /**
   * Log phishing detection results
   */
  logPhishingDetection: (score: number, url: string, reasons: string[], orgId?: string) => {
    logger.info('Phishing Detection', {
      score,
      url: sanitizeUrl(url),
      reasons,
      orgId,
      category: 'phishing'
    });
  }
};

/**
 * Sanitize URL for logging (remove sensitive query parameters)
 */
function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const sensitiveParams = ['token', 'key', 'password', 'secret'];
    
    sensitiveParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, '[REDACTED]');
      }
    });
    
    return urlObj.toString();
  } catch {
    return '[INVALID_URL]';
  }
}

/**
 * Request correlation ID management
 */
let correlationId = 0;

export function generateCorrelationId(): string {
  return `req_${++correlationId}_${Date.now()}`;
}

export function withCorrelationId<T extends object>(data: T, id: string): T & { correlationId: string } {
  return { ...data, correlationId: id };
}

export { logger };
