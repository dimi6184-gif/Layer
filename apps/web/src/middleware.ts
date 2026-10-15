import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRateLimiter, getClientIdentifier, checkRateLimitMemory } from '@/lib/rate-limit';
import { logRateLimitViolation } from '@/lib/security-monitor';

const RATE_LIMITS = {
  '/api/auth': { requests: 10, window: 60000 },
  '/api/': { requests: 100, window: 60000 },
  '/dashboard': { requests: 60, window: 60000 },
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip rate limiting for static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  // Get client identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : (request.headers.get('x-real-ip') || 'unknown');
  const userAgent = request.headers.get('user-agent');
  const identifier = getClientIdentifier(ip, userAgent);

  // Rate limiting with Redis (production) or in-memory (dev)
  const rateLimiter = getRateLimiter(pathname);

  if (rateLimiter) {
    // Production: Use Redis
    try {
      const { success, limit, reset, remaining } = await rateLimiter.limit(identifier);

      if (!success) {
        // Log rate limit violation
        logRateLimitViolation(pathname, ip, undefined, limit - remaining);
        
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests',
            message: 'Please slow down and try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
              'X-RateLimit-Limit': String(limit),
              'X-RateLimit-Remaining': String(remaining),
              'X-RateLimit-Reset': String(reset),
            },
          }
        );
      }
    } catch (error) {
      // Redis failed — apply in-memory fallback instead of skipping entirely
      if (process.env.NODE_ENV === 'development') {
        console.error('[Rate Limit] Redis error, applying memory fallback:', error);
      }
      const limit = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS] || { requests: 200, window: 60000 };
      const result = checkRateLimitMemory(identifier, limit);
      if (!result.success) {
        logRateLimitViolation(pathname, ip, undefined, limit.requests - result.remaining);
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests', message: 'Please slow down and try again later.' }),
          { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)) } }
        );
      }
    }
  }

  // Fallback: In-memory rate limiting (development)
  if (!rateLimiter) {
    const limit = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS] || { requests: 200, window: 60000 };
    const result = checkRateLimitMemory(identifier, limit);

    if (!result.success) {
      // Log rate limit violation
      logRateLimitViolation(pathname, ip, undefined, limit.requests - result.remaining);
      
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Please slow down and try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
            'X-RateLimit-Remaining': String(result.remaining),
          },
        }
      );
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // HSTS — only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // Prevent clickjacking
  if (!pathname.startsWith('/api/')) {
    response.headers.set('X-Frame-Options', 'DENY');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
