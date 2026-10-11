# Anti-Scam: Wie werden Bilder gespeichert?

## 🔍 Übersicht

Das Anti-Scam System speichert Bilder **NICHT auf einem Server oder in einer Datenbank**, sondern nutzt **Base64-Encoding direkt in der HTML-Datei**.

## 📊 Der Ablauf

### 1. **Bild wird hochgeladen**
```
User postet Scam-Bild → Discord CDN speichert es temporär
URL: https://cdn.discordapp.com/attachments/...
```

### 2. **Bot erkennt Scam**
```typescript
// scamDetector.ts downloadet das Bild von Discord CDN
const response = await axios.get(attachment.url, { 
  responseType: 'arraybuffer',
  timeout: 5000 
});
```

### 3. **Bot konvertiert zu Base64**
```typescript
// scamReportGenerator.ts
const base64 = Buffer.from(response.data).toString('base64');
const dataUrl = `data:${attachment.contentType};base64,${base64}`;
```

### 4. **Base64 wird in HTML eingebettet**
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..." />
```

### 5. **HTML-Datei wird an Discord gesendet**
```typescript
// Die HTML-Datei wird als Attachment an den Log-Channel geschickt
const reportFile = await generateScamReport(message, scamResult);
await logChannel.send({ files: [reportFile] });
```

### 6. **Scam-Nachricht wird gelöscht**
```typescript
await message.delete();
// ⚠️ Das originale Bild ist jetzt von Discord CDN entfernt
// ✅ Aber die Base64-Version bleibt in der HTML-Datei
```

## 💾 Wo ist das Bild gespeichert?

### ✅ NACH dem Prozess:
- **In der HTML-Datei** (als Base64-String eingebettet)
- **In Discord** (als Attachment im Log-Channel)
- Discord speichert diese HTML-Datei auf ihrem CDN

### ❌ NICHT gespeichert:
- ❌ Nicht auf deinem Server/Hosting
- ❌ Nicht in der Datenbank
- ❌ Nicht im Dateisystem des Bots
- ❌ Das originale Discord CDN Bild wird gelöscht

## 🎯 Vorteile dieser Methode

### 1. **Keine Hosting-Kosten**
- Keine Bilder auf deinem Server = keine Speicherkosten
- Discord hostet die HTML-Dateien kostenlos

### 2. **Alles in einer Datei**
- HTML kann offline geöffnet werden
- Bilder sind direkt eingebettet
- Kein Risiko, dass Bilder verschwinden

### 3. **Unabhängig von Discord CDN**
- Wenn Discord das Original löscht, bleibt die Base64-Version
- Moderatoren können immer nachsehen, was gepostet wurde

## 📏 Größenlimits

### Discord Attachment Limits:
- **Free Server:** Max 25 MB pro Datei
- **Nitro Server:** Max 100 MB pro Datei

### Typische Größen:
- **Original PNG:** ~180 KB (wie in deinem Test)
- **Base64 in HTML:** ~240 KB (33% größer durch Encoding)
- ✅ Weit unter den Discord Limits

## 🔒 Sicherheit

### Was passiert bei großen Bildern?

```typescript
// Timeout nach 5 Sekunden
const response = await axios.get(attachment.url, { 
  responseType: 'arraybuffer',
  timeout: 5000 
});
```

Wenn Download fehlschlägt:
```typescript
catch (error) {
  // Speichert nur die URL ohne Base64
  attachmentData.push({ 
    name: attachment.name, 
    url: attachment.url, 
    contentType: attachment.contentType 
  });
}
```

## 📂 Beispiel HTML-Struktur

```html
<div class="attachment-item">
  <!-- Base64-eingebettetes Bild -->
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..." />
  
  <div class="attachment-info">
    <div class="attachment-name">Screenshot_2026-06-01_101532.png</div>
    <div class="attachment-type">image/png</div>
  </div>
</div>
```

## 🔄 Der komplette Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User postet Scam-Bild                                    │
│    ├─ Discord CDN: https://cdn.discordapp.com/...           │
│    └─ Nachricht ID: 1511688623295168633                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Bot downloadet Bild BEVOR Nachricht gelöscht wird       │
│    ├─ axios.get(attachment.url)                             │
│    └─ Speichert in RAM als Buffer                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Konvertierung zu Base64                                  │
│    ├─ Buffer.from(response.data).toString('base64')         │
│    └─ Erstellt Data URL: data:image/png;base64,...          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. HTML-Report wird generiert                               │
│    ├─ Layer Branding (🛡️ Logo, Purple/Fuchsia)            │
│    ├─ User Info, Server Info, Timestamp                     │
│    ├─ Scam Confidence & Reason                              │
│    └─ <img src="data:image/png;base64,...">                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. HTML wird an Log-Channel gesendet                        │
│    ├─ Dateiname: layer-scam-report-{userId}-{timestamp}    │
│    └─ Discord speichert die HTML-Datei auf ihrem CDN       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Scam-Nachricht wird gelöscht                             │
│    ├─ message.delete()                                      │
│    ├─ ⚠️  Original Discord CDN URL wird ungültig           │
│    └─ ✅ Base64 in HTML bleibt erhalten                     │
└─────────────────────────────────────────────────────────────┘
```

## 🎬 Endergebnis

Moderatoren können:
1. ✅ HTML-Datei von Discord downloaden
2. ✅ Im Browser öffnen (offline!)
3. ✅ Alle Bilder sehen (eingebettet als Base64)
4. ✅ Layer-gebrandete Report-Seite mit allen Infos

**Kein zusätzliches Hosting erforderlich!** 🎉
