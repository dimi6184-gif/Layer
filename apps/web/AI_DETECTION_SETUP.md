# 🤖 AI Image Detection - Setup Guide

## Überblick

Das AI Image Detection System erkennt automatisch KI-generierte Bilder in Discord-Servern. Perfekt für Designer-Server mit "No AI" Regeln.

## Features

✅ **Automatische Erkennung** - Scannt alle Bilder in Echtzeit  
✅ **Konfidenz-Score** - Zeigt 0-100% Wahrscheinlichkeit an  
✅ **Flexible Aktionen** - Löschen, Warnen oder nur Loggen  
✅ **Channel-Spezifisch** - Wähle welche Kanäle überwacht werden  
✅ **Whitelist-Rollen** - Moderatoren können ausgenommen werden  
✅ **KI-Kennzeichnung** - Optional: User müssen KI-Bilder labeln  
✅ **Detaillierte Logs** - Mit Vorschau und Konfidenz-Score  

## Setup

### 1. Database Migration

Füge diese Felder zum `Guild` Model in `schema.prisma` hinzu:

```prisma
model Guild {
  // ... existing fields ...
  
  // AI Image Detection
  aiImageDetectionEnabled     Boolean   @default(false)
  aiDetectionThreshold        Int       @default(70)  // 50-95
  aiDetectionAction           String    @default("log")  // log, warn, delete
  aiDetectionLogChannelId     String?
  aiDetectionDeleteChannelIds String[]  @default([])
  aiDetectionWhitelistRoleIds String[]  @default([])
  aiDetectionRequireLabel     Boolean   @default(false)
  
  aiDetections AIImageDetection[]
}

model AIImageDetection {
  id          String   @id @default(cuid())
  guildId     String
  guild       Guild    @relation(fields: [guildId], references: [discordId], onDelete: Cascade)
  channelId   String
  messageId   String
  userId      String
  userName    String
  imageUrl    String
  confidence  Int      // 0-100
  action      String   // log, warn, delete
  hadLabel    Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  @@index([guildId])
  @@index([createdAt])
}
```

Dann Migration ausführen:
```bash
cd packages/db
npx prisma migrate dev --name add_ai_detection
npx prisma generate
```

### 2. Hugging Face API Key

1. Gehe zu [huggingface.co](https://huggingface.co/)
2. Erstelle einen Account (kostenlos)
3. Gehe zu Settings → Access Tokens
4. Erstelle einen neuen Token mit "read" Berechtigung
5. Füge in `.env` hinzu:

```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Bot Integration

Füge den Event Handler in `src/index.ts` hinzu:

```typescript
import { setupAIImageDetection } from './events/aiImageDetectionHandler';

// Nach client.login()
setupAIImageDetection(client);
```

### 4. Install Dependencies

```bash
cd apps/bot
npm install axios
```

## Verwendung

### Im Dashboard

1. Gehe zu **Dashboard** → **[Server auswählen]** → **AI Detection**
2. Aktiviere "AI Image Detection"
3. Konfiguriere:
   - **Schwellenwert**: 70% empfohlen (50-95%)
   - **Aktion**: Log, Warn oder Delete
   - **Log-Kanal**: Wo Erkennungen gepostet werden
   - **Überwachte Kanäle**: Welche Kanäle gescannt werden
   - **Whitelist-Rollen**: Ausnahmen (z.B. Moderatoren)
   - **KI-Kennzeichnung**: Erfordert [AI] Label

### Discord

Bilder werden automatisch gescannt wenn:
- Sie in überwachten Kanälen gepostet werden
- Der User keine Whitelist-Rolle hat
- Sie über dem Schwellenwert liegen

**Log-Nachricht enthält:**
- 📊 Konfidenz-Score (0-100%)
- 👤 User Info
- 📍 Kanal
- 🏷️ Ob KI-Label vorhanden war
- 🖼️ Bild-Vorschau
- 🔗 Link zur Nachricht

## Beispiel Use Cases

### Scenario 1: Designer-Server (Strict)
```
Schwellenwert: 80%
Aktion: Delete
Überwachte Kanäle: #portfolio, #commissions
Whitelist: @Moderator, @Admin
KI-Kennzeichnung: Ja
```
→ Bilder über 80% werden gelöscht, außer mit [AI] Label

### Scenario 2: Kreativ-Server (Moderate)
```
Schwellenwert: 70%
Aktion: Warn
Alle Kanäle: Ja
Whitelist: @Verified Artists
KI-Kennzeichnung: Nein
```
→ User erhält Warnung bei KI-Verdacht

### Scenario 3: Logging Only
```
Schwellenwert: 60%
Aktion: Log
Log-Kanal: #ai-detection-logs
```
→ Nur dokumentieren, keine Aktion

## KI-Kennzeichnung

User können KI-Bilder kennzeichnen mit:
- `[AI]` im Text
- `[KI]` im Text
- 🤖 Emoji
- "AI generated"
- "Made with AI"

Beispiel:
```
Hey schaut mal mein neues Thumbnail an! [AI]
```

## Konfidenz-Levels

- **50-69%**: Unsicher, möglicherweise Falsch-Positiv
- **70-79%**: Wahrscheinlich KI (⚠️ Gelb)
- **80-89%**: Sehr wahrscheinlich KI (🟠 Orange)
- **90-100%**: Definitiv KI (🔴 Rot)

## Troubleshooting

### "Error detecting AI image"
- Prüfe ob `HUGGINGFACE_API_KEY` gesetzt ist
- Hugging Face API könnte down sein
- Bild-URL nicht erreichbar

### "Zu viele False Positives"
- Erhöhe Schwellenwert auf 80-85%
- Aktiviere "KI-Kennzeichnung erforderlich"

### "Zu viele False Negatives"
- Senke Schwellenwert auf 60-65%
- Beachte: Mehr False Positives möglich

## API Limits

Hugging Face Free Tier:
- ~1000 Requests pro Tag
- Rate Limit: 10 req/min
- Für größere Server: Upgrade zu Pro

## Kosten

- **Hugging Face Free**: $0/Monat (1000 req/Tag)
- **Hugging Face Pro**: $9/Monat (unbegrenzt)
- **Alternative**: Eigenes Model hosten

## Support

Bei Fragen oder Problemen:
- Discord: [Dein Support-Server]
- GitHub Issues: [Dein Repo]
