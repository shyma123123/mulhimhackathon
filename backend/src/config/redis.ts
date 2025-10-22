/**
 * Redis configuration and connection management
 * 
 * This module handles Redis connections for:
 * - Caching model responses
 * - Rate limiting
 * - Session storage
 * - Throttling and queuing
 */

import { createClient, RedisClientType } from 'redis';
import { config } from './config';
import { logger } from './logger';

// Redis client instance
let redisClient: RedisClientType | null = null;

/**
 * Connect to Redis server
 */
export async function connectRedis(): Promise<void> {
  try {
    redisClient = createClient({
      url: config.redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis connection failed after 10 retries');
            return false;
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (error) => {
      logger.error('Redis client error:', error);
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');

  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

/**
 * Get Redis client instance
 */
export function getRedisClient(): RedisClientType {
  if (!redisClient || !redisClient.isOpen) {
    throw new Error('Redis not connected. Call connectRedis() first.');
  }
  return redisClient;
}

/**
 * Cache utilities for model responses
 */
export const cache = {
  /**
   * Get cached model response
   */
  async get(key: string): Promise<any | null> {
    try {
      const client = getRedisClient();
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set cached model response with TTL
   */
  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      const client = getRedisClient();
      await client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  },

  /**
   * Delete cached entry
   */
  async delete(key: string): Promise<void> {
    try {
      const client = getRedisClient();
      await client.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  },

  /**
   * Generate cache key for model responses
   */
  generateKey(prefix: string, hash: string, model: string): string {
    return `${prefix}:${hash}:${model}`;
  }
};

/**
 * Rate limiting utilities
 */
export const rateLimit = {
  /**
   * Check if request is within rate limit
   */
  async checkLimit(identifier: string, limit: number, windowSeconds: number): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    try {
      const client = getRedisClient();
      const key = `rate_limit:${identifier}`;
      const now = Date.now();
      const window = windowSeconds * 1000;

      // Use sliding window algorithm
      const pipeline = client.multi();
      
      // Remove expired entries
      pipeline.zRemRangeByScore(key, '-inf', now - window);
      
      // Count current requests
      pipeline.zCard(key);
      
      // Add current request
      pipeline.zAdd(key, { score: now, value: `${now}-${Math.random()}` });
      
      // Set expiry
      pipeline.expire(key, windowSeconds);
      
      const results = await pipeline.exec();
      
      if (!results || results.length < 2) {
        throw new Error('Pipeline execution failed');
      }

      const currentCount = results[1] as number;
      const allowed = currentCount < limit;
      const remaining = Math.max(0, limit - currentCount);
      const resetTime = now + window;

      return { allowed, remaining, resetTime };
    } catch (error) {
      logger.error('Rate limit check error:', error);
      // Fail open - allow request if Redis is down
      return { allowed: true, remaining: limit, resetTime: Date.now() + windowSeconds * 1000 };
    }
  },

  /**
   * Get rate limit info for identifier
   */
  async getLimitInfo(identifier: string, windowSeconds: number): Promise<{
    count: number;
    resetTime: number;
  }> {
    try {
      const client = getRedisClient();
      const key = `rate_limit:${identifier}`;
      const now = Date.now();
      const window = windowSeconds * 1000;

      // Remove expired entries and count
      await client.zRemRangeByScore(key, '-inf', now - window);
      const count = await client.zCard(key);

      return {
        count,
        resetTime: now + window
      };
    } catch (error) {
      logger.error('Rate limit info error:', error);
      return { count: 0, resetTime: Date.now() + windowSeconds * 1000 };
    }
  }
};

/**
 * Session management utilities
 */
export const session = {
  /**
   * Store session data
   */
  async set(sessionId: string, data: any, ttlSeconds: number = 86400): Promise<void> {
    try {
      const client = getRedisClient();
      await client.setEx(`session:${sessionId}`, ttlSeconds, JSON.stringify(data));
    } catch (error) {
      logger.error('Session set error:', error);
    }
  },

  /**
   * Get session data
   */
  async get(sessionId: string): Promise<any | null> {
    try {
      const client = getRedisClient();
      const value = await client.get(`session:${sessionId}`);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Session get error:', error);
      return null;
    }
  },

  /**
   * Delete session
   */
  async delete(sessionId: string): Promise<void> {
    try {
      const client = getRedisClient();
      await client.del(`session:${sessionId}`);
    } catch (error) {
      logger.error('Session delete error:', error);
    }
  }
};

/**
 * Health check for Redis connection
 */
export async function healthCheck(): Promise<{ status: string; details: any }> {
  try {
    const client = getRedisClient();
    const start = Date.now();
    
    await client.ping();
    const latency = Date.now() - start;
    
    const info = await client.info('memory');
    const memoryInfo = info.split('\r\n').reduce((acc, line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    return {
      status: 'healthy',
      details: {
        latency: `${latency}ms`,
        memory: {
          used: memoryInfo.used_memory_human,
          peak: memoryInfo.used_memory_peak_human
        },
        connected: client.isOpen
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        connected: redisClient?.isOpen || false
      }
    };
  }
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
}
