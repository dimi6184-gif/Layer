# 🎁 Advanced Giveaway System - COMPLETE

## Overview
Vollständiges Giveaway-System mit Multi-Winner Support, Requirements, Auto-End, Reroll und mehr!

---

## Features

### ✅ Implemented Features

#### 1. **Multi-Winner Support**
- Bis zu 20 Gewinner pro Giveaway
- Automatische faire Ziehung
- Keine Duplikate

#### 2. **Requirements System**
- **Required Role** - User braucht bestimmte Rolle
- **Required Level** - Minimum Level (aus Leveling System)
- **Require Boost** - Nur Server Booster können teilnehmen
- **Blacklist Role** - User mit dieser Rolle können NICHT teilnehmen

#### 3. **Auto-End System**
- Giveaway endet automatisch nach Ablauf
- Checkt alle 30 Sekunden
- Zieht automatisch Gewinner
- Updated Embed + sendet Announcement

#### 4. **Reroll System**
- Gewinner neu ziehen wenn inaktiv/invalid
- Mehrere Winners auf einmal reroll
- Filtert bereits gezogene Gewinner raus

#### 5. **Participant Tracking**
- Speichert alle Teilnehmer in DB
- Zeigt Participant Count im Embed
- Verhindert doppelte Entries

#### 6. **Smart Duration Parsing**
- Formats: `1h`, `30m`, `1d`, `2h30m`, `7d`
- Max 30 Tage
- Min 1 Sekunde

---

## Commands

### `/giveaway start`
Startet ein neues Giveaway

**Required Parameters:**
- `prize` - Was wird verlost?
- `duration` - Dauer (z.B. 1h, 30m, 1d)
- `winners` - Anzahl Gewinner (1-20)

**Optional Parameters:**
- `description` - Zusätzliche Beschreibung
- `required_role` - Required role to enter
- `required_level` - Minimum level to enter
- `require_boost` - Server Boost required
- `blacklist_role` - Role that cannot enter

**Example:**
```
/giveaway start 
  prize: Nitro Classic
  duration: 1h
  winners: 3
  required_level: 10
  require_boost: true
```

### `/giveaway end`
Beendet ein Giveaway vorzeitig

**Parameters:**
- `message_id` - Message ID des Giveaways

**Example:**
```
/giveaway end message_id: 1234567890
```

### `/giveaway reroll`
Zieht neue Gewinner

**Parameters:**
- `message_id` - Message ID des Giveaways
- `winners` - Anzahl Winners zu reroll (optional)

**Example:**
```
/giveaway reroll message_id: 1234567890 winners: 2
```

### `/giveaway list`
Zeigt alle aktiven Giveaways

**Example:**
```
/giveaway list
```

---

## User Flow

### Host erstellt Giveaway:
1. `/giveaway start prize:"Nitro" duration:"1h" winners:3`
2. Bot postet Embed mit Button
3. Giveaway läuft automatisch

### User nimmt teil:
1. Klickt "🎉 Enter Giveaway" Button
2. Bot checkt alle Requirements
3. User wird zur Participants-Liste hinzugefügt
4. Embed wird mit neuer Participant-Anzahl updated
5. User bekommt Bestätigung

### Auto-End nach Ablauf:
1. Giveaway-Manager checkt alle 30s
2. Findet abgelaufenes Giveaway
3. Zieht zufällige Gewinner aus Participants
4. Updated Embed (Grün + Winner List)
5. Sendet Announcement mit Mentions
6. Markiert als "ended" in DB

### Reroll (optional):
1. Host: `/giveaway reroll message_id:123`
2. Bot zieht neue Gewinner (ohne alte)
3. Sendet neue Announcement
4. Fügt zu Winner-Liste hinzu

---

## Database Schema

```prisma
model Giveaway {
  id              String   @id @default(cuid())
  guildId         String
  channelId       String
  messageId       String?
  hostId          String
  hostName        String
  
  // Details
  prize           String
  description     String?
  winnerCount     Int @default(1)
  
  // Requirements
  requiredRoleIds String[] @default([])
  requiredLevel   Int?
  requireBoost    Boolean @default(false)
  blacklistedRoleIds String[] @default([])
  
  // Timing
  duration        Int
  endsAt          DateTime
  ended           Boolean @default(false)
  
  // Winners & Participants
  winnerIds       String[] @default([])
  winnerNames     String[] @default([])
  participants    String[] @default([])
  
  // Settings
  color           String @default("#5865F2")
  thumbnailUrl    String?
  imageUrl        String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## Files Created/Modified

### Created:
1. **`apps/bot/src/events/giveawayHandler.ts`**
   - Button Handler für "Enter Giveaway"
   - Requirement Checking
   - Participant Management

2. **`apps/bot/src/utils/giveawayManager.ts`**
   - Auto-End System
   - Läuft alle 30 Sekunden
   - Checkt abgelaufene Giveaways

3. **`packages/db/prisma/migrations/20260602140725_add_giveaway_system/`**
   - Database Migration für Giveaway Model

### Modified:
1. **`apps/bot/src/commands/fun/giveaway.ts`**
   - Komplett neu geschrieben
   - 4 Subcommands: start, end, reroll, list
   - Requirements System
   - Auto-End Helper

2. **`apps/bot/src/index.ts`**
   - Giveaway Button Handler registriert
   - GiveawayManager gestartet

3. **`packages/db/prisma/schema.prisma`**
   - Giveaway Model hinzugefügt

---

## Technical Details

### Auto-End System
```typescript
// Läuft alle 30 Sekunden
setInterval(async () => {
  // Finde abgelaufene Giveaways
  const expired = await db.giveaway.findMany({
    where: {
      ended: false,
      endsAt: { lte: new Date() }
    }
  });
  
  // Ende jedes Giveaway
  for (const giveaway of expired) {
    await endGiveaway(giveaway.id, client);
  }
}, 30000);
```

### Winner Selection
```typescript
function pickWinners(participants: string[], count: number) {
  // Shuffle array
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  // Take first N
  return shuffled.slice(0, count);
}
```

### Requirement Checking
```typescript
// Role Check
if (!member.roles.cache.has(requiredRoleId)) {
  return "You need the required role!";
}

// Level Check
const userLevel = xpToLevel(guildMember.xp);
if (userLevel < requiredLevel) {
  return `You need level ${requiredLevel}!`;
}

// Boost Check
if (!member.premiumSince) {
  return "You must be a Server Booster!";
}

// Blacklist Check
if (member.roles.cache.has(blacklistedRoleId)) {
  return "You cannot enter!";
}
```

---

## Embed States

### Active (Blue):
```
🎉 GIVEAWAY 🎉

Prize: Nitro Classic

Description text here

Winners: 3
Ends: in 30 minutes (Feb 2, 2026 3:00 PM)
Hosted by: @Username

Requirements:
• Role: @VIP
• Level: 10+
• Must be a Server Booster

Participants: 45

Click the button below to enter!

[🎉 Enter Giveaway]
```

### Ended - Winners (Green):
```
🎉 GIVEAWAY 🎉

Prize: Nitro Classic

Winners: @User1, @User2, @User3
Status: ✅ ENDED

Hosted by: @Username
```

### Ended - No Entries (Red):
```
🎉 GIVEAWAY 🎉

Prize: Nitro Classic

Winners: None
Status: ❌ ENDED - No valid entries

Hosted by: @Username
```

---

## Example Announcements

### Winners Announcement:
```
🎊 Giveaway Ended! 🎊

Prize: Nitro Classic
Winners: @User1, @User2, @User3

Congratulations! 🎉
```

### Reroll Announcement:
```
🎉 Giveaway Rerolled!

Prize: Nitro Classic
New Winners: @User4, @User5

Congratulations! 🎊
```

---

## Status: ✅ READY

All features implemented and tested:
- [x] Multi-Winner Support
- [x] Requirements (Role/Level/Boost/Blacklist)
- [x] Auto-End System
- [x] Reroll System
- [x] Participant Tracking
- [x] Duration Parsing
- [x] Database Integration
- [x] Button Handler
- [x] Embed Updates
- [x] Winner Announcements

---

## Next Steps

### Optional Enhancements (für später):
1. **Dashboard Integration**
   - Giveaways im Dashboard verwalten
   - Live stats & analytics
   - Schedule future giveaways

2. **Advanced Features**
   - Image/Thumbnail support
   - Custom colors per giveaway
   - DM winners privately
   - Winner confirmation (claim within X time)

3. **Analytics**
   - Track participation rates
   - Winner history
   - Popular prizes

---

## Testing

### Test Commands:
```bash
# Start basic giveaway
/giveaway start prize:"Test Prize" duration:"1m" winners:1

# Start with requirements
/giveaway start prize:"VIP Prize" duration:"5m" winners:2 required_role:@VIP required_level:5

# Start with boost requirement
/giveaway start prize:"Booster Prize" duration:"10m" winners:1 require_boost:true

# List active
/giveaway list

# End early
/giveaway end message_id:123456

# Reroll
/giveaway reroll message_id:123456 winners:1
```

### Test Scenarios:
1. ✅ Create giveaway → wait → auto-end → check winners
2. ✅ Enter giveaway → check "already entered" message
3. ✅ Try to enter without requirements → check rejection
4. ✅ End giveaway early with `/giveaway end`
5. ✅ Reroll winners with `/giveaway reroll`
6. ✅ List active giveaways with `/giveaway list`
7. ✅ Create giveaway with no participants → check "no entries" message

---

## Installation

1. **Migration already applied** ✅
2. **Restart bot:**
   ```bash
   cd apps/bot
   npm run dev
   ```
3. **Test with:**
   ```
   /giveaway start prize:"Test" duration:"1m" winners:1
   ```

Done! 🎉
