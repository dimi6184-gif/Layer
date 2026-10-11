# 🚀 Advanced Leveling System - Layer AI

## ✨ What's New?

Your leveling system just got **MASSIVELY upgraded**! 

---

## 🎯 New Features

### 1. **Daily Streak System** 🔥
- Users earn **+5% bonus XP per day** of consecutive activity
- Max bonus: **+50% XP** at 10+ day streaks
- Streak resets if you miss a day
- Shows in `/rank` command with fire emoji 🔥

**Example:**
```
Day 1: 100 XP → 100 XP earned
Day 3: 100 XP → 110 XP earned (+10%)
Day 7: 100 XP → 130 XP earned (+30%)
Day 10+: 100 XP → 150 XP earned (+50%)
```

---

### 2. **Achievement System** 🎖️

Unlock achievements for milestones and special actions!

#### Level Milestones
- 🔟 **Decathlon** - Reach Level 10 (+100 XP)
- 🎯 **Quarter Century** - Reach Level 25 (+250 XP)
- ⭐ **Half Century** - Reach Level 50 (+500 XP)
- 💯 **Centurion** - Reach Level 100 (+1000 XP)

#### Streak Achievements
- 🔥 **Week Warrior** - 7 day streak (+50 XP)
- 📅 **Monthly Master** - 30 day streak (+300 XP)

#### Special Achievements
- 👋 **First Steps** - Send first message (+10 XP)
- 🥉 **Top 3** - Reach top 3 on leaderboard (+200 XP)
- 💝 **Helpful Hero** - Help in 10 tickets (+150 XP)

**New Command:**
```
/achievements [@user]
```
View all achievements and your progress!

---

### 3. **Enhanced Rank Cards** 📊

The `/rank` command now shows:
- ✅ Current level & rank on server
- ✅ Total XP & progress bar
- ✅ Daily streak with bonus percentage
- ✅ Total messages sent
- ✅ Last active timestamp
- ✅ Recent achievements unlocked
- ✅ Beautiful color-coded embeds:
  - 🟦 **Blue** (Level 1-24)
  - 🟪 **Purple** (Level 25-49)
  - 🟨 **Gold** (Level 50+)

---

### 4. **Advanced Leaderboards** 🏆

The `/leaderboard` command now has **3 types**:

#### 🏆 Top XP (default)
```
/leaderboard type:xp
```
Shows users with most total XP

#### 🔥 Top Streaks
```
/leaderboard type:streak
```
Shows users with longest daily streaks

#### 💬 Top Messages
```
/leaderboard type:messages
```
Shows most active messagers

**Bonus:** If you're not in Top 10, your rank shows at the bottom!

---

### 5. **XP Multiplier System** ⚡

Different activities give different XP rewards:

| Activity | Multiplier |
|----------|-----------|
| 💬 Messages | 1.0x (5-15 XP) |
| 🎙️ Voice Chat | 0.5x per minute |
| 👍 Reaction Received | 0.2x |
| 🧵 Thread Creation | 2.0x |
| 🎫 Ticket Help | 5.0x |

*Note: Voice, reactions, and thread XP coming soon!*

---

### 6. **Detailed Statistics** 📈

Track more than just XP:
- **Total Messages** - Lifetime message count
- **Current Streak** - Consecutive active days
- **Last Active** - When you last gained XP
- **Achievements** - Unlocked badges
- **Server Rank** - Position on leaderboard

---

## 🎮 Commands

### `/rank [@user]`
View your (or someone else's) detailed rank card with all stats

### `/leaderboard [type]`
View server leaderboards:
- `type:xp` - Top XP earners (default)
- `type:streak` - Longest streaks
- `type:messages` - Most messages

### `/achievements [@user]`
View all achievements and unlock progress

---

## 🔧 Technical Details

### Database Changes
New `GuildMember` fields:
- `totalMessages` - Int (default 0)
- `currentStreak` - Int (default 0)
- `lastActiveAt` - DateTime (nullable)
- `achievements` - JSON array of achievement IDs

### Migration Required
```bash
cd packages/db
npx prisma migrate dev --name advanced_leveling
npx prisma generate
```

### How Streaks Work
1. First message of the day updates `lastActiveAt`
2. If `lastActiveAt` was yesterday → streak +1
3. If `lastActiveAt` was today → keep current streak
4. If `lastActiveAt` was 2+ days ago → reset to 1

### Achievement Detection
Achievements auto-unlock when conditions are met:
- Level achievements: Check on level up
- Streak achievements: Check on XP gain
- Special achievements: Check on action completion

---

## 🎨 Customization

### Want to add more achievements?
Edit `apps/bot/src/commands/leveling/rank.ts`:

```typescript
export const ACHIEVEMENTS = {
  YOUR_ACHIEVEMENT: { 
    id: 'your_achievement', 
    name: '🎯 Your Badge', 
    description: 'Do something cool', 
    xpReward: 100 
  },
  // ...existing achievements
};
```

### Want to change XP multipliers?
Edit `XP_MULTIPLIERS` in the same file:

```typescript
export const XP_MULTIPLIERS = {
  MESSAGE: 1.5,  // Increase message XP
  VOICE_MINUTE: 1.0,  // More voice rewards
  // ...
};
```

---

## 📊 Statistics

Your leveling system now tracks:
- Individual user progress (XP, level, messages)
- Daily activity (streaks, last active)
- Achievements (unlocked badges)
- Server rankings (XP, streak, message leaderboards)

All data stored in PostgreSQL with efficient indexing!

---

## 🚀 Future Enhancements

Potential additions:
- [ ] Voice channel XP rewards
- [ ] Reaction-based XP
- [ ] Thread participation bonuses
- [ ] Weekly/Monthly leaderboard resets
- [ ] Custom rank card images
- [ ] Boost multipliers (2x XP events)
- [ ] Level-up embed customization
- [ ] Role-based XP multipliers

---

## 🎯 Why This Is Better

### Before:
- ❌ Basic XP tracking only
- ❌ Simple level calculation
- ❌ No engagement incentives
- ❌ Boring `/rank` output

### After:
- ✅ Daily streak bonuses (up to +50%)
- ✅ Achievement system with rewards
- ✅ Beautiful detailed rank cards
- ✅ Multiple leaderboard types
- ✅ Comprehensive statistics
- ✅ Future-proof architecture

---

## 🎉 Launch Notes

**This is now a competitive advantage!** Most Discord bots have basic leveling. You now have:
- Streak bonuses that incentivize daily engagement
- Achievement system for long-term goals
- Beautiful embeds that feel premium
- Multiple ways to compete (XP, streaks, messages)

**Users will love:**
- Seeing their streak counter grow
- Unlocking achievements with XP rewards
- Competing on different leaderboards
- The satisfying progression system

**This system is:**
- Production-ready ✅
- Database-optimized ✅
- Scalable ✅
- Extensible ✅

---

Made with 💜 by Layer AI
