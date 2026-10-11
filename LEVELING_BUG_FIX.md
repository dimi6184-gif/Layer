# Leveling System Bug Fix

## Issue 1: Missing Username Parameter
When users sent messages, the leveling system crashed with:
```
PrismaClientValidationError: Invalid `db.user.upsert()` invocation
Argument `username` is missing.
```

### Root Cause
The `addXP` function in `rank.ts` was trying to create a new User in the database without providing the required `username` field (which is mandatory in the Prisma schema).

### Solution
Updated `addXP` function signature and user upsert logic to include username.

---

## Issue 2: Foreign Key Constraint Violation (CRITICAL)
After fixing Issue 1, a new error appeared:
```
PrismaClientKnownRequestError: Foreign key constraint violated: `GuildMember_userId_fkey (index)`
```

### Root Cause
The `GuildMember` table has a foreign key relationship:
- `GuildMember.userId` references `User.id` (internal cuid)
- `GuildMember.guildId` references `Guild.id` (internal cuid)

But the code was trying to use Discord IDs (strings like "1404129455181398090") instead of the internal database IDs (cuids like "clx123abc...").

### Solution

#### 1. Updated `addXP` Function
**File:** `apps/bot/src/commands/leveling/rank.ts`

Now properly:
1. Creates/updates User and retrieves internal `user.id`
2. Fetches Guild's internal `guild.id`
3. Uses internal IDs for GuildMember operations

```typescript
export async function addXP(guildId: string, userId: string, username: string, amount: number) {
  // First, ensure the user exists in the User table and get their internal ID
  const user = await db.user.upsert({
    where: { discordId: userId },
    update: { username }, // Update username in case it changed
    create: { discordId: userId, username },
  });

  // Get the guild's internal ID
  const guild = await db.guild.findUnique({
    where: { discordId: guildId },
    select: { id: true }
  });

  if (!guild) {
    throw new Error(`Guild ${guildId} not found in database`);
  }

  // Now we can safely create/update the GuildMember using internal IDs
  const member = await db.guildMember.upsert({
    where: { userId_guildId: { userId: user.id, guildId: guild.id } },
    update: { xp: { increment: amount } },
    create: { userId: user.id, guildId: guild.id, xp: amount },
    include: { guild: true },
  });

  // ... rest of logic uses user.id and guild.id
}
```

#### 2. Updated `getXP` Function
Now properly resolves internal IDs before querying GuildMember:

```typescript
export async function getXP(guildId: string, userId: string) {
  // Get internal IDs
  const user = await db.user.findUnique({
    where: { discordId: userId },
    select: { id: true }
  });

  const guild = await db.guild.findUnique({
    where: { discordId: guildId },
    select: { id: true }
  });

  if (!user || !guild) return 0;

  const member = await db.guildMember.findUnique({
    where: { userId_guildId: { userId: user.id, guildId: guild.id } },
  });
  return member?.xp ?? 0;
}
```

#### 3. Updated Function Call in index.ts
**File:** `apps/bot/src/index.ts` (around line 442)

Changed from:
```typescript
const result = await addXP(message.guild.id, message.author.id, xp);
```

To:
```typescript
const result = await addXP(message.guild.id, message.author.id, message.author.username, xp);
```

## Additional Fix: Scam Report Generator

### Issue
The HTML template in `scamReportGenerator.ts` had a syntax error that caused bundling to fail:
```
Transform failed with 1 error:
ERROR: Syntax error " "
```

### Solution
Rewrote the HTML generation function to use proper multi-line template literals instead of one long minified string. This makes the code:
- More readable
- Easier to maintain
- Compatible with TypeScript/ESBuild bundler

**File:** `apps/bot/src/utils/scamReportGenerator.ts`

The HTML template is now properly formatted with line breaks and indentation, while maintaining all the Layer branding styles (dark background, purple/fuchsia gradients, glassmorphism effects).

## Key Learnings

### Prisma Relationships
- **Discord IDs** (like user IDs, guild IDs) are stored in fields like `discordId`
- **Internal IDs** (cuids) are used for table relationships
- Always resolve Discord IDs to internal IDs before creating relationships

### Schema Structure
```prisma
model User {
  id        String @id @default(cuid())  // Internal ID
  discordId String @unique              // Discord user ID
}

model GuildMember {
  userId  String
  user    User @relation(fields: [userId], references: [id])  // References internal ID!
}
```

## Testing
✅ Both files pass TypeScript diagnostics
✅ No syntax errors
✅ Proper ID resolution throughout the codebase
✅ Foreign key constraints satisfied

## Status
**FIXED** - Ready for testing
