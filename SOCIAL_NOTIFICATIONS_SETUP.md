# 🔴 Social Media Live Notifications Setup

## ✅ Was wurde implementiert?

- **Twitch Integration** - Überwacht Twitch-Streams
- **YouTube Integration** - Überwacht YouTube-Livestreams
- **Automatische Benachrichtigungen** - Sendet Discord-Nachrichten wenn jemand live geht
- **Custom Messages** - Anpassbare Benachrichtigungstexte mit Variablen
- **Role Pings** - Erwähnt ausgewählte Rollen
- **Schöne Embeds** - Mit Thumbnail, Viewer-Count, etc.
- **Check-Intervall** - Alle 3 Minuten

---

## 🔧 Setup-Anleitung

### 1. Twitch API Setup

1. Gehe zu: https://dev.twitch.tv/console/apps
2. Klicke auf **"Register Your Application"**
3. Fülle aus:
   - **Name**: `Discord Bot - [Dein Bot Name]`
   - **OAuth Redirect URLs**: `http://localhost`
   - **Category**: `Application Integration`
4. Klicke auf **"Create"**
5. Klicke auf **"Manage"** bei deiner App
6. Kopiere die **Client ID**
7. Klicke auf **"New Secret"** und kopiere das **Client Secret**
8. Füge beide in die `.env` Datei ein:
   ```env
   TWITCH_CLIENT_ID=deine_client_id_hier
   TWITCH_CLIENT_SECRET=dein_client_secret_hier
   ```

### 2. YouTube API Setup

1. Gehe zu: https://console.cloud.google.com/
2. Erstelle ein neues Projekt oder wähle ein bestehendes
3. Gehe zu **"APIs & Services" > "Library"**
4. Suche nach **"YouTube Data API v3"**
5. Klicke auf **"Enable"**
6. Gehe zu **"APIs & Services" > "Credentials"**
7. Klicke auf **"Create Credentials" > "API Key"**
8. Kopiere den API Key
9. Füge ihn in die `.env` Datei ein:
   ```env
   YOUTUBE_API_KEY=dein_youtube_api_key_hier
   ```

### 3. Bot neu starten

Nach dem Eintragen der API-Keys:

```bash
cd apps/bot
npm run dev
```

Du solltest sehen:
```
🟣 Layer Bot online as [Bot Name]
   Guilds: X
   Music Player: Initialized
   Stream Monitor: Started (checking every 3 minutes)
```

---

## 📱 Verwendung im Dashboard

1. Gehe zu **Dashboard > Social Alerts**
2. **Enable Notifications** - Schalte den Toggle ein
3. **Notification Channel** - Wähle den Channel aus dem Dropdown
4. **Roles to Ping** - Wähle Rollen aus (optional)
5. **Custom Message Template** - Passe die Nachricht an:
   - `{user}` = Streamer-Name
   - `{platform}` = Twitch oder YouTube
   - `{url}` = Stream-URL
6. Klicke auf **"Save Settings"**
7. Klicke auf **"Add Account"**
8. Wähle **Platform** (Twitch oder YouTube)
9. Gib den **Username** ein
10. Klicke auf **"Add"**

---

## 🎯 Wie es funktioniert

1. **Alle 3 Minuten** checkt der Bot alle hinzugefügten Accounts
2. Wenn jemand **live geht**, wird eine Benachrichtigung gesendet
3. Die Benachrichtigung enthält:
   - Custom Message mit Role Pings
   - Embed mit Stream-Titel
   - Thumbnail vom Stream
   - Viewer-Count
   - Link zum Stream
4. **Keine Spam-Benachrichtigungen** - Nur einmal pro Stream

---

## 🔍 Troubleshooting

### Bot sendet keine Benachrichtigungen

1. **API-Keys prüfen**:
   - Sind alle Keys in der `.env` eingetragen?
   - Sind die Keys korrekt (keine Leerzeichen)?

2. **Bot-Logs prüfen**:
   ```
   [StreamMonitor] Checking X accounts...
   [StreamMonitor] Sent notification for twitch/username
   ```

3. **Channel-Permissions prüfen**:
   - Hat der Bot Zugriff auf den Notification-Channel?
   - Hat der Bot die Permission "Send Messages" und "Embed Links"?

4. **Account-Status prüfen**:
   - Ist der Account korrekt geschrieben?
   - Ist der Streamer wirklich live?

### Twitch funktioniert nicht

- Prüfe ob die Twitch App aktiv ist: https://dev.twitch.tv/console/apps
- Prüfe ob Client ID und Secret korrekt sind
- Twitch Username muss exakt sein (case-insensitive)

### YouTube funktioniert nicht

- Prüfe ob die YouTube Data API v3 aktiviert ist
- Prüfe ob der API Key korrekt ist
- YouTube Channel Name muss exakt sein
- Beim ersten Check wird die Channel ID automatisch gespeichert

---

## 📊 Features

✅ **Twitch Support** - Vollständig funktionsfähig
✅ **YouTube Support** - Vollständig funktionsfähig
✅ **Custom Messages** - Mit Variablen
✅ **Role Pings** - Multi-Select
✅ **Channel Dropdown** - Einfache Auswahl
✅ **Live Status** - Zeigt an wer gerade live ist
✅ **Embeds** - Schöne Benachrichtigungen
✅ **Viewer Count** - Zeigt aktuelle Zuschauerzahl
✅ **Thumbnails** - Stream-Vorschau
✅ **Spam-Schutz** - Nur eine Benachrichtigung pro Stream
✅ **Audit Logs** - Alle Benachrichtigungen werden geloggt

---

## 🎨 Beispiel-Benachrichtigung

```
@Streamer Role

🔴 xQc is now live on Twitch!
https://twitch.tv/xqc

┌─────────────────────────────────┐
│ xQc                             │
│ 🔴 LIVE on Twitch               │
│                                 │
│ 👥 Viewers: 45,234              │
│                                 │
│ [Stream Thumbnail]              │
└─────────────────────────────────┘
```

---

## 🚀 Nächste Schritte

1. API-Keys eintragen
2. Bot neu starten
3. Im Dashboard Accounts hinzufügen
4. Warten bis jemand live geht (max. 3 Minuten)
5. Benachrichtigung erhalten! 🎉
