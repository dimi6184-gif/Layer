# 🦖 Pterodactyl Deployment Guide

## ✅ Perfekt für Discord Bots!

Pterodactyl ist **ideal** für Discord Bots weil:
- ✅ Node.js native support
- ✅ File Manager (kein FTP nötig)
- ✅ Console access (live logs)
- ✅ Auto-restart bei Crash
- ✅ Resource monitoring
- ✅ Kostenlos (wenn Server Zugang)

---

## 📦 Step-by-Step Deploy

### 1. Files vorbereiten

**Auf deinem PC:**
```bash
# 1. Build den Bot
cd apps/bot
npm run build

# 2. Erstelle ein ZIP mit:
dist/               # Kompilierter Code
node_modules/       # Dependencies (oder installiere auf Server)
package.json
package-lock.json
.env.example       # Als Template
eng.traineddata    # Tesseract data file (falls benötigt)
```

**ODER nur Source und auf Server kompilieren:**
```bash
# ZIP erstellen mit:
src/
package.json
package-lock.json
tsconfig.json
.env.example
eng.traineddata
```

---

### 2. Auf Pterodactyl hochladen

**Option A: File Manager (Empfohlen)**
1. Gehe zu deinem Node.js Server Panel
2. Klicke auf "Files"
3. Lösche alle Default-Files
4. Drag & Drop dein ZIP
5. Rechtsklick → "Unarchive"

**Option B: SFTP**
1. Nutze FileZilla oder WinSCP
2. SFTP Details aus Pterodactyl Panel
3. Upload alle Files

---

### 3. Environment Variables (.env)

**Im File Manager:**
1. Erstelle neue Datei: `.env`
2. Kopiere Inhalt von `.env.example`
3. Fülle die Werte aus:

```env
# Discord Bot
DISCORD_TOKEN=your_bot_token_here

# Database (Supabase)
DATABASE_URL=postgresql://user:password@host:5432/database

# AI Features (Optional)
GEMINI_API_KEY=your_gemini_key_here

# Twitch (Optional)
TWITCH_CLIENT_ID=your_twitch_id
TWITCH_CLIENT_SECRET=your_twitch_secret
```

---

### 4. Dependencies installieren

**In der Pterodactyl Console:**
```bash
npm install
```

**Falls du Prisma nutzt:**
```bash
# Prisma Client generieren
cd node_modules/@nexus/db
npx prisma generate
cd ../..
```

---

### 5. TypeScript kompilieren (falls Source hochgeladen)

```bash
npm run build
```

Dies erstellt den `dist/` Ordner mit kompiliertem Code.

---

### 6. Startup Configuration

**Im Pterodactyl Panel:**

1. Gehe zu "Startup"
2. **Startup Command:**
   ```bash
   node dist/index.js
   ```
   
   **ODER mit auto-restart:**
   ```bash
   npm start
   ```

3. **Node Version:** Stelle sicher dass Node 18+ installiert ist

---

### 7. Bot starten

**Im Panel:**
1. Klicke "Start" Button
2. Warte bis Bot online ist
3. Check Console für:
   ```
   ✅ Logged in as YourBotName#1234
   ✅ Slash commands deployed
   ```

---

## 🔧 Troubleshooting

### Problem: "Module not found"
**Fix:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Problem: "Permission denied"
**Fix:** Check file permissions in Pterodactyl
```bash
chmod +x dist/index.js
```

### Problem: "Database connection failed"
**Fix:**
1. Check DATABASE_URL in .env
2. Teste Connection:
```bash
node -e "require('@nexus/db').db.$connect().then(() => console.log('✅ DB Connected')).catch(e => console.error('❌', e))"
```

### Problem: "Prisma Client not generated"
**Fix:**
```bash
cd node_modules/@nexus/db
npx prisma generate
cd ../..
```

### Problem: Bot crasht bei Start
**Fix:** Check Console logs für genauen Fehler

---

## 🚀 Auto-Restart Setup

**Option 1: Pterodactyl Auto-Restart (Empfohlen)**
- Aktiviere in Panel Settings → "Auto-Restart on Crash"

**Option 2: PM2 (Falls verfügbar)**
```bash
npm install -g pm2
pm2 start dist/index.js --name discord-bot
pm2 save
pm2 startup
```

**Option 3: package.json script**
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "start:watch": "nodemon dist/index.js"
  }
}
```

---

## 📊 Monitoring

**In Pterodactyl Console:**
- Live logs sichtbar
- CPU/RAM usage anzeigen
- Restart/Stop/Kill buttons

**Nützliche Commands:**
```bash
# Logs anschauen
tail -f logs/bot.log

# Memory usage
free -h

# Prozesse
top

# Bot neu starten (im Console)
# Einfach "Stop" dann "Start" Button klicken
```

---

## 🔄 Updates deployen

### Method 1: Manual
1. Stop Bot
2. Upload neue Files (überschreibt alte)
3. `npm install` (falls neue Dependencies)
4. `npm run build` (falls TypeScript)
5. Start Bot

### Method 2: Git (Wenn verfügbar)
```bash
git pull
npm install
npm run build
# Restart in Panel
```

---

## 📁 Folder Structure auf Pterodactyl

```
/home/container/
├── dist/              # Kompilierter Code
│   └── index.js
├── node_modules/      # Dependencies
├── src/              # Source (optional)
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env              # SECRETS!
├── eng.traineddata   # Tesseract
└── logs/             # Log files (optional)
```

---

## ⚡ Performance Tips

### 1. Memory Limit setzen
```bash
node --max-old-space-size=512 dist/index.js
```

### 2. Logging optimieren
Nicht zu viel console.log in production!

### 3. Database Connection Pooling
Bereits konfiguriert in Prisma:
```typescript
// In @nexus/db
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. Discord.js Caching
```typescript
// In index.ts
const client = new Client({
  intents: [...],
  makeCache: Options.cacheWithLimits({
    MessageManager: 50,
    GuildMemberManager: 100,
  }),
});
```

---

## 🔒 Security Checklist

- [ ] `.env` file ist NICHT in Git committed
- [ ] `.env` file hat richtige Permissions (chmod 600)
- [ ] Database URL hat starkes Passwort
- [ ] Bot Token ist sicher (nicht geteilt)
- [ ] Pterodactyl Panel hat 2FA aktiviert
- [ ] Nur nötige Ports sind offen

---

## 📞 Support

**Wenn Probleme:**
1. Check Console logs in Pterodactyl
2. Check `.env` file (alle Variablen gesetzt?)
3. Test database connection
4. Check Node.js version (`node --version`)
5. Check RAM usage (Bot braucht ~512MB-1GB)

**Häufige Fehler:**
- DATABASE_URL falsch → Fix in .env
- DISCORD_TOKEN falsch → Neuen Token aus Discord Dev Portal
- Module not found → `npm install` ausführen
- Permission denied → `chmod +x dist/index.js`
- Out of memory → Server RAM erhöhen oder Bot optimieren

---

## ✅ Production Checklist

Vor Go-Live:
- [ ] `.env` file vollständig ausgefüllt
- [ ] Database connection getestet
- [ ] Bot startet ohne Fehler
- [ ] Slash commands deployen erfolgreich
- [ ] Auto-restart aktiviert
- [ ] Monitoring setup (Console logs)
- [ ] Backup-Strategie für Database

---

## 🎉 Done!

Dein Discord Bot läuft jetzt auf Pterodactyl!

**Next Steps:**
1. Dashboard auf Vercel deployen
2. Custom Domain konfigurieren
3. Monitoring setup (optional)
4. Backup-Strategie planen

---

**Kosten: $0 (wenn Pterodactyl Zugang kostenlos ist)** 🎊

**Performance: Perfekt für 1-500 Server** 🚀

**Uptime: 99.9%+ (abhängig von Pterodactyl Host)** ✅
