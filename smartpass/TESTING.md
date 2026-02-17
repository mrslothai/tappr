# Testing SmartPass

## Quick Test Steps

### 1. Start the App
```bash
npm run dev
```
Open http://localhost:5173 in your browser

### 2. Test Notification Permission
- Click "Enable" on the notification banner
- Click "Test" to verify notifications work

### 3. Test OCR Scanner

#### Option A: Create a Sample Boarding Pass
Create a simple text image with:
```
BOARDING PASS
PASSENGER: JOHN DOE
FLIGHT: AA123
FROM: LAX TO: JFK
DATE: 14 FEB 2026
GATE: B12
SEAT: 23A
BOARDING TIME: 14:30
DEPARTURE: 15:00
```

You can create this using any image editor or screenshot tool.

#### Option B: Use a Real Boarding Pass
- Take a photo of any boarding pass
- Or use a screenshot from an airline booking

### 4. Upload and Test
1. Click the upload area
2. Select your boarding pass image
3. Wait for OCR processing (progress bar shows status)
4. Verify extracted data appears correctly
5. Check that QR code is generated

### 5. Test Notifications
To test notification scheduling:
1. After uploading a pass, check browser console
2. Notifications are scheduled based on boarding time
3. For immediate testing, you can click "Test" button

### 6. Test Offline Mode
1. Load the app once
2. Open DevTools > Application > Service Workers
3. Check "Offline" checkbox
4. Reload page - should still work
5. Your saved passes should persist

### 7. Test Local Storage
1. Upload multiple passes
2. Refresh the page
3. All passes should still be visible
4. Try deleting a pass - should remove from storage

### 8. Test PWA Installation
#### Chrome/Edge:
1. Look for install icon in address bar
2. Click to install as app
3. App should open in standalone window

#### Mobile (iOS/Android):
1. Open in Safari/Chrome
2. Tap Share > Add to Home Screen
3. Open from home screen - runs as app

## Expected Behavior

### Scanner Component
- ✅ Shows upload area with drag-and-drop support
- ✅ Displays image preview after selection
- ✅ Shows OCR progress bar (0-100%)
- ✅ Displays error message if extraction fails
- ✅ Clears preview after successful scan

### PassCard Component
- ✅ Displays flight number and route prominently
- ✅ Shows QR code (200x200px)
- ✅ All extracted fields visible (name, seat, gate, times)
- ✅ Delete button works
- ✅ Original image viewable in expandable section

### Notifications
- ✅ Permission request on first load
- ✅ Shows current permission status
- ✅ Test notification works when enabled
- ✅ Notifications scheduled for boarding passes

### Offline/PWA
- ✅ Works offline after first load
- ✅ Service worker registers successfully
- ✅ Can be installed as PWA
- ✅ localStorage persists across sessions

## Known Limitations (MVP)

1. **OCR Accuracy**: 
   - Depends on image quality
   - May not work with all boarding pass formats
   - Best results with clear, high-contrast images

2. **Date Parsing**:
   - Assumes current/future dates
   - May need manual adjustment for different date formats

3. **QR Code**:
   - Generated from extracted data
   - Not the original boarding pass QR code
   - For display purposes only

4. **Notifications**:
   - Only work when browser is running
   - setTimeout cleared on page close
   - Need to keep page/tab open

## Troubleshooting

### OCR Not Working
- Check image quality (clear, well-lit)
- Try rotating image to correct orientation
- Ensure text is readable

### Notifications Not Showing
- Check browser notification permissions
- Verify boarding time is in the future
- Check browser console for errors

### Service Worker Issues
- Clear browser cache
- Unregister old service workers in DevTools
- Hard reload (Cmd/Ctrl + Shift + R)

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance Metrics

- Initial load: ~250KB (gzipped)
- OCR processing: 2-5 seconds per image
- Service worker: Caches core assets
- localStorage: ~5MB limit (plenty for boarding passes)

## Browser Console Checks

Open DevTools Console and verify:
```javascript
// Service worker registered
navigator.serviceWorker.controller

// Notification permission
Notification.permission

// localStorage contents
localStorage.getItem('smartpass_boarding_passes')
```

## Next Steps After Testing

1. ✅ If OCR works: Try different boarding pass formats
2. ✅ If notifications work: Test with real flight times
3. ✅ If PWA works: Install and test offline mode
4. ⏭️ Consider adding manual entry form for failed OCR
5. ⏭️ Add QR code detection from original image
6. ⏭️ Implement export to Wallet features
