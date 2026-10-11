# 🛡️ Advanced Auto-Moderation System

Complete implementation of comprehensive auto-moderation **integrated into the existing Moderation page** with 8+ detection rules, customizable actions, and whitelist system.

---

## ✅ Implementation Status: COMPLETE (Integrated into Moderation)

### Database Schema ✅
- **Migration**: `20260602163235_add_advanced_automod_system`
- **Location**: `packages/db/prisma/schema.prisma`
- **Fields Added**: 30+ new fields to Guild model for auto-mod configuration

### Bot Integration ✅
- **Auto-Mod Handler**: `apps/bot/src/utils/autoMod.ts`
- **Integration**: `apps/bot/src/index.ts` (message event handler)
- **Execution Order**: Auto-Mod runs BEFORE anti-scam but AFTER ticket handler

### Dashboard Implementation ✅
- **Settings Component**: `apps/web/src/components/ModerationSettings.tsx` (EXTENDED)
- **Page**: `apps/web/src/app/(app)/dashboard/[id]/moderation/page.tsx` (UPDATED)
- **Actions**: `apps/web/src/actions/auto-mod.ts`
- **Sidebar**: Uses existing "Moderation" link (no new page created)

### ⚠️ Important: Integrated, Not Separate
The advanced auto-mod features are **integrated into the existing Moderation page**, not a separate page. Users access everything through Dashboard → Moderation.

---

## 🎯 Features

### 1. **Spam Detection** 🚫
- **What it does**: Prevents users from sending too many messages in a short time
- **Settings**:
  - Max Messages (2-20, default: 5)
  - Timeframe in seconds (1-60, default: 5)
  - Action on violation
  - Timeout duration (if action = timeout)
- **Example**: Block users sending 5+ messages in 5 seconds

### 2. **Caps Filter** 🔠
- **What it does**: Blocks messages with excessive uppercase letters
- **Settings**:
  - Threshold % (50-100, default: 70)
  - Minimum message length to check (5-50, default: 10)
  - Action on violation
- **Example**: Block "THIS IS 100% CAPS!!!" if >= 70% caps

### 3. **Link Filter** 🔗
- **What it does**: Blocks all links except whitelisted domains
- **Settings**:
  - Whitelist domains (array of strings)
  - Action on violation
- **Example**: Allow "youtube.com" and "twitter.com", block everything else
- **UI**: Add/remove domains with visual chips

### 4. **Discord Invite Filter** 📩
- **What it does**: Blocks Discord server invites
- **Settings**:
  - Action on violation
- **Detects**: discord.gg, discord.io, discord.me, discordapp.com/invite, etc.

### 5. **Mention Spam** @
- **What it does**: Limits @mentions per message
- **Settings**:
  - Max mentions (1-20, default: 5)
  - Action on violation
- **Counts**: Users + Roles mentions combined

### 6. **Emoji Spam** 😀
- **What it does**: Limits emojis per message
- **Settings**:
  - Max emojis (1-50, default: 10)
  - Action on violation
- **Counts**: Custom Discord emojis + Unicode emojis

### 7. **Attachment Filter** 📎
- **What it does**: Blocks all file attachments
- **Settings**:
  - Action on violation
- **Use case**: Prevent spam images/files in certain channels

### 8. **Duplicate Messages** 🔄
- **What it does**: Prevents sending the same message repeatedly
- **Settings**:
  - Timeframe in seconds (10-300, default: 60)
  - Action on violation
- **Example**: Block "BUY NOW!" sent 3 times in 60 seconds

---

## ⚙️ Actions

Each rule can have different actions when violated:

1. **Delete** - Delete the message only
2. **Warn** - Delete + send warning message
3. **Timeout** - Delete + timeout user (configurable duration)
4. **Kick** - Delete + kick user from server
5. **Ban** - Delete + ban user from server

---

## 🔓 Whitelist System

### Whitelisted Channels
- Auto-mod is completely disabled in these channels
- Use for: Staff channels, bot commands, off-topic

### Whitelisted Roles
- Users with these roles bypass ALL auto-mod rules
- Use for: Staff, VIP, Trusted members

---

## 🎨 Dashboard Features

### Master Toggle
- Enable/disable entire auto-mod system
- When disabled, all rules are ignored

### Rule Cards
- Collapsible design - shows settings only when enabled
- Each rule has:
  - Icon and description
  - Toggle switch
  - Custom settings (thresholds, limits, etc.)
  - Action selector dropdown

### Multi-Select Lists
- Whitelist channels with Ctrl/Cmd + click
- Whitelist roles with Ctrl/Cmd + click

### Visual Feedback
- Success/error messages at top
- Loading states on save button
- Domain chips with remove buttons

---

## 🤖 Bot Behavior

### Execution Order
1. **Ticket Handler** (for ticket channels)
2. **Auto-Mod** (this system)
3. **Anti-Scam** (image/text analysis)
4. **Basic Moderation** (banned words, old spam check)
5. **Leveling** (XP rewards)

### Message Flow
```
Message received
  → Is it in a ticket? → Ticket handler
  → Auto-mod enabled? → Check all rules
  → Rule violated? → Execute action + log
  → Continue to anti-scam...
```

### Warning Messages
- Deleted automatically after 8 seconds
- Shows:
  - Rule name
  - Reason
  - Action taken
  - User mention

### Audit Logging
- All violations logged to database
- Sent to log channel (if configured)
- Shows:
  - User info
  - Channel
  - Rule violated
  - Action taken
  - Message content

---

## 📊 Technical Details

### Memory Management
- Spam tracker cleaned every 5 minutes
- Duplicate tracker cleaned every 5 minutes
- Only keeps recent entries (< 1 minute)

### Performance
- All checks are O(1) or O(n) where n is small
- No database queries per message
- Efficient regex patterns

### Type Safety
- Full TypeScript types
- Prisma schema validation
- React component props typed

---

## 🎛️ Configuration Examples

### Gaming Server
```
Spam: 5 messages / 5s → Timeout 5min
Caps: 80% → Delete
Links: Whitelist [twitch.tv, youtube.com] → Delete
Invites: Ban
Mentions: 5 max → Warn
Emojis: 15 max → Delete
```

### Professional Server
```
Spam: 3 messages / 10s → Kick
Caps: 60% → Delete
Links: Whitelist [company.com, docs.com] → Timeout
Invites: Ban
Attachments: Delete
Duplicates: 30s → Delete
```

### Community Server
```
Spam: 6 messages / 5s → Warn
Caps: 90% → Delete
Invites: Delete
Mentions: 8 max → Delete
Emojis: 20 max → Warn
```

---

## 🔧 Setup Guide

1. **Enable Auto-Mod**
   - Go to Dashboard → Server → Auto-Mod
   - Toggle "Enable Auto-Mod" ON

2. **Configure Rules**
   - Enable the rules you want
   - Set thresholds and limits
   - Choose actions for violations

3. **Set Whitelist (Optional)**
   - Add staff channels/roles to bypass
   - Multi-select with Ctrl/Cmd + click

4. **Save Settings**
   - Click "Save Settings" button
   - Settings apply immediately

5. **Test**
   - Try violating a rule in Discord
   - Check if message is deleted
   - Verify log channel receives alert

---

## 📝 Database Fields

All fields in Guild model:

```prisma
autoModEnabled: Boolean
autoModSpamEnabled: Boolean
autoModSpamMaxMessages: Int
autoModSpamTimeframe: Int
autoModSpamAction: String
autoModSpamTimeoutDuration: Int
autoModCapsEnabled: Boolean
autoModCapsThreshold: Int
autoModCapsMinLength: Int
autoModCapsAction: String
autoModLinksEnabled: Boolean
autoModLinksWhitelist: String[]
autoModLinksAction: String
autoModInvitesEnabled: Boolean
autoModInvitesAction: String
autoModMentionsEnabled: Boolean
autoModMentionsMax: Int
autoModMentionsAction: String
autoModEmojisEnabled: Boolean
autoModEmojisMax: Int
autoModEmojisAction: String
autoModAttachmentsEnabled: Boolean
autoModAttachmentsAction: String
autoModWhitelistChannels: String[]
autoModWhitelistRoles: String[]
autoModDuplicatesEnabled: Boolean
autoModDuplicatesTimeframe: Int
autoModDuplicatesAction: String
```

---

## 🎉 Summary

The Advanced Auto-Mod system provides:

✅ **8 Detection Rules** - Spam, Caps, Links, Invites, Mentions, Emojis, Attachments, Duplicates
✅ **5 Action Types** - Delete, Warn, Timeout, Kick, Ban
✅ **Whitelist System** - Bypass by channel or role
✅ **Clean Dashboard UI** - Collapsible cards, toggles, multi-select
✅ **Comprehensive Logging** - Database + Discord log channel
✅ **Real-time Enforcement** - Instant detection and action
✅ **Zero Database Queries** - All checks in memory for performance
✅ **Type-Safe** - Full TypeScript implementation
✅ **Customizable** - Every threshold and limit is configurable

This is a **production-ready** auto-moderation system that rivals bots like Dyno, MEE6, and Carl-bot!
