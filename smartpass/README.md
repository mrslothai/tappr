# ✈️ SmartPass - Boarding Pass Scanner MVP

A simple, offline-first Progressive Web App (PWA) that scans boarding passes and displays them cleanly with smart notifications.

## Features

- **📸 Boarding Pass Scanner**: Upload photos/screenshots of boarding passes
- **🤖 OCR Extraction**: Automatically extracts passenger name, flight number, gate, boarding time, seat
- **📱 Clean UI**: Display QR codes prominently for gate scanning
- **💾 Offline-First**: Works without internet after first load
- **🔔 Smart Notifications**: Alerts 2h before, 30min before, and at boarding time
- **📦 Local Storage**: All data stays on your device

## Tech Stack

- **Frontend**: React + Vite
- **OCR**: Tesseract.js (client-side, no API needed)
- **Styling**: Tailwind CSS
- **Storage**: localStorage
- **Notifications**: Web Notifications API
- **PWA**: Service Worker for offline access

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Usage

1. **Enable Notifications**: Click "Enable" to allow browser notifications
2. **Upload Boarding Pass**: Take a photo or screenshot of your boarding pass
3. **Upload Image**: Click the upload area and select your boarding pass image
4. **View Details**: The app will extract flight details and display them
5. **Get Alerts**: You'll receive notifications before your flight

## How It Works

### OCR Processing
- Uses Tesseract.js to extract text from boarding pass images
- Runs entirely in the browser (no server needed)
- Supports standard IATA boarding pass formats

### Data Parsing
- Regex-based extraction of:
  - Passenger name (usually all caps)
  - Flight number (e.g., AA123, BA456)
  - Gate (e.g., A12, B5)
  - Boarding time (HH:MM format)
  - Seat (e.g., 12A, 23B)
  - Date and route information

### Notifications
- Scheduled using setTimeout
- Alerts at:
  - 2 hours before boarding
  - 30 minutes before boarding
  - At boarding time

### Offline Support
- Service worker caches app resources
- Works offline after first load
- All data stored locally (no cloud)

## Privacy

- **All data stays on your device**
- No server uploads
- No tracking
- localStorage only

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 16.4+)

Requires:
- FileReader API
- Web Notifications API
- Service Workers
- localStorage

## Future Enhancements

- [ ] QR code detection from image
- [ ] Multiple language support
- [ ] Export to Apple Wallet / Google Pay
- [ ] Flight status tracking
- [ ] Cloud sync (optional)

## License

MIT

## Credits

Built with ❤️ by Team Sloth
