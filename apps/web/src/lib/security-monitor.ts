import * as Sentry from "@sentry/nextjs";

/**
 * Security Event Types
 */
export enum SecurityEventType {
  // Authentication
  UNAUTHORIZED_ACCESS = "unauthorized_access",
  INVALID_SESSION = "invalid_session",
  SUSPICIOUS_LOGIN = "suspicious_login",
  
  // Authorization
  PERMISSION_DENIED = "permission_denied",
  IDOR_ATTEMPT = "idor_attempt",
  PRIVILEGE_ESCALATION = "privilege_escalation",
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  
  // Validation
  INVALID_INPUT = "invalid_input",
  XSS_ATTEMPT = "xss_attempt",
  SQL_INJECTION_ATTEMPT = "sql_injection_attempt",
  
  // Bot API
  BOT_AUTH_FAILED = "bot_auth_failed",
  REPLAY_ATTACK = "replay_attack",
  
  // Other
  SECURITY_HEADER_MISSING = "security_header_missing",
  CSRF_TOKEN_INVALID = "csrf_token_invalid",
}

/**
 * Security Event Severity
 */
export enum SecuritySeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Security Event Interface
 */
export interface SecurityEvent {
  type: SecurityEventType;
  severity: SecuritySeverity;
  userId?: string;
  guildId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  details?: Record<string, any>;
}

/**
 * Log a security event to Sentry
 */
export function logSecurityEvent(event: SecurityEvent): void {
  // Don't log in development unless it's critical
  if (process.env.NODE_ENV === 'development' && event.severity !== SecuritySeverity.CRITICAL) {
    console.warn('[Security Event]', event);
    return;
  }

  // Set severity level
  const level = getSentryLevel(event.severity);

  // Create Sentry event
  Sentry.withScope((scope) => {
    // Set level
    scope.setLevel(level);

    // Add tags for filtering
    scope.setTag('security_event', event.type);
    scope.setTag('severity', event.severity);
    
    if (event.userId) {
      scope.setUser({ id: event.userId });
    }
    
    if (event.guildId) {
      scope.setTag('guild_id', event.guildId);
    }

    // Add context
    scope.setContext('security', {
      type: event.type,
      severity: event.severity,
      ip: event.ip,
      userAgent: event.userAgent,
      path: event.path,
      method: event.method,
      timestamp: new Date().toISOString(),
    });

    // Add details as extra context
    if (event.details) {
      scope.setContext('details', event.details);
    }

    // Capture event
    Sentry.captureMessage(`Security Event: ${event.type}`, level);
  });
}

/**
 * Log a rate limit violation
 */
export function logRateLimitViolation(
  path: string,
  ip: string,
  userId?: string,
  attempts?: number
): void {
  logSecurityEvent({
    type: SecurityEventType.RATE_LIMIT_EXCEEDED,
    severity: attempts && attempts > 100 ? SecuritySeverity.HIGH : SecuritySeverity.MEDIUM,
    userId,
    ip,
    path,
    details: {
      attempts,
      message: 'Rate limit exceeded',
    },
  });
}

/**
 * Log an unauthorized access attempt
 */
export function logUnauthorizedAccess(
  path: string,
  userId?: string,
  guildId?: string,
  reason?: string
): void {
  logSecurityEvent({
    type: SecurityEventType.UNAUTHORIZED_ACCESS,
    severity: SecuritySeverity.HIGH,
    userId,
    guildId,
    path,
    details: {
      reason: reason || 'Unauthorized access attempt',
    },
  });
}

/**
 * Log an IDOR attempt
 */
export function logIdorAttempt(
  path: string,
  userId: string,
  attemptedGuildId: string,
  actualGuildIds: string[]
): void {
  logSecurityEvent({
    type: SecurityEventType.IDOR_ATTEMPT,
    severity: SecuritySeverity.CRITICAL,
    userId,
    guildId: attemptedGuildId,
    path,
    details: {
      message: 'User attempted to access data from unauthorized guild',
      attemptedGuild: attemptedGuildId,
      authorizedGuilds: actualGuildIds,
    },
  });
}

/**
 * Log a bot authentication failure
 */
export function logBotAuthFailure(
  ip: string,
  reason: string,
  path?: string
): void {
  logSecurityEvent({
    type: SecurityEventType.BOT_AUTH_FAILED,
    severity: SecuritySeverity.HIGH,
    ip,
    path,
    details: {
      reason,
      message: 'Bot API authentication failed',
    },
  });
}

/**
 * Log a replay attack attempt
 */
export function logReplayAttack(
  ip: string,
  nonce: string,
  timestamp: number
): void {
  logSecurityEvent({
    type: SecurityEventType.REPLAY_ATTACK,
    severity: SecuritySeverity.CRITICAL,
    ip,
    details: {
      nonce,
      timestamp,
      message: 'Potential replay attack detected',
    },
  });
}

/**
 * Log invalid input / validation error
 */
export function logValidationError(
  path: string,
  field: string,
  value: any,
  userId?: string
): void {
  logSecurityEvent({
    type: SecurityEventType.INVALID_INPUT,
    severity: SecuritySeverity.LOW,
    userId,
    path,
    details: {
      field,
      value: typeof value === 'string' ? value.substring(0, 100) : value,
      message: 'Input validation failed',
    },
  });
}

/**
 * Log a permission denied event
 */
export function logPermissionDenied(
  userId: string,
  guildId: string,
  permission: string,
  path: string
): void {
  logSecurityEvent({
    type: SecurityEventType.PERMISSION_DENIED,
    severity: SecuritySeverity.MEDIUM,
    userId,
    guildId,
    path,
    details: {
      permission,
      message: 'Permission denied for operation',
    },
  });
}

/**
 * Create a performance transaction for monitoring
 */
export function startPerformanceTransaction(
  name: string,
  op: string
): Sentry.Transaction | undefined {
  if (process.env.NODE_ENV === 'production') {
    return Sentry.startTransaction({
      name,
      op,
    });
  }
  return undefined;
}

/**
 * Helper: Convert security severity to Sentry level
 */
function getSentryLevel(severity: SecuritySeverity): Sentry.SeverityLevel {
  switch (severity) {
    case SecuritySeverity.LOW:
      return 'info';
    case SecuritySeverity.MEDIUM:
      return 'warning';
    case SecuritySeverity.HIGH:
      return 'error';
    case SecuritySeverity.CRITICAL:
      return 'fatal';
    default:
      return 'info';
  }
}

/**
 * Monitor database query performance
 */
export function monitorDatabaseQuery<T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> {
  const transaction = startPerformanceTransaction(queryName, 'db.query');
  
  return query()
    .then(result => {
      transaction?.finish();
      return result;
    })
    .catch(error => {
      transaction?.finish();
      Sentry.captureException(error, {
        tags: {
          query: queryName,
        },
      });
      throw error;
    });
}

/**
 * Monitor API route performance
 */
export function monitorApiRoute<T>(
  routeName: string,
  handler: () => Promise<T>
): Promise<T> {
  const transaction = startPerformanceTransaction(routeName, 'http.server');
  
  return handler()
    .then(result => {
      transaction?.finish();
      return result;
    })
    .catch(error => {
      transaction?.finish();
      
      // Log security events for specific errors
      if (error.message?.includes('Unauthorized')) {
        logUnauthorizedAccess(routeName, undefined, undefined, error.message);
      } else if (error.message?.includes('Permission denied')) {
        logSecurityEvent({
          type: SecurityEventType.PERMISSION_DENIED,
          severity: SecuritySeverity.MEDIUM,
          path: routeName,
          details: { error: error.message },
        });
      }
      
      Sentry.captureException(error, {
        tags: {
          route: routeName,
        },
      });
      throw error;
    });
}
