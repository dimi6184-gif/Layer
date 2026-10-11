# Security Quick Reference

## 🔐 When Building New Features

### ✅ Checklist for Every New Feature

#### 1. **API Routes** (`/api/**/route.ts`)
```typescript
import { auth } from "@/auth";
import { verifyGuildAccess } from "@/lib/db-access-control";

export async function POST(req: NextRequest) {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { guildId, ...data } = body;

  // 2. Verify guild access (requireAdmin: true for write operations)
  try {
    await verifyGuildAccess(guildId, session.user.id, { requireAdmin: true });
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  // 3. Your logic here...
}
```

#### 2. **Dashboard Pages** (`/dashboard/[id]/**/page.tsx`)
```typescript
import { ensureServerAccess } from "@/lib/ensure-access";

export default async function MyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Always call this FIRST!
  await ensureServerAccess(id);
  
  // Now safe to query guild data
  const guild = await db.guild.findUnique({ where: { discordId: id } });
  // ...
}
```

#### 3. **Server Actions** (`/actions/*.ts`)
```typescript
"use server";

import { auth } from "@/auth";
import { ensureServerAccess } from "@/lib/ensure-access";
import { hasPermission } from "./team";
import { PERMISSIONS } from "@/lib/team-permissions";

export async function updateSomething(guildId: string, data: any) {
  // 1. Authentication
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 2. Guild access
  await ensureServerAccess(guildId);

  // 3. Permission check (for sensitive operations)
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODULES);
  if (!canManage) {
    throw new Error("You don't have permission to manage this");
  }

  // 4. Input validation
  validateInput(data);

  // 5. Your logic...
  await db.guild.update({
    where: { discordId: guildId },
    data,
  });

  // 6. Audit log
  await db.auditLog.create({
    data: {
      guildId,
      action: "SOMETHING_UPDATED",
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      details: "Updated something",
      metadata: data,
    },
  });
}
```

#### 4. **Bot-Only API Routes** (`/api/bot/**/route.ts`)
```typescript
import { verifyBotApiAuth } from "@/lib/bot-api-auth";

export async function POST(req: NextRequest) {
  // Bot-only endpoints (called from Discord bot)
  const authResult = verifyBotApiAuth(req);
  if (!authResult.valid) {
    return NextResponse.json(
      { error: authResult.error || 'Unauthorized' },
      { status: 401 }
    );
  }

  // Your bot logic...
}
```

---

## 🛡️ Available Security Functions

### 1. `ensureServerAccess(guildId: string)`
**Use in:** Dashboard pages, server actions
**What it does:**
- Checks if user is authenticated
- Verifies user is team member of guild
- Auto-creates owner if first user
- Redirects to login if not authenticated
- Throws error if no access

**Example:**
```typescript
await ensureServerAccess(guildId);
```

---

### 2. `verifyGuildAccess(guildId, userId, options?)`
**Use in:** API routes (stricter than ensureServerAccess)
**What it does:**
- Checks if user is team member
- Optional: Requires admin permissions
- Throws `AccessDeniedError` if denied

**Example:**
```typescript
import { verifyGuildAccess, AccessDeniedError } from "@/lib/db-access-control";

try {
  await verifyGuildAccess(guildId, userId, { requireAdmin: true });
} catch (error) {
  if (error instanceof AccessDeniedError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  throw error;
}
```

---

### 3. `hasPermission(guildId, permission)`
**Use in:** Server actions (fine-grained permissions)
**What it does:**
- Checks if current user has specific permission
- Permission-based access control (RBAC)
- Returns boolean

**Available Permissions:**
```typescript
PERMISSIONS.MANAGE_MODULES      // Enable/disable modules
PERMISSIONS.MANAGE_MODERATION   // Moderation settings
PERMISSIONS.MANAGE_ANTISCAM     // Anti-scam settings
PERMISSIONS.MANAGE_LEVELING     // Leveling system
PERMISSIONS.MANAGE_TICKETS      // Ticket system
PERMISSIONS.MANAGE_TEAM         // Team management
PERMISSIONS.VIEW_TEAM           // View team members
PERMISSIONS.VIEW_LOGS           // View audit logs
PERMISSIONS.VIEW_ANALYTICS      // View analytics
```

**Example:**
```typescript
const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODULES);
if (!canManage) {
  throw new Error("You don't have permission");
}
```

---

### 4. `verifyBotApiAuth(req: NextRequest)`
**Use in:** Bot-only API routes
**What it does:**
- Verifies bot API secret (timing-safe)
- Checks nonce/timestamp for replay attacks
- Returns `{ valid: boolean, error?: string }`

**Example:**
```typescript
const authResult = verifyBotApiAuth(req);
if (!authResult.valid) {
  return NextResponse.json({ error: authResult.error }, { status: 401 });
}
```

**Bot must send:**
```typescript
headers: {
  'Authorization': `Bearer ${process.env.BOT_API_SECRET}`,
  'X-Nonce': randomString(),
  'X-Timestamp': Date.now().toString()
}
```

---

## 🚨 Common Security Mistakes

### ❌ DON'T DO THIS:
```typescript
// BAD: Taking guildId from client without verification
export async function POST(req: NextRequest) {
  const { guildId } = await req.json();
  
  // IDOR vulnerability! User can access ANY guild!
  await db.guild.update({
    where: { discordId: guildId },
    data: { ... }
  });
}
```

### ✅ DO THIS:
```typescript
// GOOD: Verify access first
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guildId } = await req.json();
  
  // Verify user has access to this guild
  try {
    await verifyGuildAccess(guildId, session.user.id, { requireAdmin: true });
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  // Now safe
  await db.guild.update({
    where: { discordId: guildId },
    data: { ... }
  });
}
```

---

### ❌ DON'T DO THIS:
```typescript
// BAD: No authentication on public API
export async function GET() {
  // Returns sensitive data to ANYONE!
  const users = await db.user.findMany();
  return NextResponse.json(users);
}
```

### ✅ DO THIS:
```typescript
// GOOD: Require authentication
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Only return data user has access to
  const teamMembers = await db.teamMember.findMany({
    where: { userId: session.user.id }
  });
  return NextResponse.json(teamMembers);
}
```

---

### ❌ DON'T DO THIS:
```typescript
// BAD: Console logs in production
export async function updateSettings(data: any) {
  console.log("User data:", data); // Logs sensitive data!
  await db.guild.update({ ... });
}
```

### ✅ DO THIS:
```typescript
// GOOD: Dev-only logs
export async function updateSettings(data: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log("User data:", data);
  }
  await db.guild.update({ ... });
}
```

---

## 📝 Input Validation

Always validate user input with our validation utilities:

```typescript
import { 
  validateStringLength, 
  validateDiscordId, 
  validateArraySize 
} from "@/lib/validation";

// String length
validateStringLength(input, 'Field name', { min: 1, max: 100 });

// Discord ID (snowflake)
validateDiscordId(id, 'Guild ID');

// Array size
validateArraySize(array, 'Items', { min: 1, max: 10 });
```

---

## 🔍 Audit Logging

For sensitive operations, always log to audit log:

```typescript
await db.auditLog.create({
  data: {
    guildId,
    action: "SETTINGS_UPDATED", // Use clear action names
    userId: session.user.id,
    userName: session.user.name || "Unknown",
    details: "Updated anti-scam settings", // Human-readable description
    metadata: settings, // JSON data for forensics
  },
});
```

**Common Action Names:**
- `MODULE_TOGGLE` - Module enabled/disabled
- `SETTINGS_UPDATED` - Settings changed
- `TEAM_MEMBER_INVITED` - Team member added
- `TEAM_MEMBER_REMOVED` - Team member removed
- `PERMISSION_CHANGED` - Permissions updated
- `COMMAND_EXECUTED` - Command used
- `AI_TOKENS_USED` - AI usage

---

## 🔐 Environment Variables

**Required for Production:**

```env
# NextAuth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.com

# Discord OAuth
DISCORD_CLIENT_ID=<from-discord-developer-portal>
DISCORD_CLIENT_SECRET=<from-discord-developer-portal>
DISCORD_TOKEN=<bot-token>

# Database
DATABASE_URL=<your-database-url>

# Bot API (for bot-only endpoints)
BOT_API_SECRET=<generate-with-openssl-rand-base64-32>

# Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=<from-upstash>
UPSTASH_REDIS_REST_TOKEN=<from-upstash>
```

**Generate secrets:**
```bash
openssl rand -base64 32
```

---

## 📊 Security Testing

Run security tests before deploying:

```bash
# NPM audit
npm run security:audit

# Run security tests
npm run test:security

# Full security check
npm run security:check
```

---

## 🚀 Pre-Deployment Checklist

Before pushing to production:

- [ ] All API routes have authentication
- [ ] All dashboard pages call `ensureServerAccess()`
- [ ] All server actions have permission checks
- [ ] Input validation on all user inputs
- [ ] Audit logging for sensitive operations
- [ ] No console.logs with sensitive data
- [ ] Environment variables set
- [ ] Security tests passing
- [ ] Rate limiting configured

---

## 📚 Further Reading

- See `ENTERPRISE_SECURITY_IMPLEMENTATION.md` for full security architecture
- See `API_SECURITY_IMPLEMENTATION.md` for detailed implementation status
- See `apps/web/src/lib/db-access-control.ts` for access control implementation
- See `apps/web/src/lib/bot-api-auth.ts` for bot authentication
- See `apps/web/src/middleware.ts` for rate limiting

---

**Last Updated:** 2026-10-08
**Maintained by:** Layer Security Team
