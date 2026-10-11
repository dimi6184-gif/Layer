# 🚨 ROBLOX SWAT GAME - QUICK START GUIDE

## 🎮 SO SPIELST DU DAS SPIEL

### **Erste Schritte:**

1. **Öffne Roblox Studio**
2. **Öffne dein Place1 Projekt**
3. **Drücke F5** oder klicke **"Play"** Button
4. Du spawnst als **SWAT Officer** vor dem Gebäude

---

## ⌨️ **STEUERUNG**

### **Bewegung:**
- `W` `A` `S` `D` - Laufen
- `Shift` (gedrückt halten) - Sprint (schneller laufen)
- `Ctrl` oder `C` - Ducken (langsamer, aber leiser)
- `Maus` - Umschauen

### **Waffen:**
- `Linke Maustaste` - Schießen
- `R` - Nachladen
- Ziele mit dem **weißen Fadenkreuz** in der Mitte

### **Interaktion:**
- `E` - Türen öffnen/schließen
- Gehe nah zur Tür, bis "Open Door" erscheint

---

## 🎯 **GAMEPLAY TIPPS**

### **Taktisches Vorgehen:**

1. **Langsam bewegen** - Ducken mit `Ctrl`
2. **Ecken checken** - Schau um Ecken bevor du reingehst
3. **Türen sichern** - Öffne Türen vorsichtig mit `E`
4. **Ziele auf den Kopf** - Headshots machen mehr Schaden
5. **Ammo management** - Nachladen wenn sicher (versteckt hinter Wänden)

### **Ready or Not Style:**
- Bleib im Team (später Multiplayer)
- Kläre Raum für Raum
- Nutze Deckung
- Schieße nur wenn nötig

---

## 🔫 **WAFFEN INFO**

### **Aktuell ausgerüstet: GLOCK 17**
- **Typ:** Pistole
- **Schaden:** 25 (75 Kopfschuss)
- **Magazin:** 17 Schuss
- **Reserve:** 51 Schuss
- **Modus:** Semi-Automatisch (1 Klick = 1 Schuss)

### **Andere Waffen (im Code verfügbar):**
- **M4A1** - Assault Rifle (30 Schuss, Automatisch)
- **AK-47** - Heavy Rifle (30 Schuss, stark)
- **MP5** - SMG (30 Schuss, schnell)
- **Shotgun** - Nahkampf (8 Schuss, 8 Pellets)

---

## 🏢 **MAP LAYOUT**

```
        [Eingang]
           |
    [------+------]
    |             |
  [Room 1]   [Hallway]
    |             |
    [------+------]
           |
        [Room 2]
```

### **Gebäude Features:**
- **3 Räume** mit interaktiven Türen
- **Eingangs-Tür** (Frontseite)
- **2 Interior Türen** (Räume)
- **Beleuchtung** (Taktisches Ambiente)
- **Spawn außerhalb** (SWAT Team ready position)

---

## 🎨 **HUD ERKLÄRUNG**

### **Oben Links: Team**
```
┌──────────────┐
│  SWAT TEAM   │ ← Dein Team
└──────────────┘
```

### **Mitte: Crosshair**
```
       │
   ────┼──── ← Ziel hier
       │
```

### **Unten Links: Health**
```
┌─────────────────────┐
│ ❤️ HEALTH: 100      │
│ ████████████████░░  │ ← Grüner Balken
└─────────────────────┘
```

### **Unten Rechts: Waffe**
```
┌───────────────┐
│ GLOCK 17      │ ← Waffen Name
│               │
│   17   / 51   │ ← Magazin / Reserve
└───────────────┘
```

---

## 🚨 **MISSION (Coming Soon)**

### **Phase 2 Features:**
- [ ] **Hostage Rescue** - Geiseln retten
- [ ] **Bomb Defusal** - Bomben entschärfen
- [ ] **Raid** - Gebäude stürmen
- [ ] **Evidence Collection** - Beweise sammeln

### **Ausrüstung (Coming Soon):**
- [ ] **Flashbang** - Gegner blenden
- [ ] **Smoke Grenade** - Sicht blockieren
- [ ] **Ballistic Shield** - Schutz
- [ ] **Taschenlampe** - Im Dunkeln sehen
- [ ] **Breaching Tool** - Türen aufbrechen

---

## ⚠️ **BEKANNTE PROBLEME**

### **Was noch fehlt:**
- Waffen wechseln (nur Glock aktuell)
- Gegner/Suspects AI
- Zivilisten
- Sound Effects
- Mehr Maps
- Multiplayer Teams

### **Workaround:**
- Aktuell nur **Single Player** testing
- Fokus auf **Movement** und **Shooting**
- Türen testen

---

## 🔧 **DEVELOPMENT MODE**

### **Testen im Studio:**
```
1. F5 - Play Mode starten
2. F8 - Output Console öffnen (für Logs)
3. Escape - Pause/Stop
```

### **Logs im Output:**
- `[GameManager]` - Game state
- `[WeaponHandler]` - Shooting/Reload
- `[MovementController]` - Sprint/Crouch
- `[Door]` - Door interactions

---

## 📚 **LERNEN & VERBESSERN**

### **Was du üben solltest:**

1. **Aim Training** - Schieße auf Wände, übe Headshots
2. **Movement** - Lerne Sprint → Stop → Crouch smooth
3. **Peek Corners** - Übe langsam um Ecken schauen
4. **Door Entry** - Übe Tür öffnen → reingehen → sichern

### **Pro Tips:**
- Ducken macht dich schwerer zu treffen
- Sprint ist laut, ducken ist leise
- Türen erst öffnen, dann durchgehen (nicht beides gleichzeitig)
- Immer Munition im Blick behalten

---

## 🎯 **ZIEL DES SPIELS**

Dieses wird ein **Realistic Tactical Shooter**:

### **Core Gameplay Loop:**
1. **Briefing** - Mission info
2. **Planning** - Team strategy
3. **Breach** - Gebäude stürmen
4. **Clear** - Räume sichern
5. **Extract** - Mission abschließen
6. **Debrief** - Score/Rating

### **Scoring System (Coming Soon):**
- ⭐ Geiseln gerettet
- ⭐ Suspects festgenommen (nicht getötet)
- ⭐ Wenig Gewalt benutzt
- ⭐ Team überlebt
- ❌ Zivilisten verletzt
- ❌ Unnötige Schüsse

---

## 🆘 **HILFE**

### **Spiel startet nicht?**
- Checke Output Console (F9) für Errors
- Stelle sicher alle Scripts sind enabled
- Restart Studio

### **Kamera funktioniert nicht?**
- FirstPersonCamera Script in StarterCharacterScripts?
- Checke Console Logs

### **Waffen schießen nicht?**
- WeaponSystem Module in ReplicatedStorage?
- WeaponHandler Script in StarterCharacterScripts?
- Checke Console: "[WeaponHandler] Initialized"

### **HUD fehlt?**
- TacticalHUD Script in StarterGui?
- Checke PlayerGui im Explorer

---

## 📞 **KONTAKT**

Bugs? Features? Feedback?
- Checke `ROBLOX_SWAT_GAME_PHASE1.md` für Details
- Siehe **Next Steps** für Roadmap

---

**VIEL SPASS BEIM SPIELEN! 🚨**

*Phase 1 - Basic Gameplay - COMPLETE ✅*
