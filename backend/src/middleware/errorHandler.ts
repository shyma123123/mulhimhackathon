/**
 * Error Handling Middleware
 * 
 * Centralized error handling for the application:
 * - Structured error responses
 * - Error logging and monitoring
 * - Security-aware error messages
 * - Request correlation tracking
 */

import { Request, Response, NextFunction } from 'express';
import { logger, generateCorrelationId } from '@/config/logger';
import { config } from '@/config/config';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  correlationId?: string;
}

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  public statusCode = 400;
  public code = 'VALIDATION_ERROR';
  public isOperational = true;

  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  public statusCode = 401;
  public code = 'AUTHENTICATION_ERROR';
  public isOperational = true;

  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  public statusCode = 403;
  public code = 'AUTHORIZATION_ERROR';
  public isOperational = true;

  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  public statusCode = 404;
  public code = 'NOT_FOUND';
  public isOperational = true;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  public statusCode = 409;
  public code = 'CONFLICT';
  public isOperational = true;

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error {
  public statusCode = 429;
  public code = 'RATE_LIMIT_EXCEEDED';
  public isOperational = true;

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ServiceUnavailableError extends Error {
  public statusCode = 503;
  public code = 'SERVICE_UNAVAILABLE';
  public isOperational = true;

  constructor(message: string = 'Service temporarily unavailable') {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Main error handling middleware
 */
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Generate correlation ID if not present
  const correlationId = error.correlationId || generateCorrelationId();
  
  // Determine if this is an operational error
  const isOperational = error.isOperational || false;
  
  // Get status code
  const statusCode = error.statusCode || 500;
  
  // Prepare error response
  const errorResponse: any = {
    error: getErrorTitle(statusCode),
    message: getErrorMessage(error, statusCode),
    correlation_id: correlationId
  };

  // Add additional fields based on error type
  if (error.code) {
    errorResponse.code = error.code;
  }

  if (error instanceof ValidationError && error.details) {
    errorResponse.details = error.details;
  }

  // Add request information for debugging (only in development)
  if (config.nodeEnv === 'development') {
    errorResponse.debug = {
      stack: error.stack,
      endpoint: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    };
  }

  // Log the error
  logError(error, req, correlationId, statusCode, isOperational);

  // Send response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  const correlationId = generateCorrelationId();
  
  logger.warn('Route not found', {
    correlationId,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    correlation_id: correlationId
  });
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validation error handler for Joi
 */
export function handleJoiError(error: any): ValidationError {
  const details = error.details.map((detail: any) => ({
    field: detail.path.join('.'),
    message: detail.message,
    value: detail.context?.value
  }));

  return new ValidationError('Validation failed', details);
}

/**
 * Database error handler
 */
export function handleDatabaseError(error: any): AppError {
  // PostgreSQL error codes
  const pgErrors: Record<string, { statusCode: number; message: string }> = {
    '23505': { statusCode: 409, message: 'Resource already exists' },
    '23503': { statusCode: 400, message: 'Referenced resource not found' },
    '23502': { statusCode: 400, message: 'Required field missing' },
    '23514': { statusCode: 400, message: 'Constraint violation' },
    '42P01': { statusCode: 500, message: 'Database table not found' },
    'ECONNREFUSED': { statusCode: 503, message: 'Database connection failed' },
    'ETIMEDOUT': { statusCode: 503, message: 'Database connection timeout' }
  };

  const errorCode = error.code || error.errno || 'UNKNOWN';
  const pgError = pgErrors[errorCode];

  if (pgError) {
    const appError = new Error(pgError.message) as AppError;
    appError.statusCode = pgError.statusCode;
    appError.code = errorCode;
    appError.isOperational = true;
    return appError;
  }

  // Default database error
  const dbError = new Error('Database operation failed') as AppError;
  dbError.statusCode = 500;
  dbError.code = 'DATABASE_ERROR';
  dbError.isOperational = false;
  return dbError;
}

/**
 * Model API error handler
 */
export function handleModelError(error: any): AppError {
  if (error.response) {
    // HTTP error from model API
    const statusCode = error.response.status;
    
    if (statusCode === 401) {
      return new AuthenticationError('Model API authentication failed');
    } else if (statusCode === 429) {
      return new RateLimitError('Model API rate limit exceeded');
    } else if (statusCode >= 500) {
      return new ServiceUnavailableError('Model service temporarily unavailable');
    } else {
      const modelError = new Error('Model API error') as AppError;
      modelError.statusCode = 502;
      modelError.code = 'MODEL_API_ERROR';
      modelError.isOperational = true;
      return modelError;
    }
  } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return new ServiceUnavailableError('Model service connection failed');
  }

  // Default model error
  const modelError = new Error('Model processing failed') as AppError;
  modelError.statusCode = 500;
  modelError.code = 'MODEL_ERROR';
  modelError.isOperational = false;
  return modelError;
}

/**
 * Get error title based on status code
 */
function getErrorTitle(statusCode: number): string {
  const titles: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  };

  return titles[statusCode] || 'Error';
}

/**
 * Get safe error message for client
 */
function getErrorMessage(error: Error, statusCode: number): string {
  // In production, don't expose internal error details
  if (config.nodeEnv === 'production' && statusCode >= 500) {
    return 'An internal error occurred';
  }

  // For operational errors, use the error message
  if ((error as AppError).isOperational) {
    return error.message;
  }

  // For non-operational errors, use generic messages
  if (statusCode >= 500) {
    return 'An internal server error occurred';
  }

  return error.message || 'An error occurred';
}

/**
 * Log error with appropriate level and context
 */
function logError(
  error: Error,
  req: Request,
  correlationId: string,
  statusCode: number,
  isOperational: boolean
): void {
  const logContext = {
    correlationId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    request: {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.userId
    },
    response: {
      statusCode
    }
  };

  if (statusCode >= 500 && !isOperational) {
    // Log system errors as errors
    logger.error('System error occurred', logContext);
  } else if (statusCode >= 400) {
    // Log client errors as warnings
    logger.warn('Client error occurred', logContext);
  } else {
    // Log other errors as info
    logger.info('Error occurred', logContext);
  }
}

/**
 * Global unhandled rejection handler
 */
export function setupGlobalErrorHandlers(): void {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });

    // Exit process after logging
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection:', {
      reason: reason instanceof Error ? {
        name: reason.name,
        message: reason.message,
        stack: reason.stack
      } : reason,
      promise: promise.toString()
    });
  });

  process.on('warning', (warning: Error) => {
    logger.warn('Node.js Warning:', {
      warning: {
        name: warning.name,
        message: warning.message,
        stack: warning.stack
      }
    });
  });
}
