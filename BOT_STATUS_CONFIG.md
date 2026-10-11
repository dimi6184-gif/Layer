# 🎮 Bot Status Configuration

## ✅ Professional Discord Status

Der Bot hat jetzt einen professionellen, rotierenden Status auf Discord!

---

## 🔄 Rotating Status Messages

Der Bot wechselt alle **30 Sekunden** zwischen verschiedenen Status-Nachrichten:

### 1. **Watching your server 🛡️**
- Type: `Watching` (3)
- Zeigt, dass der Bot den Server überwacht

### 2. **Listening to /help for commands**
- Type: `Listening` (2)
- Zeigt Benutzern, wie sie Hilfe bekommen

### 3. **Watching X servers**
- Type: `Watching` (3)
- Zeigt die Anzahl der Server, auf denen der Bot ist

### 4. **Playing AI-powered moderation**
- Type: `Playing` (0)
- Hebt die AI-Features hervor

### 5. **Watching for scams and spam**
- Type: `Watching` (3)
- Zeigt die Schutzfunktionen

---

## 🎨 Activity Types

Discord unterstützt verschiedene Activity Types:

| Type | Number | Example |
|------|--------|---------|
| Playing | 0 | Playing Minecraft |
| Streaming | 1 | Streaming on Twitch |
| Listening | 2 | Listening to Spotify |
| Watching | 3 | Watching YouTube |
| Competing | 5 | Competing in Arena |

---

## ⚙️ Wie es funktioniert

```typescript
// Status-Array mit verschiedenen Aktivitäten
const statuses = [
  { name: 'your server 🛡️', type: 3 }, // Watching
  { name: '/help for commands', type: 2 }, // Listening
  { name: `${c.guilds.cache.size} servers`, type: 3 }, // Watching
  { name: 'AI-powered moderation', type: 0 }, // Playing
  { name: 'for scams and spam', type: 3 }, // Watching
];

// Rotiert alle 30 Sekunden
setInterval(updateStatus, 30000);
```

---

## 🎯 Vorteile

### 1. **Professionell**
- Zeigt, dass der Bot aktiv und gepflegt ist
- Macht einen guten ersten Eindruck

### 2. **Informativ**
- Zeigt Benutzern die Hauptfunktionen
- Weist auf wichtige Commands hin

### 3. **Dynamisch**
- Wechselnde Nachrichten halten es interessant
- Zeigt verschiedene Features

### 4. **Branding**
- Hebt die AI-Features hervor
- Zeigt die Schutzfunktionen

---

## 🔧 Anpassung

### Status ändern
Bearbeite das `statuses` Array in `apps/bot/src/index.ts`:

```typescript
const statuses = [
  { name: 'Deine Nachricht hier', type: 3 },
  { name: 'Noch eine Nachricht', type: 0 },
  // Füge mehr hinzu...
];
```

### Rotationszeit ändern
Ändere die Millisekunden im `setInterval`:

```typescript
// 30 Sekunden (Standard)
setInterval(updateStatus, 30000);

// 1 Minute
setInterval(updateStatus, 60000);

// 10 Sekunden
setInterval(updateStatus, 10000);
```

### Status-Typ ändern
Ändere die `type` Nummer:

```typescript
{ name: 'Minecraft', type: 0 } // Playing
{ name: 'Spotify', type: 2 }   // Listening
{ name: 'YouTube', type: 3 }   // Watching
```

---

## 📊 Beispiel-Ausgabe

Wenn der Bot startet, siehst du:

```
🟣 Layer Bot online as Layer#7362
   Guilds: 1
   Music Player: Initialized
📤 Deploying 22 slash commands to dev guild (instant)...
✅ Slash commands deployed to guild 1510700008725545050.
```

Und auf Discord wird der Bot angezeigt als:

```
🟢 Layer
   Watching your server 🛡️
```

Nach 30 Sekunden:

```
🟢 Layer
   Listening to /help for commands
```

Und so weiter...

---

## 🎨 Weitere Ideen

### Gaming-Theme
```typescript
const statuses = [
  { name: 'Fortnite', type: 0 },
  { name: 'Minecraft', type: 0 },
  { name: 'League of Legends', type: 0 },
];
```

### Music-Theme
```typescript
const statuses = [
  { name: 'Spotify', type: 2 },
  { name: 'your favorite songs', type: 2 },
  { name: 'music in voice channels', type: 2 },
];
```

### Moderation-Theme
```typescript
const statuses = [
  { name: 'for rule breakers', type: 3 },
  { name: 'the chat', type: 3 },
  { name: 'your server safe', type: 0 },
];
```

### Stats-Theme
```typescript
const statuses = [
  { name: `${memberCount} members`, type: 3 },
  { name: `${messageCount} messages today`, type: 3 },
  { name: `${commandCount} commands`, type: 3 },
];
```

---

## ✅ Status

- ✅ Rotating status implemented
- ✅ 5 professional messages
- ✅ 30-second rotation
- ✅ Dynamic server count
- ✅ Professional appearance

---

**Der Bot hat jetzt einen professionellen, dynamischen Status! 🎉**
