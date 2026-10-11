# Welcome/Leave System - Complete Implementation

## ✅ Implementation Status: COMPLETE

---

## 🎯 Features Implemented

### Welcome System
- ✅ **Toggle Enable/Disable** - Turn welcome messages on/off
- ✅ **Channel Selection** - Choose where welcome messages are sent
- ✅ **Embed Support** - Rich embeds with custom title, description, and color
- ✅ **Plain Text Messages** - Alternative to embeds for simpler messages
- ✅ **Auto-Generated Images** - Canvas-based welcome images with user avatar, gradient background
- ✅ **DM Welcome Messages** - Private welcome messages sent to new members
- ✅ **Auto-Role Assignment** - Automatically assign multiple roles to new members
- ✅ **Placeholder Support** - Dynamic placeholders: `{user}`, `{username}`, `{server}`, `{memberCount}`
- ✅ **Live Preview** - Real-time preview of how messages will look

### Leave System
- ✅ **Toggle Enable/Disable** - Turn leave messages on/off
- ✅ **Channel Selection** - Choose where leave messages are sent
- ✅ **Embed Support** - Rich embeds with custom title, description, and color
- ✅ **Plain Text Messages** - Alternative to embeds
- ✅ **Placeholder Support** - Same placeholders as welcome messages
- ✅ **Live Preview** - Real-time preview of leave messages

---

## 📁 Files Created/Modified

### Bot Files
1. **`apps/bot/src/events/welcomeHandler.ts`** - NEW
   - `handleMemberJoin()` - Processes new member joins
   - `handleMemberLeave()` - Processes member leaves
   - `generateWelcomeImage()` - Creates custom welcome images with Canvas
   - Event listeners registered in `index.ts`

### Dashboard Files
2. **`apps/web/src/app/(app)/dashboard/[id]/welcome/page.tsx`** - NEW
   - Dashboard page for Welcome/Leave settings
   - Fetches guild settings, channels, and roles
   - Passes data to WelcomeSettings component

3. **`apps/web/src/components/WelcomeSettings.tsx`** - NEW
   - Complete UI for configuring welcome and leave settings
   - Separate save buttons for welcome and leave
   - Live preview panels
   - Auto-role multi-select
   - Placeholder documentation

4. **`apps/web/src/actions/welcome.ts`** - NEW
   - `updateWelcomeSettings()` - Saves welcome configuration
   - `updateLeaveSettings()` - Saves leave configuration
   - Audit logging for both actions

5. **`apps/web/src/app/(app)/dashboard/layout.tsx`** - UPDATED
   - Added "Welcome/Leave" to sidebar with UserPlus icon
   - Positioned before Giveaways module

### Database
6. **`packages/db/prisma/schema.prisma`** - UPDATED (Migration already applied)
   - 18 new fields added to Guild model
   - Migration: `20260602142853_add_welcome_leave_system`

---

## 🎨 Welcome Image Generation

The system uses **Canvas** to generate custom welcome images:
- **Size**: 800x300 pixels
- **Background**: Purple-blue gradient (#5865F2 to #7289DA)
- **Avatar**: Circular user avatar (120px) with white border
- **Text**: "WELCOME", username, member count, server name
- **Font**: Arial Bold for headers, regular for details
- **Auto-generated** for each new member

---

## 🔧 Placeholders

Available in all messages (welcome/leave, embeds, DMs):

| Placeholder | Output | Example |
|------------|--------|---------|
| `{user}` | User mention | @Username |
| `{username}` | Username only | Username |
| `{server}` | Server name | My Server |
| `{memberCount}` | Total members | 1,234 |

---

## 🚀 How It Works

### Member Join Flow
1. User joins the server
2. Bot detects `GuildMemberAdd` event
3. `handleMemberJoin()` is triggered
4. **Auto-assign roles** (if configured)
5. **Generate welcome image** (if enabled)
6. **Send welcome message** to channel (with embed/image)
7. **Send DM** to user (if enabled)
8. **Log to audit log**

### Member Leave Flow
1. User leaves the server
2. Bot detects `GuildMemberRemove` event
3. `handleMemberLeave()` is triggered
4. **Send leave message** to channel (with embed)
5. **Log to audit log**

---

## 🎯 Dashboard Features

### Welcome Tab
- Enable/disable toggle
- Channel selector
- Embed vs plain text toggle
- Embed customization (title, description, color)
- Image generation toggle
- DM toggle with custom message
- Auto-role selector (multi-select checkboxes)
- Live preview panel
- Save button

### Leave Tab
- Enable/disable toggle
- Channel selector
- Embed vs plain text toggle
- Embed customization (title, description, color)
- Live preview panel
- Save button

### UI Elements
- Clean, minimalistic design matching existing dashboard
- Color-coded (green for welcome, red for leave)
- Real-time preview with placeholder substitution
- Placeholder documentation at the top
- Separate save buttons to avoid conflicts

---

## 🧪 Testing Checklist

- [ ] **Welcome Message**: Join server and check if message appears in configured channel
- [ ] **Welcome Image**: Verify custom image is generated with avatar and correct text
- [ ] **Welcome DM**: Check if DM is sent to new member
- [ ] **Auto-Roles**: Confirm roles are automatically assigned
- [ ] **Leave Message**: Leave server and check if leave message appears
- [ ] **Placeholders**: Test all placeholders in messages
- [ ] **Dashboard**: Save settings and verify they persist
- [ ] **Preview**: Check live preview matches actual messages
- [ ] **Embed Colors**: Test custom colors for embeds
- [ ] **Multi-roles**: Test assigning multiple auto-roles

---

## 📊 Database Schema

### Welcome Fields (Guild model)
```prisma
welcomeEnabled            Boolean  @default(false)
welcomeChannelId          String?
welcomeMessage            String?
welcomeEmbedEnabled       Boolean  @default(true)
welcomeEmbedTitle         String   @default("Welcome to {server}! 👋")
welcomeEmbedDescription   String   @default("Hey {user}, welcome to **{server}**!\n\nYou are member **#{memberCount}**!")
welcomeEmbedColor         String   @default("#5865F2")
welcomeImageEnabled       Boolean  @default(true)
welcomeDMEnabled          Boolean  @default(false)
welcomeDMMessage          String?
autoRoleIds               String[] @default([])
```

### Leave Fields (Guild model)
```prisma
leaveEnabled              Boolean  @default(false)
leaveChannelId            String?
leaveMessage              String?
leaveEmbedEnabled         Boolean  @default(true)
leaveEmbedTitle           String   @default("Goodbye 👋")
leaveEmbedDescription     String   @default("{user} has left the server.")
leaveEmbedColor           String   @default("#ef4444")
```

---

## 🎉 Summary

The Welcome/Leave System is **fully implemented and ready to use**! 

Users can now:
1. Navigate to **Dashboard → Server → Welcome/Leave**
2. Configure welcome messages with custom images, DMs, and auto-roles
3. Configure leave messages with custom embeds
4. Preview messages in real-time
5. Save settings independently for welcome and leave

The system automatically triggers when members join or leave, with full audit logging and error handling.

---

## 📝 Notes

- Canvas package already installed for image generation
- Events registered in `apps/bot/src/index.ts`
- Migration already applied to database
- All files follow existing project structure and conventions
- Uses `@nexus/db` for database imports (correct import name)
- Uses `db` client (not `prisma`)
- Sidebar link added between Verification and Giveaways
