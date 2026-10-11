# 🛡️ Anti-Scam Protection - Visuelle Übersicht

## 🎯 Wie es funktioniert

```
┌─────────────────────────────────────────────────────────────┐
│                    User sendet Nachricht                     │
│              (Text + optional Bild/Attachment)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Bot empfängt MessageCreate Event                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Anti-Scam aktiviert? │
              └──────────┬───────────┘
                         │
            ┌────────────┴────────────┐
            │ Nein                    │ Ja
            ▼                         ▼
    ┌───────────────┐      ┌──────────────────────┐
    │ Weiter zu     │      │  Scam Detection      │
    │ anderen Checks│      │  Engine starten      │
    └───────────────┘      └──────────┬───────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────────┐         ┌───────────────────────┐
        │   Text-Analyse        │         │   Bild-Analyse        │
        │   (Synchron)          │         │   (Async - Gemini)    │
        │                       │         │                       │
        │ • Keywords checken    │         │ • OCR Text-Extraktion│
        │ • URLs scannen        │         │ • Kontext-Analyse    │
        │ • Domains prüfen      │         │ • Screenshot-Erkennung│
        │                       │         │ • QR-Code Detection  │
        │ Score: 0-100          │         │ Confidence: 0-100    │
        └───────────┬───────────┘         └───────────┬───────────┘
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────────┐
                        │  Ergebnisse kombinieren  │
                        │  Max(Text, Image) Score  │
                        └──────────┬───────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
        ┌───────────────────┐         ┌───────────────────┐
        │ Score < Threshold │         │ Score ≥ Threshold │
        │                   │         │                   │
        │ ✅ Legitim        │         │ 🚨 SCAM ERKANNT  │
        └─────────┬─────────┘         └─────────┬─────────┘
                  │                               │
                  ▼                               ▼
        ┌───────────────────┐         ┌───────────────────┐
        │ Nachricht bleibt  │         │ Nachricht löschen │
        │ Weiter zu anderen │         └─────────┬─────────┘
        │ Moderation Checks │                   │
        └───────────────────┘                   ▼
                                    ┌───────────────────────┐
                                    │ Warnung an User senden│
                                    │ • Confidence Score    │
                                    │ • Erkennungstyp       │
                                    │ • Grund               │
                                    └─────────┬─────────────┘
                                              │
                                              ▼
                                    ┌───────────────────────┐
                                    │ Log in Log-Channel    │
                                    │ (falls konfiguriert)  │
                                    └───────────────────────┘
```

## 📊 Sensitivitäts-Schwellenwerte

```
┌─────────────────────────────────────────────────────────────┐
│                    Confidence Score                          │
│  0%                                                    100%  │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │                                    ┌─────────────────┐ │ │
│  │                                    │   HIGH (40%)    │ │ │
│  │                                    │   🔴 Aggressiv  │ │ │
│  │                                    └─────────────────┘ │ │
│  │                                                        │ │
│  │                          ┌───────────────────────────┐ │ │
│  │                          │     MEDIUM (60%)          │ │ │
│  │                          │     🟠 Ausgewogen         │ │ │
│  │                          └───────────────────────────┘ │ │
│  │                                                        │ │
│  │        ┌─────────────────────────────────────────────┐ │ │
│  │        │              LOW (80%)                      │ │ │
│  │        │              🟢 Konservativ                 │ │ │
│  │        └─────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Beispiele:

95% Confidence: "Withdrawal Succeed! Claim your $5000 crypto now!"
                + Screenshot von fake Binance Withdrawal
                → Wird bei ALLEN Stufen blockiert ✅

70% Confidence: "Free crypto airdrop! Click here"
                → Wird bei MEDIUM und HIGH blockiert ✅
                → Wird bei LOW NICHT blockiert ❌

45% Confidence: Nachricht enthält "crypto" + "click here"
                → Wird nur bei HIGH blockiert ✅
                → Wird bei MEDIUM und LOW NICHT blockiert ❌
```

## 🎨 Dashboard UI Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Server Dashboard                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Layer AI  │  │ Moderation │  │ Anti-Scam  │ ← NEU!     │
│  │  🤖 Active │  │  🛡️ Active │  │  🚨 Active │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Click auf "Anti-Scam"
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              🚨 Anti-Scam Protection                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Enable Anti-Scam Protection          [Toggle ON/OFF] │ │
│  │  Uses AI to detect crypto scams...                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  🛡️ How It Works                                       │ │
│  │  • Image Analysis: AI scans images for fake crypto... │ │
│  │  • Text Detection: Identifies scam keywords...        │ │
│  │  • Link Scanning: Detects fake Discord, Steam URLs... │ │
│  │  • Auto-Delete: Suspicious messages removed instantly │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Detection Sensitivity                                 │ │
│  │                                                        │ │
│  │  ○ Low Sensitivity (80% threshold)                    │ │
│  │    Only blocks obvious scams                          │ │
│  │                                                        │ │
│  │  ● Medium Sensitivity (60% threshold) ← Selected      │ │
│  │    Balanced protection                                │ │
│  │                                                        │ │
│  │  ○ High Sensitivity (40% threshold)                   │ │
│  │    Maximum protection, may have false positives       │ │
│  │                                                        │ │
│  │                              [Save Changes] Button    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  What Gets Detected                                    │ │
│  │  ┌──────────────────┐  ┌──────────────────┐           │ │
│  │  │ 🚨 High Risk     │  │ ⚠️ Medium Risk   │           │ │
│  │  │ • Fake crypto    │  │ • Suspicious     │           │ │
│  │  │   withdrawals    │  │   crypto keywords│           │ │
│  │  │ • Verify wallet  │  │ • Shortened URLs │           │ │
│  │  │ • Free Nitro     │  │ • Fake domains   │           │ │
│  │  └──────────────────┘  └──────────────────┘           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Erkennungs-Beispiele

### ✅ Beispiel 1: Fake Crypto Withdrawal (wie dein Bild)

```
┌─────────────────────────────────────────────────────────────┐
│  User: @scammer                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  [Bild: Withdrawal Succeed Screenshot]                 │ │
│  │  "Congratulations! Your withdrawal of $5000 has been   │ │
│  │   processed. Click here to verify: bit.ly/crypto123"   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼ Analyse
┌─────────────────────────────────────────────────────────────┐
│  Text-Analyse:                                               │
│  • "withdrawal" (HIGH) → +30 Punkte                         │
│  • "click here" (LOW) → +5 Punkte                           │
│  • "bit.ly" (Suspicious Domain) → +25 Punkte                │
│  Text Score: 60                                             │
│                                                              │
│  Bild-Analyse (Gemini):                                     │
│  • Erkennt fake Binance Screenshot                          │
│  • "Withdrawal Succeed" Text im Bild                        │
│  • Verdächtiger Kontext                                     │
│  Image Score: 95                                            │
│                                                              │
│  Final Score: 95 (Maximum von beiden)                       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼ Entscheidung
┌─────────────────────────────────────────────────────────────┐
│  🚨 SCAM DETECTED!                                           │
│  Confidence: 95%                                             │
│  Type: BOTH (Text + Image)                                  │
│  Reason: High-risk keyword: "withdrawal"; Suspicious domain:│
│          bit.ly; Image: Fake crypto withdrawal screenshot   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼ Aktion
┌─────────────────────────────────────────────────────────────┐
│  ✅ Nachricht gelöscht                                       │
│  ✅ Warnung gesendet:                                        │
│     "🚨 Scam Detected & Removed                             │
│      @scammer, your message was automatically deleted       │
│      because it appears to contain scam content.            │
│      Detection Type: BOTH | Confidence: 95%"                │
│  ✅ Log in #mod-logs Channel                                │
└─────────────────────────────────────────────────────────────┘
```

### ✅ Beispiel 2: Legitime Nachricht

```
┌─────────────────────────────────────────────────────────────┐
│  User: @legituser                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  "Hey guys, I'm learning about crypto trading.         │ │
│  │   Anyone have good resources?"                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼ Analyse
┌─────────────────────────────────────────────────────────────┐
│  Text-Analyse:                                               │
│  • "crypto" (MEDIUM) → +10 Punkte                           │
│  Text Score: 10                                             │
│                                                              │
│  Bild-Analyse: Keine Bilder                                 │
│  Image Score: 0                                             │
│                                                              │
│  Final Score: 10                                            │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼ Entscheidung
┌─────────────────────────────────────────────────────────────┐
│  ✅ LEGITIM                                                  │
│  Score (10) < Threshold (60 bei Medium)                     │
│  Nachricht wird NICHT blockiert                             │
└─────────────────────────────────────────────────────────────┘
```

## 📈 Statistiken & Monitoring

```
┌─────────────────────────────────────────────────────────────┐
│                    #mod-logs Channel                         │
│                                                              │
│  🚨 Anti-Scam: Message Deleted                              │
│  User: scammer#1234 (123456789)                             │
│  Channel: #general                                          │
│  Confidence: 95%                                            │
│  Type: both                                                 │
│  Reason: High-risk keyword: "withdrawal"; Suspicious        │
│          domain: bit.ly; Image: Fake crypto withdrawal      │
│  Content: "Congratulations! Your withdrawal..."            │
│  Timestamp: 2026-06-01 10:23:45                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Performance

```
┌─────────────────────────────────────────────────────────────┐
│                    Response Times                            │
│                                                              │
│  Text-Analyse:        ~5ms   ⚡ Sehr schnell                │
│  Bild-Analyse:        ~500ms 🔄 Gemini API Call             │
│  Nachricht löschen:   ~50ms  ⚡ Discord API                 │
│  Warnung senden:      ~100ms ⚡ Discord API                 │
│                                                              │
│  Total (mit Bild):    ~655ms                                │
│  Total (nur Text):    ~155ms                                │
└─────────────────────────────────────────────────────────────┘

User Experience: Nachricht verschwindet sofort, Warnung erscheint
                 innerhalb von 1 Sekunde
```

## 🔐 Sicherheit & Privacy

```
┌─────────────────────────────────────────────────────────────┐
│                    Datenfluss                                │
│                                                              │
│  Discord Message                                             │
│       │                                                      │
│       ▼                                                      │
│  Bot (lokale Text-Analyse)                                  │
│       │                                                      │
│       ├─► Gemini API (nur Bilder, keine User-Daten)        │
│       │   • Bild wird NICHT gespeichert                     │
│       │   • Keine User-IDs übertragen                       │
│       │   • Nur Analyse-Ergebnis zurück                     │
│       │                                                      │
│       ▼                                                      │
│  Datenbank (nur Metadaten)                                  │
│       • Guild Settings                                       │
│       • Keine Message-Inhalte                               │
│       • Keine Bilder                                        │
│                                                              │
│  ✅ DSGVO-konform                                            │
│  ✅ Keine Datenspeicherung                                   │
│  ✅ Nur Analyse, keine Weitergabe                           │
└─────────────────────────────────────────────────────────────┘
```
