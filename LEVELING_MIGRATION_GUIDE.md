# 🔄 Advanced Leveling Migration Guide

## Step 1: Update Database Schema

```bash
cd packages/db
npx prisma migrate dev --name advanced_leveling_system
```

This will:
- Add `totalMessages` field (Int, default 0)
- Add `currentStreak` field (Int, default 0)
- Add `lastActiveAt` field (DateTime, nullable)
- Add `achievements` field (JSON, default [])

## Step 2: Generate Prisma Client

```bash
npx prisma generate
```

## Step 3: Rebuild Bot

```bash
cd ../../apps/bot
npm run build
```

## Step 4: Restart Bot

```bash
npm start
```

## Step 5: Test New Commands

In your Discord server:

```
/rank
```
Should show new detailed rank card with streak, messages, achievements

```
/leaderboard type:xp
/leaderboard type:streak
/leaderboard type:messages
```
Should show different leaderboard types

```
/achievements
```
Should show all available achievements

## Migration Issues?

### Issue: "Unknown field" errors
**Solution:** Make sure you ran `npx prisma generate` after the migration

### Issue: Commands not showing up
**Solution:** Bot needs to restart to register new commands

### Issue: Existing users have 0 messages
**Solution:** Normal! `totalMessages` will start tracking from now

### Issue: Streaks not working
**Solution:** Streaks need at least 2 consecutive days to show bonus

## Rollback (if needed)

If something breaks, rollback:

```bash
cd packages/db
npx prisma migrate resolve --rolled-back advanced_leveling_system
```

Then restore the old schema from git:
```bash
git checkout HEAD -- prisma/schema.prisma
npx prisma generate
```

## Success Checklist

- [ ] Migration ran without errors
- [ ] Prisma client generated
- [ ] Bot restarted successfully
- [ ] `/rank` shows new fields
- [ ] `/leaderboard` has type options
- [ ] `/achievements` command works
- [ ] Streak system tracking (wait 2 days to verify)
- [ ] Achievements unlocking (check after level up)

## Done! 🎉

Your advanced leveling system is now live!

Users will start seeing:
- Streak bonuses after consecutive days
- Achievements unlocking automatically
- Beautiful rank cards
- Multiple leaderboards

Monitor the logs for any "achievement unlocked" or "streak" messages to confirm it's working!
