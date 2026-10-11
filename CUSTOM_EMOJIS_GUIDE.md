# Custom Emojis Feature - Complete Guide

## 🎨 Overview

The Custom Emojis feature allows server administrators to customize the emojis used in polls and giveaways, making them match their server's branding and theme.

---

## ✨ Features

### Poll Emojis (4 custom emojis)
- Replace default number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣)
- Use any emoji: Unicode emojis or Discord custom server emojis
- Automatically fallback to defaults if not configured
- Reaction tracking works seamlessly with custom emojis

### Giveaway Emoji (1 custom emoji)
- Replace default party emoji (🎉)
- Shows on the "Enter Giveaway" button
- Works with both Components v2 and classic embed formats

---

## 📖 How to Use

### Step 1: Access Settings
1. Go to your server dashboard: `/dashboard/[server-id]`
2. Click on "Server Settings" in the sidebar
3. Scroll to the "🎨 Custom Emojis" section

### Step 2: Configure Poll Emojis
1. You'll see 4 input fields labeled "Option 1" through "Option 4"
2. Enter your desired emoji in each field
3. You can use:
   - **Unicode emojis:** 😀 👍 ❤️ ⚡
   - **Discord server emojis:** `<:custom:1234567890>`

**To get Discord custom emoji IDs:**
1. In Discord, type `\:emoji_name:` in any channel
2. Send the message
3. Discord will show the full emoji code: `<:name:1234567890>`
4. Copy and paste this entire code into the input field

### Step 3: Configure Giveaway Emoji
1. Enter your desired emoji in the "Giveaway Button Emoji" field
2. You'll see a live preview of the emoji below
3. Same emoji types work (Unicode or Discord custom)

### Step 4: Save Changes
1. Click "Save Changes" button
2. Wait for success confirmation
3. Your custom emojis are now active!

### Reset to Defaults
- Click "Reset to Defaults" to restore original emojis:
  - Poll: 1️⃣, 2️⃣, 3️⃣, 4️⃣
  - Giveaway: 🎉

---

## 🧪 Testing Your Custom Emojis

### Test Polls:
```
/poll question:"What's your favorite color?" option1:"Red" option2:"Blue" option3:"Green"
```
- The bot will use your custom emojis for reactions
- Click reactions to vote - tracking works normally

### Test Giveaways:
```
/giveaway start prize:"Discord Nitro" duration:"1h" winners:1
```
- The "Enter Giveaway" button will show your custom emoji
- Functionality remains the same

---

## 🔧 Technical Details

### Database Schema:
```prisma
model Guild {
  // ... other fields
  customPollEmojis        String[] @default(["1️⃣", "2️⃣", "3️⃣", "4️⃣"])
  customGiveawayEmoji     String @default("🎉")
}
```

### How the Bot Uses Custom Emojis:

**Poll Command:**
```typescript
// Fetch guild settings
const guildSettings = await db.guild.findUnique({
  where: { discordId: guildId },
  select: { customPollEmojis: true },
});

// Use custom or fallback to defaults
const pollEmojis = guildSettings?.customPollEmojis || ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

// Display in poll message
const optionText = options.map((o, i) => `${pollEmojis[i]} ${o}`).join('\n');

// Add as reactions
for (let i = 0; i < options.length; i++) {
  await msg.react(pollEmojis[i]);
}
```

**Giveaway Command:**
```typescript
// Fetch guild settings
const guildSettings = await db.guild.findUnique({
  where: { discordId: guildId },
  select: { customGiveawayEmoji: true },
});

const giveawayEmoji = guildSettings?.customGiveawayEmoji || '🎉';

// Use in button
button.setEmoji(giveawayEmoji);
```

### Reaction Tracking with Custom Emojis:

The `pollHandler.ts` dynamically checks if a reaction matches the server's custom emojis:

```typescript
async function isPollEmoji(guildId: string, emoji: string) {
  const guildSettings = await db.guild.findUnique({
    where: { discordId: guildId },
    select: { customPollEmojis: true },
  });

  const pollEmojis = guildSettings?.customPollEmojis || DEFAULT_EMOJIS;
  const index = pollEmojis.indexOf(emoji);
  
  return { isValid: index !== -1, index };
}
```

This ensures that:
- Only configured emojis are tracked
- Vote counting works correctly with custom emojis
- Different servers can use different emojis

---

## 🎯 Use Cases

### Server Branding:
- Use your server's custom emojis for a branded experience
- Match polls/giveaways to your server's theme colors

### Language Support:
- Use language-specific emojis
- Make polls more accessible with culturally relevant symbols

### Gaming Servers:
- Use game-related emojis (⚔️ 🛡️ 🏹 🔮 for RPG polls)
- Use rank/tier emojis for competitive giveaways

### Community Engagement:
- Fun themed emojis increase participation
- Custom reactions make the server feel unique

---

## 🐛 Troubleshooting

### Custom Emoji Not Working?
1. **Check emoji format:** Discord custom emojis must be `<:name:id>` format
2. **Verify bot permissions:** Bot needs "Use External Emojis" permission
3. **Check emoji availability:** Bot must be in a server that has the custom emoji

### Poll Reactions Not Tracking?
1. Ensure you saved the settings properly
2. Try resetting to defaults and testing
3. Check that you have exactly 4 emojis configured

### Giveaway Button Shows Wrong Emoji?
1. Clear browser cache
2. Restart the bot
3. Verify emoji is saved in database

---

## 📊 Migration Details

**Migration:** `20260602214730_add_custom_emojis`

**SQL Changes:**
```sql
ALTER TABLE "Guild" 
ADD COLUMN "customPollEmojis" TEXT[] DEFAULT ARRAY['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
ADD COLUMN "customGiveawayEmoji" TEXT DEFAULT '🎉';
```

**Backwards Compatibility:**
- Existing servers automatically get default emojis
- No breaking changes to existing polls/giveaways
- Servers can opt-in to custom emojis anytime

---

## 🚀 Future Enhancements

Possible future additions:
- Emoji picker UI (visual selection instead of text input)
- Per-poll custom emojis (different emojis for different polls)
- Animated emoji support
- Emoji presets (gaming, food, flags, etc.)
- Import/export emoji configurations

---

**Date:** June 2, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
