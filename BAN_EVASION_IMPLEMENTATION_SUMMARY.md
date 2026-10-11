# Ban Evasion Detection - Implementation Summary

## ✅ What We Built

A **Multi-Signal Account-Linking System** for detecting potential ban evasion - NOT "AI magic" or "95% accurate detection".

---

## 🎯 Core Approach

### Multi-Signal Linking (NOT Single Fingerprint Hash)

**5 Independent Signals:**

1. **Device Link (30% weight)**
   - Multiple fingerprint components (Canvas, WebGL, Audio, Fonts, GPU, Screen)
   - NOT just one hash comparison
   - Checks 10+ independent attributes

2. **Verification Link (35% weight - STRONGEST)**
   - Persistent browser verification ID (stored in localStorage)
   - Cryptographically random, unique per browser
   - Survives across sessions on same browser
   - **This is the game-changer:** Same browser = Same ID

3. **Behavioral Link (20% weight)**
   - Activity time patterns (hourly/daily)
   - Emoji usage patterns
   - Message length patterns
   - Typing speed patterns (if available)
   - Vocabulary patterns

4. **Account Context (10% weight)**
   - Join timing (joined right after ban?)
   - Account age (brand new account?)
   - Temporal relationship to ban

5. **Consistency Score (5% weight)**
   - **Manipulation Detection**: Detects contradictory fingerprint attributes
   - Example: High-end GPU + generic Canvas = spoofing
   - Example: Mobile platform + 8 CPU cores = suspicious
   - Based on research: manipulated fingerprints have inconsistencies

---

## 📊 Link Score Categories

**NOT "probability" - just pattern match strength:**

- **95-100**: Very Strong Link → Moderator MUST review
- **85-94**: Strong Link → Moderator should review
- **70-84**: Weak Link → Consider reviewing
- **<70**: Minimal Link → Probably ignore

---

## 🔑 Key Improvements Over Original

### What Changed:

1. **Added Persistent Verification ID**
   - Strongest signal when available (35% weight)
   - Browser-specific, survives sessions
   - Can't be easily bypassed without clearing localStorage

2. **Multiple Independent Signals**
   - Not just "fingerprint = same" → "10+ components match"
   - Each component weighted differently

3. **Manipulation Detection**
   - Detects fingerprint spoofing attempts
   - Looks for contradictory attributes
   - Penalizes inconsistent fingerprints

4. **Context-Aware**
   - Join timing matters
   - Account age matters
   - Not just device/behavioral

5. **Honest Scoring**
   - It's a "Link Score", not "accuracy"
   - Explicitly NOT a probability
   - Categories instead of false precision

---

## 🛡️ What This CANNOT Do

**Will NOT catch:**
- Different device + different browser
- User who changes all behavior intentionally
- User with VPN + anti-fingerprinting tools
- User who clears localStorage

**Will give False Positives for:**
- Siblings/roommates on shared computer
- People in same timezone + age group
- Common browser configurations
- School/library computers

---

## 💡 What This DOES Well

**Good at catching:**
- Lazy evaders (same device, same browser)
- Quick re-joins (same day/week)
- Pattern-consistent users
- Multiple alts from same browser

**Best use case:**
- Gives mods a **lead** to investigate
- Shows **evidence** (what matched)
- Tracks confirmed alt accounts
- Reduces mod workload

---

## 🔐 Privacy Considerations

### Data Collected:
- Device fingerprint components (anonymous)
- Browser verification ID (random, per-browser)
- Activity patterns (timestamps, not content)
- Emoji/vocabulary counts (not actual messages)

### Data NOT Collected:
- Message content
- IP addresses (bots can't see them)
- Browsing history
- Personal files
- Passwords

### Legal Status:
- **We are NOT lawyers**
- Device fingerprinting is legal gray area
- GDPR/CCPA considerations needed
- Users must be informed
- Data deletion must be available

---

## 📈 Expected Performance

**Realistic Expectations:**

- **With Verification ID**: Strong link detection when same browser used
- **Without Verification ID**: Moderate link detection based on fingerprint + behavior
- **False Positive Rate**: Unknown (needs real-world testing)
- **False Negative Rate**: High (determined evaders will bypass)

**Not Claiming:**
- ❌ "95% accuracy" (no validation data)
- ❌ "AI-powered" (pattern matching, not ML)
- ❌ "Enterprise-level" (experimental system)
- ❌ "Foolproof" (many bypass methods exist)

---

## 🚀 Files Created

### Backend (Bot):
```
apps/bot/src/utils/banEvasionDetector.ts
├── analyzeUser() - Main detection function
├── calculateAccountLink() - Multi-signal scoring
├── compareMultipleFingerprintSignals() - Device comparison
├── analyzeBehavioralPatterns() - Behavior comparison
├── detectFingerprintInconsistencies() - Manipulation detection
└── Helper methods (tracking, storage, etc.)
```

### Frontend (Web):
```
apps/web/src/app/(app)/verify/[guildId]/[userId]/page.tsx
├── Verification page with ThumbmarkJS
├── Persistent verification ID generation
└── Clean UI with animated background

apps/web/src/app/api/fingerprint/verify/route.ts
└── API endpoint to store fingerprint data
```

### Database:
```
packages/db/prisma/schema.prisma
├── UserFingerprint model
├── BannedUser model  
├── BanEvasionDetection model
├── MessageAnalytics model
└── Guild settings (banEvasionEnabled, etc.)
```

### Documentation:
```
BAN_EVASION_DETECTION.md - User-facing docs (realistic)
BAN_EVASION_IMPLEMENTATION_SUMMARY.md - This file
```

---

## 🔮 Future Improvements (Maybe)

If system proves useful:
- [ ] Validate accuracy with real data
- [ ] Add machine learning (needs training data)
- [ ] Better VPN/proxy detection
- [ ] Cross-server detection (privacy concerns)
- [ ] Voice fingerprinting (if feasible)

**First priority: Does it actually help mods?**

---

## ⚖️ Bottom Line

**What we built:**
- A tool that gives mods leads, not answers
- Multi-signal pattern matching
- Honest about limitations
- Privacy-conscious design
- Realistic expectations

**What we didn't build:**
- Magic AI that "knows" it's the same person
- 95% accurate detection system
- Foolproof ban evasion prevention
- Automated ban decision maker

**Is it useful? Probably.**  
**Is it perfect? Absolutely not.**  
**Is it honest? Yes.**

---

Made with realistic expectations 🎯
