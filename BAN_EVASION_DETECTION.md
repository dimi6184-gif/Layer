# 🚨 Ban Evasion Detection System

## Overview

Layer Bot now includes a **Ban Evasion Detection System** that helps moderators identify potential alt accounts. It uses device fingerprinting and behavioral patterns to flag suspicious joins for manual review.

**Important:** This is a *helper tool*, not a magic solution. It will give you leads, not guarantees.

---

## 🎯 How It Works

### Multi-Signal Account Linking

Instead of relying on one "fingerprint hash", the system uses **5 independent signals**:

**1. Device Link (30%)**
- Compares 10+ device attributes independently
- Canvas, WebGL, Audio, Fonts, GPU, Screen, etc.
- NOT just "hash matches = same device"

**2. Verification Link (35% - STRONGEST)**
- Persistent browser verification ID
- Stored in browser's localStorage
- Survives across sessions
- **Can't bypass without clearing browser data**

**3. Behavioral Link (20%)**
- Activity time patterns
- Emoji patterns
- Message patterns
- Multiple weak signals combined

**4. Account Context (10%)**
- Join timing (right after ban?)
- Account age (brand new?)
- Temporal relationship

**5. Manipulation Detection (5%)**
- Detects contradictory fingerprint attributes
- Example: High-end GPU + generic Canvas = spoofing
- Penalizes suspicious inconsistencies

### Link Score (NOT Probability!)

The system calculates a 0-100 "link score" - this is **pattern match strength**, NOT "% chance it's the same person".

```
95-100: Very Strong Link → Review immediately
85-94:  Strong Link → Should review
70-84:  Weak Link → Consider reviewing
<70:    Minimal Link → Probably ignore
```

**Always review manually. False positives will happen.**

---

## 🔧 Setup

### 1. Enable Ban Evasion Detection

In your server dashboard:
```
Dashboard → Security → Ban Evasion Detection → Enable
```

**Settings:**
- **Minimum Confidence**: Alert threshold (default: 85%)
- **Auto Action**: What to do when detected
  - `alert`: Only notify moderators
  - `rate_limit`: Slow down the suspect
  - `auto_ban`: Automatically ban (not recommended)
- **Require Verification**: Force new members to verify device
- **Log Channel**: Where to send alerts

### 2. Verification Flow

When enabled, new members must:
1. Click verification button in welcome channel
2. Open web panel (automatically)
3. Device fingerprint is collected (client-side)
4. Verification completes in 2-3 seconds

**Privacy Note**: Only anonymous device data is collected. No browsing history, passwords, or personal information.

---

## 📊 How It Detects

### When User Joins

```typescript
1. User joins server
2. Bot checks if verification required
3. If yes: Send verification link
4. User clicks → Opens web panel
5. ThumbmarkJS collects fingerprint
6. System compares against all banned users
7. If match found (>85%):
   → Alert sent to mods
   → Optional auto-action applied
```

### Detection Signals

The system looks for:

**Exact Matches (100% confidence):**
- Identical device fingerprint
- Same hardware + browser combo

**High Confidence (80-99%):**
- 90%+ fingerprint component match
- Similar typing speed + emoji patterns
- Same activity hours

**Medium Confidence (70-79%):**
- 70%+ fingerprint similarity
- Matching behavioral patterns
- Similar vocabulary usage

**Low Confidence (50-69%):**
- Partial fingerprint match
- Some behavioral overlap

---

## 🛡️ False Positive Prevention

### Why False Positives Happen

1. **Shared Devices**: Siblings, roommates, school/library computers
2. **Browser Updates**: Change fingerprints
3. **Common Patterns**: People in same timezone + similar ages often behave similarly
4. **VPNs/Proxies**: Can mask real device info

### What We Do

1. **Manual Review Only**: Never auto-ban based on score alone
2. **Whitelist System**: Mark verified users
3. **High Threshold**: Default 85% before alerting
4. **Show Evidence**: Mods see *why* it matched

**Expected False Positive Rate**: Unknown - we haven't tested this at scale yet.

---

## 📈 Mod Dashboard

### Ban Evasion Tab

**Pending Detections:**
```
┌─────────────────────────────────────────────────────┐
│ Suspect: @NewUser123                                │
│ Banned User: @OldTroll (banned 2 weeks ago)         │
│ Confidence: 92%                                      │
│                                                      │
│ Breakdown:                                           │
│ • Fingerprint Match: 95%                             │
│ • Behavioral Match: 88%                              │
│ • Network Match: 85%                                 │
│                                                      │
│ Signals:                                             │
│ ✓ Exact device fingerprint                           │
│ ✓ Same emojis: 💀 👀 🔥                              │
│ ✓ Similar typing speed (85 WPM)                      │
│ ✓ Same activity hours (2-5 AM)                       │
│                                                      │
│ [Confirm Ban] [False Positive] [Ignore]              │
└─────────────────────────────────────────────────────┘
```

**Actions:**
- **Confirm Ban**: Bans the suspect + all linked accounts
- **False Positive**: Whitelists user, system learns
- **Ignore**: Dismisses this detection only

---

## 💡 Best Practices

### For Moderators

1. **Review All Detections**: Don't auto-ban without review
2. **Check Signals**: Look at what matched
3. **Consider Context**: New account + suspicious behavior
4. **Use Whitelist**: Mark verified users
5. **Monitor Appeals**: Users can explain

### For Server Owners

1. **Enable Verification**: Required for accuracy
2. **Set Reasonable Threshold**: 85% is recommended
3. **Use "Alert" Mode First**: Test before auto-actions
4. **Set Up Log Channel**: Track all detections
5. **Train Your Mods**: Explain the system

---

## 🔐 Privacy & Data Collection

### What We Collect

**Device Fingerprint (Anonymous):**
- Browser type & version
- Screen resolution
- Timezone
- Installed fonts (hashed)
- GPU model
- Canvas/Audio fingerprints

**Behavioral Data:**
- Message timestamps (when you post)
- Emoji usage counts (which emojis, not in what context)
- Activity times (hourly patterns)

### What We DON'T Collect

- ❌ Message content
- ❌ IP addresses (bots can't see them anyway)
- ❌ Passwords or auth tokens
- ❌ Browser history
- ❌ Files or downloads

### GDPR/Privacy Compliance

**We are NOT lawyers.** Before using this in production:

1. Add this to your privacy policy
2. Inform users that device data is collected
3. Provide data deletion on request
4. Consider if your jurisdiction requires consent

Device fingerprinting exists in a **legal gray area** in some countries. Check with a lawyer if you're concerned.

---

## 📊 How Accurate Is This?

**Honest answer: We don't know yet.**

We're using:
- ThumbmarkJS (open-source fingerprinting library)
- Pattern matching algorithms
- Score weighting we chose ourselves

**What we CAN say:**
- Device fingerprints can distinguish devices (when they work)
- Behavioral patterns show some correlation
- Manual review with this data is better than manual review without it

**What we CANNOT claim:**
- "95% accuracy" - we haven't validated this
- "Enterprise-level" - this is experimental
- "AI-powered" - it's pattern matching, not machine learning

**Will it help? Probably.**  
**Is it perfect? Absolutely not.**

---

## 🚀 Advanced Features

### Command: `/ban-evasion`

**Check User:**
```
/ban-evasion check @user
→ Shows if user matches any banned accounts
```

**View Stats:**
```
/ban-evasion stats
→ Shows detection statistics for your server
```

**Whitelist User:**
```
/ban-evasion whitelist @user
→ Marks user as verified (never flagged)
```

### API Integration

For advanced users, you can integrate with our API:

```typescript
// Check if user is suspect
const result = await BanEvasionDetector.analyzeUser(
  userId,
  guildId,
  fingerprintData
);

if (result && result.confidenceScore > 85) {
  // Alert moderators
}
```

---

## 🎓 Limitations & Known Issues

### Will NOT Work If:

1. **User uses different device** - fingerprint changes completely
2. **User switches browsers** - different fingerprint
3. **User updates browser** - might change fingerprint
4. **User uses VPN/Tor** - masks some signals
5. **User uses anti-fingerprinting tools** - blocks data collection
6. **User changes behavior intentionally** - patterns won't match

### Will Give False Positives If:

1. **Shared computers** (family, school, internet cafe)
2. **Common patterns** (timezone + age group + interests)
3. **Browser defaults** (many people use default settings)
4. **Small sample size** (<50 messages for behavioral)

### What This System Is Good For:

- Catching lazy ban evaders (same device, same patterns)
- Giving mods a **lead** to investigate
- Tracking multiple alt accounts once one is confirmed

### What This System Is NOT:

- A magic bullet
- 100% accurate
- A replacement for mod judgment
- Foolproof against determined evaders

---

## 🐛 Troubleshooting

### "Verification Link Not Working"

**Solution:**
1. Check if user has DMs enabled
2. Try sending link in server channel
3. User can manually visit: `https://yourdomain.com/verify/{guildId}/{userId}`

### "Too Many False Positives"

**Solution:**
1. Increase confidence threshold (85% → 90%)
2. Disable auto-actions
3. Whitelist common false positives
4. Check if siblings/roommates sharing device

### "User Bypassing Detection"

**Solution:**
1. Enable required verification (no bypass)
2. Check if verification role is set correctly
3. Lower confidence threshold (85% → 75%)
4. Enable behavioral tracking (need 50+ messages)

---

## 🔮 Roadmap (Maybe)

Possible improvements if we validate the system works:
- [ ] Actual machine learning (needs training data)
- [ ] VPN/Proxy detection
- [ ] Cross-server detection (privacy concerns)
- [ ] Better accuracy validation

**First priority: See if the basic version actually helps moderators.**

---

## 📞 Support

Need help?
- Discord: [Your Support Server]
- Email: support@yourbot.com
- Docs: https://docs.yourbot.com

---

## ⚖️ Legal Disclaimer

**We are not lawyers. This is NOT legal advice.**

This system:
- Collects device data
- Tracks user behavior patterns
- Stores this data for moderation purposes

Before using this feature:
1. **Update your privacy policy**
2. **Inform users** (verification screen does this)
3. **Check your local laws** (GDPR, CCPA, etc.)
4. **Provide data deletion** (we store data, you need a deletion process)

**Open Source:**
- ThumbmarkJS: MIT License (free to use)
- Our code: Custom implementation

**No warranties:** This is experimental. Use at your own risk.

---

## Summary

**What this is:**
- An experimental tool to help mods spot potential ban evaders
- Uses device fingerprints + behavioral patterns
- Gives you a score + evidence to review manually

**What this is NOT:**
- 95% accurate (we don't have validation data)
- AI-powered (it's pattern matching)
- Foolproof (determined evaders can bypass it)
- Legal advice (check with a lawyer)

**Should you use it?**
- If you have a ban evasion problem: **Maybe, carefully**
- If you're looking for a magic solution: **No**
- If you want a tool to give you leads: **Yes**

Made with realistic expectations by Layer Bot Team 🎯
