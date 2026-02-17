# SmartPass Project Structure

## Directory Tree

```
smartpass/
├── public/                      # Static assets
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker for offline support
│   └── icon.svg                # Placeholder icon (need PNG versions)
│
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── Scanner.jsx        # Upload & OCR component
│   │   ├── PassCard.jsx       # Individual boarding pass display
│   │   ├── PassList.jsx       # List of all passes
│   │   └── NotificationManager.jsx  # Notification permission UI
│   │
│   ├── utils/                  # Utility functions
│   │   ├── ocr.js             # Tesseract.js OCR wrapper
│   │   ├── parser.js          # Extract boarding pass data from text
│   │   ├── notifications.js   # Web Notifications API wrapper
│   │   └── storage.js         # localStorage CRUD operations
│   │
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point + SW registration
│   └── index.css              # Tailwind CSS imports + global styles
│
├── index.html                  # HTML template
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── .gitignore                 # Git ignore rules
│
├── README.md                  # Project overview
├── USER-GUIDE.md              # End-user documentation
├── TESTING.md                 # Testing instructions
├── DEPLOYMENT.md              # Deployment guide
├── ICONS-TODO.md              # Icon generation instructions
├── SAMPLE-BOARDING-PASS.txt   # Test data
└── PROJECT-STRUCTURE.md       # This file
```

## Component Architecture

```
App.jsx (Main Container)
├── NotificationManager.jsx (Permission UI)
├── Scanner.jsx (Upload + OCR)
│   └── Uses: ocr.js, parser.js
└── PassList.jsx (Display all passes)
    └── PassCard.jsx (Individual pass)
        └── Uses: qrcode.react
```

## Data Flow

1. **Upload Image** → Scanner.jsx
2. **Extract Text** → utils/ocr.js (Tesseract.js)
3. **Parse Data** → utils/parser.js (Regex extraction)
4. **Save Pass** → utils/storage.js (localStorage)
5. **Schedule Notifications** → utils/notifications.js
6. **Display** → PassCard.jsx (with QR code)

## Key Technologies

### Frontend Framework
- **React 18**: UI components
- **Vite 5**: Build tool & dev server

### OCR & Image Processing
- **Tesseract.js**: Client-side OCR engine
- **FileReader API**: Image upload handling

### Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **@tailwindcss/postcss**: PostCSS plugin

### PWA Features
- **Service Worker**: Offline caching
- **Web App Manifest**: Install as app
- **Web Notifications API**: Flight alerts

### Data & Display
- **localStorage**: Client-side data persistence
- **qrcode.react**: QR code generation
- **date-fns**: Date/time manipulation

## File Sizes

| File | Size (approx) | Purpose |
|------|---------------|---------|
| Scanner.jsx | 5.2 KB | Upload & OCR UI |
| PassCard.jsx | 4.9 KB | Boarding pass display |
| PassList.jsx | 1.2 KB | List wrapper |
| NotificationManager.jsx | 5.0 KB | Permission UI |
| ocr.js | 1.0 KB | OCR wrapper |
| parser.js | 3.6 KB | Data extraction |
| notifications.js | 4.2 KB | Notification scheduling |
| storage.js | 2.0 KB | localStorage CRUD |
| App.jsx | 3.2 KB | Main component |

**Total Source**: ~30 KB (uncompressed)
**Built Bundle**: ~245 KB (includes Tesseract.js)
**Gzipped**: ~79 KB

## Dependencies

### Production
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "tesseract.js": "^5.x",
  "qrcode.react": "^4.x",
  "date-fns": "^3.x"
}
```

### Development
```json
{
  "@vitejs/plugin-react": "^4.x",
  "vite": "^7.x",
  "@tailwindcss/postcss": "^4.x"
}
```

## Configuration Files

### vite.config.js
- Default Vite + React setup
- No special configuration needed

### tailwind.config.js
- Content paths for CSS purging
- Default theme (no customizations)

### postcss.config.js
- @tailwindcss/postcss plugin

### manifest.json
- PWA name, colors, icons
- Standalone display mode
- Portrait orientation

### sw.js
- Cache-first strategy
- Caches HTML, CSS, JS
- Updates on new version

## Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css      # Tailwind styles
│   └── index-[hash].js       # React + dependencies
├── manifest.json
├── sw.js
└── icon-*.png (if added)
```

## Development Workflow

1. **Start Dev Server**
   ```bash
   npm run dev
   ```
   - Hot reload enabled
   - Runs on http://localhost:5173

2. **Build for Production**
   ```bash
   npm run build
   ```
   - Minifies code
   - Tree-shakes unused code
   - Generates production assets

3. **Preview Production Build**
   ```bash
   npm run preview
   ```
   - Test built version locally

## State Management

### Component State (useState)
- `passes`: Array of boarding passes
- `notificationTimeouts`: Map of scheduled notifications
- `loading`: OCR processing status
- `error`: Error messages

### Persistent State (localStorage)
- `smartpass_boarding_passes`: JSON array of all passes

## API Surface

### Utils API

```javascript
// OCR
extractTextFromImage(image) → Promise<string>
extractTextWithProgress(image, onProgress) → Promise<string>

// Parser
parseBoardingPass(text) → Object
isValidBoardingPass(data) → boolean

// Storage
getAllPasses() → Array<Object>
savePass(pass) → Object
deletePass(id) → void
updatePass(id, updates) → Object

// Notifications
requestNotificationPermission() → Promise<boolean>
showNotification(title, body, options) → void
scheduleNotifications(pass) → Array<timeoutId>
clearScheduledNotifications(timeoutIds) → void
```

## Performance Considerations

### Bundle Size
- Tesseract.js is the largest dependency (~2MB)
- Loaded lazily only when needed
- Consider CDN for production

### OCR Processing
- Runs in worker thread (non-blocking)
- Takes 2-5 seconds per image
- Progress feedback to user

### Caching Strategy
- Service worker caches all static assets
- localStorage for boarding pass data
- Images stored as data URLs

### Optimization Opportunities
1. Lazy load Tesseract.js worker
2. Compress boarding pass images
3. Implement virtual scrolling for many passes
4. Use IndexedDB instead of localStorage for large datasets

## Security Considerations

### Client-Side Only
- No server = No server vulnerabilities
- All processing happens in browser
- No API keys needed

### Data Privacy
- Everything stays on device
- No analytics by default
- No third-party tracking

### PWA Security
- Requires HTTPS (automatic on hosting platforms)
- Service worker isolated from main thread
- localStorage sandboxed per domain

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| React | ✅ | ✅ | ✅ | ✅ |
| Service Workers | ✅ | ✅ | ✅ 11.1+ | ✅ |
| Notifications | ✅ | ✅ | ✅ 16.4+ | ✅ |
| FileReader API | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| PWA Install | ✅ | ❌ | ✅ iOS | ✅ |

**Recommended**: Chrome, Edge, Safari (iOS 16.4+)

## Testing Strategy

1. **Manual Testing**: Upload various boarding pass formats
2. **OCR Accuracy**: Test with different image qualities
3. **Offline Mode**: Disable network after first load
4. **Notifications**: Test scheduling with future dates
5. **PWA**: Install and test as standalone app
6. **localStorage**: Verify data persistence across sessions

## Future Enhancements

### Phase 2
- [ ] Manual data entry form (for failed OCR)
- [ ] Edit boarding pass details
- [ ] Multiple flight views (list/grid)

### Phase 3
- [ ] QR code detection from original image
- [ ] Cloud sync (optional, with auth)
- [ ] Flight status API integration

### Phase 4
- [ ] Export to Apple Wallet / Google Pay
- [ ] Share boarding pass via link
- [ ] Print-friendly view

### Phase 5
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] Analytics (privacy-respecting)

## Maintenance

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Updating Service Worker
Change `CACHE_NAME` in `public/sw.js`:
```javascript
const CACHE_NAME = 'smartpass-v2'; // Increment version
```

### Monitoring
- No server-side logging needed
- Optional: Add client-side error tracking
- Consider usage analytics (Plausible, etc.)

## Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Tesseract.js](https://tesseract.projectnaptha.com)
- [PWA Guide](https://web.dev/progressive-web-apps)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Last Updated**: February 14, 2026
**Version**: 1.0.0 (MVP)
