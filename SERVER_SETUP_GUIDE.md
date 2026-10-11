# 🚀 Layer Bot - Server Setup Guide

## 📋 Server Specs (XEON Nova):
- **CPU:** 2x Intel Xeon v4 Cores
- **RAM:** 8 GB DDR4 ECC
- **Storage:** 40 GB NVMe SSD
- **Network:** 5 Gbit/s, Fair-Use Traffic
- **Price:** 3.50€/Monat
- **Perfect für:** 200+ Discord Server! ✅

---

# 🎯 COMPLETE SETUP - Step by Step

## ⏱️ Geschätzte Zeit: 3-4 Stunden

---

## 📅 PHASE 1: Server kaufen & Zugang (30 Min)

### 1. **Server bestellen**
- ✅ XEON Nova VPS kaufen
- ✅ Ubuntu 22.04 LTS auswählen
- ✅ SSH Key hochladen (oder Password wählen)
- ✅ Warten auf Setup Email (~10-30 Min)

### 2. **Zugang notieren**
Du bekommst per Email:
```
IP Address: 123.45.67.89
Username: root
Password: xyz123 (oder SSH Key)
```

**Speichere diese Infos sicher!**

---

## 📅 PHASE 2: Server vorbereiten (30 Min)

### 1. **Mit Server verbinden**

**Windows (CMD/PowerShell):**
```bash
ssh root@123.45.67.89
```

**Passwort eingeben** wenn gefragt.

---

### 2. **System updaten**
```bash
# Updates installieren
apt update && apt upgrade -y

# Reboot
reboot
```

**Warte 2-3 Minuten, dann wieder einloggen:**
```bash
ssh root@123.45.67.89
```

---

### 3. **Essentials installieren**
```bash
# Node.js 20.x installieren
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Git installieren
apt install -y git

# Build Tools
apt install -y build-essential

# PM2 (Process Manager)
npm install -g pm2

# PostgreSQL
apt install -y postgresql postgresql-contrib

# Checken ob alles läuft
node --version  # sollte v20.x.x zeigen
npm --version
git --version
pm2 --version
```

---

### 4. **PostgreSQL konfigurieren**
```bash
# PostgreSQL starten
systemctl start postgresql
systemctl enable postgresql

# Als postgres user einloggen
sudo -u postgres psql

# In psql (PostgreSQL prompt):
CREATE DATABASE layer_bot;
CREATE USER layeruser WITH PASSWORD 'dein_sicheres_passwort_hier';
GRANT ALL PRIVILEGES ON DATABASE layer_bot TO layeruser;
\q

# Exit aus postgres
exit
```

**Notiere:**
```
Database: layer_bot
User: layeruser
Password: dein_sicheres_passwort_hier
```

---

## 📅 PHASE 3: Code deployen (45 Min)

### 1. **Git Repository klonen**

**Option A: Wenn du GitHub nutzt:**
```bash
cd /opt
git clone https://github.com/dein-username/layer-bot.git
cd layer-bot
```

**Option B: Code hochladen (wenn kein GitHub):**

**Auf deinem PC:**
1. Code zippen: `layer-bot.zip`
2. Mit FileZilla/WinSCP hochladen zu `/opt/layer-bot`

**Auf Server:**
```bash
cd /opt
unzip layer-bot.zip
cd layer-bot
```

---

### 2. **Dependencies installieren**
```bash
# Root dependencies
npm install

# Bot dependencies
cd apps/bot
npm install
cd ../..

# Web dependencies (für später)
cd apps/web
npm install
cd ../..

# Database dependencies
cd packages/db
npm install
cd ../..
```

**Das dauert 5-10 Minuten!** ☕

---

### 3. **Environment Variables setzen**

#### **Bot .env erstellen:**
```bash
cd /opt/layer-bot/apps/bot
nano .env
```

**Füge ein (mit deinen Werten):**
```env
# Discord
DISCORD_TOKEN=dein_discord_bot_token
CLIENT_ID=dein_client_id

# Database
DATABASE_URL=postgresql://layeruser:dein_passwort@localhost:5432/layer_bot

# AI APIs
GEMINI_API_KEY=dein_gemini_key
HUGGINGFACE_API_KEY=optional

# Stream APIs (optional zum Start)
TWITCH_CLIENT_ID=later
TWITCH_CLIENT_SECRET=later
YOUTUBE_API_KEY=later
```

**Speichern:** `Ctrl + X` → `Y` → `Enter`

---

#### **Database .env erstellen:**
```bash
cd /opt/layer-bot/packages/db
nano .env
```

**Füge ein:**
```env
DATABASE_URL=postgresql://layeruser:dein_passwort@localhost:5432/layer_bot
```

**Speichern:** `Ctrl + X` → `Y` → `Enter`

---

### 4. **Database Migration**
```bash
cd /opt/layer-bot/packages/db

# Prisma generieren
npx prisma generate

# Migration ausführen
npx prisma migrate deploy

# Checken ob DB läuft
npx prisma studio &
# Öffne in Browser: http://deine-server-ip:5555
# Wenn du Tables siehst = SUCCESS! ✅
# Dann Ctrl+C zum stoppen
```

---

### 5. **Bot builden**
```bash
cd /opt/layer-bot/apps/bot
npm run build
```

**Sollte ohne Errors durchlaufen!**

---

## 📅 PHASE 4: Bot starten (15 Min)

### 1. **Bot mit PM2 starten**
```bash
cd /opt/layer-bot/apps/bot

# Bot starten
pm2 start npm --name "layer-bot" -- start

# Status checken
pm2 status

# Logs anschauen
pm2 logs layer-bot
```

**Sollte anzeigen:**
```
🟣 Layer Bot online as Layer#1234
✅ Slash commands deployed to guild...
```

---

### 2. **PM2 Auto-Restart konfigurieren**
```bash
# Bei Server Reboot automatisch starten
pm2 startup

# Führe den angezeigten Befehl aus (etwas wie):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

# Aktuelle Prozesse speichern
pm2 save
```

✅ **Bot läuft jetzt 24/7!**

---

### 3. **Bot testen**
1. Geh in deinen Discord Server
2. Tippe `/rank` oder `/ping`
3. Bot sollte antworten! 🎉

---

## 📅 PHASE 5: Dashboard deployen (45 Min)

### **Alles auf EINEM Server - Der Layer Way! 🛡️**

**Warum auf eigenem Server?**
- ✅ Volle Kontrolle über alles
- ✅ Alles an einem Ort
- ✅ Keine externen Dependencies
- ✅ Günstiger (ein Server statt mehrere)
- ✅ Cooler! 😎

---

### **1. Dashboard builden & starten**

```bash
cd /opt/layer-bot/apps/web

# Environment Variables setzen
nano .env.production.local
```

**Füge ein:**
```env
# Database (same as bot)
DATABASE_URL=postgresql://layeruser:dein_passwort@localhost:5432/layer_bot

# NextAuth
NEXTAUTH_URL=http://deine-server-ip:3000
NEXTAUTH_SECRET=generiere-mit-openssl-rand-base64-32

# Discord OAuth
DISCORD_CLIENT_ID=dein_client_id
DISCORD_CLIENT_SECRET=dein_client_secret
DISCORD_BOT_TOKEN=dein_bot_token

# API URL
NEXT_PUBLIC_API_URL=http://deine-server-ip:3000
```

**Speichern:** `Ctrl + X` → `Y` → `Enter`

---

**NextAuth Secret generieren:**
```bash
openssl rand -base64 32
# Kopiere die Ausgabe in NEXTAUTH_SECRET
```

---

**Dashboard builden:**
```bash
cd /opt/layer-bot/apps/web

# Build (dauert 2-3 Minuten)
npm run build

# Mit PM2 starten
pm2 start npm --name "layer-dashboard" -- start

# Status checken
pm2 status
```

✅ **Dashboard läuft jetzt auf Port 3000!**

---

### **2. Nginx als Reverse Proxy installieren**

**Warum Nginx?**
- ✅ SSL/HTTPS Support
- ✅ Domain Routing
- ✅ Bessere Performance
- ✅ Sicherheit

```bash
# Nginx installieren
apt install -y nginx

# Checken ob läuft
systemctl status nginx
```

---

### **3. Nginx für Layer konfigurieren**

**Erstelle Config:**
```bash
nano /etc/nginx/sites-available/layer
```

**Füge ein (OHNE Domain erstmal):**
```nginx
server {
    listen 80;
    server_name _;  # Akzeptiert alle Requests
    
    # Dashboard
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Speichern:** `Ctrl + X` → `Y` → `Enter`

---

**Site aktivieren:**
```bash
# Default site disablen
rm /etc/nginx/sites-enabled/default

# Layer site enablen
ln -s /etc/nginx/sites-available/layer /etc/nginx/sites-enabled/

# Config testen
nginx -t

# Nginx neustarten
systemctl restart nginx
```

✅ **Dashboard jetzt erreichbar über:** `http://deine-server-ip`

---

### **4. Discord OAuth Redirect URLs eintragen**

1. Gehe zu https://discord.com/developers/applications
2. Wähle deine Application
3. OAuth2 → Redirects
4. Füge hinzu:
   ```
   http://deine-server-ip/api/auth/callback/discord
   ```
5. Save Changes

---

### **5. Dashboard testen**

1. Öffne Browser: `http://deine-server-ip`
2. Sollte Layer Homepage sehen
3. Click "Login"
4. Discord OAuth sollte funktionieren
5. Nach Login → Dashboard sehen

✅ **Dashboard läuft!** 🎉

---

### **6. (Optional) Domain & SSL einrichten**

**Wenn du eine Domain hast (z.B. layer.gg):**

#### **A) Domain DNS Setup:**
1. Gehe zu deinem Domain Provider (Namecheap, Cloudflare, etc.)
2. Erstelle A-Record:
   ```
   Type: A
   Name: @
   Value: deine-server-ip
   TTL: 3600
   ```
3. Warte 5-10 Minuten für DNS Propagation

---

#### **B) Nginx Config mit Domain updaten:**
```bash
nano /etc/nginx/sites-available/layer
```

**Ändere `server_name`:**
```nginx
server {
    listen 80;
    server_name layer.gg www.layer.gg;  # Deine Domain!
    
    # Rest bleibt gleich...
}
```

**Speichern & Nginx neustarten:**
```bash
nginx -t
systemctl restart nginx
```

---

#### **C) SSL mit Let's Encrypt (HTTPS):**
```bash
# Certbot installieren
apt install -y certbot python3-certbot-nginx

# SSL Certificate generieren
certbot --nginx -d layer.gg -d www.layer.gg

# Email eingeben wenn gefragt
# Agreement akzeptieren
# Redirect to HTTPS? → Yes (2)
```

✅ **Dashboard jetzt mit HTTPS:** `https://layer.gg` 🔒

**Auto-Renewal testen:**
```bash
certbot renew --dry-run
```

---

### **7. NextAuth URL updaten (mit Domain)**

**Wenn du Domain + SSL hast:**
```bash
nano /opt/layer-bot/apps/web/.env.production.local
```

**Ändere:**
```env
NEXTAUTH_URL=https://layer.gg  # Deine Domain mit HTTPS!
NEXT_PUBLIC_API_URL=https://layer.gg
```

**Dashboard rebuilden:**
```bash
cd /opt/layer-bot/apps/web
npm run build
pm2 restart layer-dashboard
```

---

### **8. Discord OAuth URLs updaten**

1. Discord Developer Portal
2. OAuth2 → Redirects
3. **Entferne** alte IP-URL
4. **Füge hinzu:**
   ```
   https://layer.gg/api/auth/callback/discord
   ```
5. Save

✅ **Alles läuft jetzt über deine Domain mit SSL!** 🎉

---

### **9. PM2 Setup finalisieren**

```bash
# Beide Prozesse auto-restart bei reboot
pm2 startup
# Führe angezeigte Befehl aus

# Prozesse speichern
pm2 save

# Status checken
pm2 status
```

**Sollte zeigen:**
```
┌─────┬────────────────────┬─────────┬─────────┐
│ id  │ name               │ status  │ memory  │
├─────┼────────────────────┼─────────┼─────────┤
│ 0   │ layer-bot          │ online  │ 150 MB  │
│ 1   │ layer-dashboard    │ online  │ 180 MB  │
└─────┴────────────────────┴─────────┴─────────┘
```

---

## 🎯 FINALE ARCHITEKTUR:

```
                    Internet
                       ↓
                  [Port 80/443]
                       ↓
                    Nginx
                  (Reverse Proxy)
                       ↓
         ┌─────────────┴─────────────┐
         ↓                           ↓
    Bot (PM2)                  Dashboard (PM2)
    Port: N/A                  Port: 3000
         ↓                           ↓
         └─────────────┬─────────────┘
                       ↓
                  PostgreSQL
                  Port: 5432
```

**Alles auf EINEM Server! 🛡️**

---

## 📊 Resource Usage (geschätzt):

**Mit 10-50 Servern:**
- Bot: ~150-250 MB RAM
- Dashboard: ~180-250 MB RAM
- PostgreSQL: ~150-200 MB RAM
- Nginx: ~20-50 MB RAM
- System: ~300-500 MB RAM
- **Total:** ~1-1.5 GB RAM genutzt

**Du hast 8 GB** → **6.5 GB frei!** ✅

---

## 🔒 PHASE 6: Security (30 Min)

### 1. **Firewall aktivieren**
```bash
# UFW installieren
apt install -y ufw

# Wichtige Ports erlauben
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS

# Firewall aktivieren
ufw enable

# Status checken
ufw status
```

---

### 2. **Fail2Ban (gegen Brute-Force)**
```bash
# Installieren
apt install -y fail2ban

# Config kopieren
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Starten
systemctl start fail2ban
systemctl enable fail2ban
```

---

### 3. **Automatische Updates**
```bash
apt install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

---

## 📊 PHASE 7: Monitoring (15 Min)

### 1. **PM2 Monitoring**
```bash
# Monitoring starten
pm2 monitor

# Oder Web UI
pm2 plus
```

---

### 2. **UptimeRobot Setup** (extern)

1. Gehe zu https://uptimerobot.com
2. "Add New Monitor"
3. Monitor Type: HTTP(s)
4. URL: `https://deine-domain.com/api/health`
5. Interval: 5 minutes
6. Alert via Email

✅ **Wirst benachrichtigt wenn Bot offline geht!**

---

## 📝 PHASE 8: Backup Setup (15 Min)

### 1. **Automatisches DB Backup**
```bash
# Backup Script erstellen
nano /opt/backup-db.sh
```

**Füge ein:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# PostgreSQL Backup
PGPASSWORD="dein_passwort" pg_dump -U layeruser -h localhost layer_bot > $BACKUP_DIR/layer_bot_$DATE.sql

# Alte Backups löschen (älter als 7 Tage)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: layer_bot_$DATE.sql"
```

**Speichern & ausführbar machen:**
```bash
chmod +x /opt/backup-db.sh

# Testen
/opt/backup-db.sh
```

---

### 2. **Cronjob für tägliche Backups**
```bash
crontab -e

# Füge hinzu (tägliches Backup um 3 Uhr morgens):
0 3 * * * /opt/backup-db.sh
```

---

## ✅ FINALE CHECKLISTE:

### **Bot:**
- [ ] ✅ Server gekauft & eingerichtet
- [ ] ✅ PostgreSQL läuft
- [ ] ✅ Code deployed
- [ ] ✅ Environment Variables gesetzt
- [ ] ✅ Database migriert
- [ ] ✅ Bot mit PM2 gestartet
- [ ] ✅ Bot antwortet auf Commands
- [ ] ✅ PM2 Auto-Restart konfiguriert

### **Dashboard:**
- [ ] ✅ Auf Vercel deployed (empfohlen)
- [ ] ✅ Environment Variables gesetzt
- [ ] ✅ Domain konfiguriert
- [ ] ✅ SSL funktioniert

### **Security:**
- [ ] ✅ Firewall aktiviert
- [ ] ✅ Fail2Ban läuft
- [ ] ✅ Auto-Updates aktiviert

### **Monitoring:**
- [ ] ✅ UptimeRobot Setup
- [ ] ✅ PM2 Monitoring
- [ ] ✅ Backups laufen

---

## 🎯 NÜTZLICHE BEFEHLE:

### **PM2 Commands:**
```bash
pm2 status                 # Alle Prozesse anzeigen
pm2 logs layer-bot         # Bot Logs live anzeigen
pm2 restart layer-bot      # Bot neustarten
pm2 stop layer-bot         # Bot stoppen
pm2 delete layer-bot       # Bot aus PM2 entfernen
pm2 monit                  # Resource Monitor
```

### **PostgreSQL Commands:**
```bash
sudo -u postgres psql layer_bot           # DB öffnen
\dt                                        # Tables anzeigen
\q                                         # Beenden
```

### **System Commands:**
```bash
htop                       # Resource Monitor
df -h                      # Disk Space
free -h                    # RAM Usage
systemctl status postgresql # PostgreSQL Status
```

---

## 🆘 TROUBLESHOOTING:

### **Bot startet nicht:**
```bash
# Logs checken
pm2 logs layer-bot --lines 100

# Häufige Probleme:
# 1. Discord Token falsch → .env checken
# 2. Database Connection fehlt → DATABASE_URL checken
# 3. Port bereits belegt → anderen Port nutzen
```

### **Database Connection Error:**
```bash
# PostgreSQL läuft?
systemctl status postgresql

# Port 5432 offen?
netstat -tuln | grep 5432

# Password richtig?
psql -U layeruser -d layer_bot -h localhost
```

### **Out of Memory:**
```bash
# Memory checken
free -h

# PM2 Memory Limit setzen
pm2 start npm --name "layer-bot" --max-memory-restart 500M -- start
```

---

## 📞 SUPPORT:

### **Wenn etwas nicht klappt:**
1. Logs checken: `pm2 logs layer-bot`
2. Server neustarten: `reboot`
3. Discord Support Server (create one!)
4. Google den Error

---

## 🎉 SUCCESS!

Wenn alles läuft:
- ✅ Bot ist 24/7 online
- ✅ Dashboard ist erreichbar
- ✅ Database läuft
- ✅ Backups laufen
- ✅ Monitoring aktiv

**Du bist LIVE! 🚀**

Zeit für Launch! 🎊

---

## 📅 MORGEN PLAN:

**09:00 - 09:30:** Server kaufen & Email warten
**09:30 - 10:00:** System Setup (Updates, Node.js, PostgreSQL)
**10:00 - 11:00:** Code deployen & Environment Variables
**11:00 - 11:30:** Database Migration & Bot builden
**11:30 - 12:00:** Bot mit PM2 starten & testen
**12:00 - 12:30:** Dashboard auf Vercel deployen
**12:30 - 13:00:** Security & Firewall
**13:00 - 13:30:** Monitoring & Backups Setup
**13:30 - 14:00:** Testing & Debugging
**14:00:** 🚀 **LIVE!**

**Geschätzte Gesamtzeit: 4-5 Stunden** (mit Pausen)

---

Viel Erfolg morgen! Du schaffst das! 💪🛡️
