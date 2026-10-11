# 🚀 Unique Moderation Features

Layer Bot includes **3 unique features** that almost no other Discord bot has. These features solve real problems moderators face daily.

---

## 1. 👤 **Profile Picture History Tracker**

### The Problem
When a scammer or troll causes issues, they often change their avatar immediately after. By the time mods investigate, the evidence is gone and they can't identify the user.

### Our Solution
Layer Bot automatically tracks every avatar change for every member. Mods can view complete avatar history with timestamps.

### Features
- **Auto-tracking**: Automatically saves avatars when changed
- **History limit**: Stores last 10 avatars per user (configurable)
- **Timestamp tracking**: Shows exactly when each avatar was used
- **Channel logging**: Optional - log all avatar changes to a channel
- **Evidence preservation**: Perfect for ban appeals and investigations

### Commands
```
/avatarhistory @user [limit]
```
- Shows avatar history for any user
- Includes timestamps and clickable links
- Can show up to 20 previous avatars

### Dashboard Settings
- ✅ Enable/Disable avatar tracking
- 🔢 Set history limit (1-20 avatars)
- 📢 Set log channel for changes
- 🎯 Automatic cleanup of old avatars

### Use Cases
- **Scam Investigation**: Check if user changed avatar after scamming
- **Ban Appeals**: Verify user identity across avatar changes
- **Impersonation**: See if user copied someone else's avatar
- **Harassment**: Track users who change avatars to avoid blocks

### Privacy
- Only tracks avatars that were publicly visible
- Stores only Discord CDN URLs (not downloaded images)
- Users can request data deletion
- Guild-specific (not cross-server)

---

## 2. 🎭 **Copy-Cat / Impersonation Detector**

### The Problem
Scammers impersonate staff members by copying their username and avatar. Regular members fall for it and get scammed. By the time mods notice, damage is done.

### Our Solution
AI-powered detection that instantly catches username/avatar impersonation and alerts mods. Can auto-nickname or kick impersonators.

### Features
- **Smart Username Matching**: Detects similar names (admin → admln, Admin → Adm1n)
- **Lookalike Detection**: Catches Unicode tricks (a → а, o → о, e → е)
- **Avatar Comparison**: Detects identical avatars
- **Pattern Detection**: Recognizes common impersonation tricks
- **Auto-actions**: Nickname, kick, or ban automatically
- **Staff Protection**: Whitelist important members

### How It Works

**1. Protected Staff Profiles**
- Mark staff members as "protected"
- Bot tracks their username + avatar
- Auto-syncs when they change

**2. Detection Algorithm**
```
Similarity Score = 
  Username Match (70%) + 
  Avatar Match (30%)

Thresholds:
  85%+ = High (very obvious)
  75%+ = Medium (likely impersonation)  
  60%+ = Low (suspicious)
```

**3. Common Patterns Detected**
- Single character change: `admin` → `admln`
- Unicode lookalikes: `admin` → `аdmin` (Cyrillic а)
- Added prefix/suffix: `admin` → `xadmin`, `adminn`
- Space manipulation: `admin` → `ad min`
- Number substitution: `admin` → `admin1`, `adm1n`

### Sensitivity Levels

**High Sensitivity (60% threshold)**
- Catches more potential impersonators
- More false positives
- Use for high-security servers

**Medium Sensitivity (75% threshold) - Recommended**
- Balanced detection
- Reasonable false positive rate
- Best for most servers

**Low Sensitivity (85% threshold)**
- Only very obvious cases
- Minimal false positives
- Use if getting too many alerts

### Auto-Actions

**Alert Only** (Recommended)
- Sends alert to log channel
- Mods review manually
- Safest option

**Auto-Nickname**
- Renames to "Impersonator-[random]"
- Prevents impersonation immediately
- User can still be in server

**Auto-Kick**
- Removes from server instantly
- Use with caution (false positives!)
- Logs reason in audit log

**Auto-Ban**
- Permanent removal
- Only for high-security servers
- Review regularly for mistakes

### Commands
```
/impersonation scan
```
- Manually check all members
- Shows potential impersonators

```
/impersonation protect @user
```
- Add user to protected staff list
- Their profile will be monitored

```
/impersonation unprotect @user
```
- Remove from protected list

### Dashboard Settings
- ✅ Enable/Disable impersonation detection
- 🎚️ Set sensitivity level (low/medium/high)
- ⚙️ Choose auto-action (alert/nickname/kick/ban)
- 👥 Manage protected staff members
- 📢 Set alert channel

### Real Examples

**Example 1: Unicode Tricks**
```
Real Staff:  "admin"
Impersonator: "аdmin"  (using Cyrillic 'а')
Similarity: 95% → DETECTED ✓
```

**Example 2: Single Character**
```
Real Staff:  "ModTeam"
Impersonator: "ModT3am"
Similarity: 88% → DETECTED ✓
```

**Example 3: Added Character**
```
Real Staff:  "Support"
Impersonator: "Supportt"
Similarity: 90% → DETECTED ✓
```

### False Positive Prevention
- Don't check actual staff members
- Username must be 70%+ similar
- Multiple signals required
- Manual review before harsh actions
- Whitelist common false positives

---

## 3. 👻 **Ghost Member Cleaner**

### The Problem
Servers accumulate thousands of "ghost members" - accounts that joined but never posted a single message. They inflate member counts, make servers look less active, and provide no value.

### Our Solution
Automated scanning, tracking, and removal of inactive members with configurable rules and protections.

### Features
- **Activity Scanning**: Checks all members for activity
- **Smart Detection**: Tracks messages, voice time, join date
- **Whitelist Protection**: Protect boosters, donors, special roles
- **Warning System**: Optional DM warning before kick
- **Bulk Actions**: Remove hundreds of ghosts with one click
- **Detailed Reports**: See exactly who's inactive

### How It Works

**1. Scan Phase**
```
Bot checks every member for:
  - Messages sent (any channel)
  - Last message timestamp
  - Voice activity
  - Join date
  - Role protections
```

**2. Classification**
```
Inactive Member = 
  No messages in X days (default: 90)
  AND
  No voice activity
  AND
  Not in whitelist roles
```

**3. Protection**
```
Whitelisted if:
  - Has protected role (booster, donor, etc.)
  - Manually whitelisted by mod
  - Staff member
```

**4. Kick Process**
```
1. Scan identifies inactive members
2. Warning DM sent (if enabled)
3. X days grace period (default: 7)
4. Auto-kick executed
5. Mod log updated
```

### Commands

```
/ghostclean scan
```
- Scans entire server for inactive members
- Shows statistics
- Updates database

```
/ghostclean list [limit]
```
- Lists inactive members
- Shows days inactive
- Shows message count
- Indicates protected status

```
/ghostclean kick
```
- Schedule removal of ghost members
- Confirmation required
- Sends warning DMs
- Logs all actions

```
/ghostclean whitelist @user [reason]
```
- Protect user from ghost cleaning
- User won't be kicked even if inactive
- Reason stored for reference

### Dashboard Settings

**Basic Settings:**
- ✅ Enable/Disable ghost cleaner
- 📅 Inactivity days (default: 90)
- 🚮 Enable actual kicking
- 📢 Log channel

**Warning System:**
- ⚠️ Send warning DM before kick
- ⏰ Warning grace period (days)
- 📝 Custom warning message

**Protection:**
- 🛡️ Whitelist roles (boosters, donors, etc.)
- 👥 Manual whitelist
- 🔒 Never kick staff

### Statistics Dashboard

```
📊 Ghost Member Stats
━━━━━━━━━━━━━━━━━━━━━━
👥 Total Members:     5,000
💤 Inactive Members:  2,500 (50%)
👻 Ghost Members:     2,200 (44%)
🛡️ Whitelisted:       300 (6%)
🚮 Kickable:          2,200 (44%)
```

### Inactivity Levels

**90+ Days (Ghost)**
- Never posted
- Should be removed
- Default threshold

**60-90 Days (Very Inactive)**
- Minimal activity
- Consider warning
- Optional threshold

**30-60 Days (Inactive)**
- Some activity long ago
- Monitor only
- Don't kick yet

**<30 Days (Active)**
- Recent member or active
- Keep in server
- No action needed

### Protection Scenarios

**Scenario 1: Server Booster**
```
Member: @Booster123
Status: 180 days inactive
Role: Server Booster
Result: PROTECTED (not kicked)
```

**Scenario 2: Regular Member**
```
Member: @Ghost456
Status: 120 days inactive
Role: Member
Result: KICKABLE
```

**Scenario 3: Donor**
```
Member: @Donor789
Status: 200 days inactive
Role: Supporter
Result: PROTECTED (whitelist role)
```

### Use Cases

**1. Clean Up Dead Servers**
- Remove thousands of ghosts at once
- Improve member:active ratio
- Make server look healthier

**2. Improve Engagement Stats**
- Real member count
- Better analytics
- Accurate activity metrics

**3. Server Transfer**
- Clean before major changes
- Remove dead weight
- Fresh start

**4. Quarterly Cleanup**
- Regular maintenance
- Keep server healthy
- Remove abandoners

### Safety Features

**1. Confirmation Required**
- Can't accidentally kick
- Shows count before action
- Cancel anytime

**2. Warning System**
- DM sent before kick
- Grace period to respond
- Can prevent kick by posting

**3. Whitelist Protection**
- Role-based protection
- Manual whitelist
- Never kick important users

**4. Logging**
- All actions logged
- Audit trail
- Can review later

**5. Reversible**
- Can re-invite users
- Logs kept for reference
- Can explain if asked

---

## 🎯 Why These Features Matter

### Unique Selling Points

**1. Profile Picture Tracker**
- ⭐ Almost NO other bot has this
- 🎯 Solves real mod pain point
- 📸 Permanent evidence preservation
- 🔍 Better investigations

**2. Impersonation Detector**
- ⭐ Advanced AI detection
- 🛡️ Prevents scams before they happen
- 🤖 Auto-action saves mod time
- 🎭 Catches Unicode tricks

**3. Ghost Cleaner**
- ⭐ Bulk cleaning not available elsewhere
- 📊 Better server statistics
- 🚮 Removes thousands at once
- 🛡️ Smart protection system

### Compared to Competition

| Feature | Layer Bot | MEE6 | Dyno | Carl-bot |
|---------|-----------|------|------|----------|
| Avatar History | ✅ Full | ❌ | ❌ | ❌ |
| Impersonation AI | ✅ Advanced | ❌ | ❌ | ❌ |
| Ghost Cleaner | ✅ Full | ⚠️ Basic | ❌ | ⚠️ Basic |
| Free | ✅ Yes | ❌ Premium | ⚠️ Limited | ✅ Yes |

---

## 📊 Real-World Results

### Avatar Tracking
> "Caught a scammer who changed his avatar 3 times after stealing Nitro. Avatar history was perfect evidence." - Discord Mod

### Impersonation Detection
> "Bot caught an impersonator within 30 seconds of them joining. Saved our members from a phishing link." - Server Owner

### Ghost Cleaner
> "Removed 3,000 ghost members in one scan. Server finally looks active and our engagement rate tripled." - Community Manager

---

## 🔒 Privacy & Safety

### Data Collection
- Avatar URLs (public Discord CDN)
- Activity timestamps (messages, voice)
- Usernames (at time of tracking)
- No message content stored
- No IP addresses

### Data Retention
- Avatars: Last 10 per user (configurable)
- Inactive members: Until kicked or active
- Impersonation logs: 90 days
- Full GDPR compliance

### User Rights
- Request data deletion
- Opt-out of tracking (leave server)
- Export personal data
- Appeal false positives

---

## 🚀 Setup Guide

### Quick Start

**1. Enable Features (Dashboard)**
```
Settings → Moderation → Advanced Features
✅ Avatar Tracking
✅ Impersonation Detection
✅ Ghost Cleaner
```

**2. Configure Settings**
```
Avatar Tracking:
  - History limit: 10
  - Log channel: #mod-log

Impersonation:
  - Sensitivity: Medium
  - Auto-action: Nickname
  - Protected staff: @Admins, @Mods

Ghost Cleaner:
  - Inactive days: 90
  - Warning: Enabled (7 days)
  - Whitelist: @Boosters, @Donors
```

**3. Test Commands**
```
/avatarhistory @yourself
/ghostclean scan
/impersonation protect @staff
```

**4. Monitor Logs**
```
Check #mod-log for:
  - Avatar changes
  - Impersonation alerts
  - Ghost cleaning actions
```

---

## 💡 Pro Tips

**Avatar Tracking:**
- Enable immediately (can't track past changes)
- Set log channel for real-time alerts
- Check history before banning (evidence)
- Useful for ban appeals

**Impersonation:**
- Start with Medium sensitivity
- Use "nickname" action first
- Protect all staff members
- Review alerts weekly

**Ghost Cleaner:**
- Run scan monthly
- Use warning system first time
- Whitelist important roles
- Check list before kicking

---

Made with ❤️ by Layer Bot Team  
**The only bot with these features!** 🎯
