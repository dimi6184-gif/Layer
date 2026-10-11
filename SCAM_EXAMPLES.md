# 🚨 Erkannte Scam-Typen - Beispiele

## Basierend auf deinen Bildern

### 1️⃣ Fake Crypto Withdrawal (Bild 1)
```
┌─────────────────────────────────────────────────────────────┐
│  Screenshot zeigt:                                           │
│  • "Withdrawal Succeed!"                                     │
│  • "Your Withdrawal of $5000 Was Successful"                │
│  • Fake Binance/Crypto-Plattform Interface                  │
│  • Grüne Checkmarks                                         │
│  • Handy-Screenshot für "Authentizität"                     │
└─────────────────────────────────────────────────────────────┘

Erkennungsmerkmale:
✅ Keyword: "withdrawal succeed" (HIGH - 30 Punkte)
✅ Keyword: "successful" (MEDIUM - 10 Punkte)
✅ Bild-Analyse: Fake Crypto-Plattform Screenshot (95% Confidence)
✅ Grüne Checkmarks + Geldbeträge = Typisches Scam-Muster

Gesamtscore: 95% → BLOCKIERT bei allen Sensitivitäten
```

### 2️⃣ Fake Promo Code / Cashback (Bild 2)
```
┌─────────────────────────────────────────────────────────────┐
│  Screenshot zeigt:                                           │
│  • "Activate your Promo Code"                               │
│  • "Your Rakeback" / "Your Cashback"                        │
│  • "Join our VIP Club"                                      │
│  • Fake Crypto-Gambling-Site Interface                      │
│  • "Withdrawal Succeed" mit grünen Checkmarks               │
│  • Geldbeträge ($2700, $2697, etc.)                         │
└─────────────────────────────────────────────────────────────┘

Erkennungsmerkmale:
✅ Keyword: "activate your promo" (HIGH - 30 Punkte)
✅ Keyword: "rakeback" (HIGH - 30 Punkte)
✅ Keyword: "vip club" (HIGH - 30 Punkte)
✅ Keyword: "withdrawal succeed" (HIGH - 30 Punkte)
✅ Bild-Analyse: Fake Gambling-Site + Success Messages (90% Confidence)
✅ Kombination von Promo + Withdrawal = Klassischer Scam

Gesamtscore: 90% → BLOCKIERT bei allen Sensitivitäten
```

### 3️⃣ Fake Influencer Endorsement (Bild 2 - Andrew Tate)
```
┌─────────────────────────────────────────────────────────────┐
│  Screenshot zeigt:                                           │
│  • "Andrew Tate 🏆🏆"                                        │
│  • Fake Social Media Post                                   │
│  • "Unverified peripherally created with other individuals" │
│  • Link zu Crypto-Scam                                      │
└─────────────────────────────────────────────────────────────┘

Erkennungsmerkmale:
✅ Keyword: "andrew tate" (HIGH - 30 Punkte)
✅ Kombination mit Crypto-Keywords
✅ Fake Social Media Screenshot
✅ Bild-Analyse: Influencer + Crypto = Scam Pattern (85% Confidence)

Gesamtscore: 85% → BLOCKIERT bei allen Sensitivitäten
```

## Weitere häufige Scam-Typen

### 4️⃣ Free Discord Nitro
```
┌─────────────────────────────────────────────────────────────┐
│  "🎉 Congratulations! You've been selected for FREE Discord │
│   Nitro! Click here to claim: discord-gift.ru/claim123"    │
└─────────────────────────────────────────────────────────────┘

Erkennungsmerkmale:
✅ Keyword: "free nitro" (HIGH - 30 Punkte)
✅ Keyword: "click here to claim" (HIGH - 30 Punkte)
✅ Fake Domain: "discord-gift.ru" (nicht discord.com)
✅ Urgency: "Congratulations! You've been selected"

Gesamtscore: 80% → BLOCKIERT bei allen Sensitivitäten
```

### 5️⃣ Wallet Connection Phishing
```
┌─────────────────────────────────────────────────────────────┐
│  "🔐 Verify your MetaMask wallet to receive your airdrop    │
│   rewards. Connect here: metamask-verify.com"               │
│  [Bild: Fake MetaMask Interface]                            │
└─────────────────────────────────────────────────────────────┘

Erkennungsmerkmale:
✅ Keyword: "verify wallet" (HIGH - 30 Punkte)
✅ Keyword: "connect" + "wallet" (HIGH - 30 Punkte)
✅ Keyword: "airdrop" (HIGH - 30 Punkte)
✅ Fake Domain: "metamask-verify.com" (nicht metamask.io)
✅ Bild: Fake Wallet Interface

Gesamtscore: 90% → BLOCKIERT bei allen Sensitivitäten
```

### 6️⃣ Investment Scam
```
┌─────────────────────────────────────────────────────────────┐
│  "💰 Double your Bitcoin in 24 hours! Guaranteed profit!    │
│   Minimum investment: $100. Join now: bit.ly/crypto-invest" │
└─────────────────────────────────────────────────────────────┘

Erkennungsmerkmale:
✅ Keyword: "double your" (HIGH - 30 Punkte)
✅ Keyword: "guaranteed profit" (HIGH - 30 Punkte)
✅ Keyword: "investment" (MEDIUM - 10 Punkte)
✅ Suspicious Domain: "bit.ly" (25 Punkte)

Gesamtscore: 95% → BLOCKIERT bei allen Sensitivitäten
```

### 7️⃣ Fake Steam Gift
```
┌─────────────────────────────────────────────────────────────┐
│  "🎮 Free $100 Steam Gift Card! Limited time offer!         │
│   Claim now: steamcommunlty.ru/gift"                        │
└─────────────────────────────────────────────────────────────┘

Erkennungsmerkmale:
✅ Keyword: "steam gift" (HIGH - 30 Punkte)
✅ Keyword: "limited time offer" (HIGH - 30 Punkte)
✅ Fake Domain: "steamcommunlty.ru" (Typo + .ru statt .com)
✅ Urgency: "Limited time"

Gesamtscore: 85% → BLOCKIERT bei allen Sensitivitäten
```

### 8️⃣ Account Suspension Phishing
```
┌─────────────────────────────────────────────────────────────┐
│  "⚠️ URGENT: Your Discord account has been flagged for      │
│   unusual activity. Verify your identity within 24 hours    │
│   or your account will be permanently suspended:            │
│   discord-verify.com/urgent"                                │
└─────────────────────────────────────────────────────────────┘

Erkennungsmerkmale:
✅ Keyword: "suspended account" (HIGH - 30 Punkte)
✅ Keyword: "unusual activity detected" (HIGH - 30 Punkte)
✅ Keyword: "verify your identity" (HIGH - 30 Punkte)
✅ Keyword: "urgent" (LOW - 5 Punkte)
✅ Fake Domain: "discord-verify.com"

Gesamtscore: 95% → BLOCKIERT bei allen Sensitivitäten
```

## Legitime Nachrichten (werden NICHT blockiert)

### ✅ Beispiel 1: Normale Crypto-Diskussion
```
┌─────────────────────────────────────────────────────────────┐
│  "Hey, I'm learning about crypto trading. Anyone have good  │
│   resources or tutorials to recommend?"                     │
└─────────────────────────────────────────────────────────────┘

Analyse:
• Keyword: "crypto" (MEDIUM - 10 Punkte)
• Keyword: "trading" (MEDIUM - 10 Punkte)
• Gesamtscore: 20%

20% < 60% (Medium Threshold) → NICHT BLOCKIERT ✅
```

### ✅ Beispiel 2: Gaming-Diskussion
```
┌─────────────────────────────────────────────────────────────┐
│  "Just got a Steam gift card for my birthday! What games    │
│   should I buy?"                                            │
└─────────────────────────────────────────────────────────────┘

Analyse:
• Keyword: "steam" (MEDIUM - 10 Punkte)
• Keyword: "gift" (MEDIUM - 10 Punkte)
• Gesamtscore: 20%

20% < 60% (Medium Threshold) → NICHT BLOCKIERT ✅
```

### ✅ Beispiel 3: Legitime Promo
```
┌─────────────────────────────────────────────────────────────┐
│  "Our server is hosting a giveaway! React with 🎉 to enter. │
│   Winner will be announced on Friday."                      │
└─────────────────────────────────────────────────────────────┘

Analyse:
• Keyword: "giveaway" (MEDIUM - 10 Punkte)
• Gesamtscore: 10%

10% < 60% (Medium Threshold) → NICHT BLOCKIERT ✅
```

## Score-Berechnung Beispiele

### Beispiel 1: Dein Bild (Withdrawal Succeed)
```
Text-Analyse:
├─ "withdrawal succeed" (HIGH)     → +30
├─ "successful" (MEDIUM)           → +10
├─ "crypto" (MEDIUM)               → +10
└─ Total Text Score: 50

Bild-Analyse (Gemini):
├─ Fake Binance Screenshot erkannt
├─ "Withdrawal Succeed" Text im Bild
├─ Grüne Checkmarks + Geldbeträge
└─ Image Score: 95

Final Score: max(50, 95) = 95%
Threshold (Medium): 60%
95% > 60% → BLOCKIERT ✅
```

### Beispiel 2: Legitime Nachricht
```
Text-Analyse:
├─ "crypto" (MEDIUM)               → +10
└─ Total Text Score: 10

Bild-Analyse:
└─ Keine Bilder → 0

Final Score: max(10, 0) = 10%
Threshold (Medium): 60%
10% < 60% → NICHT BLOCKIERT ✅
```

### Beispiel 3: Grenzfall
```
Text-Analyse:
├─ "crypto" (MEDIUM)               → +10
├─ "free" (implizit in "free money") → +10
├─ "click here" (LOW)              → +5
├─ "limited" (LOW)                 → +5
└─ Total Text Score: 30

Bild-Analyse:
└─ Keine Bilder → 0

Final Score: 30%

Bei LOW (80%):    30% < 80% → NICHT BLOCKIERT ✅
Bei MEDIUM (60%): 30% < 60% → NICHT BLOCKIERT ✅
Bei HIGH (40%):   30% < 40% → NICHT BLOCKIERT ✅
```

## Sensitivitäts-Empfehlungen

### 🟢 LOW (80%+) - Empfohlen für:
- Große Server mit viel Traffic
- Communities mit vielen Crypto-Diskussionen
- Wenn False Positives unbedingt vermieden werden müssen

**Blockiert:** Nur sehr offensichtliche Scams (95%+ Confidence)

### 🟠 MEDIUM (60%+) - Empfohlen für: ⭐
- Die meisten Server (Standard)
- Gute Balance zwischen Schutz und False Positives
- Normale Communities

**Blockiert:** Offensichtliche + wahrscheinliche Scams (60%+ Confidence)

### 🔴 HIGH (40%+) - Empfohlen für:
- Server mit vielen Scam-Problemen
- Gaming-Communities (viele Nitro/Steam Scams)
- Wenn maximaler Schutz wichtiger ist als False Positives

**Blockiert:** Alle verdächtigen Nachrichten (40%+ Confidence)
**Achtung:** Kann legitime Nachrichten blockieren!

## Statistiken

Nach 1 Woche Betrieb (geschätzt):

```
┌─────────────────────────────────────────────────────────────┐
│  Sensitivität: MEDIUM (60%)                                  │
│                                                              │
│  Nachrichten gescannt:        10,000                        │
│  Scams erkannt:                  45                         │
│  Scams blockiert:                45                         │
│  False Positives:                 2 (0.02%)                 │
│  Erfolgsrate:                 95.6%                         │
│                                                              │
│  Top Scam-Typen:                                            │
│  1. Fake Crypto Withdrawals    18 (40%)                     │
│  2. Free Nitro Scams           12 (27%)                     │
│  3. Wallet Phishing             8 (18%)                     │
│  4. Investment Scams            5 (11%)                     │
│  5. Andere                      2 (4%)                      │
└─────────────────────────────────────────────────────────────┘
```
