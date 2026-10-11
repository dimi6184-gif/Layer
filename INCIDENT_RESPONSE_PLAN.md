# 🚨 INCIDENT RESPONSE PLAN
## Was tun wenn wir gehackt werden?

**Erstellt:** 4. Juni 2026  
**Für:** Layer Discord Bot  
**Status:** Production Ready

---

## 🎯 WICHTIG: Ruhe bewahren!

**Menschen sind schlau, aber ihr seid vorbereitet.**

Dieser Plan zeigt dir **genau** was du tun musst, Schritt für Schritt.

---

## 🔥 PHASE 1: SOFORT-REAKTION (Erste 5 Minuten)

### **Schritt 1: SYSTEM STOPPEN**

```bash
# Bot stoppen
pm2 stop layer-bot

# Dashboard stoppen
pm2 stop layer-dashboard

# ODER alles stoppen
pm2 stop all
```

**Warum?** Verhindert weitere Schäden während du analysierst.

---

### **Schritt 2: BEWEISE SICHERN**

```bash
# Server Logs kopieren
sudo journalctl -u layer-bot > /tmp/bot-logs-$(date +%Y%m%d-%H%M%S).log
sudo journalctl -u layer-dashboard > /tmp/dashboard-logs-$(date +%Y%m%d-%H%M%S).log

# PM2 Logs kopieren
pm2 logs --lines 1000 > /tmp/pm2-logs-$(date +%Y%m%d-%H%M%S).log

# Nginx Access/Error Logs
sudo cp /var/log/nginx/access.log /tmp/nginx-access-$(date +%Y%m%d-%H%M%S).log
sudo cp /var/log/nginx/error.log /tmp/nginx-error-$(date +%Y%m%d-%H%M%S).log

# System Auth Logs
sudo cp /var/log/auth.log /tmp/auth-$(date +%Y%m%d-%H%M%S).log
```

**Warum?** Logs können überschrieben werden. Sichere sie SOFORT.

---

### **Schritt 3: AUDIT LOG EXPORTIEREN**

```sql
-- In der Datenbank
-- Letzte 1000 Actions exportieren
SELECT * FROM "AuditLog" 
ORDER BY "createdAt" DESC 
LIMIT 1000;

-- Speichern als CSV
\copy (SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 1000) TO '/tmp/audit-log.csv' CSV HEADER;
```

**Warum?** Zeigt dir WER WAS WANN gemacht hat.

---

## 🔍 PHASE 2: ANALYSE (Nächste 15 Minuten)

### **Schritt 4: WAS IST PASSIERT?**

**Checkliste zum Prüfen:**

#### A) **Wurde die Datenbank kompromittiert?**
```bash
# Login auf Server
ssh user@your-server

# PostgreSQL prüfen
sudo -u postgres psql layer_db

# Verdächtige User checken
SELECT * FROM "User" ORDER BY "createdAt" DESC LIMIT 20;

# Team Members checken
SELECT * FROM "TeamMember" WHERE role = 'owner';

# Audit Log nach verdächtigen Actions durchsuchen
SELECT * FROM "AuditLog" 
WHERE action IN ('TEAM_MEMBER_ADDED', 'TEAM_MEMBER_UPDATED', 'PERMISSIONS_CHANGED')
ORDER BY "createdAt" DESC 
LIMIT 50;
```

**Verdächtige Zeichen:**
- ❌ Neue Owner die du nicht kennst
- ❌ Gelöschte Team Members
- ❌ Permissions Changes um 3 Uhr nachts
- ❌ Massenhaft Actions in kurzer Zeit

---

#### B) **Wurde der Bot Token gestohlen?**

**Anzeichen:**
- Bot ist in Servern die du nicht kennst
- Bot sendet Nachrichten die du nicht geschickt hast
- Bot hat Permissions geändert

**Was tun:**
```
1. Geh zu Discord Developer Portal
2. Applications → Layer Bot
3. Bot → Reset Token
4. NEUEN Token in .env eintragen
5. Bot neustarten
```

---

#### C) **Wurde der Server kompromittiert?**

```bash
# Aktive SSH Sessions checken
who

# Letzte Logins checken
last | head -20

# Verdächtige Prozesse
ps aux | grep -E 'crypto|miner|wget|curl'

# Offene Ports checken
sudo netstat -tulpn | grep LISTEN

# Crontabs checken (Backdoors!)
crontab -l
sudo crontab -l

# Verdächtige Dateien
find /tmp -type f -mtime -1
find /home -type f -name "*.sh" -mtime -1
```

**Verdächtige Zeichen:**
- ❌ Unbekannte User eingeloggt
- ❌ Prozesse die du nicht kennst
- ❌ Offene Ports (außer 22, 80, 443, 5432, 3000, 3001)
- ❌ Neue Cron Jobs
- ❌ Neue .sh Files

---

#### D) **Wurde das Dashboard gehackt?**

```bash
# Next.js Logs checken
cat .next/trace | grep -i "error\|unauthorized\|hack"

# Audit Log nach verdächtigen Logins
SELECT * FROM "AuditLog" 
WHERE action = 'USER_LOGIN' 
AND "createdAt" > NOW() - INTERVAL '24 hours'
ORDER BY "createdAt" DESC;

# Sessions checken
SELECT * FROM "Session" ORDER BY expires DESC LIMIT 20;
```

---

### **Schritt 5: QUELLE IDENTIFIZIEREN**

**Mögliche Angriffsvektoren:**

1. **Gestohlene Credentials**
   - Discord OAuth Token leaked
   - Database Password leaked
   - .env File auf GitHub committed

2. **Server Exploit**
   - SSH Brute Force
   - Ungepatchte Software
   - Open Port Exploit

3. **Application Vulnerability**
   - IDOR (sollte gefixt sein)
   - SQL Injection (unmöglich bei euch)
   - XSS (unmöglich bei euch)

4. **Social Engineering**
   - Phishing Email
   - Fake Discord Admin
   - Teamkollege kompromittiert

---

## 🛡️ PHASE 3: EINDÄMMUNG (Nächste 30 Minuten)

### **Schritt 6: ALLE CREDENTIALS ÄNDERN**

```bash
# 1. Discord Bot Token
# → Discord Developer Portal → Reset Token

# 2. Database Password
sudo -u postgres psql
ALTER USER layer_user WITH PASSWORD 'NEUES_SICHERES_PASSWORT';
\q

# 3. NextAuth Secret
# → In .env neue generieren:
openssl rand -base64 32

# 4. BOT_API_SECRET
# → In beiden .env files ändern (bot + web)
openssl rand -base64 32

# 5. GitHub/Deployment Keys (falls relevant)
```

---

### **Schritt 7: ALLE SESSIONS INVALIDIEREN**

```sql
-- Alle User Sessions löschen
DELETE FROM "Session";

-- Alle Team Member auf 'pending' setzen (außer dich selbst)
UPDATE "TeamMember" 
SET status = 'pending' 
WHERE userId != 'DEINE_DISCORD_ID' 
AND role != 'owner';
```

**Warum?** Angreifer verliert sofort Zugriff.

---

### **Schritt 8: FIREWALL HÄRTEN**

```bash
# Nur deine IP erlauben (temporär)
sudo ufw default deny incoming
sudo ufw allow from DEINE_IP to any port 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Fail2Ban Bans checken
sudo fail2ban-client status sshd
```

---

## 🔧 PHASE 4: WIEDERHERSTELLUNG (Nächste 2 Stunden)

### **Schritt 9: SYSTEM PATCHEN**

```bash
# Alle Updates installieren
sudo apt update
sudo apt upgrade -y

# Node.js updaten
nvm install --lts
nvm use --lts

# Dependencies updaten
cd ~/layer-bot
npm update
npm audit fix

cd ~/layer-dashboard
npm update
npm audit fix
```

---

### **Schritt 10: SICHERHEITSLÜCKE FIXEN**

**Falls du die Lücke gefunden hast:**

1. **Code Fix committen**
```bash
git add .
git commit -m "SECURITY FIX: [Beschreibung]"
git push
```

2. **Auf Server deployen**
```bash
git pull
npm install
npm run build
pm2 restart all
```

3. **Testen**
```bash
# Health Check
curl http://localhost:3000/api/health
curl http://localhost:3001/health
```

---

### **Schritt 11: DATENBANK BEREINIGEN**

```sql
-- Verdächtige User entfernen
DELETE FROM "User" WHERE "discordId" = 'VERDÄCHTIGE_ID';

-- Verdächtige Team Members entfernen
DELETE FROM "TeamMember" WHERE userId = 'VERDÄCHTIGE_ID';

-- Verdächtige Audit Logs markieren
UPDATE "AuditLog" 
SET details = '[COMPROMISED] ' || details 
WHERE userId = 'VERDÄCHTIGE_ID';
```

---

### **Schritt 12: MONITORING AKTIVIEREN**

```bash
# Watch Logs live
pm2 logs --lines 100

# Watch Database Connections
watch -n 5 'sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"'

# Watch Network
sudo iftop

# Watch System Resources
htop
```

---

## 📢 PHASE 5: KOMMUNIKATION (Nächste 24 Stunden)

### **Schritt 13: USER INFORMIEREN**

**Discord Announcement (Template):**

```
🚨 SECURITY NOTICE 🚨

Layer experienced a security incident on [DATUM].

✅ WHAT WE DID:
- Immediately stopped all services
- Changed all credentials
- Patched the vulnerability
- Reviewed all audit logs

🔒 YOUR DATA:
- No user data was accessed [oder: Was betroffen war]
- All passwords are hashed (not readable)
- All sessions have been invalidated

⚠️ WHAT YOU SHOULD DO:
- Re-login to the dashboard
- Check your team members
- Review audit logs in your dashboard

❓ QUESTIONS:
Contact us on Discord: [Link]

We take security seriously. Thank you for your patience.
- Layer Team
```

---

### **Schritt 14: POST-MORTEM SCHREIBEN**

**Template:**

```markdown
# Security Incident Post-Mortem

**Date:** [DATUM]
**Duration:** [X hours]
**Severity:** [Low/Medium/High/Critical]

## What Happened?
[Kurze Beschreibung]

## Root Cause
[Was war die Ursache?]

## Impact
- Users affected: [Anzahl]
- Data compromised: [Ja/Nein - Was?]
- Downtime: [X hours]

## Timeline
- 14:30: Incident detected
- 14:35: Services stopped
- 15:00: Root cause identified
- 16:00: Fix deployed
- 17:00: Services restored

## What We Learned
1. [Learning 1]
2. [Learning 2]

## Action Items
- [ ] Implement [Security Measure]
- [ ] Add monitoring for [Metric]
- [ ] Update documentation

## Prevention
To prevent this in the future:
1. [Maßnahme 1]
2. [Maßnahme 2]
```

---

## 🔒 PHASE 6: PRÄVENTION (Ongoing)

### **Schritt 15: LANGFRISTIGE VERBESSERUNGEN**

**Sofort umsetzen:**

1. **Backup System**
```bash
# Automatische DB Backups (täglich)
crontab -e

# Add:
0 2 * * * pg_dump layer_db | gzip > /backup/layer-db-$(date +\%Y\%m\%d).sql.gz
```

2. **Monitoring Setup**
```bash
# UptimeRobot oder ähnlich
# → Checkt alle 5 Minuten ob Site erreichbar
# → Email bei Downtime
```

3. **Audit Log Review (wöchentlich)**
```sql
-- Verdächtige Actions
SELECT * FROM "AuditLog" 
WHERE action IN ('TEAM_MEMBER_ADDED', 'PERMISSIONS_CHANGED')
AND "createdAt" > NOW() - INTERVAL '7 days';
```

4. **Security Updates (monatlich)**
```bash
sudo apt update && sudo apt upgrade -y
npm audit
```

---

## 📋 CHECKLISTE: BIN ICH VORBEREITET?

**Vor Launch:**
- [ ] Backups eingerichtet (täglich)
- [ ] Monitoring aktiv (UptimeRobot)
- [ ] Fail2Ban installiert
- [ ] UFW Firewall aktiv
- [ ] SSH Key-only (kein Password)
- [ ] .env Permissions (chmod 600)
- [ ] Audit Logs funktionieren
- [ ] Incident Response Plan gelesen

**Laufender Betrieb:**
- [ ] Wöchentlich Audit Logs checken
- [ ] Monatlich Security Updates
- [ ] Backups testen (können sie restored werden?)
- [ ] Team Members regelmäßig reviewen

---

## ☎️ NOTFALL-KONTAKTE

**Speichere diese Nummern/Links:**

1. **Server Provider Support**
   - [Link zum Support]
   - [Notfall-Ticket System]

2. **Discord Developer Support**
   - https://support-dev.discord.com

3. **Database Provider** (falls managed)
   - [Support Link]

4. **Team Members**
   - Dimi: [Discord/Phone]
   - [Weitere Team Members]

---

## 🎯 WICHTIGSTE REGEL

> **"Panic is the enemy. Follow the plan."**

**Wenn du gehackt wirst:**
1. ✅ Tief durchatmen
2. ✅ Diesem Plan folgen
3. ✅ Jeden Schritt dokumentieren
4. ✅ Am Ende daraus lernen

**Du bist vorbereitet. Du schaffst das.** 💪

---

## 📊 SEVERITY LEVELS

### 🟢 **LOW** (Kein Datenverlust)
- Einzelner User betroffen
- Keine Permissions geändert
- Schnell behoben

**Response Time:** 24 hours

---

### 🟡 **MEDIUM** (Limitierter Zugriff)
- Mehrere User betroffen
- Team Member hinzugefügt
- Keine kritischen Permissions

**Response Time:** 4 hours

---

### 🟠 **HIGH** (Unauthorized Admin Access)
- Admin/Owner Zugriff kompromittiert
- Multiple Guilds betroffen
- Permissions geändert

**Response Time:** 1 hour

---

### 🔴 **CRITICAL** (Full System Compromise)
- Server Root Access
- Database kompromittiert
- Bot Token gestohlen
- Massive Datenverlust

**Response Time:** IMMEDIATE (Schritt 1-3 in 5 Minuten)

---

## ✅ NACH DEM INCIDENT

**Was gut gelaufen ist:**
- System ist gestoppt worden
- Logs wurden gesichert
- User wurden informiert
- Fix wurde deployed

**Was besser werden muss:**
- [Basierend auf Post-Mortem]

**Confidence Level nach Incident:**
- 🟢 System ist sicherer als vorher
- 🟢 Du weißt jetzt was zu tun ist
- 🟢 Processes sind etabliert

---

**Remember: Jedes große Unternehmen wurde irgendwann gehackt.**
**Discord, GitHub, Twitter - alle wurden gehackt.**
**Der Unterschied ist: Wie schnell und professionell man reagiert.**

**Ihr seid vorbereitet. 💪**
