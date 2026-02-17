# Icon Generation TODO

The app references these icons in `public/manifest.json`:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

## Quick Icon Generation

### Option 1: Using Online Tools (Easiest)
1. Go to https://favicon.io/favicon-generator/
2. Use these settings:
   - Text: ✈️ (or "SP")
   - Background: #2563eb (blue)
   - Font: Bold
3. Download and extract to `public/`

### Option 2: Using ImageMagick (Command Line)
```bash
cd /Users/sloth/.openclaw/workspace/smartpass/public

# Create 512x512 icon
convert -size 512x512 xc:"#2563eb" \
  -font Arial-Bold -pointsize 350 \
  -fill white -gravity center \
  -annotate +0+0 "✈" \
  icon-512.png

# Create 192x192 icon
convert icon-512.png -resize 192x192 icon-192.png
```

### Option 3: Using Figma/Canva (Design Tool)
1. Create 512x512 canvas
2. Blue background (#2563eb)
3. Add white airplane emoji or "SP" text
4. Export as PNG
5. Resize to 192x192 for smaller version

### Option 4: Use Existing SVG
We already have `public/icon.svg` - convert it:
```bash
# If you have rsvg-convert installed
rsvg-convert -w 512 -h 512 icon.svg > icon-512.png
rsvg-convert -w 192 -h 192 icon.svg > icon-192.png
```

## Temporary Workaround

The app will work without icons, but:
- No icon on PWA install
- No icon in app drawer
- Lower PWA score in Lighthouse

For MVP testing, icons are optional. Add them before production deployment.

## Icon Design Guidelines

- **Simple**: Clear at small sizes
- **High contrast**: Dark background, light foreground
- **Safe area**: Keep important content in center 80%
- **Format**: PNG with transparency
- **Colors**: Match theme (#2563eb blue)
- **Symbol**: Airplane ✈️ or "SP" for SmartPass

## Verification

After adding icons:
1. Check `manifest.json` is accessible
2. Inspect with DevTools > Application > Manifest
3. Icons should preview correctly
4. Install PWA to test icon appearance
