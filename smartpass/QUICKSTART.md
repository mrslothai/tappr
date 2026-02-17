# 🚀 SmartPass - Quickstart Guide

## Get Running in 3 Steps

### 1. Install Dependencies
```bash
cd /Users/sloth/.openclaw/workspace/smartpass
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit: **http://localhost:5173**

---

## First-Time Setup (5 minutes)

1. **Enable Notifications**
   - Click blue "Enable" button
   - Allow browser notifications
   - Click "Test" to verify

2. **Upload Test Boarding Pass**
   - Use `SAMPLE-BOARDING-PASS.txt` to create a test image
   - Or use any real boarding pass photo
   - Click upload area and select image

3. **Wait for Processing**
   - OCR takes 3-5 seconds
   - Progress bar shows status

4. **View Your Pass**
   - Details displayed with QR code
   - All information extracted automatically

---

## Project Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Production
npm run build        # Build for production (output: dist/)
npm run preview      # Preview production build

# Dependencies
npm install          # Install all dependencies
npm update          # Update dependencies
```

---

## Project Structure (Quick Reference)

```
smartpass/
├── src/
│   ├── components/     # React UI components
│   ├── utils/          # OCR, parser, storage, notifications
│   ├── App.jsx         # Main app
│   └── main.jsx        # Entry point
├── public/
│   ├── manifest.json   # PWA config
│   └── sw.js          # Service worker
└── Documentation/
    ├── README.md       # Project overview
    ├── USER-GUIDE.md   # End-user docs
    ├── TESTING.md      # Testing guide
    └── DEPLOYMENT.md   # Deploy instructions
```

---

## Key Features Implemented

✅ **Boarding Pass Scanner**
- Upload image (drag & drop supported)
- OCR with Tesseract.js
- Automatic data extraction

✅ **Clean UI**
- QR code display (200x200px)
- Flight details card
- Multiple pass management

✅ **Notifications**
- Web Notifications API
- 2h before flight
- 30min before boarding
- At boarding time

✅ **Offline-First PWA**
- Service worker caching
- localStorage persistence
- Works without internet

---

## Tech Stack

- **React 18** + **Vite 7** (Frontend)
- **Tailwind CSS v4** (Styling)
- **Tesseract.js** (OCR)
- **qrcode.react** (QR generation)
- **date-fns** (Date handling)

---

## Next Steps

1. **Test the App** → See `TESTING.md`
2. **Deploy** → See `DEPLOYMENT.md`
3. **Add Icons** → See `ICONS-TODO.md`

---

## Common Issues

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port 5173 in use?**
```bash
# Vite will auto-increment to 5174, 5175, etc.
# Or specify port:
npm run dev -- --port 3000
```

**OCR not working?**
- Check image quality (clear, well-lit)
- Ensure text is readable
- Try different boarding pass format

---

## Quick Links

- Dev Server: http://localhost:5173
- Build Output: `dist/`
- Documentation: All `.md` files in project root

---

**Ready to fly! ✈️**

Questions? Check `README.md` or `USER-GUIDE.md`
