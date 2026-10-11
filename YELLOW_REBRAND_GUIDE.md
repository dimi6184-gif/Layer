# 💛 Layer AI - Yellow Rebrand Guide

## Brand Colors

```css
Primary Yellow: #FFD600
Accent Yellow: #FFF700
Black: #000000
White: #FFFFFF
Dark Gray: #1a1a1a
```

## Files to Update

### 1. ✅ DONE - `apps/web/src/app/globals.css`
- ✅ Text gradient updated to yellow
- ✅ Text glow updated to yellow

### 2. Landing Page - `apps/web/src/app/(marketing)/page.tsx`

**Replace ALL instances of purple/fuchsia with yellow:**

#### Hero Section:
```tsx
// OLD:
bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600

// NEW:
bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500
```

#### CTA Button:
```tsx
// OLD:
bg-gradient-to-r from-purple-500 to-fuchsia-500
hover:shadow-purple-500/50

// NEW:
bg-gradient-to-r from-yellow-400 to-yellow-500
hover:shadow-yellow-500/50
```

#### Section Badges:
```tsx
// OLD:
bg-purple-500/10 border-purple-500/30 text-purple-300

// NEW:
bg-yellow-500/10 border-yellow-500/30 text-yellow-300
```

#### Gradient Text:
```tsx
// OLD:
from-purple-400 to-fuchsia-400
from-purple-400 via-fuchsia-400 to-purple-600

// NEW:
from-yellow-300 to-yellow-500
from-yellow-300 via-yellow-400 to-yellow-500
```

#### Feature Cards Gradients:
Replace all purple/fuchsia/violet with yellow variants:
```tsx
// OLD:
from-purple-500/20, from-fuchsia-500/20, from-violet-500/20
text-purple-400, text-fuchsia-400, text-violet-400
border-purple-500/30, border-fuchsia-500/30

// NEW:
from-yellow-500/20
text-yellow-400
border-yellow-500/30
```

### 3. Dashboard Components

#### Update all button colors:
```tsx
// Primary Buttons OLD:
bg-purple-500, bg-purple-600
hover:bg-purple-600, hover:bg-purple-700
text-purple-400

// Primary Buttons NEW:
bg-yellow-500, bg-yellow-600
hover:bg-yellow-600, hover:bg-yellow-700
text-yellow-400
```

### 4. Icon Colors in Dashboard

Replace purple accent colors with yellow:
```tsx
// OLD:
text-purple-400
bg-purple-500/10
border-purple-500/30

// NEW:
text-yellow-400
bg-yellow-500/10
border-yellow-500/30
```

---

## Quick Find & Replace

Use VS Code Find & Replace (Ctrl+Shift+H) in `apps/web` folder:

### Replace 1: Purple Gradients
```
Find: from-purple-400.*?to-purple-600
Replace: from-yellow-300 via-yellow-400 to-yellow-500
```

### Replace 2: Purple/Fuchsia Combo
```
Find: from-purple-(\d+) to-fuchsia-(\d+)
Replace: from-yellow-400 to-yellow-500
```

### Replace 3: Purple Text
```
Find: text-purple-400
Replace: text-yellow-400
```

### Replace 4: Purple Backgrounds
```
Find: bg-purple-500
Replace: bg-yellow-500
```

### Replace 5: Purple Borders
```
Find: border-purple-500
Replace: border-yellow-500
```

### Replace 6: Purple Shadows
```
Find: shadow-purple-500
Replace: shadow-yellow-500
```

### Replace 7: Fuchsia Colors
```
Find: (text|bg|border|from|to|via)-fuchsia-(\d+)
Replace: $1-yellow-$2
```

---

## Result

After these changes:
- 💛 All purple accents → Yellow
- 💛 All fuchsia accents → Yellow  
- 💛 All violet accents → Yellow
- 🖤 Black backgrounds stay
- ⚪ White text stays
- 💛 Brand consistency with logo

---

## Test Checklist

- [ ] Landing page hero gradient is yellow
- [ ] CTA buttons are yellow
- [ ] Feature section badges are yellow
- [ ] Dashboard accent colors are yellow
- [ ] Hover states are yellow
- [ ] Text glow effects are yellow
- [ ] All gradients use yellow shades

---

## Manual Review Needed

Some components use:
- `cyan` (keep for variety)
- `emerald` (keep for success states)
- `pink` (keep for variety)

Only replace `purple`, `fuchsia`, and `violet` with `yellow`.

---

Made with 💛 for Layer AI
