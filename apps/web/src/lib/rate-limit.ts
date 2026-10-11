/**
 * Production-grade Rate Limiting with Redis
 * Supports multi-instance deployments
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Redis client (uses environment variables)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Fallback to in-memory for development
const memoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiters for different routes
 */
export const rateLimiters = {
  // Authentication - Very strict
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
        analytics: true,
        prefix: 'ratelimit:auth',
      })
    : null,

  // API - Moderate
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
        analytics: true,
        prefix: 'ratelimit:api',
      })
    : null,

  // Dashboard - Lenient
  dashboard: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
        analytics: true,
        prefix: 'ratelimit:dashboard',
      })
    : null,

  // Global - Very lenient
  global: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(200, '1 m'), // 200 requests per minute
        analytics: true,
        prefix: 'ratelimit:global',
      })
    : null,
};

/**
 * Get appropriate rate limiter for a pathname
 */
export function getRateLimiter(pathname: string) {
  if (pathname.startsWith('/api/auth')) {
    return rateLimiters.auth;
  }
  if (pathname.startsWith('/api/')) {
    return rateLimiters.api;
  }
  if (pathname.startsWith('/dashboard')) {
    return rateLimiters.dashboard;
  }
  return rateLimiters.global;
}

/**
 * Fallback in-memory rate limiter for development
 */
export function checkRateLimitMemory(
  identifier: string,
  limit: { requests: number; window: number }
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || now > record.resetAt) {
    const resetAt = now + limit.window;
    memoryStore.set(identifier, { count: 1, resetAt });
    return {
      success: true,
      remaining: limit.requests - 1,
      reset: resetAt,
    };
  }

  if (record.count >= limit.requests) {
    return {
      success: false,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  record.count++;
  return {
    success: true,
    remaining: limit.requests - record.count,
    reset: record.resetAt,
  };
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(
  ip: string | null,
  userAgent: string | null
): string {
  const safeIp = ip || 'unknown';
  const safeUA = userAgent ? userAgent.substring(0, 50) : 'unknown';
  return `${safeIp}-${safeUA}`;
}
