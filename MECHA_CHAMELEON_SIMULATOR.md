# 🦎 Mecha Chameleon Simulator - Complete Documentation

## 🎮 Game Overview

A Roblox simulator game inspired by the Mecha Chameleon trend, featuring:
- Paint collection gameplay loop
- Chameleon evolution system
- Multiple worlds to explore
- Pet system with rarities
- Mutation/skins system
- Upgrade Core (Rebirth) mechanics

---

## ✅ Currently Implemented Features

### 🎨 Core Gameplay
- **Paint Collection System**: Walk near paint sources to auto-collect
  - 26 paint sources scattered across Jungle Lab (World 1)
  - Different colors: Yellow (common), Blue (uncommon), Red (rare), Purple (very rare)
  - Automatic respawn after 3 seconds
  - Visual particle effects on all paint sources
  - Paint capacity based on current tank level

- **Currency System**: 
  - Paint → Coins conversion (2:1 ratio)
  - Sell paint at the Color Factory
  - Minimum 10 paint required to sell

- **Paint Tank Capacity**:
  - Starter Tank: 50 capacity
  - Upgradeable up to 10,000 (Infinite Paint Core)

### 🏭 Buildings
- **Color Factory**: Central selling point with neon signage
  - Green sell zone with proximity prompt
  - Located at spawn (0, 0, 0)
  - Converts paint to coins

### 🦎 Chameleon Evolution
6 stages with increasing stats:
1. **Rusty Chameleon** 🤖 - Base form (1.0x speed, 50 capacity) - FREE
2. **Iron Chameleon** ⚙️ - 1.2x speed, 100 capacity - $500
3. **Crystal Chameleon** 💎 - 1.5x speed, 250 capacity - $2,000
4. **Rainbow Chameleon** 🌈 - 1.8x speed, 500 capacity - $10,000
5. **Cyber Chameleon** 👾 - 2.2x speed, 1000 capacity - $50,000
6. **Ultimate Mecha Chameleon** 🔥 - 3.0x speed, 5000 capacity - $250,000

### 🛒 Shop System
Beautiful UI with tabs:
- **🦎 Chameleon Tab**: Evolution upgrades
- **🎨 Paint Tank Tab**: Capacity upgrades (ready to implement)
- **⚡ Speed Tab**: Additional speed boosts (ready to implement)

Features:
- Dark themed UI with purple accents
- Scrollable upgrade list
- Shows speed multipliers and capacities
- Buy buttons with coin costs
- Close button (X)

### 💾 Data System
- **MockDataStore** for Studio testing (auto-switches to real DataStore in production)
- Auto-save every 60 seconds per player
- Auto-save every 5 minutes for all players
- Save on player leave
- Tracks:
  - Paint & Coins
  - Chameleon stage & Tank level
  - Current world & unlocked worlds
  - Pets (inventory & equipped)
  - Mutations (owned & equipped)
  - Rebirth count
  - Total stats (paint collected, play time)

### 🎨 Visual Enhancements
- Particle effects on all paint sources
- Color-coded by paint type
- Bloom effect for neon glow
- Enhanced ambient lighting
- Color correction filters
- Better outdoor ambience

### 📊 UI System
- **Paint Display** (Top Center): Shows current/max paint with 🎨 icon
- **Coins Display** (Top Right): Golden box with current coins
- **Shop Button** (Bottom Left): Purple button with 🛒 icon
- **Sell Button** (Bottom Center): Green button with "🏭 SELL PAINT"
- **Leaderstats**: Shows Paint and Coins in player list

---

## 🚧 Configured But Not Yet Implemented

### 🌍 World System
5 worlds configured in GameConfig:
1. **Jungle Lab** 🌴 - FREE (1.0x multiplier) ✅ ACTIVE
2. **Poolrooms** 🏊 - $5,000 (1.5x multiplier)
3. **Backrooms** 🟨 - $25,000 (2.0x multiplier)
4. **Mecha Factory** 🤖 - $100,000 (3.0x multiplier)
5. **Cyber Space** 🌌 - $500,000 (5.0x multiplier)

### 🐾 Pet System
**Pet Config Ready** with:
- 10 different pets configured
- 5 rarity tiers (Common → Legendary)
- Stat bonuses: Color collection + Speed
- 3 egg types: Basic ($100), Golden ($1,000), Mythic ($10,000)
- Max 3 pets equipped at once
- Weighted rarity system per egg type

Pet examples:
- 🐣 Mini Chameleon Bot (Common) - +25% color, +10% speed
- ⚙️ Paint Drone (Uncommon) - +50% color, +15% speed
- 🦎 Cyber Lizard (Rare) - +100% color, +25% speed
- 🌈 Rainbow Chameleon (Epic) - +200% color, +50% speed
- 👑 Golden Mecha Chameleon (Legendary) - +500% color, +100% speed

### 🎨 Mutation System
5 skins configured:
- 🔥 Lava Skin - $10,000
- ❄️ Ice Skin - $15,000
- 🌈 Rainbow Skin - $25,000
- 👻 Ghost Skin - $50,000
- 🖥️ Glitch Skin - $100,000

### 🏆 Achievement System
Ready to implement with 9 achievements:
- First Drop (collect 1 paint) → +10 coins
- Paint Collector (1,000 paint) → +100 coins
- Paint Master (10,000 paint) → +1,000 coins
- Getting Rich (100 coins earned) → +50 coins
- Millionaire (1M coins) → +50,000 coins
- Iron Evolution (upgrade to Iron) → +50 coins
- Ultimate Form (reach ultimate) → +10,000 coins
- Speed Demon (reach 2x speed) → +500 coins

### 🔄 Upgrade Core (Rebirth)
- Base cost: 100,000 coins
- Gives +10% permanent multiplier per rebirth
- Resets progress but keeps multipliers

---

## 📁 File Structure

```
ReplicatedStorage/
├── GameConfig (Module) - Main game configuration
├── AchievementConfig (Module) - Achievement definitions
└── PetConfig (Module) - Pet system configuration

ServerScriptService/
├── MainServer (Script) - Player join/leave handling
├── PlayerDataManager (Module) - Data saving/loading
├── SellSystem (Script) - Paint selling logic
├── PurchaseSystem (Script) - Upgrade purchases
├── CharacterSetup (Script) - Apply stats on spawn
└── VisualSetup (Script) - Lighting enhancements

ServerStorage/
└── PaintSourceScript (Script) - Template for paint sources

StarterPlayer/StarterPlayerScripts/
├── GameUI (LocalScript) - Main HUD
├── ShopUI (LocalScript) - Upgrade shop interface
└── PaintCollector (LocalScript) - Auto-collection system

Workspace/
├── ColorFactory (Model) - Selling building
├── JungleLab (Folder) - World 1 with 26 paint sources
├── Baseplate
└── SpawnLocation
```

---

## 🎮 Gameplay Loop

1. **Spawn** → Start with Rusty Chameleon (50 capacity)
2. **Collect Paint** → Walk near glowing paint orbs
3. **Monitor Tank** → Watch paint fill up (6/50, 26/50, etc.)
4. **Sell Paint** → Click green "SELL PAINT" button
5. **Earn Coins** → Get coins (2 paint = 1 coin)
6. **Open Shop** → Click purple shop button
7. **Buy Upgrades** → Purchase better chameleon forms
8. **Get Faster** → Speed increases with upgrades
9. **Repeat** → Grind to ultimate form!

---

## 💡 Next Steps to Complete the Game

### High Priority
1. **Implement Pet System**
   - Create egg hatching UI
   - Pet following system (pets follow player)
   - Apply pet stat bonuses
   - Pet inventory management

2. **Add More Worlds**
   - Create Poolrooms zone (blue neon theme)
   - Create Backrooms zone (yellow liminal spaces)
   - Create Mecha Factory (industrial metal theme)
   - Create Cyber Space (purple/cyan neon)
   - World teleport system

3. **Complete Shop Tabs**
   - Paint Tank upgrades (7 tiers configured)
   - Speed upgrades (separate from chameleon)

4. **Achievement System**
   - Achievement popup notifications
   - Achievement tracking
   - Reward claiming

### Medium Priority
5. **Mutation/Skin System**
   - Visual character customization
   - Skin preview system
   - Equip/unequip skins

6. **Upgrade Core (Rebirth)**
   - Rebirth UI
   - Progress reset with multipliers
   - Rebirth confirmation dialog

7. **Events System**
   - 🌈 Rainbow Storm (all paints spawn)
   - ⚡ Energy Surge (2x collection speed)
   - 👾 Glitch Invasion (rare paint spawns)
   - 🎨 Color Rain (paint falls from sky)

### Polish & Monetization
8. **Gamepasses**
   - Auto-Sell (sell automatically when full)
   - 2x Paint Collection
   - VIP Lounge
   - Permanent Speed Boost

9. **Visual Polish**
   - Custom chameleon models per stage
   - Better Color Factory building
   - World-specific ambience
   - Sound effects (collect, sell, upgrade)
   - Background music per world

10. **Social Features**
    - Leaderboard for richest players
    - Trade system for pets
    - Gifting system
    - Display owned pets

---

## 🎨 Color Palette

- **UI Background**: RGB(25, 25, 30) - Dark theme
- **UI Accent**: RGB(100, 50, 200) - Purple
- **Coins Display**: RGB(255, 200, 0) - Gold
- **Sell Button**: RGB(0, 200, 100) - Green
- **Paint Colors**:
  - Yellow: RGB(255, 234, 0)
  - Blue: RGB(0, 145, 255)
  - Red: RGB(255, 50, 50)
  - Purple: RGB(200, 0, 255)
  - Mecha Energy: RGB(0, 255, 200)

---

## 🔧 Configuration Tips

### Adjust Paint Spawn Rates
Edit `GameConfig.PaintTypes` to change paint values

### Modify Economy Balance
- Change `GameConfig.PaintConversion.Rate` (currently 2:1)
- Adjust chameleon upgrade costs in `GameConfig.ChameleonStages`

### Add More Paint Sources
Run this in Command Bar:
```lua
-- Creates paint at position
local paint = Instance.new("Part")
paint.Name = "YellowPaint_X"
paint.Size = Vector3.new(4, 4, 4)
paint.Position = Vector3.new(x, 5, z)
paint.Anchored = true
paint.CanCollide = false
paint.Color = Color3.fromRGB(255, 234, 0)
paint.Material = Enum.Material.Neon
paint.Shape = Enum.PartType.Ball
paint:SetAttribute("PaintType", "Yellow")
paint:SetAttribute("RespawnTime", 3)

local script = game.ServerStorage.PaintSourceScript:Clone()
script.Parent = paint
paint.Parent = workspace.JungleLab
```

---

## 🚀 Publishing Checklist

Before publishing to Roblox:
- [ ] Enable API Services in Game Settings
- [ ] Enable Studio Access to API Services
- [ ] Remove MockDataStore check (or publish to test with real DataStore)
- [ ] Test all upgrade purchases
- [ ] Test data persistence (join, leave, rejoin)
- [ ] Add game icon and thumbnails
- [ ] Add game description
- [ ] Set appropriate age rating
- [ ] Test on mobile devices
- [ ] Add badges for achievements

---

## 📊 Tested & Working

✅ Paint collection (auto-collects in 8 stud range)
✅ Paint selling (converts to coins)
✅ Shop UI (opens/closes correctly)
✅ Chameleon upgrades (purchases work)
✅ Speed boosts (apply after upgrade)
✅ Data saving (MockDataStore in Studio)
✅ Leaderstats (shows in player list)
✅ UI scaling (responsive design)
✅ Particle effects (on all paint sources)
✅ Visual enhancements (lighting, bloom, color correction)

---

## 🎯 Monetization Strategy

1. **Gamepasses** ($50-500 Robux):
   - Auto-Sell
   - 2x Paint
   - Triple Speed
   - Exclusive Pet Egg

2. **Developer Products**:
   - Coin packs (small boost)
   - Instant world unlock
   - Rare pet egg

3. **Premium Benefits**:
   - 1.5x paint multiplier
   - Exclusive mutation skin
   - Daily login bonus

---

**Game Status**: ✅ Playable MVP Ready!
**Next Milestone**: Add worlds 2-5 and pet system

Made with Kiro AI 🤖
