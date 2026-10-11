# Giveaway System - Components v2 Implementation

## Overview

The giveaway system has been upgraded to use Discord's **Components v2** message format for a cleaner, more modern look. This replaces the traditional embed-based messages with a flexible component system.

## What are Components v2?

Components v2 is Discord's new message format that allows flexible layouts by composing different component types:

- **TextDisplay**: Markdown-formatted text blocks
- **Container**: Rounded boxes with optional accent color (like embeds)
- **Section**: Text with an accessory (button or thumbnail)
- **Separator**: Vertical spacing with optional divider line
- **MediaGallery**: Grid of images
- **Button**: Interactive button components

## Key Changes

### Message Flag Required
All giveaway messages now use `MessageFlags.IsComponentsV2` (bit flag `1 << 15`)

### No Traditional Embeds
- ❌ Cannot use: `content`, `embeds`, `poll`, `stickers`
- ✅ Must use: Component-based layout

### Limits
- Max 40 components per message
- Max 4000 characters across all text components

## Implementation Details

### Important: Message Editing

When **creating** new messages, use `MessageFlags.IsComponentsV2`:
```typescript
await channel.send({
  components: [container],
  flags: MessageFlags.IsComponentsV2,
});
```

When **editing** existing messages, **DO NOT** use the flag. Instead, clear old content:
```typescript
await message.edit({
  components: [container],
  embeds: [],      // Clear old embeds
  content: null,   // Clear old content
});
```

This allows the bot to:
- ✅ Update old embed-based giveaways to Components v2
- ✅ Update new Components v2 giveaways
- ✅ Handle migration seamlessly without errors

### Starting a Giveaway

**Structure:**
```
Container (Accent: #5865F2 - Discord Blurple)
├─ TextDisplay: "🎉 GIVEAWAY" + Prize title
├─ TextDisplay: Description, winners, end time, host
├─ Separator (if requirements exist)
├─ TextDisplay: Requirements list
├─ Separator (no divider)
├─ Section: Call to action + Enter button
├─ Separator (with divider)
└─ TextDisplay: Footer (winner count + end date)
```

**Features:**
- Clean header with emoji and prize
- All info in readable format using Discord timestamps
- Requirements section only shows if needed
- Success-styled green button for entering
- Participant count updates live when users join

### Ended Giveaway (No Winners)

**Structure:**
```
Container (Accent: #ED4245 - Red)
├─ TextDisplay: "🎉 GIVEAWAY ENDED" + Prize
├─ TextDisplay: "No valid entries"
├─ Separator
└─ TextDisplay: Host + timestamp
```

### Ended Giveaway (With Winners)

**Structure:**
```
Container (Accent: #57F287 - Green)
├─ TextDisplay: "🎉 GIVEAWAY ENDED" + Prize
├─ TextDisplay: Winner mentions + total entries
├─ Separator
└─ TextDisplay: Host + timestamp
```

**Winner Announcement:**
```
Container (Accent: #57F287 - Green)
├─ TextDisplay: "🎊 Giveaway Ended!" + Prize
├─ TextDisplay: Winner mentions + jump link
├─ Separator (no divider)
└─ TextDisplay: Congratulations message
```

### Reroll Winners

**Structure:**
```
Container (Accent: #5865F2 - Blue)
├─ TextDisplay: "🎉 Giveaway Rerolled!" + Prize
└─ TextDisplay: New winner mentions + congrats
```

## Color Scheme

| State | Color | Hex | Purpose |
|-------|-------|-----|---------|
| Active | Discord Blurple | `#5865F2` | Standard giveaway |
| Success | Green | `#57F287` | Ended with winners |
| Error | Red | `#ED4245` | Ended without entries |

## Files Modified

### `apps/bot/src/commands/fun/giveaway.ts`
- Added Components v2 imports
- Replaced embed creation with `ContainerBuilder`
- Updated all giveaway states (active, ended, reroll)

### `apps/bot/src/events/giveawayHandler.ts`
- Updated participant counter to rebuild container
- Maintains all giveaway data in updated message

## Benefits

1. **Modern Look**: Matches Discord's latest design patterns
2. **Cleaner Layout**: Component-based structure is more organized
3. **Better Accessibility**: Proper semantic structure
4. **Future-Proof**: Uses Discord's newest message format
5. **Consistent**: All giveaway messages use same system

## Testing

To test the implementation:

1. Start a giveaway: `/giveaway start prize:"Test Prize" duration:1h winners:1`
2. Verify the message shows with container styling
3. Click "Enter Giveaway" button
4. Check that participant count updates
5. Wait for giveaway to end (or use `/giveaway end`)
6. Verify winner announcement uses Components v2

## Migration Notes

- ✅ **Old giveaways** (embed format) will be automatically converted to Components v2 when they end or when users interact with them
- ✅ **New giveaways** are created directly with Components v2
- ✅ No database changes required
- ✅ The bot clears old embeds and content when updating messages to prevent conflicts
- ⚠️ **Critical**: Never use `MessageFlags.IsComponentsV2` when editing messages - only when creating new ones

## References

- [Discord Components v2 Documentation](https://discord.com/developers/docs/components/overview)
- [discord.js Guide - Display Components](https://discordjs.guide/popular-topics/display-components)
- [Components v2 Flag](https://discord.com/developers/docs/resources/message#message-flags)

---

**Implementation Date:** June 2, 2026
**Status:** ✅ Complete
