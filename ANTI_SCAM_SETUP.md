# 🛡️ Anti-Scam Protection Setup

## Übersicht

Die Anti-Scam Funktion nutzt **Google Gemini AI**, um automatisch Scam-Nachrichten zu erkennen und zu löschen:

- ✅ **Bild-Analyse**: Erkennt fake Crypto-Withdrawal Screenshots, Phishing-Bilder, QR-Codes
- ✅ **Text-Erkennung**: Identifiziert Scam-Keywords wie "free crypto", "verify wallet", "claim airdrop"
- ✅ **Link-Scanning**: Erkennt fake Discord/Steam/Crypto URLs
- ✅ **Auto-Delete**: Verdächtige Nachrichten werden sofort gelöscht

## 🚀 Installation

### 1. Datenbank Migration

```bash
cd packages/db
npx prisma migrate dev --name add_anti_scam
npx prisma generate
```

### 2. Google Gemini API Key

1. Gehe zu [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Erstelle einen neuen API Key
3. Füge ihn zur `.env` Datei hinzu:

```env
# apps/bot/.env
GEMINI_API_KEY=dein_api_key_hier
```

### 3. Bot neu starten

```bash
cd apps/bot
npm run dev
```

## 📊 Verwendung

### Im Dashboard

1. Gehe zu deinem Server Dashboard
2. Klicke auf **"Anti-Scam Protection"**
3. Aktiviere das Modul
4. Wähle die Sensitivität:
   - **Low**: Nur offensichtliche Scams (80%+ Confidence)
   - **Medium**: Ausgewogener Schutz (60%+ Confidence) ⭐ Empfohlen
   - **High**: Maximaler Schutz (40%+ Confidence, kann False Positives haben)

### Was wird erkannt?

#### 🚨 High Risk
- Fake Crypto Withdrawal Screenshots (wie im Beispiel-Bild)
- "Verify your wallet" Phishing
- Free Nitro/Steam Gift Scams
- "Claim your airdrop" Nachrichten

#### ⚠️ Medium Risk
- Verdächtige Crypto Keywords
- Shortened URLs (bit.ly, tinyurl, etc.)
- Fake Discord/Steam Domains
- "Investment opportunity" Spam

#### ℹ️ Low Risk
- "Click here" mit verdächtigem Kontext
- "DM me" in Kombination mit anderen Indikatoren

## 🔧 Technische Details

### Erkennungsmethoden

1. **Text-basierte Erkennung** (`analyzeTextForScam`)
   - Keyword-Matching mit gewichteten Scores
   - Domain-Blacklist
   - URL-Pattern-Analyse

2. **Bild-Analyse** (`analyzeImageForScam`)
   - Google Gemini Vision API
   - OCR + Kontext-Analyse
   - Erkennt Screenshots von Crypto-Plattformen

### Ablauf

```
Nachricht empfangen
    ↓
Anti-Scam aktiviert? → Nein → Weiter zu anderen Checks
    ↓ Ja
Text analysieren (synchron)
    ↓
Bilder analysieren (async mit Gemini)
    ↓
Scam erkannt? → Ja → Nachricht löschen + Warnung senden
    ↓ Nein
Weiter zu Banned Words Check
```

### Logging

Wenn ein `logChannelId` konfiguriert ist, werden alle gelöschten Scam-Nachrichten dort geloggt mit:
- User Info
- Channel
- Confidence Score
- Erkennungstyp (Text/Image/Both)
- Grund
- Original Content

## 🎯 Beispiele

### Erkannte Scam-Muster

```
❌ "Withdrawal Succeed! Your withdrawal of $5000 has been processed"
❌ "Free crypto airdrop! Click here to claim"
❌ "Verify your wallet to continue: discord-nitro.gift"
❌ "Connect your MetaMask wallet to receive rewards"
❌ Bilder mit fake Binance/Coinbase Screenshots
```

### Legitime Nachrichten (werden NICHT blockiert)

```
✅ "I'm interested in learning about crypto"
✅ "Check out this new NFT project" (ohne verdächtige Links)
✅ "Anyone want to play some games?"
✅ Normale Bilder ohne Scam-Indikatoren
```

## ⚙️ Konfiguration

### Sensitivität anpassen

Im Dashboard kannst du die Sensitivität ändern:

- **Low (80%)**: Nur sehr offensichtliche Scams
- **Medium (60%)**: Gute Balance (Standard)
- **High (40%)**: Aggressiv, kann False Positives haben

### Keywords erweitern

Du kannst die Keyword-Liste in `apps/bot/src/utils/scamDetector.ts` erweitern:

```typescript
const SCAM_KEYWORDS = {
  high: [
    'withdrawal succeed',
    'claim your',
    // Füge hier weitere hinzu
  ],
  // ...
}
```

### Domains zur Blacklist hinzufügen

```typescript
const SUSPICIOUS_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  // Füge hier weitere hinzu
];
```

## 🐛 Troubleshooting

### "API key not configured"
- Stelle sicher, dass `GEMINI_API_KEY` in `apps/bot/.env` gesetzt ist
- Starte den Bot neu

### Bilder werden nicht analysiert
- Prüfe ob der Gemini API Key gültig ist
- Prüfe die Bot-Logs für Fehler
- Text-basierte Erkennung funktioniert auch ohne API Key

### Zu viele False Positives
- Reduziere die Sensitivität auf "Low"
- Entferne zu allgemeine Keywords aus der Liste

### Scams werden nicht erkannt
- Erhöhe die Sensitivität auf "High"
- Füge spezifische Keywords hinzu
- Prüfe ob das Modul aktiviert ist

## 📝 Kosten

Google Gemini API:
- **Free Tier**: 15 Requests/Minute, 1500 Requests/Tag
- **Paid**: $0.00025 pro Bild (sehr günstig)

Für einen durchschnittlichen Discord-Server mit ~100 Bildern/Tag:
- **Kosten**: ~$0.025/Tag = ~$0.75/Monat

## 🔐 Sicherheit

- API Keys werden nur serverseitig verwendet
- Bilder werden nicht gespeichert
- Nur Metadaten werden geloggt
- User-Daten werden nicht an Dritte weitergegeben

## 📚 Weitere Ressourcen

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [Prisma Docs](https://www.prisma.io/docs)
