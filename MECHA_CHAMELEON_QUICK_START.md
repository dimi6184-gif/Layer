# 🦎 Mecha Chameleon Simulator - Quick Start Guide

## 🎮 How to Play (Current Version)

### For Players:
1. **Spawn in** → You start as 🤖 Rusty Chameleon
2. **Walk around** → Paint sources will auto-collect when you're near them
3. **Watch your tank** → Top center shows 🎨 X / 50
4. **When full** → Click green "🏭 SELL PAINT" button
5. **Get coins** → Top right shows 💰 $ amount
6. **Open shop** → Click purple 🛒 button (bottom left)
7. **Buy upgrades** → Purchase better chameleon forms to move faster!

### Controls:
- **WASD** or **Arrow Keys**: Move
- **Space**: Jump
- **Mouse**: Look around
- **Click Buttons**: Interact with UI

---

## 🎯 What Makes Money?

### Paint Value Chart:
- 🟡 **Yellow Paint**: 1 point (most common)
- 🔵 **Blue Paint**: 2 points (uncommon)
- 🔴 **Red Paint**: 3 points (rare)
- 🟣 **Purple Paint**: 5 points (very rare)
- ⚡ **Mecha Energy**: 10 points (legendary)

### Conversion Rate:
- **2 Paint = 1 Coin**
- Example: 50 paint = 25 coins

---

## 💡 Pro Tips

1. **Look for rare paints** → Purple and red give more value!
2. **Upgrade ASAP** → Speed makes grinding faster
3. **Full tank = wasted paint** → Sell often!
4. **Plan your route** → Circle around paint sources efficiently

---

## 🛠️ For Developers

### How to Test:
1. Open the place in Roblox Studio
2. Press **F5** or click ▶️ Play
3. Walk around to collect paint
4. Test selling and upgrading

### File Locations:
- **Scripts**: ServerScriptService & StarterPlayer.StarterPlayerScripts
- **Configuration**: ReplicatedStorage (GameConfig, PetConfig, AchievementConfig)
- **World Data**: Workspace.JungleLab

### Quick Edits:

**Change paint spawn rate:**
```lua
-- In ServerStorage.PaintSourceScript
local respawnTime = paintSource:GetAttribute("RespawnTime") or 3
-- Change to 1 for faster respawn
```

**Give yourself coins (testing):**
```lua
-- In Command Bar:
local player = game.Players:GetPlayers()[1]
local data = require(game.ServerScriptService.PlayerDataManager)
data:AddCoins(player, 10000)
player.leaderstats["💰 Coins"].Value = data:GetData(player).Coins
```

**Change conversion rate:**
```lua
-- In ReplicatedStorage.GameConfig
GameConfig.PaintConversion = {
    Rate = 2, -- Change to 1 for 1:1, or 4 for 4:1
    Minimum = 10
}
```

---

## 🐛 Known Issues & Solutions

### Paint not collecting?
- Make sure you're within 8 studs of the paint source
- Check console for errors (F9)
- Verify PaintCollector script is running

### Shop not opening?
- Check if ShopUI exists in PlayerGui
- Try using command: `game.Players.LocalPlayer.PlayerGui.ShopUI.ShopFrame.Visible = true`

### Data not saving?
- Studio uses MockDataStore (data resets on restart)
- Publish the game to test real DataStore

### Can't afford upgrades?
- Collect more paint and sell it!
- Try the testing command above to give yourself coins

---

## 🎨 Customization Ideas

### Easy Customizations:
1. **Change colors** → Edit Color3.fromRGB values in GameConfig
2. **Add more paints** → Duplicate existing paint sources in JungleLab
3. **Adjust costs** → Modify prices in GameConfig.ChameleonStages
4. **Change UI colors** → Edit BackgroundColor3 in UI scripts

### Medium Difficulty:
1. **Add sound effects** → Create Sound instances on collect/sell
2. **Create new worlds** → Duplicate JungleLab, change paint spawns
3. **Add more upgrades** → Extend TankUpgrades array
4. **Custom chameleon models** → Replace player character with custom model

### Advanced:
1. **Pet system** → Use PetConfig and create egg hatching
2. **Trading system** → Create RemoteEvents for pet trades
3. **Daily rewards** → Track last login time
4. **Leaderboards** → Use OrderedDataStore

---

## 📈 Progression Path

### Early Game (0 - 1,000 coins):
- Grind yellow and blue paint
- Buy **Iron Chameleon** ($500)
- Unlock **Small Paint Tank** ($100)

### Mid Game (1,000 - 50,000 coins):
- Focus on red and purple paint
- Buy **Crystal Chameleon** ($2,000)
- Buy **Rainbow Chameleon** ($10,000)
- Save for World 2: Poolrooms ($5,000)

### Late Game (50,000+ coins):
- Farm World 2 with multipliers
- Buy **Cyber Chameleon** ($50,000)
- Unlock World 3: Backrooms ($25,000)
- Target **Ultimate Mecha Chameleon** ($250,000)

### End Game (1M+ coins):
- Buy all tank upgrades
- Collect all mutations
- Farm Cyber Space (5x multiplier!)
- Complete all achievements
- Prepare for Rebirth/Upgrade Core

---

## 🎁 What's Coming Next

Check the main documentation (MECHA_CHAMELEON_SIMULATOR.md) for:
- Pet system details
- More worlds
- Achievement implementation
- Rebirth mechanics
- Event system

---

## 🚨 Emergency Commands

### Reset character:
```lua
game.Players.LocalPlayer.Character:BreakJoints()
```

### Clear all paint sources:
```lua
workspace.JungleLab:ClearAllChildren()
```

### Reload UI:
```lua
game.Players.LocalPlayer.PlayerGui:ClearAllChildren()
game.StarterGui:Clone().Parent = game.Players.LocalPlayer
```

---

## 📞 Need Help?

1. Check console output (F9 in Studio)
2. Read error messages carefully
3. Verify all scripts are enabled
4. Check that API Services are enabled for DataStore
5. Test in Play Mode (F5), not Run Mode (F8)

---

**Have fun building your simulator!** 🦎⚡

Questions? Check the full documentation or Studio output window!
