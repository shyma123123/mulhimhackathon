/**
 * Health Check API Routes
 * 
 * Provides health check endpoints for monitoring:
 * - GET /health - Basic health check
 * - GET /health/detailed - Detailed system health
 * - GET /health/ready - Readiness probe
 * - GET /health/live - Liveness probe
 */

import { Router, Request, Response } from 'express';

import { healthCheck as dbHealthCheck } from '@/config/database';
import { healthCheck as redisHealthCheck } from '@/config/redis';
import { modelBridge } from '@/services/modelBridge';
import { logger, generateCorrelationId } from '@/config/logger';
import { config } from '@/config/config';

const router = Router();

/**
 * GET /health
 * Basic health check endpoint
 */
router.get('/', async (req: Request, res: Response) => {
  const correlationId = generateCorrelationId();
  const startTime = Date.now();

  try {
    const responseTime = Date.now() - startTime;

    res.json({
      status: 'healthy',
      service: 'smartshield-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      response_time_ms: responseTime,
      environment: config.nodeEnv,
      correlation_id: correlationId
    });

  } catch (error) {
    logger.error('Health check failed', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      status: 'unhealthy',
      service: 'smartshield-backend',
      error: 'Health check failed',
      correlation_id: correlationId
    });
  }
});

/**
 * GET /health/detailed
 * Detailed system health check
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const correlationId = generateCorrelationId();
  const startTime = Date.now();

  try {
    // Check database health
    const dbHealth = await dbHealthCheck();
    
    // Check Redis health
    const redisHealth = await redisHealthCheck();
    
    // Check model bridge health
    const modelHealth = await checkModelHealth();
    
    // Check system resources
    const systemHealth = checkSystemHealth();

    const responseTime = Date.now() - startTime;

    // Determine overall health status
    const isHealthy = 
      dbHealth.status === 'healthy' &&
      redisHealth.status === 'healthy' &&
      modelHealth.status === 'healthy' &&
      systemHealth.status === 'healthy';

    const status = isHealthy ? 'healthy' : 'degraded';

    res.status(isHealthy ? 200 : 503).json({
      status,
      service: 'smartshield-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime,
      checks: {
        database: dbHealth,
        redis: redisHealth,
        model_bridge: modelHealth,
        system: systemHealth
      },
      configuration: {
        environment: config.nodeEnv,
        model_provider: config.modelProvider,
        privacy_mode: config.privacyMode,
        cors_origins: config.corsOrigins.length
      },
      correlation_id: correlationId
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('Detailed health check failed', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`
    });

    res.status(500).json({
      status: 'unhealthy',
      service: 'smartshield-backend',
      error: 'Detailed health check failed',
      response_time_ms: responseTime,
      correlation_id: correlationId
    });
  }
});

/**
 * GET /health/ready
 * Readiness probe for Kubernetes
 */
router.get('/ready', async (req: Request, res: Response) => {
  const correlationId = generateCorrelationId();

  try {
    // Check critical dependencies
    const dbHealth = await dbHealthCheck();
    const redisHealth = await redisHealthCheck();

    const isReady = dbHealth.status === 'healthy' && redisHealth.status === 'healthy';

    if (isReady) {
      res.json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        correlation_id: correlationId
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: dbHealth.status,
          redis: redisHealth.status
        },
        correlation_id: correlationId
      });
    }

  } catch (error) {
    logger.error('Readiness check failed', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(503).json({
      status: 'not_ready',
      error: 'Readiness check failed',
      correlation_id: correlationId
    });
  }
});

/**
 * GET /health/live
 * Liveness probe for Kubernetes
 */
router.get('/live', async (req: Request, res: Response) => {
  const correlationId = generateCorrelationId();

  try {
    // Simple liveness check - just ensure the process is running
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    // Check if process has been running for at least 30 seconds (startup time)
    const isAlive = uptime > 30 && memoryUsage.heapUsed > 0;

    if (isAlive) {
      res.json({
        status: 'alive',
        uptime: uptime,
        memory: {
          heap_used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heap_total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external_mb: Math.round(memoryUsage.external / 1024 / 1024)
        },
        timestamp: new Date().toISOString(),
        correlation_id: correlationId
      });
    } else {
      res.status(503).json({
        status: 'not_alive',
        uptime: uptime,
        error: 'Process not ready or unhealthy',
        correlation_id: correlationId
      });
    }

  } catch (error) {
    logger.error('Liveness check failed', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(503).json({
      status: 'not_alive',
      error: 'Liveness check failed',
      correlation_id: correlationId
    });
  }
});

/**
 * GET /health/metrics
 * Prometheus-style metrics endpoint
 */
router.get('/metrics', async (req: Request, res: Response) => {
  const correlationId = generateCorrelationId();

  try {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Get basic metrics
    const metrics = {
      // Process metrics
      nodejs_memory_heap_used_bytes: memoryUsage.heapUsed,
      nodejs_memory_heap_total_bytes: memoryUsage.heapTotal,
      nodejs_memory_external_bytes: memoryUsage.external,
      nodejs_memory_rss_bytes: memoryUsage.rss,
      
      // Process info
      nodejs_process_uptime_seconds: process.uptime(),
      nodejs_process_pid: process.pid,
      
      // System metrics
      nodejs_version_info: process.version,
      nodejs_platform_info: process.platform,
      nodejs_arch_info: process.arch,
      
      // Application metrics
      smartshield_version_info: '1.0.0',
      smartshield_model_provider: config.modelProvider,
      smartshield_environment: config.nodeEnv,
      
      // Timestamp
      metrics_timestamp: Date.now()
    };

    // Convert to Prometheus format
    const prometheusMetrics = Object.entries(metrics)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}{value="${value}"} 1`;
        } else {
          return `${key} ${value}`;
        }
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.send(prometheusMetrics + '\n');

  } catch (error) {
    logger.error('Metrics endpoint failed', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: 'Failed to generate metrics',
      correlation_id: correlationId
    });
  }
});

/**
 * Check model bridge health
 */
async function checkModelHealth(): Promise<{ status: string; details: any }> {
  try {
    const providerInfo = modelBridge.getProviderInfo();
    
    return {
      status: 'healthy',
      details: {
        primary_provider: providerInfo.primary,
        fallback_provider: providerInfo.fallback,
        available_providers: providerInfo.available,
        model_provider: config.modelProvider,
        model_name: config.modelName
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Check system health
 */
function checkSystemHealth(): { status: string; details: any } {
  try {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Check memory usage (warn if over 80% of available)
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    const isMemoryHealthy = memoryUsagePercent < 90;
    
    // Check uptime (warn if process has been running for more than 7 days without restart)
    const isUptimeHealthy = uptime < 604800; // 7 days in seconds
    
    const status = isMemoryHealthy && isUptimeHealthy ? 'healthy' : 'warning';
    
    return {
      status,
      details: {
        memory: {
          heap_used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heap_total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          usage_percent: Math.round(memoryUsagePercent * 100) / 100,
          healthy: isMemoryHealthy
        },
        uptime: {
          seconds: uptime,
          days: Math.round(uptime / 86400),
          healthy: isUptimeHealthy
        },
        platform: process.platform,
        node_version: process.version,
        pid: process.pid
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

export default router;
