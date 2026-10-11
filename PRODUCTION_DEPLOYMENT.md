# 🚀 Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Variables

Stelle sicher, dass alle Environment Variables gesetzt sind:

#### Web App (.env)
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Discord OAuth
DISCORD_CLIENT_ID="your_client_id"
DISCORD_CLIENT_SECRET="your_client_secret"

# Discord Bot Token (für API calls)
DISCORD_BOT_TOKEN="your_bot_token"
```

#### Bot (.env)
```env
# Discord
DISCORD_TOKEN="your_bot_token"
CLIENT_ID="your_client_id"
# DEV_GUILD_ID="" # Remove in production for global commands

# Database
DATABASE_URL="postgresql://..."

# AI
GEMINI_API_KEY="your_gemini_key"
HUGGINGFACE_API_KEY="your_huggingface_key"

# Twitch
TWITCH_CLIENT_ID="your_twitch_client_id"
TWITCH_CLIENT_SECRET="your_twitch_client_secret"

# YouTube
YOUTUBE_API_KEY="your_youtube_api_key"
```

---

## 🔐 Security Checklist

- [ ] Alle Secrets sind sicher gespeichert (nicht in Git)
- [ ] NEXTAUTH_SECRET ist generiert (`openssl rand -base64 32`)
- [ ] NEXTAUTH_URL ist auf Production-Domain gesetzt
- [ ] Discord OAuth Redirect URLs sind aktualisiert
- [ ] Database hat starkes Passwort
- [ ] Rate Limiting ist aktiviert
- [ ] CORS ist korrekt konfiguriert
- [ ] Security Headers sind gesetzt (✅ bereits in next.config.ts)

---

## 📦 Build & Deploy

### Option 1: Vercel (Empfohlen für Web App)

1. **Repository zu GitHub pushen**:
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Vercel Setup**:
   - Gehe zu https://vercel.com
   - Klicke auf "New Project"
   - Importiere dein GitHub Repository
   - Root Directory: `apps/web`
   - Framework Preset: Next.js
   - Environment Variables hinzufügen (siehe oben)
   - Deploy!

3. **Custom Domain** (optional):
   - Gehe zu Project Settings > Domains
   - Füge deine Domain hinzu
   - Aktualisiere DNS Records
   - Aktualisiere NEXTAUTH_URL

### Option 2: Docker (Für beide Apps)

#### Web App Dockerfile
```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate --schema=./packages/db/prisma/schema.prisma
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

#### Bot Dockerfile
```dockerfile
# apps/bot/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/db/package*.json ./packages/db/

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate --schema=./packages/db/prisma/schema.prisma

# Build TypeScript
RUN npm run build

# Run
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - apps/web/.env
    depends_on:
      - db
    restart: unless-stopped

  bot:
    build:
      context: .
      dockerfile: apps/bot/Dockerfile
    env_file:
      - apps/bot/.env
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password
      POSTGRES_DB: discord_bot
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### Option 3: VPS (Ubuntu/Debian)

1. **Server Setup**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   ```

2. **Database Setup**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE discord_bot;
   CREATE USER botuser WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE discord_bot TO botuser;
   \q
   ```

3. **Deploy Web App**:
   ```bash
   cd apps/web
   npm ci
   npx prisma migrate deploy
   npm run build
   pm2 start npm --name "web" -- start
   pm2 save
   pm2 startup
   ```

4. **Deploy Bot**:
   ```bash
   cd apps/bot
   npm ci
   npm run build
   pm2 start npm --name "bot" -- start
   pm2 save
   ```

5. **Nginx Reverse Proxy**:
   ```nginx
   # /etc/nginx/sites-available/discord-bot
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL mit Let's Encrypt**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔄 Database Migration

### Production Migration
```bash
cd packages/db
npx prisma migrate deploy
```

### Backup vor Migration
```bash
pg_dump -U postgres discord_bot > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## 📊 Monitoring

### PM2 Monitoring
```bash
# Status anzeigen
pm2 status

# Logs anzeigen
pm2 logs

# Restart
pm2 restart all

# Stop
pm2 stop all
```

### Error Tracking (Optional)

Integriere Sentry für Error Tracking:

```bash
npm install @sentry/nextjs @sentry/node
```

---

## 🔧 Performance Optimierung

### Next.js Build Optimierung

In `next.config.ts` bereits aktiviert:
- ✅ React Strict Mode
- ✅ Compression
- ✅ Image Optimization
- ✅ Security Headers

### Database Optimierung

```sql
-- Indexes für häufige Queries
CREATE INDEX idx_guild_discord_id ON "Guild"("discordId");
CREATE INDEX idx_team_member_guild_user ON "TeamMember"("guildId", "userId");
CREATE INDEX idx_social_account_guild ON "SocialAccount"("guildId");
CREATE INDEX idx_audit_log_guild_created ON "AuditLog"("guildId", "createdAt");
```

---

## 🚨 Troubleshooting

### Web App startet nicht
- Prüfe Environment Variables
- Prüfe Database Connection
- Prüfe Logs: `pm2 logs web`

### Bot startet nicht
- Prüfe Discord Token
- Prüfe Database Connection
- Prüfe Logs: `pm2 logs bot`

### Database Connection Error
- Prüfe DATABASE_URL
- Prüfe ob PostgreSQL läuft: `sudo systemctl status postgresql`
- Prüfe Firewall Rules

### Stream Notifications funktionieren nicht
- Prüfe Twitch/YouTube API Keys
- Prüfe Bot Logs für Fehler
- Prüfe ob Bot die richtigen Permissions hat

---

## 📈 Scaling

### Horizontal Scaling
- Load Balancer vor Web App
- Mehrere Bot Instances (mit Sharding)
- Database Read Replicas

### Vertical Scaling
- Mehr RAM/CPU für Server
- Database Connection Pooling
- Redis für Caching

---

## 🔄 Updates & Maintenance

### Update Prozess
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Run migrations
cd packages/db && npx prisma migrate deploy

# Rebuild
npm run build

# Restart
pm2 restart all
```

### Backup Strategy
- Tägliche Database Backups
- Wöchentliche Full Backups
- Backup Retention: 30 Tage

---

## ✅ Post-Deployment Checklist

- [ ] Web App ist erreichbar
- [ ] Bot ist online in Discord
- [ ] Database Migrations sind gelaufen
- [ ] Alle Features funktionieren
- [ ] Error Tracking ist aktiv
- [ ] Monitoring ist eingerichtet
- [ ] Backups sind konfiguriert
- [ ] SSL Zertifikat ist aktiv
- [ ] DNS ist korrekt konfiguriert
- [ ] Discord OAuth funktioniert
- [ ] Stream Notifications funktionieren

---

## 🎉 Fertig!

Deine App ist jetzt produktionsbereit und läuft! 🚀

Bei Problemen:
1. Prüfe Logs: `pm2 logs`
2. Prüfe Environment Variables
3. Prüfe Database Connection
4. Prüfe Discord Developer Console
