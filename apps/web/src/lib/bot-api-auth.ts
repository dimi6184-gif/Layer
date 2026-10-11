import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { logBotAuthFailure, logReplayAttack } from './security-monitor';

/**
 * Secure API authentication for bot communication
 * Prevents timing attacks and replay attacks
 */

const REPLAY_WINDOW = 300000; // 5 minutes
const usedNonces = new Set<string>();

// Cleanup old nonces every 5 minutes
setInterval(() => {
  usedNonces.clear();
}, 300000);

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  
  return timingSafeEqual(bufA, bufB);
}

/**
 * Verify bot API request
 * Checks secret, timestamp, and nonce to prevent replay attacks
 */
export function verifyBotApiRequest(request: NextRequest): {
  authorized: boolean;
  error?: string;
} {
  const secret = request.headers.get('x-bot-secret');
  const timestamp = request.headers.get('x-timestamp');
  const nonce = request.headers.get('x-nonce');
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const path = request.nextUrl.pathname;

  // Check secret exists
  if (!secret) {
    logBotAuthFailure(ip, 'Missing API secret', path);
    return { authorized: false, error: 'Missing API secret' };
  }

  // Timing-safe comparison
  const expectedSecret = process.env.BOT_API_SECRET;
  if (!expectedSecret) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Bot API] BOT_API_SECRET not configured!');
    }
    return { authorized: false, error: 'Server configuration error' };
  }

  if (!timingSafeCompare(secret, expectedSecret)) {
    logBotAuthFailure(ip, 'Invalid API secret', path);
    return { authorized: false, error: 'Invalid API secret' };
  }

  // Check timestamp to prevent replay attacks
  if (timestamp) {
    const reqTime = parseInt(timestamp, 10);
    const now = Date.now();

    if (isNaN(reqTime)) {
      logBotAuthFailure(ip, 'Invalid timestamp format', path);
      return { authorized: false, error: 'Invalid timestamp' };
    }

    if (Math.abs(now - reqTime) > REPLAY_WINDOW) {
      logReplayAttack(ip, nonce || 'none', reqTime);
      return { authorized: false, error: 'Request too old or too far in future' };
    }
  }

  // Check nonce to prevent replay attacks
  if (nonce) {
    if (usedNonces.has(nonce)) {
      logReplayAttack(ip, nonce, parseInt(timestamp || '0', 10));
      return { authorized: false, error: 'Nonce already used (replay attack?)' };
    }
    usedNonces.add(nonce);
  }

  return { authorized: true };
}

export const verifyBotApiAuth = verifyBotApiRequest;

/**
 * Sanitize error messages for production
 * Never expose internal details to clients
 */
export function sanitizeError(error: string, isDevelopment: boolean): string {
  if (isDevelopment) {
    return error;
  }
  
  // Generic error in production
  return 'Authentication failed';
}
