import { db } from '@nexus/db';
import { auth } from '@/auth';
import { logIdorAttempt, logPermissionDenied, logUnauthorizedAccess } from './security-monitor';

/**
 * Database Access Control Layer
 * Ensures users can only access their own data (Broken Access Control prevention)
 */

export class AccessDeniedError extends Error {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

/**
 * Verify user has permission to access a guild
 * @throws AccessDeniedError if user doesn't have access
 */
export async function verifyGuildAccess(
  guildId: string,
  requiredPermissions?: string[]
): Promise<{ userId: string; permissions: string[] }> {
  const session = await auth();
  
  if (!session?.user?.id) {
    logUnauthorizedAccess('unknown', undefined, guildId, 'Not authenticated');
    throw new AccessDeniedError('Not authenticated');
  }

  // Check if user is a team member of this guild
  const teamMember = await db.teamMember.findFirst({
    where: {
      guildId,
      userId: session.user.id,
      status: 'active',
    },
    select: {
      permissions: true,
    },
  });

  if (!teamMember) {
    // Log IDOR attempt
    const userGuilds = await db.teamMember.findMany({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      select: { guildId: true },
    });
    
    logIdorAttempt(
      'guild-access',
      session.user.id,
      guildId,
      userGuilds.map(g => g.guildId)
    );
    
    throw new AccessDeniedError('Not a member of this server');
  }

  // @ts-ignore - Prisma type issue
  const permissions = teamMember.permissions?.permissions || [];

  // Check required permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((perm) =>
      permissions.includes(perm)
    );

    if (!hasAllPermissions) {
      const missingPerms = requiredPermissions.filter(
        perm => !permissions.includes(perm)
      );
      
      missingPerms.forEach(perm => {
        logPermissionDenied(session.user?.id ?? '', guildId, perm, 'guild-access');
      });
      
      throw new AccessDeniedError(
        `Missing required permissions: ${requiredPermissions.join(', ')}`
      );
    }
  }

  return {
    userId: session.user.id,
    permissions,
  };
}

/**
 * Verify user owns a resource
 * Generic check for any user-owned resource
 */
export async function verifyResourceOwnership(
  tableName: string,
  resourceId: string,
  userIdField: string = 'userId'
): Promise<boolean> {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new AccessDeniedError('Not authenticated');
  }

  // @ts-ignore - Dynamic table access
  const resource = await db[tableName].findUnique({
    where: { id: resourceId },
    select: { [userIdField]: true },
  });

  if (!resource) {
    throw new AccessDeniedError('Resource not found');
  }

  if (resource[userIdField] !== session.user.id) {
    throw new AccessDeniedError('Not authorized to access this resource');
  }

  return true;
}

/**
 * Safe query wrapper that automatically filters by user
 * Prevents IDOR attacks
 */
export async function safeQuery<T>(
  modelName: string,
  query: any,
  userId?: string
): Promise<T> {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new AccessDeniedError('Not authenticated');
  }

  const actualUserId = userId || session.user.id;

  // Add user filter to query
  const safeQuery = {
    ...query,
    where: {
      ...query.where,
      userId: actualUserId,
    },
  };

  // @ts-ignore - Dynamic model access
  return await db[modelName].findMany(safeQuery);
}

/**
 * Log security events for audit trail
 */
export async function logSecurityEvent(
  eventType: 'access_denied' | 'permission_check' | 'suspicious_activity',
  details: {
    userId?: string;
    guildId?: string;
    resource?: string;
    reason: string;
    metadata?: any;
  }
): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        action: eventType,
        userId: details.userId,
        guildId: details.guildId ?? '',
        details: details.resource
          ? `${eventType}: ${details.resource} — ${details.reason}`
          : `${eventType}: ${details.reason}`,
        metadata: {
          reason: details.reason,
          ...details.metadata,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    // Don't throw - logging failures shouldn't break the app
    console.error('[Security] Failed to log audit event:', error);
  }
}
