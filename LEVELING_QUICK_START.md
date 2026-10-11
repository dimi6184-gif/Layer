# 🚀 Advanced Leveling - Quick Start

## Installation (3 Schritte)

### Schritt 1: Prisma Client neu generieren
```bash
cd packages/db
npx prisma generate
```

### Schritt 2: Database Migration  
```bash
npx prisma migrate dev --name advanced_leveling_system
```

### Schritt 3: Bot neu starten
```bash
cd ../../apps/bot
npm run build
npm start
```

## Fertig! ✅

Teste die neuen Commands:
```
/rank
/leaderboard type:xp
/leaderboard type:streak
/leaderboard type:messages
/achievements
```

## Was ist neu?

✅ **Daily Streaks** - +5% XP pro Tag (max +50%)
✅ **Achievements** - 8 unlockable badges mit XP rewards
✅ **Enhanced Rank Cards** - Zeigt Streak, Messages, Last Active
✅ **3 Leaderboard Types** - XP, Streak, Messages
✅ **Detailed Stats** - Comprehensive tracking

## Probleme?

Falls Errors kommen, schick mir den Output! 🔧
