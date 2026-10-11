# 🚀 Anti-Scam Quick Start Guide

## ✅ Was wurde bereits gemacht

1. ✅ Datenbank Schema erweitert (`antiScamEnabled`, `scamSensitivity`)
2. ✅ Migration durchgeführt (`20260601082323_add_anti_scam`)
3. ✅ Scam Detection Engine erstellt (`scamDetector.ts`)
4. ✅ Bot Integration implementiert (Auto-Delete + Warnung)
5. ✅ Dashboard Modul erstellt (`/anti-scam`)
6. ✅ UI Components erstellt (`AntiScamSettings.tsx`)
7. ✅ GEMINI_API_KEY ist bereits konfiguriert ✅

## 🎯 Nächste Schritte (für dich)

### 1. Bot neu starten

```bash
cd apps/bot
npm run dev
```

### 2. Dashboard öffnen

1. Öffne dein Dashboard im Browser
2. Wähle deinen Server aus
3. Du siehst jetzt ein neues Modul: **"Anti-Scam Protection"** 🚨

### 3. Anti-Scam aktivieren

1. Klicke auf **"Anti-Scam Protection"**
2. Toggle **"Enable Anti-Scam Protection"** auf **ON**
3. Wähle Sensitivität: **"Medium"** (empfohlen)
4. Klicke **"Save Changes"**

### 4. Testen

Sende eine Test-Nachricht in deinem Discord-Server:

```
🚨 TEST: Withdrawal Succeed! Your withdrawal of $5000 has been processed. Click here to claim: bit.ly/crypto123
```

**Erwartetes Ergebnis:**
- ✅ Nachricht wird sofort gelöscht
- ✅ Bot sendet Warnung:
  ```
  🚨 Scam Detected & Removed
  @YourName, your message was automatically deleted because it appears to contain scam content.
  
  Detection Type: TEXT
  Confidence: 85%
  Reason: High-risk keyword: "withdrawal succeed"; Suspicious domain: bit.ly
  
  If this was a mistake, please contact a moderator.
  ```
- ✅ Warnung verschwindet nach 10 Sekunden

### 5. Bild-Test (optional)

Sende ein Bild wie in deinen Screenshots (Fake Withdrawal):

**Erwartetes Ergebnis:**
- ✅ Nachricht wird sofort gelöscht
- ✅ Bot sendet Warnung mit **Detection Type: IMAGE** oder **BOTH**
- ✅ Confidence sollte 80-95% sein

## 📊 Dashboard Features

### Anti-Scam Seite zeigt:

1. **Toggle zum Aktivieren/Deaktivieren**
   - Ein/Aus-Schalter für das gesamte Modul

2. **"How It Works" Info-Panel**
   - Erklärt die 4 Erkennungsmethoden
   - Image Analysis, Text Detection, Link Scanning, Auto-Delete

3. **Sensitivitäts-Einstellung**
   - 3 Optionen: Low (80%), Medium (60%), High (40%)
   - Jede Option zeigt Threshold und Beschreibung
   - Visuelles Feedback mit Icons und Farben

4. **"What Gets Detected" Beispiele**
   - High Risk: Fake withdrawals, verify wallet, free Nitro
   - Medium Risk: Crypto keywords, shortened URLs, fake domains

## 🔧 Konfiguration

### Sensitivität ändern

Im Dashboard → Anti-Scam → Wähle eine der 3 Optionen:

- **🟢 Low (80%)**: Nur sehr offensichtliche Scams
- **🟠 Medium (60%)**: Ausgewogen (Standard) ⭐
- **🔴 High (40%)**: Aggressiv, maximaler Schutz

### Log-Channel einrichten (optional)

1. Dashboard → Settings
2. Wähle einen Log-Channel
3. Alle gelöschten Scam-Nachrichten werden dort geloggt mit:
   - User Info
   - Channel
   - Confidence Score
   - Erkennungstyp
   - Grund
   - Original Content

## 🎨 Was wird erkannt

### ✅ Basierend auf deinen Bildern:

1. **Fake Crypto Withdrawals**
   - "Withdrawal Succeed!"
   - Screenshots mit grünen Checkmarks
   - Fake Binance/Coinbase Interfaces

2. **Fake Promo Codes / Cashback**
   - "Activate your Promo Code"
   - "Your Rakeback"
   - "Join our VIP Club"
   - Fake Gambling-Site Screenshots

3. **Fake Influencer Endorsements**
   - "Andrew Tate" + Crypto
   - Fake Social Media Posts
   - Celebrity + Investment Scams

4. **Weitere Scam-Typen**
   - Free Discord Nitro
   - Wallet Connection Phishing
   - Investment Scams
   - Fake Steam Gifts
   - Account Suspension Phishing

## 📈 Monitoring

### Im Log-Channel siehst du:

```
🚨 Anti-Scam: Message Deleted
User: scammer#1234 (123456789)
Channel: #general
Confidence: 95%
Type: both
Reason: High-risk keyword: "withdrawal succeed"; Suspicious domain: bit.ly; Image: Fake crypto withdrawal screenshot
Content: "Withdrawal Succeed! Your withdrawal..."
Timestamp: 2026-06-01 10:23:45
```

### Statistiken (zukünftig):

- Anzahl erkannter Scams
- Top Scam-Typen
- Confidence-Verteilung
- False Positive Rate

## 🐛 Troubleshooting

### Problem: Bilder werden nicht analysiert

**Lösung:**
1. Prüfe ob `GEMINI_API_KEY` in `apps/bot/.env` gesetzt ist ✅ (ist bereits vorhanden)
2. Starte Bot neu
3. Prüfe Bot-Logs für Fehler

### Problem: Zu viele False Positives

**Lösung:**
1. Reduziere Sensitivität auf "Low"
2. Entferne zu allgemeine Keywords aus `scamDetector.ts`

### Problem: Scams werden nicht erkannt

**Lösung:**
1. Erhöhe Sensitivität auf "High"
2. Füge spezifische Keywords hinzu in `scamDetector.ts`
3. Prüfe ob Modul aktiviert ist im Dashboard

### Problem: Bot reagiert nicht

**Lösung:**
1. Prüfe ob `moderationEnabled` aktiviert ist (Anti-Scam läuft nur wenn Moderation aktiv ist)
2. Prüfe Bot-Logs für Fehler
3. Prüfe Bot-Permissions (Manage Messages)

## 💡 Tipps

### 1. Starte mit Medium Sensitivität
- Gute Balance zwischen Schutz und False Positives
- Kann später angepasst werden

### 2. Richte einen Log-Channel ein
- Siehst alle gelöschten Nachrichten
- Kannst False Positives identifizieren
- Hilfreich für Moderation

### 3. Teste mit echten Scam-Beispielen
- Kopiere Scam-Nachrichten aus anderen Servern
- Teste verschiedene Scam-Typen
- Passe Sensitivität an

### 4. Informiere deine Community
- Poste eine Ankündigung über das neue Feature
- Erkläre dass Scam-Nachrichten automatisch gelöscht werden
- Gib Kontakt für False Positives

### 5. Erweitere die Keyword-Liste
- Füge server-spezifische Scam-Keywords hinzu
- Beobachte welche Scams durchkommen
- Update `scamDetector.ts` regelmäßig

## 📚 Dateien zum Anpassen

### Keywords erweitern
```typescript
// apps/bot/src/utils/scamDetector.ts

const SCAM_KEYWORDS = {
  high: [
    'withdrawal succeed',
    'dein neues keyword hier',
    // ...
  ],
  // ...
}
```

### Domains zur Blacklist hinzufügen
```typescript
// apps/bot/src/utils/scamDetector.ts

const SUSPICIOUS_DOMAINS = [
  'bit.ly',
  'deine-domain.com',
  // ...
];
```

### Gemini-Prompt anpassen
```typescript
// apps/bot/src/utils/scamDetector.ts

const prompt = `Analyze this image for potential scam content. Look for:
- Deine zusätzlichen Kriterien hier
- ...
`;
```

## 🎉 Fertig!

Dein Anti-Scam System ist jetzt einsatzbereit!

**Nächste Schritte:**
1. ✅ Bot neu starten
2. ✅ Dashboard öffnen
3. ✅ Anti-Scam aktivieren
4. ✅ Testen
5. ✅ Genießen! 🎉

Bei Fragen oder Problemen, schau in die anderen Dokumentations-Dateien:
- `ANTI_SCAM_SETUP.md` - Detaillierte Setup-Anleitung
- `ANTI_SCAM_SUMMARY.md` - Technische Übersicht
- `SCAM_EXAMPLES.md` - Beispiele für erkannte Scams
- `ANTI_SCAM_VISUAL.md` - Visuelle Diagramme
